import React from 'react';

import { getIsRunningOnBrowser, SubRouterOutlet, useEventListener, useLocation, useNavigator } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, Dialog, Direction, EqualGrid, Head, KibaIcon, LayerContainer, LoadingSpinner, MarkdownText, PaddingSize, ResponsiveHidingView, ScreenSize, Stack, Text } from '@kibalabs/ui-react';

import { useAccount } from '../../AccountContext';
import { CollectionToken, TokenAttribute, TokenListing } from '../../client';
import { InQueryParam } from '../../client/endpoints';
import { Filter } from '../../components/Filter';
import { FloatingView } from '../../components/FloatingView';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { LooksrareClient } from '../../LooksrareClient';
import { OpenseaClient } from '../../OpenseaClient';
import { getBackgroundMusic, getBannerImageUrl, getCollectionAddress, getHost, getTreasureHuntTokenId } from '../../util';


export const useScrollListenerElement = <T extends HTMLElement>(handler: (event: Event) => void, dependencies: React.DependencyList = []): [element: T | null, setElement: ((element: T) => void)] => {
  const [element, setElement] = React.useState<T | null>(null);
  useEventListener(element, 'scroll', handler, dependencies);
  return [element, setElement];
};


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const location = useLocation();
  const account = useAccount();
  const { notdClient, projectId, collection, collectionAttributes, allTokens } = useGlobals();
  const [collectionTokens, setCollectionTokens] = React.useState<CollectionToken[] | null | undefined>(undefined);
  const [showOwnedTokensOnly, setShowOwnedTokensOnly] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenListingMap, setTokenListMap] = React.useState<Record<string, TokenListing | null>>({});
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [shouldPlayMusic, setShouldPlayMusic] = React.useState<boolean>(false);
  const tokenLimitRef = React.useRef<number>(30);
  const previousQueryRef = React.useRef<string | null>(null);
  const backgroundMusicSource = getBackgroundMusic(projectId);
  const backgroundMusic = React.useMemo((): HTMLAudioElement | null => {
    return getIsRunningOnBrowser() && backgroundMusicSource != null ? new Audio(backgroundMusicSource) : null;
  }, [backgroundMusicSource]);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

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

  const updateCollectionTokens = React.useCallback((): void => {
    const collectionAddress = getCollectionAddress(projectId);
    const attributeFilters = Object.keys(filters).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, [filters[filterKey]]));
    tokenLimitRef.current = 30;
    if (collectionAddress) {
      const newQuery = {
        collectionAddress,
        limit: tokenLimitRef.current,
        ownerAddress: showOwnedTokensOnly && account ? account.address : undefined,
        minPrice: undefined,
        maxPrice: undefined,
        isListed: undefined,
        tokenIdIn: undefined,
        attributeFilters,
      };
      if (JSON.stringify(newQuery) === previousQueryRef.current) {
        return;
      }
      // NOTE(krishan711): this is to prevent duplicate querying (e.g. when account is loaded but not used)
      previousQueryRef.current = JSON.stringify(newQuery);
      setCollectionTokens(undefined);
      notdClient.queryCollectionTokens(collectionAddress, tokenLimitRef.current, 0, showOwnedTokensOnly && account ? account.address : undefined, undefined, undefined, undefined, undefined, attributeFilters).then((retrievedCollectionTokens: CollectionToken[]): void => {
        setCollectionTokens(retrievedCollectionTokens);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionTokens(null);
      });
    } else {
      if (!allTokens) {
        setCollectionTokens([]);
        return;
      }
      const newTokens = allTokens.reduce((accumulator: CollectionToken[], value: CollectionToken): CollectionToken[] => {
        if (accumulator.length < tokenLimitRef.current) {
          const isMatch = value.attributes.reduce((innerAccumulator: boolean, innerValue: TokenAttribute): boolean => {
            return innerAccumulator && (!(innerValue.traitType in filters) || innerValue.value === filters[innerValue.traitType]);
          }, true);
          if (isMatch) {
            accumulator.push(value);
          }
        }
        return accumulator;
      }, []);
      setCollectionTokens(newTokens);
    }
  }, [projectId, notdClient, filters, showOwnedTokensOnly, tokenLimitRef, previousQueryRef, account, allTokens]);

  React.useEffect((): void => {
    updateCollectionTokens();
  }, [updateCollectionTokens]);

  const loadMoreCollectionTokens = React.useCallback((): void => {
    if (!collectionTokens) {
      return;
    }
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      const attributeFilters = Object.keys(filters).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, [filters[filterKey]]));
      notdClient.queryCollectionTokens(collectionAddress, tokenLimitRef.current, collectionTokens.length, showOwnedTokensOnly && account ? account.address : undefined, undefined, undefined, undefined, undefined, attributeFilters).then((retrievedCollectionTokens: CollectionToken[]): void => {
        setCollectionTokens([...collectionTokens, ...retrievedCollectionTokens]);
      });
    } else {
      if (!allTokens) {
        setCollectionTokens([]);
        return;
      }
      const newTokens = allTokens.reduce((accumulator: CollectionToken[], value: CollectionToken): CollectionToken[] => {
        if (accumulator.length < tokenLimitRef.current) {
          const isMatch = value.attributes.reduce((innerAccumulator: boolean, innerValue: TokenAttribute): boolean => {
            return innerAccumulator && (!(innerValue.traitType in filters) || innerValue.value === filters[innerValue.traitType]);
          }, true);
          if (isMatch) {
            accumulator.push(value);
          }
        }
        return accumulator;
      }, []);
      setCollectionTokens(newTokens);
    }
  }, [notdClient, projectId, filters, showOwnedTokensOnly, tokenLimitRef, collectionTokens, account, allTokens]);

  const onAttributeValueClicked = (attributeName: string, attributeValue: string | null | undefined): void => {
    const filtersCopy = { ...filters };
    if (filtersCopy[attributeName] === attributeValue || !attributeValue) {
      delete filtersCopy[attributeName];
    } else {
      filtersCopy[attributeName] = attributeValue;
    }
    setFilters(filtersCopy);
    if (scrollingRef) {
      scrollingRef.scrollTop = 0;
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
    const openseaListingMap = await new OpenseaClient().getTokenListings(collection.address, tokenIdsToUpdate);
    const looksrareListingMap = await new LooksrareClient().getTokenListings(collection.address, tokenIdsToUpdate);
    const newListingMap: Record<string, TokenListing | null> = { ...tokenListingMap };
    tokenIdsToUpdate.forEach((tokenId: string): void => {
      const listings = [openseaListingMap[tokenId], looksrareListingMap[tokenId]].filter((listing: TokenListing | null): boolean => listing != null) as TokenListing[];
      if (listings.length === 0) {
        newListingMap[tokenId] = null;
      } else {
        newListingMap[tokenId] = listings.sort((listing1: TokenListing, listing2: TokenListing): number => (listing1.value.gte(listing2.value) ? 1 : -1))[0];
      }
    });
    setTokenListMap(newListingMap);
  }, [collection, collectionTokens, tokenListingMap]);

  React.useEffect((): void => {
    updateTokenListings();
  }, [updateTokenListings]);

  const onScrolled = React.useCallback((event: Event): void => {
    const eventTarget = event.target as HTMLDivElement;
    if (collectionTokens && tokenLimitRef.current > collectionTokens.length) {
      return;
    }
    const size = eventTarget.scrollHeight - eventTarget.clientHeight;
    if (size - eventTarget.scrollTop < 300) {
      tokenLimitRef.current += 30;
      loadMoreCollectionTokens();
    }
  }, [collectionTokens, tokenLimitRef, loadMoreCollectionTokens]);

  const [scrollingRef, setScrollingRef] = useScrollListenerElement<HTMLDivElement>(onScrolled);

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
      {collection === undefined || collectionAttributes === undefined ? (
        <LoadingSpinner />
      ) : collection === null || collectionAttributes === null ? (
        <Text variant='error'>Failed to load</Text>
      ) : (
        <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
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
                  </Box>
                </React.Fragment>
              </ResponsiveHidingView>
              <Stack.Item growthFactor={1} shrinkFactor={1}>
                <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true}>
                  <Stack.Item growthFactor={1} shrinkFactor={1}>
                    <Box variant='unrounded' isFullHeight={true} isFullWidth={true}>
                      <LayerContainer>
                        {collectionTokens === undefined ? (
                          <LoadingSpinner />
                        ) : collectionTokens === null ? (
                          <Text variant='error'>Failed to load</Text>
                        ) : (
                          <Stack direction={Direction.Vertical} isScrollableVertically={false} isFullHeight={true} contentAlignment={Alignment.Start}>
                            {Object.keys(filters).length > 0 && (
                              <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start} paddingHorizontal={PaddingSize.Wide1} paddingBottom={PaddingSize.Default}>
                                {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                                  <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} onClicked={(): void => onAttributeValueClicked(filterKey, undefined)} />
                                ))}
                              </Stack>
                            )}
                            <Stack.Item growthFactor={1} shrinkFactor={1}>
                              <Box variant='unrounded' ref={setScrollingRef} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
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
      )}
      <ColorSettingView variant='dialog'>
        <Dialog
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
          maxWidth='1000px'
          maxHeight='90%'
        >
          <SubRouterOutlet />
        </Dialog>
      </ColorSettingView>
    </React.Fragment>
  );
};
