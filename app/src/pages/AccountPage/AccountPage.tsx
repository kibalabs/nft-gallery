import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Direction, EqualGrid, Head, Image, LoadingSpinner, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { Collection, CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { TokenDialog } from '../../components/TokenDialog';
import { useGlobals } from '../../globalsContext';
import { usePageData } from '../../PageDataContext';
import { getCollectionAddress } from '../../util';
import { IHomePageData } from '../HomePage/getHomePageData';

export const AccountPage = (): React.ReactElement => {
  const { notdClient, projectId } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const { data } = usePageData<IHomePageData>();
  const accountAddress = useStringRouteParam('accountAddress');
  const [collection, setCollection] = React.useState<Collection | null | undefined>(data?.collection || undefined);
  const [collectionTokens, setCollectionTokens] = React.useState<CollectionToken[] | null | undefined>(data?.collectionTokens || undefined);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  const chosenToken = isTokenSubpageShowing && collectionTokens ? collectionTokens.find((token: CollectionToken): boolean => token.tokenId === location.pathname.split('/tokens/')[1]) : null;

  // TODO(krishan711): this would be much better somewhere global
  const updateCollection = React.useCallback((): void => {
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      notdClient.getCollection(collectionAddress).then((retrievedCollection: Collection): void => {
        setCollection(retrievedCollection);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollection(null);
      });
    } else {
      // TODO(krishan711): Load from file
      //   const metadataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/metadatas.json`);
      //   const loadedTokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
      //   setTokenCollection(loadedTokenCollection);
    }
  }, [notdClient, projectId]);

  React.useEffect((): void => {
    updateCollection();
  }, [updateCollection]);


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
      {isTokenSubpageShowing && chosenToken && collection && (
        <TokenDialog
          token={chosenToken}
          collection={collection}
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
        />
      )}
    </React.Fragment>
  );
};
