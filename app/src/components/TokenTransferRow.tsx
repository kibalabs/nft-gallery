import React from 'react';

import { dateToRelativeString, shortFormatEther } from '@kibalabs/core';
import { Alignment, Direction, IconButton, KibaIcon, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';
import { BigNumber } from 'ethers';

import { AccountViewLink } from './AccountView';
import { IpfsImage } from './IpfsImage';
import { TokenTransfer } from '../client/resources';

interface IUserTokenTransferRowProps {
  userAddress: string;
  tokenTransfer: TokenTransfer;
}

export const UserTokenTransferRow = (props: IUserTokenTransferRowProps): React.ReactElement => {
  let action = '';
  let actionSecondary: string | null = null;
  const isSender = props.userAddress && props.tokenTransfer.fromAddress === props.userAddress;
  const hasValue = props.tokenTransfer.value.gt(BigNumber.from(0));
  let iconId = '';
  if (props.tokenTransfer.isSwap || props.tokenTransfer.isMultiAddress) {
    action = 'Swapped';
    iconId = 'ion-trail-sign';
    actionSecondary = 'with';
  } else if (props.tokenTransfer.fromAddress === '0x0000000000000000000000000000000000000000') {
    action = 'Minted';
    iconId = 'ion-star';
  } else if (props.tokenTransfer.toAddress === '0x0000000000000000000000000000000000000000') {
    action = 'Burned';
    iconId = 'ion-flame';
  } else if (!hasValue) {
    iconId = 'ion-gift';
    if (isSender) {
      action = 'Gave';
      actionSecondary = 'to';
    } else {
      action = 'Given';
      actionSecondary = 'by';
    }
  } else {
    iconId = 'ion-pricetag';
    if (isSender) {
      action = 'Sold';
      actionSecondary = 'to';
    } else {
      action = 'Bought';
      actionSecondary = 'from';
    }
  }
  return (
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} shouldAddGutters={false} isFullWidth={true}>
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
        <Text variant='note'>{dateToRelativeString(props.tokenTransfer.blockDate)}</Text>
        <IconButton variant='small' icon={<KibaIcon iconId='ion-open-outline' variant='small' />} target={`https://etherscan.io/tx/${props.tokenTransfer.transactionHash}`} />
      </Stack>
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
        <KibaIcon iconId={iconId} />
        <Spacing variant={PaddingSize.Default} />
        <Text>{action}</Text>
        <Spacing variant={PaddingSize.Default} />
        <IpfsImage height='1em' width='1em' source={props.tokenTransfer.token.resizableImageUrl || props.tokenTransfer.token.imageUrl || ''} alternativeText='.' />
        <Spacing variant={PaddingSize.Narrow} />
        <Text>{props.tokenTransfer.token.name}</Text>
      </Stack>
      {actionSecondary && (
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
          <Text>{actionSecondary}</Text>
          <Spacing variant={PaddingSize.Default} />
          {isSender ? (
            <AccountViewLink address={props.tokenTransfer.toAddress} target={`/members/${props.tokenTransfer.toAddress}`} />
          ) : (
            <AccountViewLink address={props.tokenTransfer.fromAddress} target={`/members/${props.tokenTransfer.fromAddress}`} />
          )}
        </Stack>
      )}
      {hasValue && (
        <Text>{`for ${shortFormatEther(props.tokenTransfer.value)}`}</Text>
      )}
    </Stack>
  );
};


interface ITokenTransferRowProps {
  tokenTransfer: TokenTransfer;
}

export const TokenTransferRow = (props: ITokenTransferRowProps): React.ReactElement => {
  let action = '';
  let actionSecondary: string | null = null;
  let address1: string | null = null;
  let address2: string | null = null;
  const hasValue = props.tokenTransfer.value.gt(BigNumber.from(0));
  let iconId = '';
  if (props.tokenTransfer.isSwap || props.tokenTransfer.isMultiAddress) {
    action = 'Swapped tokens';
    iconId = 'ion-trail-sign';
    actionSecondary = 'from';
    address1 = props.tokenTransfer.toAddress;
    address2 = props.tokenTransfer.fromAddress;
  } else if (props.tokenTransfer.fromAddress === '0x0000000000000000000000000000000000000000') {
    action = 'Minted';
    iconId = 'ion-star';
    actionSecondary = 'by';
    address2 = props.tokenTransfer.toAddress;
  } else if (props.tokenTransfer.toAddress === '0x0000000000000000000000000000000000000000') {
    action = 'Burned';
    iconId = 'ion-flame';
    actionSecondary = 'by';
    address2 = props.tokenTransfer.fromAddress;
  } else if (!hasValue) {
    iconId = 'ion-gift';
    action = 'Transfer';
    actionSecondary = 'from';
    address1 = props.tokenTransfer.toAddress;
    address2 = props.tokenTransfer.fromAddress;
  } else {
    iconId = 'ion-pricetag';
    action = 'Bought';
    actionSecondary = 'from';
    address1 = props.tokenTransfer.toAddress;
    address2 = props.tokenTransfer.fromAddress;
  }
  return (
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} shouldAddGutters={false} isFullWidth={true}>
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
        <Text variant='note'>{dateToRelativeString(props.tokenTransfer.blockDate)}</Text>
        <IconButton variant='small' icon={<KibaIcon iconId='ion-open-outline' variant='small' />} target={`https://etherscan.io/tx/${props.tokenTransfer.transactionHash}`} />
      </Stack>
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
        <KibaIcon iconId={iconId} />
        <Spacing variant={PaddingSize.Default} />
        <Text>{action}</Text>
        <Spacing variant={PaddingSize.Narrow} />
        {hasValue && (
          <Text>{`for ${shortFormatEther(props.tokenTransfer.value)}`}</Text>
        )}
      </Stack>
      {actionSecondary && (
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true} shouldAddGutters={true}>
          {address1 && (
            <AccountViewLink address={address1} target={`/members/${address1}`} />
          )}
          {actionSecondary && (
            <Text>{actionSecondary}</Text>
          )}
          {address2 && (
            <AccountViewLink address={address2} target={`/members/${address2}`} />
          )}
        </Stack>
      )}
    </Stack>
  );
};
