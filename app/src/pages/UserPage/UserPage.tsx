import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Direction, Image, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { useAccount } from '../../AccountContext';
import { CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';
import { Token } from '../../model';

export const UserPage = (): React.ReactElement => {
  const account = useAccount();
  const { notdClient } = useGlobals();
  const address = useStringRouteParam('address');
  const accountAddress = useStringRouteParam('accountAddress');
  const [holdings, setHoldings] = React.useState<Token[] | undefined | null>(undefined);

  const getCollectionHoldings = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setHoldings(undefined);
    }
    if (!account) {
      setHoldings(null);
      return;
    }
    notdClient.getCollectionHoldings(address, account.address).then((tokenTransfers: CollectionToken[]): void => {
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
  }, [notdClient, address, account]);

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
