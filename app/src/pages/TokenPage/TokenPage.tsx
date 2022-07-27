import React from 'react';

import { etherToNumber, longFormatNumber, resolveUrl, truncateEnd, truncateMiddle } from '@kibalabs/core';
import { useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, EqualGrid, Head, IconButton, Image, KibaIcon, Link, LinkBase, LoadingSpinner, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../../AccountContext';
import { Airdrop, CollectionToken, TokenAttribute, TokenListing, TokenTransfer } from '../../client';
import { EtherValue } from '../../components/EtherValue';
import { KeyValue } from '../../components/KeyValue';
import { useGlobals } from '../../globalsContext';
import { LooksrareClient } from '../../LooksrareClient';
import { OpenseaClient } from '../../OpenseaClient';
import { getChain, getTreasureHuntTokenId } from '../../util';

export const TokenPage = (): React.ReactElement => {
  const account = useAccount();
  const tokenId = useStringRouteParam('tokenId');
  const { notdClient, projectId, collection, allTokens } = useGlobals();
  const [collectionToken, setCollectionToken] = React.useState<CollectionToken | null | undefined>(undefined);
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const [tokenTransfers, setTokenTransfers] = React.useState<TokenTransfer[] | undefined | null>(undefined);
  const [isTreasureHuntSubmitting, setIsTreasureHuntSubmitting] = React.useState<boolean>(false);
  const [isTreasureHuntSubmitted, setIsTreasureHuntSubmitted] = React.useState<boolean>(false);
  const [treasureHuntSubmittingError, setTreasureHuntSubmittingError] = React.useState<Error | null>(null);
  const [airdrop, setAirdrop] = React.useState<Airdrop | null | undefined>(undefined);
  const [listing, setListing] = React.useState<TokenListing | null | undefined>(undefined);

  const imageUrl = collectionToken?.resizableImageUrl ?? (collectionToken?.imageUrl ? resolveUrl(collectionToken.imageUrl) : '');
  const frameImageUrl = collectionToken?.frameImageUrl && resolveUrl(collectionToken.frameImageUrl);
  const latestTransfer = tokenTransfers && tokenTransfers.length > 0 ? tokenTransfers[0] : null;
  const isOwner = latestTransfer?.toAddress && account && latestTransfer.toAddress === account.address;
  const isTreasureHuntToken = collectionToken?.tokenId === getTreasureHuntTokenId(projectId);

  const updateCollectionToken = React.useCallback(async (): Promise<void> => {
    if (collection === undefined) {
      setCollectionToken(undefined);
      return;
    }
    if (collection === null) {
      setCollectionToken(null);
      return;
    }
    if (allTokens) {
      setCollectionToken(allTokens.find((candidateCollectionToken: CollectionToken): boolean => candidateCollectionToken.tokenId === tokenId));
    } else {
      await notdClient.getCollectionToken(collection.address, tokenId).then((retrievedCollectionToken: CollectionToken): void => {
        setCollectionToken(retrievedCollectionToken);
      });
    }
  }, [notdClient, collection, allTokens, tokenId]);

  React.useEffect((): void => {
    updateCollectionToken();
  }, [updateCollectionToken]);

  const updateListings = React.useCallback(async (): Promise<void> => {
    if (!collection || !collectionToken) {
      setListing(null);
      return;
    }
    setListing(undefined);
    const listings: TokenListing[] = [];
    if (getChain(projectId) === 'ethereum') {
      try {
        const openseaListing = await (new OpenseaClient().getTokenListing(collection.address, collectionToken.tokenId));
        if (openseaListing) {
          listings.push(openseaListing);
        }
      } catch (error: unknown) {
        console.error(error);
      }
      try {
        const looksrareListing = await (new LooksrareClient().getTokenListing(collection.address, collectionToken.tokenId));
        if (looksrareListing) {
          listings.push(looksrareListing);
        }
      } catch (error: unknown) {
        console.error(error);
      }
    }
    if (listings.length === 0) {
      setListing(null);
    } else {
      setListing(listings.sort((listing1: TokenListing, listing2: TokenListing): number => (listing1.value.gte(listing2.value) ? 1 : -1))[0]);
    }
  }, [projectId, collection, collectionToken]);

  React.useEffect((): void => {
    updateListings();
  }, [updateListings]);

  const updateAirdropStatus = React.useCallback(async (): Promise<void> => {
    if (!collection || !collectionToken) {
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
  }, [notdClient, collection, collectionToken]);

  React.useEffect((): void => {
    updateAirdropStatus();
  }, [updateAirdropStatus]);

  const updateTokenSales = React.useCallback(async (): Promise<void> => {
    if (!collection || !collectionToken) {
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
  }, [notdClient, projectId, collection, collectionToken]);

  React.useEffect((): void => {
    updateTokenSales();
  }, [updateTokenSales]);

  const onSubmitClicked = async (): Promise<void> => {
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
      return `https://opensea.io/assets/${tokenListing.token.registryAddress}/${tokenListing.token.tokenId}`;
    }
    if (tokenListing.source === 'looksrare') {
      return `https://looksrare.org/collections/${tokenListing.token.registryAddress}/${tokenListing.token.tokenId}`;
    }
    return '';
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
          <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={true} childAlignment={Alignment.Center}>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Box maxHeight='30em' maxWidth='50%' isFullWidth={false}>
                <Image source={imageUrl} isLazyLoadable={true} alternativeText={collectionToken.name} />
              </Box>
            </Stack.Item>
            <Spacing variant={PaddingSize.Wide2} />
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Stack direction={Direction.Vertical} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }}>
                <Text variant='header2'>{collectionToken.name}</Text>
                <Stack direction={Direction.Horizontal} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }}>
                  <IconButton variant={'tertiary'} icon={<Box height='1rem' width='1rem' variant='unrounded'><Image variant='unrounded' source={'/assets/icon-info.svg'} alternativeText={'info'} /></Box>} target={`https://tokenhunt.io/collections/${collectionToken.registryAddress}/tokens/${tokenId}`} />
                  <IconButton variant={'tertiary'} icon={<Box height='1rem' width='1rem' variant='unrounded'><Image variant='unrounded' source={'/assets/icon-looksrare.svg'} alternativeText={'looksrare'} /></Box>} target={`https://looksrare.org/collections/${collectionToken.registryAddress}/${tokenId}`} />
                  <IconButton variant={'tertiary'} icon={<Box height='1rem' width='1rem' variant='unrounded'><Image variant='unrounded' source={'/assets/icon-opensea.svg'} alternativeText={'opensea'} /></Box>} target={`https://opensea.io/assets/${collectionToken.registryAddress}/${tokenId}`} />
                  <IconButton variant={'tertiary'} icon={<Box height='1rem' width='1rem' variant='unrounded'><Image variant='unrounded' source={'/assets/icon-etherscan.svg'} alternativeText={'etherscan'} /></Box>} target={`https://etherscan.io/nft/${collectionToken.registryAddress}/${tokenId}`} />
                </Stack>
                <Spacing variant={PaddingSize.Narrow2} />
                { latestTransfer && (
                  <LinkBase target={`/accounts/${latestTransfer.toAddress}`}>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Text variant='small'>Owned by</Text>
                      <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                        <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${latestTransfer.toAddress}/image`} alternativeText='Avatar' />
                      </Box>
                      <Text variant='small'>{isOwner ? 'You' : truncateMiddle(latestTransfer.toAddress, 10)}</Text>
                    </Stack>
                  </LinkBase>
                )}
                <Spacing variant={PaddingSize.Wide} />
                { collectionToken.frameImageUrl && frameImageUrl && (
                  <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} paddingLeft={PaddingSize.Narrow} paddingBottom={PaddingSize.Wide}>
                    <Text variant='note'>Frame</Text>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                        <Image source={frameImageUrl} alternativeText='Avatar' />
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
                          <Image source={airdrop.claimToken.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/')} alternativeText='' />
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
                          <Button variant='primary-small' text='Connect wallet to sumbit' onClicked={onLinkAccountsClicked} />
                        ) : (
                          <Button variant='primary-small' text='Submit claim' onClicked={onSubmitClicked} />
                        )}
                        {treasureHuntSubmittingError && (
                          <Text variant='error'>{treasureHuntSubmittingError.message}</Text>
                        )}
                      </React.Fragment>
                    )}
                  </Stack>
                )}
                <EqualGrid childSize={6} contentAlignment={Alignment.Start} shouldAddGutters={true} defaultGutter={PaddingSize.Narrow}>
                  {collectionToken.attributes.map((attribute: TokenAttribute): React.ReactElement => (
                    <KeyValue key={attribute.traitType} name={attribute.traitType} nameTextVariant='note' value={attribute.value} valueTextVariant='default' />
                  ))}
                </EqualGrid>
              </Stack>
            </Stack.Item>
          </Stack>
        </ResponsiveTextAlignmentView>
      )}
    </React.Fragment>
  );
};
