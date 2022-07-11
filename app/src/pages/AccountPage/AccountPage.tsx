import React from 'react';

import { RestMethod, truncateMiddle } from '@kibalabs/core';
import { useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Direction, EqualGrid, Head, Image, LoadingSpinner, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { CollectionToken } from '../../client/resources';
import { TokenCard } from '../../components/TokenCard';
import { TokenDialog } from '../../components/TokenDialog';
import { useGlobals } from '../../globalsContext';
import { Token, TokenCollection } from '../../model';
import { usePageData } from '../../PageDataContext';
import { loadTokenCollection } from '../../util';
import { IHomePageData } from '../HomePage/getHomePageData';

export const AccountPage = (): React.ReactElement => {
  const { notdClient, requester, projectId } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const { data } = usePageData<IHomePageData>();
  const accountAddress = useStringRouteParam('accountAddress');
  const [holdings, setHoldings] = React.useState<Token[] | undefined | null>(undefined);
  const [tokenCollection, setTokenCollection] = React.useState<TokenCollection | undefined>(data?.tokenCollection || undefined);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');
  const chosenToken = isTokenSubpageShowing && tokenCollection?.tokens ? tokenCollection.tokens[Number(location.pathname.split('/tokens/')[1])] : null;

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

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo(`/accounts/${accountAddress}`);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`${accountAddress} | ${tokenCollection ? tokenCollection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide}>
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingTop={PaddingSize.Wide2}>
          <Box variant='rounded' shouldClipContent={true} height='40px' width='40px'>
            <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${accountAddress}/image`} alternativeText='Avatar' />
          </Box>
          <Text variant='header2'>{truncateMiddle(accountAddress, 15)}</Text>
        </Stack>
        <Stack.Item growthFactor={1} shrinkFactor={1}>
          <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 3, extraLarge: 2 }} contentAlignment={Alignment.Center} shouldAddGutters={true}>
            { holdings === undefined ? (
              <LoadingSpinner />
            ) : holdings === null ? (
              <Text variant='error'>Failed to load account tokens</Text>
            ) : (
              holdings.map((ownerToken: Token, index: number): React.ReactElement => (
                <TokenCard key={index} token={ownerToken} target={`/accounts/${accountAddress}/tokens/${ownerToken.tokenId}`} />
              ))
            )}
          </EqualGrid>
        </Stack.Item>
      </Stack>
      {isTokenSubpageShowing && chosenToken && tokenCollection && (
        <TokenDialog
          token={chosenToken}
          tokenCollection={tokenCollection}
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
        />
      )}
    </React.Fragment>
  );
};
