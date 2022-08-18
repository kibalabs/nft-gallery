import React from 'react';

import { useLocation, useNavigator } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, getVariant, HidingView, IconButton, Image, KibaIcon, LinkBase, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, TabBar, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { useGlobals } from '../globalsContext';
import { getChain, getLogoImageUrl } from '../util';
import { AccountViewLink } from './AccountView';

const TAB_KEY_GALLERY = 'TAB_KEY_GALLERY';
const TAB_KEY_MEMBERS = 'TAB_KEY_MEMBERS';

export const NavBar = (): React.ReactElement => {
  const account = useAccount();
  const { projectId, collection } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const logoImageUrl = getLogoImageUrl(projectId);
  const chain = getChain(projectId);
  const navigator = useNavigator();
  const location = useLocation();
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>(TAB_KEY_GALLERY);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  // TODO(krishan711): change tabbar to allow setting targets on tabs directly when updated in ui-react
  const onTabKeySelected = (newSelectedTabKey: string): void => {
    let newLocation = '';
    if (newSelectedTabKey === TAB_KEY_GALLERY) {
      newLocation = '/';
    } else if (newSelectedTabKey === TAB_KEY_MEMBERS) {
      newLocation = '/members';
    }
    navigator.navigateTo(newLocation);
    setSelectedTabKey(newSelectedTabKey);
    setIsMenuOpen(false);
  };

  React.useEffect((): void => {
    if (location.pathname === '/') {
      setSelectedTabKey(TAB_KEY_GALLERY);
    } else if (location.pathname === '/members') {
      setSelectedTabKey(TAB_KEY_MEMBERS);
    } else {
      setSelectedTabKey('');
    }
    setIsMenuOpen(false);
  }, [location]);

  const onMenuClicked = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Stack direction={Direction.Vertical} isFullWidth={true}>
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} isFullWidth={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Wide}>
        <Stack.Item shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <LinkBase target='/' isFullHeight={true}>
            {logoImageUrl ? (
              <Box height='100%' width='100%' maxHeight={projectId === 'pepes' ? '3rem' : '2rem'} shouldClipContent={true}>
                <Image source={logoImageUrl} alternativeText={`${collection ? collection.name : ''} Gallery`} isFullHeight={true} isFullWidth={true} />
              </Box>
            ) : (
              <Text variant='header1'>{`${collection ? collection.name : ''} Gallery`}</Text>
            )}
          </LinkBase>
        </Stack.Item>
        <Spacing />
        <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
          <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
            <TabBar.Item tabKey={TAB_KEY_GALLERY} text='Gallery' />
            <TabBar.Item tabKey={TAB_KEY_MEMBERS} text='Members' />
          </TabBar>
        </ResponsiveHidingView>
        <Stack.Item shrinkFactor={1} growthFactor={1}>
          <Spacing />
        </Stack.Item>
        <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
          <Box isFullWidth={false}>
            { chain === 'ethereum' && (
              <React.Fragment>
                { account ? (
                  <AccountViewLink address={account.address} target={`/accounts/${account.address}`} />
                ) : (
                  <Button variant='secondary' text='Connect Wallet' onClicked={onLinkAccountsClicked} />
                )}
              </React.Fragment>
            )}
          </Box>
        </ResponsiveHidingView>
        <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
          <IconButton icon={<KibaIcon iconId='ion-menu-outline' />} label='Open menu' onClicked={onMenuClicked} />
        </ResponsiveHidingView>
      </Stack>
      <HidingView isHidden={!isMenuOpen}>
        <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
          <Box variant='unrounded-overlay'>
            <Stack direction={Direction.Vertical} isFullWidth={true} childAlignment={Alignment.Center} shouldAddGutters={true} paddingStart={PaddingSize.Wide} paddingEnd={PaddingSize.Wide}>
              <Button text='Gallery' variant={getVariant(selectedTabKey === TAB_KEY_GALLERY ? 'navBarSelected' : null)} onClicked={(): void => onTabKeySelected(TAB_KEY_GALLERY)} />
              <Button text='Members' variant={getVariant(selectedTabKey === TAB_KEY_MEMBERS ? 'navBarSelected' : null)} onClicked={(): void => onTabKeySelected(TAB_KEY_MEMBERS)} />
              { chain === 'ethereum' && (
                <React.Fragment>
                  { account ? (
                    <AccountViewLink address={account.address} target={`/accounts/${account.address}`} />
                  ) : (
                    <Button variant='secondary' text='Connect Wallet' onClicked={onLinkAccountsClicked} />
                  )}
                </React.Fragment>
              )}
            </Stack>
          </Box>
        </ResponsiveHidingView>
      </HidingView>
    </Stack>
  );
};
