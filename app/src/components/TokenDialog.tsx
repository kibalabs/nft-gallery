import React from 'react';

import { dateToString, etherToNumber, isToday, longFormatNumber, resolveUrl, truncateEnd, truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Button, ColorSettingView, Dialog, Direction, EqualGrid, Image, Link, LinkBase, LoadingSpinner, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { Airdrop, TokenListing, TokenTransfer } from '../client';
import { KeyValue } from '../components/KeyValue';
import { useGlobals } from '../globalsContext';
import { Token, TokenCollection } from '../model';
import { OpenseaClient } from '../OpenseaClient';
import { getTreasureHuntTokenId } from '../util';
import { EtherValue } from './EtherValue';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  tokenCollection: TokenCollection;
  onCloseClicked: () => void;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
  const account = useAccount();
  const { notdClient, projectId } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const [tokenTransfers, setTokenTransfers] = React.useState<TokenTransfer[] | undefined | null>(undefined);
  const [isTreasureHuntSubmitting, setIsTreasureHuntSubmitting] = React.useState<boolean>(false);
  const [isTreasureHuntSubmitted, setIsTreasureHuntSubmitted] = React.useState<boolean>(false);
  const [treasureHuntSubmittingError, setTreasureHuntSubmittingError] = React.useState<Error | null>(null);
  const [airdrop, setAirdrop] = React.useState<Airdrop | null | undefined>(undefined);
  const [listing, setListing] = React.useState<TokenListing | null | undefined>(undefined);

  const imageUrl = resolveUrl(props.token.imageUrl);
  const frameImageUrl = props.token.frameImageUrl && resolveUrl(props.token.frameImageUrl);
  const latestTransfer = tokenTransfers && tokenTransfers.length > 0 ? tokenTransfers[0] : null;
  const isOwner = latestTransfer?.toAddress && account && latestTransfer.toAddress === account.address;
  const isTreasureHuntToken = props.token.tokenId === getTreasureHuntTokenId(projectId);

  const updateListings = React.useCallback(async (): Promise<void> => {
    try {
      const openseaListing = await (new OpenseaClient().getTokenListing(props.tokenCollection.address, props.token.tokenId));
      console.log('openseaListing', openseaListing);
      setListing(openseaListing);
    } catch (error: unknown) {
      console.error(error);
      setListing(null);
    }
  }, [props.tokenCollection.address, props.token.tokenId]);

  React.useEffect((): void => {
    updateListings();
  }, [updateListings]);

  const updateAirdropStatus = React.useCallback(async (): Promise<void> => {
    setAirdrop(undefined);
    notdClient.listCollectionTokenAirdrops(props.tokenCollection.address, props.token.tokenId).then((airdrops: Airdrop[]): void => {
      if (airdrops.length > 0) {
        setAirdrop(airdrops[0]);
      } else {
        setAirdrop(null);
      }
    }).catch((error: unknown): void => {
      console.error(error);
      setAirdrop(null);
    });
  }, [notdClient, props.tokenCollection.address, props.token.tokenId]);

  React.useEffect((): void => {
    updateAirdropStatus();
  }, [updateAirdropStatus]);

  const updateTokenSales = React.useCallback(async (): Promise<void> => {
    setTokenTransfers(undefined);
    notdClient.getTokenRecentTransfers(props.tokenCollection.address, props.token.tokenId).then((retrievedTokenTransfers: TokenTransfer[]): void => {
      setTokenTransfers(retrievedTokenTransfers);
    }).catch((error: unknown): void => {
      console.error(error);
      setTokenTransfers(null);
    });
  }, [notdClient, props.tokenCollection.address, props.token.tokenId]);

  React.useEffect((): void => {
    updateTokenSales();
  }, [updateTokenSales]);

  const onSubmitClicked = async (): Promise<void> => {
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
        registryAddress: props.tokenCollection.address,
        tokenId: props.token.tokenId,
      },
    });
    let signature;
    try {
      signature = await account.signer.signMessage(message);
      await notdClient.submitTreasureHuntForCollectionToken(props.tokenCollection.address, props.token.tokenId, account.address, signature);
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
    return '';
  };

  return (
    <ColorSettingView variant='dialog'>
      <Dialog
        isOpen={props.isOpen}
        onCloseClicked={props.onCloseClicked}
        maxWidth='1000px'
        maxHeight='90%'
      >
        <ResponsiveTextAlignmentView alignmentResponsive={{ base: TextAlignment.Center, medium: TextAlignment.Left }}>
          <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={true} childAlignment={Alignment.Center}>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Box maxHeight='30em' maxWidth='50%' isFullWidth={false}>
                <Image source={imageUrl} isLazyLoadable={true} alternativeText={props.token.name} />
              </Box>
            </Stack.Item>
            <Spacing variant={PaddingSize.Wide2} />
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Stack direction={Direction.Vertical} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }}>
                <Text variant='header2'>{props.token.name}</Text>
                <Spacing variant={PaddingSize.Narrow2} />
                { latestTransfer && (
                  <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }}>
                    <LinkBase target={`/accounts/${latestTransfer.toAddress}`}>
                      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                        <Text variant='small'>Owned by</Text>
                        <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                          <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${latestTransfer.toAddress}/image`} alternativeText='Avatar' />
                        </Box>
                        <Text variant='small'>{isOwner ? 'You' : truncateMiddle(latestTransfer.toAddress, 10)}</Text>
                      </Stack>
                    </LinkBase>
                    {/* <Spacing variant={PaddingSize.Default} />
                    <Text variant='note'>Last Transfer</Text>
                    <Text>{`${shortFormatEther(latestTransfer.value)} on ${getTokenDateString(latestTransfer.blockDate)}`}</Text> */}
                  </Stack>
                )}
                <Spacing variant={PaddingSize.Wide} />
                { props.token.frameImageUrl && frameImageUrl && (
                  <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} paddingLeft={PaddingSize.Narrow} paddingBottom={PaddingSize.Wide}>
                    <Text variant='note'>Frame</Text>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Box variant='rounded' shouldClipContent={true} height='1em' width='1em'>
                        <Image source={`${frameImageUrl}`} alternativeText='Avatar' />
                      </Box>
                      <Link text={truncateEnd(props.token.frameImageUrl, 20)} target={frameImageUrl} />
                    </Stack>
                  </Stack>
                )}
                { listing && (
                  <React.Fragment>
                    <Text variant='note'>Current price</Text>
                    <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} childAlignment={Alignment.Center}>
                      <EtherValue textVariant='large-bold' value={longFormatNumber(etherToNumber(listing.value))} />
                      <Spacing variant={PaddingSize.Wide} />
                      <Button variant='narrow' text='Purchase' target={getListingUrl(listing)} />
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
                  {Object.keys(props.token.attributeMap).map((attributeKey: string): React.ReactElement => (
                    <KeyValue key={attributeKey} name={attributeKey} nameTextVariant='note' value={props.token.attributeMap[attributeKey]} valueTextVariant='default' />
                  ))}
                </EqualGrid>
              </Stack>
            </Stack.Item>
          </Stack>
        </ResponsiveTextAlignmentView>
      </Dialog>
    </ColorSettingView>
  );
};
