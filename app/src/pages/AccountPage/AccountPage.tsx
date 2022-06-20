import React from 'react';

import { RestMethod, truncateMiddle } from '@kibalabs/core';
import { useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Direction, EqualGrid, Image, LayerContainer, LoadingSpinner, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { usePageData } from '../../PageDataContext';
import { loadTokenCollection } from '../../util';
import { IHomePageData } from '../HomePage/getHomePageData';

export const AccountPage = (): React.ReactElement => {
  const { notdClient, requester, projectId } = useGlobals();
  const { data } = usePageData<IHomePageData>();
  const accountAddress = useStringRouteParam('accountAddress');
  const [holdings, setHoldings] = React.useState<Token[] | undefined | null>(undefined);
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(data?.tokenCollection || undefined);
  const loadMetadata = React.useCallback(async (): Promise<void> => {
    const metadataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/metadatas.json`);
    const loadedTokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
    setTokenCollection(loadedTokenCollection);
  }, [requester, projectId]);
  React.useEffect((): void => {
    loadMetadata();
  }, [loadMetadata]);

  const getCollectionHoldings = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setHoldings(undefined);
    }
    if (!accountAddress) {
      setHoldings(null);
      return;
    }
    if (!tokenCollection || !tokenCollection.tokens) {
      setHoldings(undefined);
      return;
    }
    const tokens = tokenCollection.tokens;
    notdClient.getCollectionHoldings(tokenCollection.address, accountAddress).then((collectionTokens: CollectionToken[]): void => {
      const newOwnedTokens = collectionTokens.map((collectionToken: CollectionToken): Token => {
        return tokens[collectionToken.tokenId];
      });
      setHoldings(newOwnedTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setHoldings(null);
    });
  }, [notdClient, tokenCollection, accountAddress]);
  React.useEffect((): void => {
    getCollectionHoldings();
  }, [getCollectionHoldings]);

  return (
    <LayerContainer>
      <LayerContainer.Layer isFullHeight={true} isFullWidth={true}>
        <Stack direction={Direction.Vertical} isFullWidth={true} childAlignment={Alignment.Center} shouldAddGutters={true} paddingVertical={PaddingSize.Wide2} isScrollableVertically={true}>
          { accountAddress && (
            <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} isScrollableVertically={true}>
              <Box variant='rounded' shouldClipContent={true} height='40px' width='40px'>
                <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${accountAddress}/image`} alternativeText='Avatar' />
              </Box>
              <Text variant='header2'>{truncateMiddle(accountAddress, 15)}</Text>
            </Stack>
          )}
          <Spacing variant={PaddingSize.Wide} />
          <Stack.Item growthFactor={1}>
            <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Center} shouldAddGutters={true}>
              { holdings === undefined ? (
                <LoadingSpinner />) : (
                holdings && holdings.map((ownerToken: Token, index: number) : React.ReactElement => (
                  <TokenCard
                    key={index}
                    token={ownerToken}
                  />
                )))}
            </EqualGrid>
          </Stack.Item>
        </Stack>
      </LayerContainer.Layer>
    </LayerContainer>

  );
};
