import React from 'react';

import { useDeepCompareEffect, useNavigator, useRenderedRef, useScrollListener } from '@kibalabs/core-react';
import { Alignment, Box, Direction, EqualGrid, LinkBase, LoadingSpinner, PaddingSize, Pill, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { TokenCard } from '../components/TokenCard';
import { TokenDialog } from '../components/TokenDialog';
import metadata from '../metadata_consolidated.json';
import { Token, TokenAttribute, TokenCollection, TokenCollectionAttribute } from '../model';


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
    const parsedTokens = (metadata as unknown as object[]).map((metadataObject: object): Token => {
      return {
        tokenId: metadataObject.tokenId,
        name: metadataObject.name,
        description: metadataObject.description,
        imageUrl: `https://mdtp-images.s3.eu-west-1.amazonaws.com/images/${metadataObject.tokenId}.png`, // metadataObject['image'],
        attributes: (metadataObject.attributes || []).map((attribute: object): TokenAttribute => {
          return {
            name: attribute.trait_type,
            value: attribute.value ? attribute.value : null,
          };
        }),
        attributeMap: (metadataObject.attributes || []).reduce((current: Record<string, string>, attribute: object): Record<string, string> => {
          // eslint-disable-next-line no-param-reassign
          current[attribute.trait_type] = attribute.value ? attribute.value : null;
          return current;
        }, {}),
      };
    });
    parsedTokens.sort((token1: Token, token2: Token): number => token1.tokenId - token2.tokenId);

    const tokenAttributes: Record<string, TokenCollectionAttribute> = {};
    parsedTokens.forEach((token: Token): void => {
      token.attributes.forEach((attribute: TokenAttribute): void => {
        let tokenAttribute = tokenAttributes[attribute.name];
        if (!tokenAttribute) {
          tokenAttribute = {
            name: attribute.name,
            tokenIds: [],
            values: {},
          };
          tokenAttributes[tokenAttribute.name] = tokenAttribute;
        }
        tokenAttribute.tokenIds.push(token.tokenId);
        let tokenValue = tokenAttribute.values[attribute.value];
        if (!tokenValue) {
          tokenValue = {
            name: attribute.value,
            tokenIds: [],
          };
          tokenAttribute.values[tokenValue.name] = tokenValue;
        }
        tokenValue.tokenIds.push(token.tokenId);
      });
    });

    setTokenCollection({
      tokens: parsedTokens.reduce((current: Record<string, Token>, value: Token): Record<string, Token> => {
        // eslint-disable-next-line no-param-reassign
        current[value.tokenId] = value;
        return current;
      }, {}),
      attributes: tokenAttributes,
    });
  }, [metadata]);

  const onAttributeValueClicked = (attributeName: string, attributeValue: string): void => {
    const filtersCopy = { ...filters };
    if (filtersCopy[attributeName] === attributeValue) {
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

  // eslint-disable-next-line no-restricted-globals
  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  // eslint-disable-next-line no-restricted-globals
  const chosenToken = tokenCollection?.tokens[Number(location.pathname.replace('/tokens/', ''))];

  return (
    <React.Fragment>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide2} paddingHorizontal={PaddingSize.Wide2}>
        <Text variant='header1'>MDTP NFT Gallery</Text>
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <Stack direction={Direction.Horizontal} shouldAddGutters={true} isFullHeight={true} isFullWidth={true}>
            <Box width='300px' isFullHeight={true}>
              <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true}>
                <Text variant='header3'>FILTER</Text>
                {tokenCollection === undefined ? (
                  <LoadingSpinner />
                ) : (
                  <React.Fragment>
                    {Object.keys(tokenCollection.attributes).map((attributeKey: string): React.ReactElement => (
                      <Stack key={tokenCollection.attributes[attributeKey].name} direction={Direction.Vertical} contentAlignment={Alignment.Start}>
                        <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Fill} isFullWidth={true}>
                          <Text variant='bold-large'>{tokenCollection.attributes[attributeKey].name}</Text>
                          <Text variant='note'>{tokenCollection.attributes[attributeKey].tokenIds.length}</Text>
                        </Stack>
                        {Object.keys(tokenCollection.attributes[attributeKey].values).map((valueKey: string): React.ReactElement => (
                          <LinkBase key={valueKey} onClicked={(): void => onAttributeValueClicked(attributeKey, valueKey)} isFullWidth={true}>
                            <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Fill} isFullWidth={true}>
                              <Text>{tokenCollection.attributes[attributeKey].values[valueKey].name || 'none'}</Text>
                              <Text variant='note'>{tokenCollection.attributes[attributeKey].values[valueKey].tokenIds.length}</Text>
                            </Stack>
                          </LinkBase>
                        ))}
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
                    <Pill key={filterKey} text={`${filterKey}: ${filters[filterKey]}`} />
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
