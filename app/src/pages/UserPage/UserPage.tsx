import React from 'react';

import { RestMethod, truncateMiddle } from '@kibalabs/core';
import { useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Direction, Image, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { usePageData } from '../../PageDataContext';
import { loadTokenCollection } from '../../util';
import { IHomePageData } from '../HomePage/getHomePageData';

export const UserPage = (): React.ReactElement => {
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
    notdClient.getCollectionHoldings(tokenCollection?.address, accountAddress).then((tokenTransfers: CollectionToken[]): void => {
      const newOwnedTokens: Token[] = tokenTransfers.map((tokenTransfer: CollectionToken) => {
        return {
          tokenId: tokenTransfer.tokenId,
          name: tokenTransfer.name,
          description: tokenTransfer.description,
          imageUrl: tokenTransfer.imageUrl,
          attributes: [],
        };
      });
      setHoldings(newOwnedTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setHoldings(null);
    });
  }, [notdClient, tokenCollection?.address, accountAddress]);

  React.useEffect((): void => {
    getCollectionHoldings();
  }, [getCollectionHoldings]);

  return (
    <Stack direction={Direction.Vertical} isFullWidth={true} childAlignment={Alignment.Center} shouldAddGutters={true} paddingVertical={PaddingSize.Wide2}>
      { accountAddress && (
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
          <Box variant='rounded' shouldClipContent={true} height='40px' width='40px'>
            <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${accountAddress}/image`} alternativeText='Avatar' />
          </Box>
          <Text variant='header2'>{truncateMiddle(accountAddress, 15)}</Text>
        </Stack>
      )}
      <Spacing variant={PaddingSize.Wide} />
      <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Center} childAlignment={Alignment.Center} shouldAddGutters={true} shouldWrapItems={true}>
        {holdings && holdings.map((ownerToken: Token, index: number) : React.ReactElement => (
          <TokenCard
            key={index}
            token={ownerToken}
          />

        ))}
      </Stack>
    </Stack>
  );
};
