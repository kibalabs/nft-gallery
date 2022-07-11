import React from 'react';

import { RestMethod } from '@kibalabs/core';
import { Alignment, Direction, EqualGrid, LoadingSpinner, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { TokenTransfer } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { usePageData } from '../../PageDataContext';
import { loadTokenCollection } from '../../util';
import { IHomePageData } from '../HomePage/getHomePageData';

export const RecentSalesPage = (): React.ReactElement => {
  const { notdClient, requester, projectId } = useGlobals();
  const { data } = usePageData<IHomePageData>();
  const [recentSales, setRecentSales] = React.useState<Token[] | undefined | null>(undefined);
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(data?.tokenCollection || undefined);
  const loadMetadata = React.useCallback(async (): Promise<void> => {
    const metadataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/metadatas.json`);
    const loadedTokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
    setTokenCollection(loadedTokenCollection);
  }, [requester, projectId]);
  React.useEffect((): void => {
    loadMetadata();
  }, [loadMetadata]);

  const getCollectionRecentSales = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setRecentSales(undefined);
    }
    if (!tokenCollection?.address) {
      setRecentSales(null);
      return;
    }
    if (!tokenCollection || !tokenCollection.tokens) {
      setRecentSales(undefined);
      return;
    }
    const tokens = tokenCollection.tokens;
    notdClient.getCollectionRecentSales(tokenCollection?.address).then((collectionTokens: TokenTransfer[]): void => {
      const newOwnedTokens = collectionTokens.map((collectionToken: TokenTransfer): Token => {
        return tokens[collectionToken.tokenId];
      });
      setRecentSales(newOwnedTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setRecentSales(null);
    });
  }, [notdClient, tokenCollection]);
  React.useEffect((): void => {
    getCollectionRecentSales();
  }, [getCollectionRecentSales]);
  return (
    <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} padding={PaddingSize.Wide2}>
      <Text variant='header2'>Recent Sales</Text>
      <Stack.Item growthFactor={1}>
        <EqualGrid childSizeResponsive={{ base: 6, medium: 6, large: 4, extraLarge: 3 }} contentAlignment={Alignment.Center} shouldAddGutters={true}>
          { recentSales === undefined ? (
            <LoadingSpinner />) : (
            recentSales && recentSales.map((recentSaleToken: Token, index: number) : React.ReactElement => (
              <TokenCard
                key={index}
                token={recentSaleToken}
                target={`/tokens/${recentSaleToken.tokenId}`}
              />
            )))}
        </EqualGrid>
      </Stack.Item>
    </Stack>
  );
};
