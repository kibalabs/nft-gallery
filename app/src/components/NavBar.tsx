import React from 'react';

import { Alignment, Box, Button, Direction, Image, LinkBase, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { useGlobals } from '../globalsContext';
import { getChain, getLogoImageUrl } from '../util';
import { AccountViewLink } from './AccountView';

export const NavBar = (): React.ReactElement => {
  const account = useAccount();
  const { projectId, collection } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const logoImageUrl = getLogoImageUrl(projectId);
  const chain = getChain(projectId);

  return (
    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Default} paddingVertical={PaddingSize.Wide}>
      <Stack.Item shrinkFactor={1}>
        <LinkBase target='/' isFullHeight={true}>
          {logoImageUrl ? (
            <Box height='100%' maxHeight={projectId === 'pepes' ? '3rem' : '2rem'} shouldClipContent={true}>
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
      { chain === 'ethereum' && (
        account ? (
          <AccountViewLink accountId={account.address} target={`/accounts/${account.address}`} />
        ) : (
          <Button variant='secondary' text='Connect Wallet' onClicked={onLinkAccountsClicked} />
        )
      )}
    </Stack>
  );
};
