import React from 'react';

import { useDeepCompareEffect, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, Head, KibaIcon, LayerContainer, LoadingSpinner, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text, useResponsiveScreenSize } from '@kibalabs/ui-react';

import { Filter } from '../components/Filter';
import { TokenCard } from '../components/TokenCard';
import { TokenDialog } from '../components/TokenDialog';
import metadata from '../metadata_consolidated.json';
import { Token, TokenCollection } from '../model';
import { loadTokenCollectionFromFile } from '../util';


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(undefined);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenLimit, setTokenLimit] = React.useState<number>(50);
  const [isResponsiveFilterShowing, setIsResponsiveFilterShowing] = React.useState<boolean>(false);
  const [scrollingRef] = useRenderedRef<HTMLDivElement>();
  const responsiveScreenSize = useResponsiveScreenSize();

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
  }, [metadata]);

  const onAttributeValueClicked = (attributeName: string, attributeValue: string | null | undefined): void => {
    const filtersCopy = { ...filters };
    if (filtersCopy[attributeName] === attributeValue || !attributeValue) {
      delete filtersCopy[attributeName];
    } else {
      filtersCopy[attributeName] = attributeValue;
    }
    setFilters(filtersCopy);
    scrollingRef.current.scrollTop = 0;
  };

  const filteredTokens = React.useMemo((): Token[] | undefined => {
    if (!tokenCollection || !tokenCollection.tokens) {
      return undefined;
    }
    const validFilterKeys = Object.keys(filters).filter((filterKey: string): boolean => filters[filterKey] != null);
    const innerFilteredTokens = Object.values(tokenCollection.tokens).filter((token: Token): boolean => {
      let match = true;
      validFilterKeys.forEach((filterKey: string): void => {
        match = match && token.attributeMap[filterKey] === filters[filterKey];
      });
      return match;
    });
    return innerFilteredTokens.slice(0, tokenLimit);
  }, [tokenCollection, filters, tokenLimit]);

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
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide2}>
        <Text variant='header1'>{`${tokenCollection ? tokenCollection.name : ''} Gallery`}</Text>
        <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
          <Button variant='small' text={isResponsiveFilterShowing ? 'Hide Filter Menu' : 'Show Filter Menu'} onClicked={(): void => setIsResponsiveFilterShowing(!isResponsiveFilterShowing)} />
        </ResponsiveHidingView>
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          {tokenCollection === undefined ? (
            <LoadingSpinner />
          ) : (
            <Stack direction={Direction.Horizontal} shouldAddGutters={true} defaultGutter={PaddingSize.Wide2} isFullHeight={true} isFullWidth={true}>
              <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                <Spacing variant={PaddingSize.Wide2} />
                <Box width='300px' isFullHeight={true}>
                  <Filter filters={filters} onAttributeValueClicked={onAttributeValueClicked} tokenCollection={tokenCollection} />
                </Box>
              </ResponsiveHidingView>
              <Stack.Item growthFactor={1} shrinkFactor={1}>
                <LayerContainer>
                  <Box ref={scrollingRef} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
                    <Stack direction={Direction.Vertical} shouldAddGutters={true} contentAlignment={Alignment.Start} paddingRight={PaddingSize.Wide2}>
                      <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start}>
                        {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                          <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} onClicked={(): void => onAttributeValueClicked(filterKey, undefined)} />
                        ))}
                      </Stack>
                      <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Start} isFullHeight={true} shouldAddGutters={true}>
                        {filteredTokens.map((token: Token): React.ReactElement => (
                          <TokenCard key={String(token.tokenId)} token={token} />
                        ))}
                      </EqualGrid>
                    </Stack>
                  </Box>
                  {isResponsiveFilterShowing && (responsiveScreenSize === ScreenSize.Base || responsiveScreenSize === ScreenSize.Small) && (
                    <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                      <Box variant='overlay' isFullHeight={true} width='80%' maxWidth='350px'>
                        <Filter filters={filters} onAttributeValueClicked={onAttributeValueClicked} tokenCollection={tokenCollection} />
                      </Box>
                    </ResponsiveHidingView>
                  )}
                </LayerContainer>
              </Stack.Item>
            </Stack>
          )}
        </Stack.Item>
      </Stack>
      {isTokenSubpageShowing && chosenToken && (
        <TokenDialog
          token={chosenToken}
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
        />
      )}
    </React.Fragment>
  );
};
