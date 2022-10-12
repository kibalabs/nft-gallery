import React from 'react';

import { etherToNumber, longFormatNumber, resolveUrl, truncateEnd, truncateMiddle } from '@kibalabs/core';
import { useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, Form, Head, HidingView, IconButton, Image, KibaIcon, Link, LinkBase, List, LoadingSpinner, MultiLineInput, PaddingSize, ResponsiveTextAlignmentView, SingleLineInput, Spacing, Stack, TabBar, Text, TextAlignment } from '@kibalabs/ui-react';
import { BigNumber } from 'ethers';

import { useAccount, useOnLinkAccountsClicked, useWeb3 } from '../../AccountContext';
import { Airdrop, CollectionToken, GalleryToken, TokenAttribute, TokenListing, TokenOwnership, TokenTransfer } from '../../client';
import { AccountViewLink } from '../../components/AccountView';
import { EtherValue } from '../../components/EtherValue';
import { IpfsImage } from '../../components/IpfsImage';
import { KeyValue } from '../../components/KeyValue';
import { TokenTransferRow } from '../../components/TokenTransferRow';
import { useGlobals } from '../../globalsContext';
import { LooksrareClient } from '../../LooksrareClient';
import { OpenseaClient } from '../../OpenseaClient';
import { getChain, getTreasureHuntTokenId, isCustomizationEnabled } from '../../util';

const TAB_KEY_ATTRIBUTES = 'TAB_KEY_ATTRIBUTES';
const TAB_KEY_OWNERSHIPS = 'TAB_KEY_OWNERSHIPS';
const TAB_KEY_ACTIVITY = 'TAB_KEY_ACITIVTY';

