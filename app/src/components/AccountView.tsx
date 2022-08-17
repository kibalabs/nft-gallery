import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Direction, Image, LinkBase, Stack, Text } from '@kibalabs/ui-react';

import { useAccount, useWeb3 } from '../AccountContext';
import { useGlobals } from '../globalsContext';
import { getChain } from '../util';

export interface AccountViewProps {
  accountId: string;
  textVariant?: string;
  imageSize?: string;
  shouldUseYourAccount?: boolean;
}

export const AccountView = (props: AccountViewProps): React.ReactElement => {
  const web3 = useWeb3();
  const account = useAccount();
  const { projectId } = useGlobals();
  const [name, setName] = React.useState<string | null | undefined>(undefined);

  const updateName = React.useCallback(async (): Promise<void> => {
    if (getChain(projectId) !== 'ethereum') {
      setName(null);
      return;
    }
    if (props.accountId && web3) {
      const retrievedOwnerName = await web3.lookupAddress(props.accountId);
      setName(retrievedOwnerName);
    } else {
      setName(null);
    }
  }, [props.accountId, web3, projectId]);

  React.useEffect((): void => {
    updateName();
  }, [updateName]);

  const imageSize = props.imageSize ?? '20px';
  const defaultText = truncateMiddle(props.accountId, 10);
  const text = (props.shouldUseYourAccount && account?.address === props.accountId) ? 'Your profile' : (name ?? defaultText);

  return (
    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
      <Box variant='rounded' shouldClipContent={true} height={imageSize} width={imageSize}>
        <Image source={`https://web3-images-api.kibalabs.com/v1/accounts/${props.accountId}/image`} alternativeText='Avatar' />
      </Box>
      <Text variant={props.textVariant}>{text}</Text>
    </Stack>
  );
};

export interface AccountViewLinkProps extends AccountViewProps {
  target: string;
}

export const AccountViewLink = (props: AccountViewLinkProps): React.ReactElement => {
  return (
    <LinkBase target={props.target}>
      <AccountView {...props} />
    </LinkBase>
  );
};