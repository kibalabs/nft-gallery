import React from 'react';

import { dateToString, isToday, truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Button, Dialog, Direction, EqualGrid, Image, Link, LinkBase, LoadingSpinner, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { shortFormatEther } from '../chainUtil';
import { TokenTransfer } from '../client';
import { KeyValue } from '../components/KeyValue';
import { useGlobals } from '../globalsContext';
import { Token, TokenCollection } from '../model';
import { truncateEnd } from '../stringUtil';
import { resolveUrl } from '../urlUtil';
import { getTreasureHuntTokenId } from '../util';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  tokenCollection: TokenCollection;
  onCloseClicked: () => void;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
  const account = useAccount();
  const { notdClient } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const [tokenTransfers, setTokenTransfers] = React.useState<TokenTransfer[] | undefined | null>(undefined);
  const [isTreasureHuntSubmitting, setIsTreasureHuntSubmitting] = React.useState<boolean>(false);
  const [isTreasureHuntSubmitted, setIsTreasureHuntSubmitted] = React.useState<boolean>(false);
  const [treasureHuntSubmittingError, setTreasureHuntSubmittingError] = React.useState<Error | null>(null);

  const imageUrl = resolveUrl(props.token.imageUrl);
  const frameImageUrl = props.token.frameImageUrl && resolveUrl(props.token.frameImageUrl);
  const latestTransfer = tokenTransfers && tokenTransfers.length > 0 ? tokenTransfers[0] : null;
  const isOwner = latestTransfer?.toAddress && account && latestTransfer.toAddress === account.address;
  const isTreasureHuntToken = props.token.tokenId === getTreasureHuntTokenId();

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

  const getTokenDateString = (tokenDate: Date): string => {
    if (tokenDate !== null) {
      if (isToday(tokenDate)) {
        return dateToString(tokenDate, 'HH:mm');
      }
      return dateToString(tokenDate, 'dd-MMM-yyyy');
    }
    return '';
  };

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

  return (
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
            <Stack direction={Direction.Vertical} contentAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} isFullHeight={true}>
              <Text variant='header2'>{props.token.name}</Text>
              <Spacing variant={PaddingSize.Wide} />
              { tokenTransfers === undefined ? (
                <LoadingSpinner />
              ) : tokenTransfers === null || !latestTransfer ? (
                <Text variant='note'>Not currently owned</Text>
              ) : (
                <Stack direction={Direction.Vertical} childAlignmentResponsive={{ base: Alignment.Center, medium: Alignment.Start }} paddingLeft={PaddingSize.Narrow}>
                  <Text variant='note'>Owner</Text>
                  <LinkBase target={`https://nft.tokenhunt.io/accounts/${latestTransfer.toAddress}`}>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Box variant='rounded' shouldClipContent={true} height='20px' width='20px'>
                        <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${latestTransfer.toAddress}/image`} alternativeText='Avatar' />
                      </Box>
                      <Text>{isOwner ? 'You' : truncateMiddle(latestTransfer.toAddress, 10)}</Text>
                    </Stack>
                  </LinkBase>
                  <Spacing variant={PaddingSize.Default} />
                  <Text variant='note'>Last Transfer</Text>
                  <Text>{`${shortFormatEther(latestTransfer.value)} on ${getTokenDateString(latestTransfer.blockDate)}`}</Text>
                </Stack>
              )}
              <Spacing variant={PaddingSize.Wide} />
              { frameImageUrl && (
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
  );
};
