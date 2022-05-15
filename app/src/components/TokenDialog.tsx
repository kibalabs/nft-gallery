import React from 'react';

import { dateToString, isToday } from '@kibalabs/core';
import { Alignment, Box, Dialog, Direction, EqualGrid, Image, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { TokenTransfer } from '../client';
import { KeyValue } from '../components/KeyValue';
import { useGlobals } from '../globalsContext';
import { Token, TokenCollection } from '../model';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  onCloseClicked: () => void;
  collectionAddress: TokenCollection;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.startsWith('ipfs://') ? props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.imageUrl;
  const [tokenSales, setTokenSales] = React.useState<TokenTransfer[] | undefined | null>(undefined);
  const { notdClient } = useGlobals();

  const updateTokenSales = React.useCallback(async (): Promise<void> => {
    setTokenSales(undefined);
    notdClient.getTokenRecentSales(props.collectionAddress.address, props.token.tokenId).then((tokenTransfers: TokenTransfer[]): void => {
      setTokenSales(tokenTransfers);
    }).catch((error: unknown): void => {
      console.error(error);
      setTokenSales(null);
    });
  }, [notdClient, props.collectionAddress.address, props.token.tokenId]);

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

  return (
    <Dialog
      isOpen={props.isOpen}
      onCloseClicked={props.onCloseClicked}
      maxWidth='1000px'
      maxHeight='90%'
    >
      <ResponsiveTextAlignmentView alignmentResponsive={{ base: TextAlignment.Center, medium: TextAlignment.Left }}>
        <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={true} childAlignment={Alignment.Center}>
          <Box maxHeight='30em' width='50%'>
            <Image source={imageUrl} isLazyLoadable={true} alternativeText={props.token.name} />
          </Box>
          <Spacing variant={PaddingSize.Wide2} />
          <Box width='50%'>
            <Stack direction={Direction.Vertical}>
              <Text variant='header2'>{props.token.name}</Text>
              <Spacing variant={PaddingSize.Wide} />
              <EqualGrid childSize={6} contentAlignment={Alignment.Start} shouldAddGutters={true} defaultGutter={PaddingSize.Wide}>
                {Object.keys(props.token.attributeMap).map((attributeKey: string): React.ReactElement => (
                  <KeyValue key={attributeKey} name={attributeKey} nameTextVariant='note' value={props.token.attributeMap[attributeKey]} valueTextVariant='bold' />
                ))}
              </EqualGrid>
              {tokenSales && tokenSales.length > 0 ? (
                <React.Fragment>
                  <Text variant='note'>owner:</Text>
                  <Text variant='bold'>{tokenSales[0].toAddress}</Text>
                  <Text>{`Last Bought for Ξ${tokenSales[0].value / 1000000000000000000.0} on ${getTokenDateString(tokenSales[0].blockDate)}`}</Text>
                </React.Fragment>
              ) : (
                <Text variant='note'>Not currently owned</Text>
              )}
            </Stack>
          </Box>
        </Stack>
      </ResponsiveTextAlignmentView>
    </Dialog>
  );
};