export const TokenPage = (): React.ReactElement => {
  const account = useAccount();
  const web3 = useWeb3();
  const tokenId = useStringRouteParam('tokenId');
  const { notdClient, projectId, collection, allTokens } = useGlobals();
  const [galleryToken, setGalleryToken] = React.useState<GalleryToken | null | undefined>(undefined);
  const collectionToken = galleryToken?.collectionToken;
  const tokenCustomization = galleryToken?.tokenCustomization;
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const [tokenTransfers, setTokenTransfers] = React.useState<TokenTransfer[] | undefined | null>(undefined);
  const [tokenOwnerships, setTokenOwnerships] = React.useState<TokenOwnership[] | null | undefined>(undefined);
  const [isTreasureHuntSubmitting, setIsTreasureHuntSubmitting] = React.useState<boolean>(false);
  const [isTreasureHuntSubmitted, setIsTreasureHuntSubmitted] = React.useState<boolean>(false);
  const [treasureHuntSubmittingError, setTreasureHuntSubmittingError] = React.useState<Error | null>(null);
  const [airdrop, setAirdrop] = React.useState<Airdrop | null | undefined>(undefined);
  const [liveListing, setLiveListing] = React.useState<TokenListing | null | undefined>(undefined);
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>(TAB_KEY_ATTRIBUTES);

  const listing = liveListing ?? galleryToken?.tokenListing;
  const imageUrl = collectionToken?.resizableImageUrl ?? (collectionToken?.imageUrl ? resolveUrl(collectionToken.imageUrl) : '');
  const frameImageUrl = collectionToken?.frameImageUrl && resolveUrl(collectionToken.frameImageUrl);
  const latestTransfer = tokenTransfers && tokenTransfers.length > 0 ? tokenTransfers[0] : null;
  const isOwner = collection?.doesSupportErc721 && latestTransfer?.toAddress && account && latestTransfer.toAddress === account.address;
  const tokenQuantity = React.useMemo((): BigNumber => {
    if (!collection?.doesSupportErc1155 || !tokenOwnerships) {
      return BigNumber.from(1);
    }
    return tokenOwnerships.reduce((accumulator: BigNumber, current: TokenOwnership): BigNumber => {
      return accumulator.add(current.quantity);
    }, BigNumber.from(0));
  }, [collection, tokenOwnerships]);
  const isTreasureHuntToken = collectionToken?.tokenId === getTreasureHuntTokenId(projectId);

  const onTabKeySelected = (newSelectedTabKey: string): void => {
    setSelectedTabKey(newSelectedTabKey);
  };

  const updateCollectionToken = React.useCallback(async (): Promise<void> => {
    if (collection?.address === undefined) {
      setGalleryToken(undefined);
      return;
    }
    if (collection?.address === null) {
      setGalleryToken(null);
      return;
    }
    if (allTokens) {
      const chosenCollectionToken = allTokens.find((candidateCollectionToken: CollectionToken): boolean => candidateCollectionToken.tokenId === tokenId);
      if (chosenCollectionToken == null) {
        setGalleryToken(null);
      } else {
        setGalleryToken(new GalleryToken(chosenCollectionToken, null, null, 1));
      }
    } else {
      await notdClient.getGalleryToken(collection?.address, tokenId).then((retrievedGalleryToken: GalleryToken): void => {
        setGalleryToken(retrievedGalleryToken);
      });
    }
  }, [notdClient, collection?.address, allTokens, tokenId]);

  React.useEffect((): void => {
    updateCollectionToken();
  }, [updateCollectionToken]);

  const updateListings = React.useCallback(async (): Promise<void> => {
    if (!collection?.address || !collectionToken?.tokenId) {
      setLiveListing(null);
      return;
    }
    setLiveListing(undefined);
    const liveListings: TokenListing[] = [];
    if (getChain(projectId) === 'ethereum') {
      try {
        const openseaListing = await (new OpenseaClient().getTokenListing(collection.address, collectionToken.tokenId));
        if (openseaListing) {
          liveListings.push(openseaListing);
        }
      } catch (error: unknown) {
        console.error(error);
      }
      try {
        const looksrareListing = await (new LooksrareClient().getTokenListing(collection.address, collectionToken.tokenId));
        if (looksrareListing) {
          liveListings.push(looksrareListing);
        }
      } catch (error: unknown) {
        console.error(error);
      }
    }
    if (liveListings.length === 0) {
      setLiveListing(null);
    } else {
      setLiveListing(liveListings.sort((liveListing1: TokenListing, liveListing2: TokenListing): number => (liveListing1.value.gte(liveListing2.value) ? 1 : -1))[0]);
    }
  }, [projectId, collection?.address, collectionToken?.tokenId]);

  React.useEffect((): void => {
    updateListings();
  }, [updateListings]);

  const updateAirdropStatus = React.useCallback(async (): Promise<void> => {
    if (!collection?.address || !collectionToken?.tokenId) {
      setAirdrop(null);
      return;
    }
    setAirdrop(undefined);
    notdClient.listCollectionTokenAirdrops(collection.address, collectionToken.tokenId).then((airdrops: Airdrop[]): void => {
      if (airdrops.length > 0) {
        setAirdrop(airdrops[0]);
      } else {
        setAirdrop(null);
      }
    }).catch((error: unknown): void => {
      console.error(error);
      setAirdrop(null);
    });
  }, [notdClient, collection?.address, collectionToken?.tokenId]);

  React.useEffect((): void => {
    updateAirdropStatus();
  }, [updateAirdropStatus]);

  const updateTokenSales = React.useCallback(async (): Promise<void> => {
    if (!collection?.address || !collectionToken?.tokenId) {
      setTokenTransfers(null);
      return;
    }
    setTokenTransfers(undefined);
    if (getChain(projectId) !== 'ethereum') {
      setTokenTransfers([]);
    } else {
      notdClient.listCollectionTokenRecentTransfers(collection.address, collectionToken.tokenId).then((retrievedTokenTransfers: TokenTransfer[]): void => {
        setTokenTransfers(retrievedTokenTransfers);
      }).catch((error: unknown): void => {
        console.error(error);
        setTokenTransfers(null);
      });
    }
  }, [notdClient, projectId, collection?.address, collectionToken?.tokenId]);

  React.useEffect((): void => {
    updateTokenSales();
  }, [updateTokenSales]);

  const updateTokenOwnerships = React.useCallback(async (): Promise<void> => {
    if (!collection?.address || !collectionToken?.tokenId || !collection?.doesSupportErc1155) {
      setTokenOwnerships(null);
      return;
    }
    setTokenOwnerships(undefined);
    if (getChain(projectId) !== 'ethereum') {
      setTokenOwnerships([]);
    } else {
      notdClient.listCollectionTokenOwnerships(collection.address, collectionToken.tokenId).then((retrievedTokenOwnerships: TokenOwnership[]): void => {
        setTokenOwnerships(retrievedTokenOwnerships);
      }).catch((error: unknown): void => {
        console.error(error);
        setTokenOwnerships(null);
      });
    }
  }, [notdClient, projectId, collection?.address, collectionToken?.tokenId, collection?.doesSupportErc1155]);

  React.useEffect((): void => {
    updateTokenOwnerships();
  }, [updateTokenOwnerships]);

  const onTreasureHuntSubmitClicked = async (): Promise<void> => {
    if (!collection || !collectionToken) {
      return;
    }
    setTreasureHuntSubmittingError(null);
    setIsTreasureHuntSubmitting(true);
    if (!account) {
      setIsTreasureHuntSubmitting(false);
      setTreasureHuntSubmittingError(Error('Please connect your wallet to submit'));
      return;
    }
    const message = JSON.stringify({
      command: 'COMPLETE_TREASURE_HUNT',
      message: {
        registryAddress: collection.address,
        tokenId: collectionToken.tokenId,
      },
    });
    let signature;
    try {
      signature = await account.signer.signMessage(message);
      await notdClient.submitTreasureHuntForCollectionToken(collection.address, collectionToken.tokenId, account.address, signature);
    } catch (error: unknown) {
      setIsTreasureHuntSubmitting(false);
      setTreasureHuntSubmittingError(error as Error);
      return;
    }
    setIsTreasureHuntSubmitted(true);
    setIsTreasureHuntSubmitting(false);
  };

  const getListingUrl = (tokenListing: TokenListing): string => {
    if (tokenListing.source.startsWith('opensea')) {
      return `https://opensea.io/assets/${tokenListing.registryAddress}/${tokenListing.tokenId}`;
    }
    if (tokenListing.source === 'looksrare') {
      return `https://looksrare.org/collections/${tokenListing.registryAddress}/${tokenListing.tokenId}`;
    }
    return '';
  };

  // TODO(krishan711): move this to a separate component
  const [isUpdatingStory, setIsUpdatingStory] = React.useState<boolean>(false);
  const [isSavingStory, setIsSavingStory] = React.useState<boolean>(false);
  const [customName, setCustomName] = React.useState<string>('');
  const [customDescription, setCustomDescription] = React.useState<string>('');
  const [updatingStoryErrorMessaging, setUpdatingStoryErrorMessaging] = React.useState<string | null>(null);
  const onUpdateStoryClicked = (): void => {
    setIsUpdatingStory(true);
    setCustomName(tokenCustomization?.name || collectionToken?.name || '');
    setCustomDescription('');
  };

  const onUpdateStoryCancelClicked = (): void => {
    setIsUpdatingStory(false);
  };

  const onUpdateStorySaveClicked = async (): Promise<void> => {
    if (!web3 || !account || !collection) {
      setUpdatingStoryErrorMessaging('Your wallet is not connected');
      return;
    }
    setUpdatingStoryErrorMessaging(null);
    setIsSavingStory(true);
    const blockNumber = await web3.getBlockNumber();
    const command = 'CREATE_CUSTOMIZATION';
    const message = {
      registryAddress: collection.address,
      tokenId,
      creatorAddress: account.address,
      blockNumber,
      name: customName,
      description: customDescription,
    };
    const dataString = JSON.stringify({ command, message }, undefined, 2);
    let signature;
    try {
      signature = await account.signer.signMessage(dataString);
      await notdClient.createCustomizationForCollectionToken(collection.address, tokenId, account.address, signature, blockNumber, customName, customDescription);
      updateCollectionToken();
      setIsSavingStory(false);
      setIsUpdatingStory(false);
    } catch (error: unknown) {
      setUpdatingStoryErrorMessaging((error as Error).message);
      setIsSavingStory(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        {/* <title>{title}</title>
        <meta name='twitter:title' content={title} />
        {description && <meta name='description' content={description} /> }
        {bannerImageUrl ? (
          <React.Fragment>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={bannerImageUrl} />
            <meta name='og:image' content={bannerImageUrl} />
          </React.Fragment>
        ) : (
          <meta name='twitter:card' content='summary' />
        )} */}
      </Head>
      {collection === undefined || collectionToken === undefined ? (
        <LoadingSpinner />
      ) : collection === null || collectionToken === null ? (
        <Text variant='error'>Failed to load</Text>
      ) : (
        <ResponsiveTextAlignmentView alignmentResponsive={{ base: TextAlignment.Center, medium: TextAlignment.Left }}>
          <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={false} childAlignment={Alignment.Start}>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Box variant='sticky'>
                <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center}>
                  <IpfsImage source={imageUrl} maxHeight='30em' maxWidth='30em' isLazyLoadable={false} alternativeText={collectionToken.name} isFullWidth={true} />
                  {getChain(projectId) === 'ethereum' && (
                    <Stack direction={Direction.Horizontal} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }}>
                      <IconButton variant={'tertiary'} icon={<Box width='1.3em'><Image source={'/assets/icon-info.svg'} alternativeText={'info'} /></Box>} target={`https://tokenhunt.io/collections/${collectionToken.registryAddress}/tokens/${tokenId}`} />
                      <IconButton variant={'tertiary'} icon={<Box width='1.3em'><Image source={'/assets/icon-looksrare.svg'} alternativeText={'looksrare'} /></Box>} target={`https://looksrare.org/collections/${collectionToken.registryAddress}/${tokenId}`} />
                      <IconButton variant={'tertiary'} icon={<Box width='1.3em'><Image source={'/assets/icon-opensea.svg'} alternativeText={'opensea'} /></Box>} target={`https://opensea.io/assets/${collectionToken.registryAddress}/${tokenId}`} />
                      <IconButton variant={'tertiary'} icon={<Box width='1.3em'><Image source={'/assets/icon-etherscan.svg'} alternativeText={'etherscan'} /></Box>} target={`https://etherscan.io/nft/${collectionToken.registryAddress}/${tokenId}`} />
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack.Item>
            <Spacing variant={PaddingSize.Wide2} />
            <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
              <Box maxWidth='400px'>
                <Stack direction={Direction.Vertical} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} isFullWidth={true} isFullHeight={false} isScrollableVertically={false}>
                  {isUpdatingStory ? (
                    <Box maxWidth='350px'>
                      <Form onFormSubmitted={onUpdateStorySaveClicked} isLoading={isSavingStory}>
                        <Stack direction={Direction.Vertical} shouldAddGutters={false}>
                          <Text variant='header3'>Update your Sprite&apos;s profile</Text>
                          <Spacing variant={PaddingSize.Wide} />
                          <Text variant='note'>Name</Text>
                          <SingleLineInput
                            value={customName}
                            onValueChanged={setCustomName}
                            placeholderText={"Give your sprite it's own name..."}
                          />
                          <Spacing variant={PaddingSize.Default} />
                          <Text variant='note'>Background</Text>
                          <MultiLineInput
                            value={customDescription}
                            onValueChanged={setCustomDescription}
                            maxRowCount={3}
                            placeholderText={"What's your sprite's story? Are they playful, wild, curious? What do they like to eat? Tell us everything..."}
                          />
                          <Spacing variant={PaddingSize.Wide} />
                          <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center}>
                            <Button variant='secondary' text='Cancel' onClicked={onUpdateStoryCancelClicked} />
                            <Button variant='primary' text='Save' buttonType='submit' />
                          </Stack>
                          {updatingStoryErrorMessaging && (
                            <React.Fragment>
                              <Spacing variant={PaddingSize.Default} />
                              <Text variant='error'>{updatingStoryErrorMessaging}</Text>
                            </React.Fragment>
                          )}
                        </Stack>
                      </Form>
                    </Box>
                  ) : (
                    <React.Fragment>
                      {tokenCustomization?.name && (
                        <Text variant='note'>{collectionToken.name}</Text>
                      )}
                      <Text variant='header2'>{tokenCustomization?.name || collectionToken.name}</Text>
                      <Spacing variant={PaddingSize.Narrow2} />
                      { collection.doesSupportErc721 && latestTransfer && (
                        <LinkBase target={`/members/${latestTransfer.toAddress}`}>
                          <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                            <Text variant='small'>Owned by</Text>
                            <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                              <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${latestTransfer.toAddress}/image`} alternativeText='Avatar' />
                            </Box>
                            <Text variant='small'>{isOwner ? 'You' : truncateMiddle(latestTransfer.toAddress, 10)}</Text>
                          </Stack>
                        </LinkBase>
                      )}
                      { collection.doesSupportErc1155 && tokenOwnerships && (
                        <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center}>
                          <KibaIcon variant='small' iconId='ion-person' />
                          <Text>{`${tokenOwnerships.length} owners`}</Text>
                          <Spacing />
                          <KibaIcon variant='small' iconId='ion-grid' />
                          <Text>{`${tokenQuantity.toString()} total`}</Text>
                        </Stack>
                      )}
                      {tokenCustomization?.description && (
                        <React.Fragment>
                          <Spacing variant={PaddingSize.Default} />
                          <Text variant='note'>Story</Text>
                          <Text>{tokenCustomization?.description}</Text>
                        </React.Fragment>
                      )}
                      { isOwner && isCustomizationEnabled(projectId) && (
                        <Stack.Item>
                          <Link variant='small' text="Update your Sprites' story" onClicked={onUpdateStoryClicked} />
                        </Stack.Item>
                      )}
                      <Spacing variant={PaddingSize.Wide} />
                      { collectionToken.frameImageUrl && frameImageUrl && (
                        <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} paddingLeft={PaddingSize.Narrow} paddingBottom={PaddingSize.Wide}>
                          <Text variant='note'>Frame</Text>
                          <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                            <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                              <IpfsImage source={frameImageUrl} alternativeText='Avatar' />
                            </Box>
                            <Link text={truncateEnd(collectionToken.frameImageUrl, 20)} target={frameImageUrl} />
                          </Stack>
                        </Stack>
                      )}
                      { listing && (
                        <React.Fragment>
                          <Text variant='note'>Current price</Text>
                          <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} childAlignment={Alignment.Center}>
                            <EtherValue textVariant='large-bold' value={longFormatNumber(etherToNumber(listing.value))} />
                            <Spacing variant={PaddingSize.Wide} />
                            <Button variant='narrow' text='Purchase' target={getListingUrl(listing)} iconRight={<KibaIcon variant='small' iconId='ion-open-outline' />} />
                          </Stack>
                          <Spacing variant={PaddingSize.Wide} />
                        </React.Fragment>
                      )}
                      { airdrop && (
                        <React.Fragment>
                          <Text>{`${airdrop.name} ${airdrop.isClaimed ? 'claimed ✅' : 'not claimed...'}`}</Text>
                          <Stack direction={Direction.Horizontal} shouldAddGutters={true} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} childAlignment={Alignment.Center} isFullWidth={false}>
                            <Text variant='small'>{`${airdrop.isClaimed ? 'Claimed:' : 'To claim:'}`}</Text>
                            {airdrop.claimToken.imageUrl && (
                              <Box height='1em' width='1em'>
                                <IpfsImage source={airdrop.claimToken.imageUrl} alternativeText='' />
                              </Box>
                            )}
                            <Text variant='small'>{`${airdrop.claimToken.name}`}</Text>
                            {!airdrop.isClaimed && isOwner && (
                              <Link variant='small' text='Claim now' target='https://stormdrop.spriteclubnft.com' />
                            )}
                          </Stack>
                          <Spacing variant={PaddingSize.Wide} />
                        </React.Fragment>
                      )}
                      { isTreasureHuntToken && (
                        <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} paddingLeft={PaddingSize.Narrow} paddingBottom={PaddingSize.Wide}>
                          <Text variant='note'>Treasure Hunt</Text>
                          <Text>You found the chosen Sprite!</Text>
                          {isTreasureHuntSubmitting ? (
                            <LoadingSpinner />
                          ) : (
                            <React.Fragment>
                              {isTreasureHuntSubmitted ? (
                                <Text variant='success'>You&apos;re in, jump into the Sprites discord to find out if you won!</Text>
                              ) : !account ? (
                                <Button variant='primary-small' text='Connect wallet to submit' onClicked={onLinkAccountsClicked} />
                              ) : (
                                <Button variant='primary-small' text='Submit claim' onClicked={onTreasureHuntSubmitClicked} />
                              )}
                              {treasureHuntSubmittingError && (
                                <Text variant='error'>{treasureHuntSubmittingError.message}</Text>
                              )}
                            </React.Fragment>
                          )}
                        </Stack>
                      )}
                      <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
                        <TabBar.Item variant='lined' tabKey={TAB_KEY_ATTRIBUTES} text='Traits' />
                        {collection.doesSupportErc1155 && tokenOwnerships && (
                          <TabBar.Item variant='lined' tabKey={TAB_KEY_OWNERSHIPS} text='Owners' />
                        )}
                        {getChain(projectId) === 'ethereum' && (
                          <TabBar.Item variant='lined' tabKey={TAB_KEY_ACTIVITY} text='Activity' />
                        )}
                      </TabBar>
                      <Spacing />
                      <Stack.Item growthFactor={1} shrinkFactor={1}>
                        <HidingView isHidden={selectedTabKey !== TAB_KEY_ATTRIBUTES}>
                          <EqualGrid childSize={6} contentAlignment={Alignment.Start} shouldAddGutters={true} defaultGutter={PaddingSize.Narrow}>
                            {collectionToken.attributes.map((attribute: TokenAttribute): React.ReactElement => (
                              <KeyValue key={attribute.traitType} name={attribute.traitType} nameTextVariant='note' value={attribute.value} valueTextVariant='default' />
                            ))}
                          </EqualGrid>
                        </HidingView>
                        <HidingView isHidden={selectedTabKey !== TAB_KEY_OWNERSHIPS}>
                          <List isFullWidth={true}>
                            {tokenOwnerships?.map((tokenOwnership: TokenOwnership): React.ReactElement => (
                              <List.Item variant='slim' key={tokenOwnership.ownerAddress} itemKey={tokenOwnership.ownerAddress}>
                                <Stack direction={Direction.Horizontal} shouldAddGutters={true} isFullWidth={true}>
                                  <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
                                    <AccountViewLink address={tokenOwnership.ownerAddress} target={`/members/${tokenOwnership.ownerAddress}`} />
                                  </Stack.Item>
                                  <Text>{tokenOwnership.quantity.toString()}</Text>
                                </Stack>
                              </List.Item>
                            ))}
                          </List>
                        </HidingView>
                        <HidingView isHidden={selectedTabKey !== TAB_KEY_ACTIVITY}>
                          { tokenTransfers === undefined ? (
                            <LoadingSpinner />
                          ) : tokenTransfers === null ? (
                            <Text variant='error' alignment={TextAlignment.Center}>Failed to load activity</Text>
                          ) : tokenTransfers.length === 0 ? (
                            <Text alignment={TextAlignment.Center}>No activity</Text>
                          ) : (
                            <React.Fragment>
                              <List shouldShowDividers={true} isFullWidth={true}>
                                {tokenTransfers.map((tokenTransfer: TokenTransfer): React.ReactElement => (
                                  <List.Item key={tokenTransfer.tokenTransferId} itemKey={String(tokenTransfer.tokenTransferId)}>
                                    <TokenTransferRow tokenTransfer={tokenTransfer} />
                                  </List.Item>
                                ))}
                              </List>
                            </React.Fragment>
                          )}
                        </HidingView>
                      </Stack.Item>
                    </React.Fragment>
                  )}
                </Stack>
              </Box>
            </Stack.Item>
          </Stack>
        </ResponsiveTextAlignmentView>
      )}
    </React.Fragment>
  );
};
