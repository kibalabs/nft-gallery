import React from 'react';

import { RestMethod } from '@kibalabs/core';
import { getIsRunningOnBrowser, useDeepCompareCallback, useLocation, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, Head, Image, KibaIcon, LayerContainer, LoadingSpinner, MarkdownText, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../../AccountContext';
import { CollectionToken } from '../../client';
import { Account } from '../../components/Account';
import { Filter } from '../../components/Filter';
import { TokenCard } from '../../components/TokenCard';
import { TokenDialog } from '../../components/TokenDialog';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { usePageData } from '../../PageDataContext';
import { getBackgroundMusic, getLogoImageUrl, getTreasureHuntTokenId, loadTokenCollection } from '../../util';
import { IHomePageData } from './getHomePageData';


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const location = useLocation();
  const account = useAccount();
  const { data } = usePageData<IHomePageData>();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const { notdClient, requester, projectId } = useGlobals();
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(data?.tokenCollection || undefined);
  const [ownedTokens, setOwnedTokens] = React.useState<Token[] | undefined | null>(undefined);
  const [showOwnedTokensOnly, setShowOwnedTokensOnly] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenLimit, setTokenLimit] = React.useState<number>(50);
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [shouldPlayMusic, setShouldPlayMusic] = React.useState<boolean>(false);
  const [scrollingRef] = useRenderedRef<HTMLDivElement>();
  const logoImageUrl = getLogoImageUrl(projectId);
  const backgroundMusicSource = getBackgroundMusic(projectId);
  const backgroundMusic = React.useMemo((): HTMLAudioElement | null => {
    return getIsRunningOnBrowser() && backgroundMusicSource != null ? new Audio(backgroundMusicSource) : null;
  }, [backgroundMusicSource]);

  React.useEffect((): void => {
    if (!backgroundMusic) {
      return;
    }
    if (shouldPlayMusic) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }, [backgroundMusic, shouldPlayMusic]);

  const onConnectWalletClicked = async (): Promise<void> => {
    await onLinkAccountsClicked();
  };

  const onScrolled = React.useCallback((): void => {
    if (!scrollingRef.current) {
      return;
    }
    const size = scrollingRef.current.scrollHeight - scrollingRef.current.clientHeight;
    if (size - scrollingRef.current.scrollTop < 500) {
      setTokenLimit(tokenLimit + 25);
    }
  }, [scrollingRef, tokenLimit]);

  useScrollListener(scrollingRef.current, onScrolled);

  const loadMetadata = React.useCallback(async (): Promise<void> => {
    const metadataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/metadatas.json`);
    const loadedTokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
    setTokenCollection(loadedTokenCollection);
  }, [requester, projectId]);

  React.useEffect((): void => {
    loadMetadata();
  }, [loadMetadata]);

  const getCollectionHoldings = useDeepCompareCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setOwnedTokens(undefined);
    }
    if (!account) {
      setOwnedTokens(null);
      return;
    }
    if (!tokenCollection || !tokenCollection.tokens) {
      setOwnedTokens(undefined);
      return;
    }
    // NOTE(krishan711): not sure why but this re-aliasing fixes some type checks
    const tokens = tokenCollection.tokens;
    notdClient.getCollectionHoldings(tokenCollection.address, account.address).then((collectionTokens: CollectionToken[]): void => {
      const newOwnedTokens = collectionTokens.map((collectionToken: CollectionToken): Token => {
        return tokens[collectionToken.tokenId];
      });
      setOwnedTokens(newOwnedTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setOwnedTokens(null);
    });
  }, [notdClient, tokenCollection, account]);

  React.useEffect((): void => {
    getCollectionHoldings();
  }, [getCollectionHoldings]);

  const onAttributeValueClicked = (attributeName: string, attributeValue: string | null | undefined): void => {
    const filtersCopy = { ...filters };
    if (filtersCopy[attributeName] === attributeValue || !attributeValue) {
      delete filtersCopy[attributeName];
    } else {
      filtersCopy[attributeName] = attributeValue;
    }
    setFilters(filtersCopy);
    if (scrollingRef.current) {
      scrollingRef.current.scrollTop = 0;
    }
  };

  const filteredTokens = React.useMemo((): Token[] | undefined => {
    if (!tokenCollection || !tokenCollection.tokens) {
      return undefined;
    }
    let tokens = Object.values(tokenCollection.tokens);
    if (showOwnedTokensOnly) {
      if (!ownedTokens) {
        return undefined;
      }
      tokens = ownedTokens;
    }
    const validFilterKeys = Object.keys(filters).filter((filterKey: string): boolean => filters[filterKey] != null);
    const innerFilteredTokens = tokens.filter((token: Token): boolean => {
      let match = true;
      validFilterKeys.forEach((filterKey: string): void => {
        match = match && token.attributeMap[filterKey] === filters[filterKey];
      });
      return match;
    });
    return innerFilteredTokens.slice(0, tokenLimit);
  }, [tokenCollection, filters, tokenLimit, showOwnedTokensOnly, ownedTokens]);

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo('/');
  };

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  const chosenToken = isTokenSubpageShowing && tokenCollection?.tokens ? tokenCollection.tokens[Number(location.pathname.replace('/tokens/', ''))] : null;

  return (
    <React.Fragment>
      <Head>
        <title>{`${tokenCollection ? tokenCollection.name : 'Token'} Gallery`}</title>
        {tokenCollection?.description ? (
          <meta name='description' content={`A gallery of ${tokenCollection.name} built by https://www.tokenpage.xyz. ${tokenCollection.description}`} />
        ) : tokenCollection && (
          <meta name='description' content={`A gallery of ${tokenCollection.name} built by https://www.tokenpage.xyz`} />
        )}
        {tokenCollection?.bannerImageUrl && (
          <meta property='og:image' content={tokenCollection?.bannerImageUrl} />
        )}
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide}>
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Wide2}>
          <Stack.Item shrinkFactor={1} growthFactor={1}>
            {logoImageUrl ? (
              <Box height='2em'>
                <Image source={logoImageUrl} alternativeText={`${tokenCollection ? tokenCollection.name : ''} Gallery`} />
              </Box>
            ) : (
              <Text variant='header1'>{`${tokenCollection ? tokenCollection.name : ''} Gallery`}</Text>
            )}
          </Stack.Item>
          { !account ? (
            <Button variant='secondary' text= 'Connect Wallet' onClicked={onConnectWalletClicked} />
          ) : (
            <Account accountId={account.address} target={`https://nft.tokenhunt.io/accounts/${account.address}`} />
          )}
        </Stack>
        { getTreasureHuntTokenId(projectId) && (
          <Stack paddingHorizontal={PaddingSize.Wide2} isFullWidth={true}>
            <Box variant='notification'>
              <MarkdownText textVariant='success' source={'🕵️‍♂️🕵️‍♀️ **The hunt is on, find the Sprite to win a prize!**\nHere&apos;s your clue: &quot;The tokenId is the beginner class in school&quot;'} />
            </Box>
          </Stack>
        )}
        <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
          <Button variant='small' text={isResponsiveFilterShowing ? 'Hide Filter Menu' : 'Show Filter Menu'} onClicked={(): void => setIsResponsiveFilterShowing(!isResponsiveFilterShowing)} />
        </ResponsiveHidingView>
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <Stack direction={Direction.Horizontal} shouldAddGutters={true} defaultGutter={PaddingSize.Wide2} isFullHeight={true} isFullWidth={true}>
            <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
              <Spacing variant={PaddingSize.Wide2} />
              <Box width='300px' isFullHeight={true}>
                {tokenCollection === undefined ? (
                  <LoadingSpinner />
                ) : (
                  <Filter
                    filters={filters}
                    onAttributeValueClicked={onAttributeValueClicked}
                    account={account}
                    showOwnedTokensOnly={showOwnedTokensOnly}
                    setShowOwnedTokensOnly={setShowOwnedTokensOnly}
                    shouldShowMusicOption={backgroundMusic != null}
                    shouldPlayMusic={shouldPlayMusic}
                    setShouldPlayMusic={setShouldPlayMusic}
                    tokenCollection={tokenCollection}
                  />
                )}
              </Box>
            </ResponsiveHidingView>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <LayerContainer>
                <Box ref={scrollingRef} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
                  {tokenCollection === undefined || filteredTokens === undefined ? (
                    <LoadingSpinner />
                  ) : (
                    <Stack direction={Direction.Vertical} isScrollableVertically={false} isFullHeight={true} shouldAddGutters={true} contentAlignment={Alignment.Start} paddingRight={PaddingSize.Wide2}>
                      <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start}>
                        {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                          <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} onClicked={(): void => onAttributeValueClicked(filterKey, undefined)} />
                        ))}
                      </Stack>
                      <Stack.Item growthFactor={1}>
                        {filteredTokens.length > 0 ? (
                          <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Start} shouldAddGutters={true} isFullHeight={false}>
                            {filteredTokens.map((token: Token): React.ReactElement => (
                              <TokenCard key={token.tokenId} token={token} />
                            ))}
                          </EqualGrid>
                        ) : (
                          <Text>No tokens match filter</Text>
                        )}
                      </Stack.Item>
                    </Stack>
                  )}
                </Box>
                <LayerContainer.Layer shouldPassThroughTouches={true}>
                  {isResponsiveFilterShowing && (
                    <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                      <Box variant='overlay' isFullHeight={true} width='80%' maxWidth='350px' shouldCaptureTouches={true}>
                        {tokenCollection === undefined ? (
                          <LoadingSpinner />
                        ) : (
                          <Filter
                            filters={filters}
                            onAttributeValueClicked={onAttributeValueClicked}
                            account={account}
                            showOwnedTokensOnly={showOwnedTokensOnly}
                            setShowOwnedTokensOnly={setShowOwnedTokensOnly}
                            shouldShowMusicOption={backgroundMusicSource != null}
                            shouldPlayMusic={shouldPlayMusic}
                            setShouldPlayMusic={setShouldPlayMusic}
                            tokenCollection={tokenCollection}
                          />
                        )}
                      </Box>
                    </ResponsiveHidingView>
                  )}
                </LayerContainer.Layer>
              </LayerContainer>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      {isTokenSubpageShowing && chosenToken && tokenCollection && (
        <TokenDialog
          token={chosenToken}
          tokenCollection={tokenCollection}
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
        />
      )}
    </React.Fragment>
  );
};
