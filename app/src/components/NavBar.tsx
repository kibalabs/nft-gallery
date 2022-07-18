import React from 'react';

import { RestMethod } from '@kibalabs/core';
import { Alignment, Box, Button, Direction, Image, LinkBase, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { Collection } from '../client';
import { useGlobals } from '../globalsContext';
import { IGalleryPageData, usePageData } from '../PageDataContext';
import { getCollectionAddress, getLogoImageUrl } from '../util';
import { Account } from './Account';


export const NavBar = (): React.ReactElement => {
  const account = useAccount();
  const { notdClient, projectId, requester } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const logoImageUrl = getLogoImageUrl(projectId);
  const { data } = usePageData<IGalleryPageData>();
  const [collection, setCollection] = React.useState<Collection | null | undefined>(data?.collection || undefined);

  // TODO(krishan711): this would be much better somewhere global
  const updateCollection = React.useCallback(async (): Promise<void> => {
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      notdClient.getCollection(collectionAddress).then((retrievedCollection: Collection): void => {
        setCollection(retrievedCollection);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollection(null);
      });
    } else {
      const collectionDataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/data.json`);
      const collectionData = JSON.parse(collectionDataResponse.content);
      const newCollection = Collection.fromObject(collectionData.collection);
      setCollection(newCollection);
    }
  }, [notdClient, requester, projectId]);

  React.useEffect((): void => {
    updateCollection();
  }, [updateCollection]);

  return (
    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Default} paddingVertical={PaddingSize.Wide}>
      <Stack.Item shrinkFactor={1}>
        <LinkBase target='/' isFullHeight={true}>
          {logoImageUrl ? (
            <Box height='100%' maxHeight='2em' shouldClipContent={true}>
              <Image source={logoImageUrl} alternativeText={`${collection ? collection.name : ''} Gallery`} isFullHeight={true} />
            </Box>
          ) : (
            <Text variant='header1'>{`${collection ? collection.name : ''} Gallery`}</Text>
          )}
        </LinkBase>
      </Stack.Item>
      <Stack.Item shrinkFactor={1} growthFactor={1}>
        <Spacing />
      </Stack.Item>
      { !account ? (
        <Button variant='secondary' text='Connect Wallet' onClicked={onLinkAccountsClicked} />
      ) : (
        <Account accountId={account.address} target={`/accounts/${account.address}`} />
      )}
    </Stack>
  );
};
