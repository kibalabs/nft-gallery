import React from 'react';

import { SubRouterOutlet, useLocation, useNavigator } from '@kibalabs/core-react';
import { Alignment, ColorSettingView, ContainingView, Dialog, Direction, Head, KibaIcon, LoadingSpinner, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { Collection, CollectionOverlap, CollectionOverlapSummary, SuperCollectionOverlap } from '../../client';
import { AccountViewLink } from '../../components/AccountView';
import { CollapsibleBox } from '../../components/CollapsibleBox';
import { IpfsImage } from '../../components/IpfsImage';
import { useGlobals } from '../../globalsContext';
import { isSuperCollection } from '../../util';


export const MemberHoldingsPage = (): React.ReactElement => {
  const { notdClient, projectId, collection, otherCollections } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const [collectionOverlapSummaries, setCollectionOverlapSummaries] = React.useState<CollectionOverlapSummary[] | null | undefined>(undefined);
  const [registryExpandedMap, setRegistryExpandedMap] = React.useState<Record<string, boolean>>({});
  const [collectionOverlapsMap, setCollectionOverlapsMap] = React.useState<Record<string, SuperCollectionOverlap[]>>({});

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo('/member-holdings');
  };

  const updateCollectionOverlapSummaries = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setCollectionOverlapSummaries(undefined);
    }
    if (!collection?.address) {
      setCollectionOverlapSummaries(undefined);
      return;
    }
    if (isSuperCollection(projectId)) {
      notdClient.listSuperCollectionOverlapSummaries(projectId).then((retrievedCollectionOverlapSummaries: CollectionOverlapSummary[]): void => {
        setCollectionOverlapSummaries(retrievedCollectionOverlapSummaries);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionOverlapSummaries(null);
      });
    } else {
      notdClient.listCollectionOverlapSummaries(collection.address).then((retrievedCollectionOverlapSummaries: CollectionOverlapSummary[]): void => {
        setCollectionOverlapSummaries(retrievedCollectionOverlapSummaries);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionOverlapSummaries(null);
      });
    }
  }, [notdClient, projectId, collection?.address]);

  React.useEffect((): void => {
    updateCollectionOverlapSummaries();
  }, [updateCollectionOverlapSummaries]);

  const onRegistryCollapseToggled = (registryAddress: string): void => {
    if (collection && !collectionOverlapsMap[registryAddress]) {
      if (isSuperCollection(projectId)) {
        notdClient.listSuperCollectionOverlaps(projectId, registryAddress).then((retrievedSuperCollectionOverlaps: SuperCollectionOverlap[]): void => {
          setCollectionOverlapsMap({
            ...collectionOverlapsMap,
            [registryAddress]: retrievedSuperCollectionOverlaps,
          });
        }).catch((error: unknown): void => {
          console.error(error);
        });
      } else {
        notdClient.listCollectionOverlaps(collection.address, registryAddress).then((retrievedCollectionOverlaps: CollectionOverlap[]): void => {
          const superCollectionOverlaps = retrievedCollectionOverlaps.reduce((accumulator: SuperCollectionOverlap[], current: CollectionOverlap): SuperCollectionOverlap[] => {
            accumulator.push(new SuperCollectionOverlap(current.ownerAddress, current.otherRegistryAddress, current.otherRegistryTokenCount, { [current.registryAddress]: current.registryTokenCount }));
            return accumulator;
          }, []);
          setCollectionOverlapsMap({
            ...collectionOverlapsMap,
            [registryAddress]: superCollectionOverlaps,
          });
        }).catch((error: unknown): void => {
          console.error(error);
        });
      }
    }
    setRegistryExpandedMap({
      ...registryExpandedMap,
      [registryAddress]: !registryExpandedMap[registryAddress],
    });
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Member Holdings | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <ContainingView>
        <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          {collection === undefined || collectionOverlapSummaries === undefined ? (
            <LoadingSpinner />
          ) : collection === null || collectionOverlapSummaries === null ? (
            <Text variant='error'>Failed to load</Text>
          ) : collectionOverlapSummaries.length === 0 ? (
            <Text alignment={TextAlignment.Center}>No other projects</Text>
          ) : (
            <React.Fragment>
              {collectionOverlapSummaries.map((collectionOverlapSummary: CollectionOverlapSummary): React.ReactElement => (
                <CollapsibleBox
                  key={collectionOverlapSummary.registryAddress}
                  isCollapsed={!registryExpandedMap[collectionOverlapSummary.otherCollection.address]}
                  onCollapseToggled={(): void => onRegistryCollapseToggled(collectionOverlapSummary.otherCollection.address)}
                  headerView={(
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                      <IpfsImage source={collectionOverlapSummary.otherCollection.imageUrl || ''} height='1.5em' width='1.5em' alternativeText='' />
                      <Text>{collectionOverlapSummary.otherCollection.name}</Text>
                      <Spacing />
                      <KibaIcon variant='small' iconId='ion-person' />
                      <Text>{collectionOverlapSummary.ownerCount}</Text>
                      <Spacing />
                      <KibaIcon variant='small' iconId='ion-grid' />
                      <Text>{collectionOverlapSummary.otherRegistryTokenCount}</Text>
                    </Stack>
                  )}
                >
                  {!collectionOverlapsMap[collectionOverlapSummary.otherCollection.address] ? (
                    <LoadingSpinner />
                  ) : (
                    <Stack direction={Direction.Vertical} contentAlignment={Alignment.Start} childAlignment={Alignment.Start} shouldAddGutters={true}>
                      {collectionOverlapsMap[collectionOverlapSummary.otherCollection.address].map((collectionOverlap: SuperCollectionOverlap): React.ReactElement => (
                        <Stack key={collectionOverlap.ownerAddress} direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                          <AccountViewLink address={collectionOverlap.ownerAddress} target={`/members/${collectionOverlap.ownerAddress}`} />
                          <Spacing />
                          {isSuperCollection(projectId) ? (
                            <React.Fragment>
                              {otherCollections?.map((otherCollection: Collection): React.ReactElement => (
                                <React.Fragment key={otherCollection.address}>
                                  {(collectionOverlap.registryTokenCountMap[otherCollection.address] || 0) > 0 ? (
                                    <React.Fragment>
                                      <IpfsImage source={otherCollection.imageUrl || ''} height='1.5em' width='1.5em' alternativeText='' />
                                      <Text>{collectionOverlap.registryTokenCountMap[otherCollection.address] || 0}</Text>
                                      <Spacing variant={PaddingSize.Narrow} />
                                    </React.Fragment>
                                  ) : (
                                    null
                                  )}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <IpfsImage source={collection.imageUrl || ''} height='1.5em' width='1.5em' alternativeText='' />
                              <Text>{collectionOverlap.registryTokenCountMap[collection.address] || 0}</Text>
                              <Spacing variant={PaddingSize.Narrow} />
                            </React.Fragment>
                          )}
                          <Spacing variant={PaddingSize.Narrow} />
                          <IpfsImage source={collectionOverlapSummary.otherCollection.imageUrl || ''} height='1.5em' width='1.5em' alternativeText='' />
                          <Text>{collectionOverlap.otherRegistryTokenCount}</Text>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </CollapsibleBox>
              ))}
            </React.Fragment>
          )}
        </Stack>
      </ContainingView>
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
