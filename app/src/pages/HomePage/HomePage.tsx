import React from 'react';

import { useDeepCompareCallback, useDeepCompareEffect, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, Head, KibaIcon, LayerContainer, LoadingSpinner, MarkdownText, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text, useResponsiveScreenSize } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../../AccountContext';
import { CollectionToken } from '../../client';
import { Account } from '../../components/Account';
import { Filter } from '../../components/Filter';
import { TokenCard } from '../../components/TokenCard';
import { TokenDialog } from '../../components/TokenDialog';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { getTreasureHuntTokenId, loadTokenCollectionFromFile } from '../../util';


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const account = useAccount();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const { notdClient } = useGlobals();
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(undefined);
  const [ownedTokens, setOwnedTokens] = React.useState<Token[] | undefined | null>(undefined);
  const [showOwnedTokensOnly, setShowOwnedTokensOnly] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenLimit, setTokenLimit] = React.useState<number>(50);
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [scrollingRef] = useRenderedRef<HTMLDivElement>();
  const responsiveScreenSize = useResponsiveScreenSize();

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

  useDeepCompareEffect((): void => {
    const loadedTokenCollection = loadTokenCollectionFromFile();
    setTokenCollection(loadedTokenCollection);
  }, []);

  const getCollectionHoldings = useDeepCompareCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setOwnedTokens(undefined);
    }
    if (!account) {
      setOwnedTokens(null);
      return;
    }
    if (!tokenCollection) {
      setOwnedTokens(undefined);
      return;
    }
    notdClient.getCollectionHoldings(tokenCollection.address, account.address).then((collectionTokens: CollectionToken[]): void => {
      const newOwnedTokens = collectionTokens.map((collectionToken: CollectionToken): Token => {
        return tokenCollection.tokens[collectionToken.tokenId];
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

  // eslint-disable-next-line no-restricted-globals
  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  // eslint-disable-next-line no-restricted-globals
  const chosenToken = tokenCollection?.tokens[Number(location.pathname.replace('/tokens/', ''))];

  return (
    <React.Fragment>
      <Head>
        <title>{`${tokenCollection ? tokenCollection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide}>
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Wide2} shouldWrapItems={true}>
          <Stack.Item shrinkFactor={1} growthFactor={1}>
            <Text variant='header1'>{`${tokenCollection ? tokenCollection.name : ''} Gallery`}</Text>
          </Stack.Item>
          { !account ? (
            <Button variant='secondary' text= 'Connect Wallet' onClicked={onConnectWalletClicked} />
          ) : (
            <Account accountId={account.address} target={`https://nft.tokenhunt.io/accounts/${account.address}`} />
          )}
        </Stack>
        { getTreasureHuntTokenId() && (
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
                  <Filter filters={filters} onAttributeValueClicked={onAttributeValueClicked} account={account} showOwnedTokensOnly={showOwnedTokensOnly} setShowOwnedTokensOnly={setShowOwnedTokensOnly} tokenCollection={tokenCollection} />
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
                {isResponsiveFilterShowing && (responsiveScreenSize === ScreenSize.Base || responsiveScreenSize === ScreenSize.Small) && (
                  <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                    <Box variant='overlay' isFullHeight={true} width='80%' maxWidth='350px'>
                      {tokenCollection === undefined ? (
                        <LoadingSpinner />
                      ) : (
                        <Filter filters={filters} onAttributeValueClicked={onAttributeValueClicked} account={account} showOwnedTokensOnly={showOwnedTokensOnly} setShowOwnedTokensOnly={setShowOwnedTokensOnly} tokenCollection={tokenCollection} />
                      )}
                    </Box>
                  </ResponsiveHidingView>
                )}
              </LayerContainer>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      {isTokenSubpageShowing && chosenToken && (
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