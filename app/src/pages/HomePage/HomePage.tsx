import React from 'react';

import { longFormatEther } from '@kibalabs/core';
import { getIsRunningOnBrowser, SubRouterOutlet, useEventListener, useLocation, useNavigator, useUrlQueryState } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, Dialog, Direction, EqualGrid, Head, KibaIcon, LoadingSpinner, MarkdownText, PaddingSize, ResponsiveHidingView, ScreenSize, Stack, Text } from '@kibalabs/ui-react';
import { useWeb3Account } from '@kibalabs/web3-react';
import { BigNumber } from 'ethers';

import { Collection, CollectionToken, GalleryToken, TokenAttribute, TokenListing } from '../../client';
import { InQueryParam } from '../../client/endpoints';
import { Filter } from '../../components/Filter';
import { FloatingView } from '../../components/FloatingView';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { LooksrareClient } from '../../LooksrareClient';
import { OpenseaClient } from '../../OpenseaClient';
import { useWindowScroll } from '../../reactUtil';
import { getBackgroundMusic, getBannerImageUrl, getChain, getHost, getShouldUsePreviewImages, getTreasureHuntTokenId } from '../../util';


export const useScrollListenerElement = <T extends HTMLElement>(handler: (event: Event) => void, dependencies: React.DependencyList = []): [element: T | null, setElement: ((element: T) => void)] => {
  const [element, setElement] = React.useState<T | null>(null);
  useEventListener(element, 'scroll', handler, dependencies);
  return [element, setElement];
};

export const DEFAULT_SORT = 'TOKENID_ASC';

