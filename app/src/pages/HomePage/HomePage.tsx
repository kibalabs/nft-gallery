import React from 'react';

import { RestMethod } from '@kibalabs/core';
import { getIsRunningOnBrowser, useDeepCompareCallback, useLocation, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, Direction, EqualGrid, Head, Image, KibaIcon, LayerContainer, LoadingSpinner, MarkdownText, PaddingSize, ResponsiveHidingView, ScreenSize, Stack, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../../AccountContext';
import { CollectionAttribute, CollectionToken, TokenListing, Collection } from '../../client';
import { Account } from '../../components/Account';
import { Filter } from '../../components/Filter';
import { FloatingView } from '../../components/FloatingView';
import { TokenCard } from '../../components/TokenCard';
import { TokenDialog } from '../../components/TokenDialog';
import { useGlobals } from '../../globalsContext';
import { OpenseaClient } from '../../OpenseaClient';
import { usePageData } from '../../PageDataContext';
import { getBackgroundMusic, getBannerImageUrl, getCollectionAddress, getHost, getLogoImageUrl, getTreasureHuntTokenId, loadTokenCollection } from '../../util';
import { IHomePageData } from './getHomePageData';
import { InQueryParam } from '../../client/endpoints';


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const location = useLocation();
  const account = useAccount();
  const { data } = usePageData<IHomePageData>();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const { notdClient, projectId } = useGlobals();
  const [collection, setCollection] = React.useState<Collection | null | undefined>(data?.collection || undefined);
  const [collectionTokens, setCollectionTokens] = React.useState<CollectionToken[] | null | undefined>(data?.collectionTokens || undefined);
  const [collectionAttributes, setCollectionAttributes] = React.useState<CollectionAttribute[] | null | undefined>(undefined);
  const [showOwnedTokensOnly, setShowOwnedTokensOnly] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenListingMap, setTokenListMap] = React.useState<Record<string, TokenListing | null>>({});
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [shouldPlayMusic, setShouldPlayMusic] = React.useState<boolean>(false);
  const [scrollingRef] = useRenderedRef<HTMLDivElement>();
  const tokenLimitRef = React.useRef<number>(30);

  const logoImageUrl = getLogoImageUrl(projectId);
  const backgroundMusicSource = getBackgroundMusic(projectId);
  const backgroundMusic = React.useMemo((): HTMLAudioElement | null => {
    return getIsRunningOnBrowser() && backgroundMusicSource != null ? new Audio(backgroundMusicSource) : null;
  }, [backgroundMusicSource]);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  const chosenToken = isTokenSubpageShowing && collectionTokens ? collectionTokens[Number(location.pathname.replace('/tokens/', ''))] : null;

  const host = getHost(projectId);
  let bannerImageUrl = getBannerImageUrl(projectId) || collection?.bannerImageUrl;
  if (bannerImageUrl && bannerImageUrl.startsWith('/')) {
    bannerImageUrl = `${host}${bannerImageUrl}`;
  }
  const title = `${collection ? collection.name : 'Token'} Gallery`;
  const description = collection?.description ? `The gallery of ${collection.name}. ${collection.description} built by https://www.tokenpage.xyz` : collection ? `The gallery of ${collection.name} built by https://www.tokenpage.xyz` : '';

  React.useEffect((): void => {
    if (!backgroundMusic) {
      return;
    }
    if (shouldPlayMusic) {
      backgroundMusic.play();
      backgroundMusic.loop = true;
    } else {
      backgroundMusic.pause();
    }
  }, [backgroundMusic, shouldPlayMusic]);

  const onConnectWalletClicked = async (): Promise<void> => {
    await onLinkAccountsClicked();
  };

  const updateCollection = React.useCallback((): void => {
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      notdClient.getCollection(collectionAddress).then((retrievedCollection: Collection): void => {
        setCollection(retrievedCollection);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollection(null);
      });
      notdClient.listCollectionAttributes(collectionAddress).then((retrievedCollectionAttributes: CollectionAttribute[]): void => {
        setCollectionAttributes(retrievedCollectionAttributes);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionAttributes(null);
      });
    } else {
      // TODO(krishan711): Load from file
      //   const metadataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/metadatas.json`);
      //   const loadedTokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
      //   setTokenCollection(loadedTokenCollection);
    }
  }, [notdClient, projectId]);

  React.useEffect((): void => {
    updateCollection();
  }, [updateCollection]);

  const updateCollectionTokens = React.useCallback((): void => {
    const collectionAddress = getCollectionAddress(projectId);
    setCollectionTokens(undefined);
    tokenLimitRef.current = 30;
    if (collectionAddress) {
      if (showOwnedTokensOnly) {
        // TODO(krishna711): add ownerAddress filter to query
        setCollectionTokens([]);
        return;
      }
      const attributeFilters = Object.keys(filters).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, [filters[filterKey]]));
      notdClient.queryCollectionTokens(collectionAddress, tokenLimitRef.current, 0, undefined, undefined, undefined, undefined, attributeFilters).then((retrievedCollectionTokens: CollectionToken[]): void => {
        setCollectionTokens(retrievedCollectionTokens);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionTokens(null);
      });
    } else {
      // TODO(krishan711): Load from file
    }
  }, [projectId, filters, showOwnedTokensOnly, tokenLimitRef]);

  React.useEffect((): void => {
    updateCollectionTokens();
  }, [updateCollectionTokens]);

  const loadMoreCollectionTokens = React.useCallback((): void => {
    if (!collectionTokens) {
      return;
    }
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      if (showOwnedTokensOnly) {
        // TODO(krishna711): add ownerAddress filter to query
        setCollectionTokens([]);
        return;
      }
      const attributeFilters = Object.keys(filters).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, [filters[filterKey]]));
      notdClient.queryCollectionTokens(collectionAddress, tokenLimitRef.current, collectionTokens.length, undefined, undefined, undefined, undefined, attributeFilters).then((retrievedCollectionTokens: CollectionToken[]): void => {
        setCollectionTokens([...collectionTokens, ...retrievedCollectionTokens]);
      });
    } else {
      // TODO(krishan711): Load from file
    }
  }, [notdClient, projectId, showOwnedTokensOnly, tokenLimitRef, collectionTokens]);

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

  const updateTokenListings = React.useCallback(async (): Promise<void> => {
    if (!collection || !collectionTokens) {
      return;
    }
    const filteredTokenIds = collectionTokens.map((token: CollectionToken): string => token.tokenId);
    const tokenIdsToUpdate = filteredTokenIds.filter((tokenId: string): boolean => !(tokenId in tokenListingMap));
    if (tokenIdsToUpdate.length === 0) {
      return;
    }
    const newListingMap = await new OpenseaClient().getTokenListings(collection.address, tokenIdsToUpdate);
    setTokenListMap({ ...tokenListingMap, ...newListingMap });
  }, [collection, collectionTokens, tokenListingMap]);

  React.useEffect((): void => {
    updateTokenListings();
  }, [updateTokenListings]);

  const onScrolled = React.useCallback((): void => {
    console.log('onScrolled');
    if (collectionTokens && tokenLimitRef.current > collectionTokens.length) {
      return;
    }
    if (!scrollingRef.current) {
      return;
    }
    const size = scrollingRef.current.scrollHeight - scrollingRef.current.clientHeight;
    if (size - scrollingRef.current.scrollTop < 300) {
      tokenLimitRef.current = tokenLimitRef.current + 30;
      loadMoreCollectionTokens();
    }
  }, [scrollingRef, tokenLimitRef, collectionTokens]);

  useScrollListener(scrollingRef.current, onScrolled);

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo('/');
  };

  const onToggleResponsiveFilterClicked = (): void => {
    setIsResponsiveFilterShowing(!isResponsiveFilterShowing);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta name='twitter:title' content={title} />
        {description && <meta name='description' content={description} /> }
        {bannerImageUrl ? (
          <React.Fragment>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={bannerImageUrl} />
            <meta name='og:image' content={bannerImageUrl} />
          </React.Fragment>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide}>
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Wide2}>
          <Stack.Item shrinkFactor={1} growthFactor={1}>
            {logoImageUrl ? (
              <Box height='2em'>
                <Image source={logoImageUrl} alternativeText={`${collection ? collection.name : ''} Gallery`} />
              </Box>
            ) : (
              <Text variant='header1'>{`${collection ? collection.name : ''} Gallery`}</Text>
            )}
          </Stack.Item>
          { !account ? (
            <Button variant='secondary' text= 'Connect Wallet' onClicked={onConnectWalletClicked} />
          ) : (
            <Account accountId={account.address} target={`/accounts/${account.address}`} />
          )}
        </Stack>
        { getTreasureHuntTokenId(projectId) && (
          <Stack paddingHorizontal={PaddingSize.Wide2} isFullWidth={true}>
            <Box variant='notification'>
              <MarkdownText textVariant='success' source={'🕵️‍♂️🕵️‍♀️ **The hunt is on, find the Sprite to win a prize!**\nHere&apos;s your clue: &quot;The tokenId is the beginner class in school&quot;'} />
            </Box>
          </Stack>
        )}
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <Stack direction={Direction.Horizontal} shouldAddGutters={false} isFullHeight={true} isFullWidth={true}>
            <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
              <React.Fragment>
                <Box width='300px' isFullHeight={true}>
                  {collection === undefined || collectionAttributes === undefined ? (
                    <LoadingSpinner />
                  ) : collection === null || collectionAttributes === null ? (
                    <Text variant='error'>Failed to load</Text>
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
                      collection={collection}
                      collectionAttributes={collectionAttributes}
                    />
                  )}
                </Box>
              </React.Fragment>
            </ResponsiveHidingView>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true}>
                <Stack.Item growthFactor={1} shrinkFactor={1}>
                  <Box variant='unrounded' isFullHeight={true} isFullWidth={true}>
                    <LayerContainer>
                      {collection === undefined || collectionTokens === undefined ? (
                        <LoadingSpinner />
                      ) : collection === null || collectionTokens === null ? (
                        <Text variant='error'>Failed to load</Text>
                      ) : (
                        <Stack direction={Direction.Vertical} isScrollableVertically={false} isFullHeight={true} contentAlignment={Alignment.Start}>
                          <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start} paddingHorizontal={PaddingSize.Wide1} paddingBottom={PaddingSize.Default}>
                            {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                              <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} onClicked={(): void => onAttributeValueClicked(filterKey, undefined)} />
                            ))}
                          </Stack>
                          <Stack.Item growthFactor={1} shrinkFactor={1}>
                            <Box variant='unrounded' ref={scrollingRef} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
                              {collectionTokens.length > 0 ? (
                                <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Start} shouldAddGutters={true} isFullHeight={false} paddingHorizontal={PaddingSize.Wide1}>
                                  {collectionTokens.map((token: CollectionToken): React.ReactElement => (
                                    <TokenCard
                                      key={token.tokenId}
                                      token={token}
                                      tokenListing={tokenListingMap[token.tokenId]}
                                      target={`/tokens/${token.tokenId}`}
                                    />
                                  ))}
                                </EqualGrid>
                              ) : (
                                <Text>No tokens match filter</Text>
                              )}
                            </Box>
                          </Stack.Item>
                        </Stack>
                      )}
                      {isResponsiveFilterShowing && (
                        <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                          <FloatingView isFullHeight={true} positionBottom={'0px'} isFullWidth={true} positionLeft={'0px'} positionTop={'0px'} zIndex={'100'}>
                            <ColorSettingView variant='dialog'>
                              <Box variant='filterOverlay' isFullHeight={true} shouldClipContent={true}>
                                {collection === undefined || collectionAttributes === undefined ? (
                                  <LoadingSpinner />
                                ) : collection === null || collectionAttributes === null ? (
                                  <Text variant='error'>Failed to load</Text>
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
                                    collection={collection}
                                    collectionAttributes={collectionAttributes}
                                  />
                                )}
                              </Box>
                            </ColorSettingView>
                          </FloatingView>
                        </ResponsiveHidingView>
                      )}
                    </LayerContainer>
                  </Box>
                </Stack.Item>
                <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                  <Button variant='unrounded' text={isResponsiveFilterShowing ? 'DONE' : 'FILTERS'} onClicked={onToggleResponsiveFilterClicked} />
                </ResponsiveHidingView>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      {isTokenSubpageShowing && chosenToken && collection && (
        <TokenDialog
          token={chosenToken}
          collection={collection}
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
        />
      )}
    </React.Fragment>
  );
};
