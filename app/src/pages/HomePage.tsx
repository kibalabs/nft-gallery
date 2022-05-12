import React from 'react';

import { useDeepCompareEffect, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, IOption, KibaIcon, LoadingSpinner, OptionSelect, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { TokenCard } from '../components/TokenCard';
import { TokenDialog } from '../components/TokenDialog';
import metadata from '../metadata_consolidated.json';
import { Token, TokenCollection, TokenCollectionAttribute } from '../model';
import { loadTokenCollectionFromFile } from '../util';


export const HomePage = (): React.ReactElement => {
  const navigator = useNavigator();
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(undefined);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [tokenLimit, setTokenLimit] = React.useState<number>(50);
  const [scrollingRef] = useRenderedRef<HTMLDivElement>();

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

  const getOptions = (attribute: TokenCollectionAttribute): IOption[] => {
    return Object.keys(attribute.values).map((valueKey: string): IOption => ({
      text: attribute.values[valueKey].name,
      itemKey: attribute.values[valueKey].name,
      // listItemVariant?: string;
      // textVariant?: string;
      // isDisabled?: boolean;
    }));
  };

  const onOptionSelected = (attribute: TokenCollectionAttribute, itemKey: string): void => {
    onAttributeValueClicked(attribute.name, itemKey);
  };

  const getSelectedOptionKey = (attribute: TokenCollectionAttribute): string | undefined => {
    return filters[attribute.name];
  };

  // eslint-disable-next-line no-restricted-globals
  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  // eslint-disable-next-line no-restricted-globals
  const chosenToken = tokenCollection?.tokens[Number(location.pathname.replace('/tokens/', ''))];

  return (
    <React.Fragment>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide2} paddingHorizontal={PaddingSize.Wide2}>
        <Text variant='header1'>{`${tokenCollection ? tokenCollection.name : ''} Gallery`}</Text>
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <Stack direction={Direction.Horizontal} shouldAddGutters={true} isFullHeight={true} isFullWidth={true}>
            <Box width='300px' isFullHeight={true}>
              <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true}>
                {/* <Text variant='header3'>FILTER</Text> */}
                {tokenCollection === undefined ? (
                  <LoadingSpinner />
                ) : (
                  <React.Fragment>
                    {Object.keys(tokenCollection.attributes).map((attributeKey: string): React.ReactElement => (
                      <Stack key={tokenCollection.attributes[attributeKey].name} direction={Direction.Vertical} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Wide} shouldAddGutters={true}>
                        <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Fill} isFullWidth={true}>
                          <Text variant='bold-large'>{tokenCollection.attributes[attributeKey].name}</Text>
                          {/* <Text variant='note'>{tokenCollection.attributes[attributeKey].tokenIds.length}</Text> */}
                        </Stack>
                        <OptionSelect
                          options={getOptions(tokenCollection.attributes[attributeKey])}
                          onItemClicked={(itemKey: string) => onOptionSelected(tokenCollection.attributes[attributeKey], itemKey)}
                          selectedItemKey={getSelectedOptionKey(tokenCollection.attributes[attributeKey])}
                        />
                        {/* {Object.keys(tokenCollection.attributes[attributeKey].values).map((valueKey: string): React.ReactElement => (
                          <LinkBase key={valueKey} onClicked={(): void => onAttributeValueClicked(attributeKey, valueKey)} isFullWidth={true}>
                            <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Fill} isFullWidth={true}>
                              <Text>{tokenCollection.attributes[attributeKey].values[valueKey].name || 'none'}</Text>
                              <Text variant='note'>{tokenCollection.attributes[attributeKey].values[valueKey].tokenIds.length}</Text>
                            </Stack>
                          </LinkBase>
                        ))} */}
                      </Stack>
                    ))}
                  </React.Fragment>
                )}
              </Stack>
            </Box>
            <Spacing />
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Stack direction={Direction.Vertical} shouldAddGutters={true}>
                <Stack direction={Direction.Horizontal} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Start}>
                  {Object.keys(filters).map((filterKey: string): React.ReactElement => (
                    <Button variant='small' iconRight={<KibaIcon variant='small' iconId='ion-close' />} key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} onClicked={(): void => onAttributeValueClicked(filterKey, undefined)} />
                  ))}
                </Stack>
                <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
                  <div ref={scrollingRef} style={{ overflowY: 'auto' }}>
                    {tokenCollection === undefined ? (
                      <LoadingSpinner />
                    ) : (
                      <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Start} isFullHeight={false} shouldAddGutters={true}>
                        {filteredTokens.map((token: Token): React.ReactElement => (
                          <TokenCard key={String(token.tokenId)} token={token} />
                        ))}
                      </EqualGrid>
                    )}
                  </div>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
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