export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const location = useLocation();
  const account = useWeb3Account();
  const { notdClient, projectId, collection, otherCollections, otherCollectionAttributes, allTokens } = useGlobals();
  const [selectedCollectionAddress, setSelectedCollectionAddress] = useUrlQueryState('collection');
  const [galleryTokens, setGalleryTokens] = React.useState<GalleryToken[] | null | undefined>(undefined);
  const [showOwnedTokensOnly, setShowOwnedTokensOnly] = React.useState<boolean>(false);
  const [showListedTokensOnly, setShowListedTokensOnly] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [tokenListingMap, setTokenListMap] = React.useState<Record<string, TokenListing | null>>({});
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [shouldPlayMusic, setShouldPlayMusic] = React.useState<boolean>(false);
  const [_order, setOrder] = useUrlQueryState('order', undefined, DEFAULT_SORT);
  const tokenLimitRef = React.useRef<number>(30);
  const galleryTokenCountRef = React.useRef<number>(0);
  const previousQueryRef = React.useRef<string | null>(null);
  const [minPrice, setMinPrice] = React.useState<BigNumber | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<BigNumber | null>(null);
  const backgroundMusicSource = getBackgroundMusic(projectId);
  const shouldUsePreviewImages = getShouldUsePreviewImages(projectId);
  const backgroundMusic = React.useMemo((): HTMLAudioElement | null => {
    return getIsRunningOnBrowser() && backgroundMusicSource != null ? new Audio(backgroundMusicSource) : null;
  }, [backgroundMusicSource]);
  const selectedCollection = !selectedCollectionAddress ? collection : (!otherCollections ? otherCollections : otherCollections.find((innerCollection: Collection): boolean => innerCollection.address === selectedCollectionAddress));
  const selectedCollectionAttributes = (selectedCollection === undefined || otherCollectionAttributes === undefined) ? undefined : (selectedCollection === null || otherCollectionAttributes === null) ? null : otherCollectionAttributes[selectedCollection.address];
  const order = _order ?? DEFAULT_SORT;

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  galleryTokenCountRef.current = galleryTokens ? galleryTokens.length : 0;

  const host = getHost(projectId);
  let bannerImageUrl = getBannerImageUrl(projectId) || collection?.bannerImageUrl;
  if (bannerImageUrl && bannerImageUrl.startsWith('/')) {
    bannerImageUrl = `${host}${bannerImageUrl}`;
  }
  const title = `${collection ? collection.name : 'Token'} Gallery`;
  const description = collection?.description ? `The ${collection.name} gallery. ${collection.description}. Built by https://www.tokenpage.xyz` : collection ? `The ${collection.name} gallery. Built by https://www.tokenpage.xyz` : '';

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
    const collectionAddress = selectedCollection?.address;
    const attributeFilters = Object.keys(filters).filter((filterKey: string): boolean => filters[filterKey] && filters[filterKey].length > 0).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, filters[filterKey]));
    tokenLimitRef.current = 30;
    if (collectionAddress) {
      const newQuery = {
        collectionAddress,
        limit: tokenLimitRef.current,
        offset: 0,
        ownerAddress: showOwnedTokensOnly && account ? account.address : undefined,
        minPrice,
        maxPrice,
        isListed: showListedTokensOnly,
        tokenIdIn: undefined,
        attributeFilters,
        order,
      };
      if (JSON.stringify(newQuery) === previousQueryRef.current) {
        return;
      }
      // NOTE(krishan711): this is to prevent duplicate querying (e.g. when account is loaded but not used)
      previousQueryRef.current = JSON.stringify(newQuery);
      setGalleryTokens(undefined);
      notdClient.queryCollectionTokens(collectionAddress, tokenLimitRef.current, 0, showOwnedTokensOnly && account ? account.address : undefined, minPrice || undefined, maxPrice || undefined, showListedTokensOnly, undefined, attributeFilters, order).then((retrievedGalleryTokens: GalleryToken[]): void => {
        setGalleryTokens(retrievedGalleryTokens);
      }).catch((error: unknown): void => {
        console.error(error);
        setGalleryTokens(null);
      });
    } else {
      if (!allTokens) {
        return;
      }
      const newTokens = allTokens.reduce((accumulator: GalleryToken[], value: CollectionToken): GalleryToken[] => {
        if (accumulator.length < tokenLimitRef.current) {
          const tokenAttributeMap = value.attributes.reduce((innerAccumulator: Record<string, string>, innerValue: TokenAttribute): Record<string, string> => {
            // eslint-disable-next-line no-param-reassign
            innerAccumulator[innerValue.traitType] = innerValue.value;
            return innerAccumulator;
          }, {});
          const isMatch = Object.keys(filters).reduce((innerAccumulator: boolean, filterKey: string): boolean => {
            return innerAccumulator && tokenAttributeMap[filterKey] != null && (!filters[filterKey] || filters[filterKey].length === 0 || filters[filterKey].includes(tokenAttributeMap[filterKey]));
          }, true);
          if (isMatch) {
            accumulator.push(new GalleryToken(value, null, null, 1));
          }
        }
        return accumulator;
      }, []);
      setGalleryTokens(newTokens);
    }
  }, [selectedCollection, notdClient, filters, order, showOwnedTokensOnly, showListedTokensOnly, minPrice, maxPrice, tokenLimitRef, previousQueryRef, account, allTokens]);

  React.useEffect((): void => {
    updateCollectionTokens();
  }, [updateCollectionTokens]);

  const loadMoreCollectionTokens = React.useCallback((): void => {
    if (!galleryTokens) {
      return;
    }
    const collectionAddress = selectedCollection?.address;
    if (collectionAddress) {
      const attributeFilters = Object.keys(filters).filter((filterKey: string): boolean => filters[filterKey] && filters[filterKey].length > 0).map((filterKey: string): InQueryParam => new InQueryParam(filterKey, filters[filterKey]));
      notdClient.queryCollectionTokens(collectionAddress, 30, galleryTokens.length, showOwnedTokensOnly && account ? account.address : undefined, minPrice || undefined, maxPrice || undefined, showListedTokensOnly, undefined, attributeFilters, order).then((retrievedGalleryTokens: GalleryToken[]): void => {
        setGalleryTokens([...galleryTokens, ...retrievedGalleryTokens]);
      });
    } else {
      if (!allTokens) {
        return;
      }
      const newTokens = allTokens.reduce((accumulator: GalleryToken[], value: CollectionToken): GalleryToken[] => {
        if (accumulator.length < tokenLimitRef.current) {
          const tokenAttributeMap = value.attributes.reduce((innerAccumulator: Record<string, string>, innerValue: TokenAttribute): Record<string, string> => {
            // eslint-disable-next-line no-param-reassign
            innerAccumulator[innerValue.traitType] = innerValue.value;
            return innerAccumulator;
          }, {});
          const isMatch = Object.keys(filters).reduce((innerAccumulator: boolean, filterKey: string): boolean => {
            return innerAccumulator && tokenAttributeMap[filterKey] != null && (!filters[filterKey] || filters[filterKey].length === 0 || filters[filterKey].includes(tokenAttributeMap[filterKey]));
          }, true);
          if (isMatch) {
            accumulator.push(new GalleryToken(value, null, null, 1));
          }
        }
        return accumulator;
      }, []);
      setGalleryTokens(newTokens);
    }
  }, [selectedCollection, notdClient, filters, order, showOwnedTokensOnly, showListedTokensOnly, minPrice, maxPrice, tokenLimitRef, galleryTokens, account, allTokens]);

  const onAttributeValueClicked = (attributeName: string, attributeValue: string | null | undefined): void => {
    const filtersCopy = { ...filters };
    if (filtersCopy[attributeName] == null) {
      filtersCopy[attributeName] = [];
    }
    if (!attributeValue || filtersCopy[attributeName].includes(attributeValue)) {
      filtersCopy[attributeName] = filtersCopy[attributeName].filter((existingValue: string): boolean => existingValue !== attributeValue);
    } else {
      filtersCopy[attributeName].push(attributeValue);
    }
    setFilters(filtersCopy);
    // if (scrollingRef) {
    //   window.scrollTop = 0;
    // }
    window.scrollTo(0, 0);
  };

  const updateTokenListings = React.useCallback(async (): Promise<void> => {
    if (!selectedCollection?.address || !galleryTokens) {
      return;
    }
    const filteredTokenIds = galleryTokens.map((galleryToken: GalleryToken): string => galleryToken.collectionToken.tokenId);
    const tokenIdsToUpdate = filteredTokenIds.filter((tokenId: string): boolean => !(tokenId in tokenListingMap));
    if (tokenIdsToUpdate.length === 0) {
      return;
    }
    const newListingMap: Record<string, TokenListing | null> = { ...tokenListingMap };
    if (getChain(projectId) !== 'ethereum') {
      tokenIdsToUpdate.forEach((tokenId: string): void => {
        newListingMap[tokenId] = null;
      });
    } else {
      const openseaListingMap = await new OpenseaClient().getTokenListings(selectedCollection.address, tokenIdsToUpdate);
      const looksrareListingMap = await new LooksrareClient().getTokenListings(selectedCollection.address, tokenIdsToUpdate);
      tokenIdsToUpdate.forEach((tokenId: string): void => {
        const listings = [openseaListingMap[tokenId], looksrareListingMap[tokenId]].filter((listing: TokenListing | null): boolean => listing != null) as TokenListing[];
        if (listings.length === 0) {
          newListingMap[tokenId] = null;
        } else {
          newListingMap[tokenId] = listings.sort((listing1: TokenListing, listing2: TokenListing): number => (listing1.value.gte(listing2.value) ? 1 : -1))[0];
        }
      });
    }
    setTokenListMap(newListingMap);
  }, [projectId, selectedCollection?.address, galleryTokens, tokenListingMap]);

  React.useEffect((): void => {
    updateTokenListings();
  }, [updateTokenListings]);

  const onWindowScrolled = React.useCallback((sizeScrolled: number, factorScrolled: number): void => {
    if (galleryTokenCountRef.current > 0 && tokenLimitRef.current > galleryTokenCountRef.current) {
      return;
    }
    if (((sizeScrolled / factorScrolled) - sizeScrolled) < 750) {
      tokenLimitRef.current += 30;
      loadMoreCollectionTokens();
    }
  }, [galleryTokenCountRef, tokenLimitRef, loadMoreCollectionTokens]);

  useWindowScroll(onWindowScrolled);

  const onToggleResponsiveFilterClicked = (): void => {
    setIsResponsiveFilterShowing(!isResponsiveFilterShowing);
  };

  const onCollectionSelected = (newSelectedCollection: Collection): void => {
    if (newSelectedCollection.address === collection?.address) {
      setSelectedCollectionAddress(null);
    } else {
      setSelectedCollectionAddress(newSelectedCollection.address);
    }
  };

  const getTokenTarget = (galleryToken: GalleryToken): string => {
    if (selectedCollectionAddress) {
      return `/tokens/${galleryToken.collectionToken.tokenId}?collection=${selectedCollectionAddress}`;
    }
    return `/tokens/${galleryToken.collectionToken.tokenId}`;
  };

  const onCloseSubpageClicked = (): void => {
    if (selectedCollectionAddress) {
      navigator.navigateTo(`/?collection=${selectedCollectionAddress}`);
      return;
    }
    navigator.navigateTo('/');
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
      {selectedCollection === undefined || selectedCollectionAttributes === undefined ? (
        <Stack isFullHeight={true} isFullWidth={true} contentAlignment={Alignment.Center} childAlignment={Alignment.Center}>
          <LoadingSpinner />
        </Stack>
      ) : selectedCollection === null || selectedCollectionAttributes === null ? (
        <Text variant='error'>Failed to load</Text>
      ) : (
        <Stack direction={Direction.Horizontal} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Start} contentAlignment={Alignment.Center} shouldAddGutters={false} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
            {/* NOTE(krishan711): 3.4em comes from navBar.height */}
            <Box width='300px' maxHeight='calc(100vh - 3.4em)' variant='sideMenu-unrounded' isScrollableVertically={true}>
              <Filter
                filters={filters}
                onAttributeValueClicked={onAttributeValueClicked}
                account={account}
                showOwnedTokensOnly={showOwnedTokensOnly}
                setShowOwnedTokensOnly={setShowOwnedTokensOnly}
                showListedTokensOnly={showListedTokensOnly}
                setShowListedTokensOnly={setShowListedTokensOnly}
                shouldShowMusicOption={backgroundMusic != null}
                shouldPlayMusic={shouldPlayMusic}
                setShouldPlayMusic={setShouldPlayMusic}
                collection={selectedCollection}
                otherCollections={otherCollections}
                onCollectionSelected={onCollectionSelected}
                collectionAttributes={selectedCollectionAttributes}
                shouldShowMarket={getChain(projectId) === 'ethereum'}
                order={order}
                setOrder={setOrder}
                shouldShowOrder={getChain(projectId) === 'ethereum'}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </Box>
          </ResponsiveHidingView>
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <Stack direction={Direction.Vertical} isScrollableVertically={false} isFullHeight={true} contentAlignment={Alignment.Start}>
              { getTreasureHuntTokenId(projectId) && (
                <Stack paddingHorizontal={PaddingSize.Wide2} isFullWidth={true}>
                  <Box variant='notification'>
                    <MarkdownText textVariant='success' source={'🕵️‍♂️🕵️‍♀️ **The hunt is on, find the Sprite to win a prize!**\nHere&apos;s your clue: &quot;The tokenId is the beginner class in school&quot;'} />
                  </Box>
                </Stack>
              )}
              {(showOwnedTokensOnly || showListedTokensOnly || minPrice || maxPrice || Object.keys(filters).length > 0) && (
                <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start} paddingHorizontal={PaddingSize.Wide1} paddingBottom={PaddingSize.Default}>
                  {showOwnedTokensOnly && (
                    <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} text={'Owned'} onClicked={(): void => setShowOwnedTokensOnly(false)} />
                  )}
                  {showListedTokensOnly && (
                    <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} text={'Listed'} onClicked={(): void => setShowListedTokensOnly(false)} />
                  )}
                  {minPrice && (
                    <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} text={`Min price: ${longFormatEther(minPrice)}`} onClicked={(): void => setMinPrice(null)} />
                  )}
                  {maxPrice && (
                    <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} text={`Max price: ${longFormatEther(maxPrice)}`} onClicked={(): void => setMaxPrice(null)} />
                  )}
                  {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                    <React.Fragment key={filterKey}>
                      {filters[filterKey].map((filterValue: string): React.ReactElement => (
                        <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={`${filterKey}: ${filterValue}`} text={`${filterKey}: ${filterValue}`} onClicked={(): void => onAttributeValueClicked(filterKey, filterValue)} />
                      ))}
                    </React.Fragment>
                  ))}
                </Stack>
              )}
              {galleryTokens === undefined ? (
                <Stack isFullHeight={true} isFullWidth={true} contentAlignment={Alignment.Center} childAlignment={Alignment.Center}>
                  <LoadingSpinner />
                </Stack>
              ) : galleryTokens === null ? (
                <Text variant='error'>Failed to load</Text>
              ) : (
                <Stack.Item growthFactor={1} shrinkFactor={1}>
                  {galleryTokens.length > 0 ? (
                    <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Start} shouldAddGutters={true} isFullHeight={false} paddingBottom={PaddingSize.Wide3}>
                      {galleryTokens.map((galleryToken: GalleryToken): React.ReactElement => (
                        <TokenCard
                          key={galleryToken.collectionToken.tokenId}
                          token={galleryToken.collectionToken}
                          tokenCustomization={galleryToken.tokenCustomization}
                          tokenListing={galleryToken.tokenListing ?? tokenListingMap[galleryToken.collectionToken.tokenId]}
                          tokenQuantity={galleryToken.quantity}
                          target={getTokenTarget(galleryToken)}
                          shouldUsePreviewImages={shouldUsePreviewImages}
                        />
                      ))}
                    </EqualGrid>
                  ) : (
                    <Text>No tokens match filter</Text>
                  )}
                </Stack.Item>
              )}
            </Stack>
            {isResponsiveFilterShowing && (
              <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                {/* NOTE(krishan711): 3.4em is from navBar.height */}
                <FloatingView isFullHeight={false} positionBottom={'0px'} isFullWidth={true} positionLeft={'0px'} positionTop={'3.4em'} zIndex={'100'}>
                  <ColorSettingView variant='dialog'>
                    <Box variant='filterOverlay' isFullHeight={true} shouldClipContent={true} isScrollableVertically={true}>
                      <Filter
                        filters={filters}
                        onAttributeValueClicked={onAttributeValueClicked}
                        account={account}
                        showOwnedTokensOnly={showOwnedTokensOnly}
                        setShowOwnedTokensOnly={setShowOwnedTokensOnly}
                        showListedTokensOnly={showListedTokensOnly}
                        setShowListedTokensOnly={setShowListedTokensOnly}
                        shouldShowMusicOption={backgroundMusicSource != null}
                        shouldPlayMusic={shouldPlayMusic}
                        setShouldPlayMusic={setShouldPlayMusic}
                        collection={selectedCollection}
                        otherCollections={otherCollections}
                        onCollectionSelected={onCollectionSelected}
                        collectionAttributes={selectedCollectionAttributes}
                        shouldShowMarket={getChain(projectId) === 'ethereum'}
                        order={order}
                        setOrder={setOrder}
                        shouldShowOrder={getChain(projectId) === 'ethereum'}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        shouldShowDoneButton={true}
                        onDoneClicked={onToggleResponsiveFilterClicked}
                      />
                    </Box>
                  </ColorSettingView>
                </FloatingView>
              </ResponsiveHidingView>
            )}
            <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
              <FloatingView isFullWidth={true} positionBottom={'0'} positionLeft={'0'}>
                <Button isFullWidth={true} variant='unrounded-overlay' text={isResponsiveFilterShowing ? 'DONE' : 'FILTERS'} onClicked={onToggleResponsiveFilterClicked} />
              </FloatingView>
            </ResponsiveHidingView>
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
