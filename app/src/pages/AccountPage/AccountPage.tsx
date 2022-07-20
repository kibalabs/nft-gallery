import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { SubRouterOutlet, useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, ColorSettingView, Dialog, Direction, EqualGrid, Head, Image, LoadingSpinner, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';

export const AccountPage = (): React.ReactElement => {
  const { notdClient, collection } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const accountAddress = useStringRouteParam('accountAddress');
  const [collectionTokens, setCollectionTokens] = React.useState<CollectionToken[] | null | undefined>(undefined);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  const getCollectionHoldings = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setCollectionTokens(undefined);
    }
    if (!accountAddress) {
      setCollectionTokens(null);
      return;
    }
    if (!collection) {
      setCollectionTokens(undefined);
      return;
    }
    notdClient.listCollectionTokensByOwner(collection.address, accountAddress).then((retrievedCollectionTokens: CollectionToken[]): void => {
      setCollectionTokens(retrievedCollectionTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setCollectionTokens(null);
    });
  }, [notdClient, collection, accountAddress]);

  React.useEffect((): void => {
    getCollectionHoldings();
  }, [getCollectionHoldings]);

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo(`/accounts/${accountAddress}`);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`${accountAddress} | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
        <Spacing />
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
          <Box variant='rounded' shouldClipContent={true} height='40px' width='40px'>
            <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${accountAddress}/image`} alternativeText='Avatar' />
          </Box>
          <Text variant='header2'>{truncateMiddle(accountAddress, 15)}</Text>
        </Stack>
        <Stack.Item growthFactor={1} shrinkFactor={1}>
          <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 3, extraLarge: 2 }} contentAlignment={Alignment.Center} shouldAddGutters={true}>
            { collectionTokens === undefined ? (
              <LoadingSpinner />
            ) : collectionTokens === null ? (
              <Text variant='error'>Failed to load account tokens</Text>
            ) : (
              collectionTokens.map((ownerToken: CollectionToken, index: number): React.ReactElement => (
                <TokenCard
                  key={index}
                  token={ownerToken}
                  target={`/accounts/${accountAddress}/tokens/${ownerToken.tokenId}`}
                />
              ))
            )}
          </EqualGrid>
        </Stack.Item>
      </Stack>
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
