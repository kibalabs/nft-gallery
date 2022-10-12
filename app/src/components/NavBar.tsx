import React from 'react';

import { useLocation, useNavigator } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, getVariant, HidingView, IconButton, KibaIcon, LinkBase, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, TabBar, Text } from '@kibalabs/ui-react';

import { useAccount, useOnLinkAccountsClicked } from '../AccountContext';
import { useGlobals } from '../globalsContext';
import { useWindowScroll } from '../reactUtil';
import { getChain, getLogoImageUrl } from '../util';
import { AccountViewLink } from './AccountView';
import { IpfsImage } from './IpfsImage';

const TAB_KEY_GALLERY = 'TAB_KEY_GALLERY';
const TAB_KEY_MEMBERS = 'TAB_KEY_MEMBERS';
const TAB_KEY_HOLDINGS = 'TAB_KEY_HOLDINGS';

const getTabKey = (locationPath): string => {
  if (locationPath.startsWith('/member-holdings')) {
    return TAB_KEY_HOLDINGS;
  }
  if (locationPath.startsWith('/members') || locationPath.startsWith('/accounts')) {
    return TAB_KEY_MEMBERS;
  }
  if (locationPath === '/') {
    return TAB_KEY_GALLERY;
  }
  return '';
};

export const NavBar = (): React.ReactElement => {
  const account = useAccount();
  const { projectId, collection } = useGlobals();
  const onLinkAccountsClicked = useOnLinkAccountsClicked();
  const logoImageUrl = getLogoImageUrl(projectId);
  const chain = getChain(projectId);
  const navigator = useNavigator();
  const location = useLocation();
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>(getTabKey(location.pathname));
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = React.useState<boolean>(false);

  // TODO(krishan711): change tabbar to allow setting targets on tabs directly when updated in ui-react
  const onTabKeySelected = (newSelectedTabKey: string): void => {
    let newLocation = '';
    if (newSelectedTabKey === TAB_KEY_GALLERY) {
      newLocation = '/';
    } else if (newSelectedTabKey === TAB_KEY_MEMBERS) {
      newLocation = '/members';
    } else if (newSelectedTabKey === TAB_KEY_HOLDINGS) {
      newLocation = '/member-holdings';
    }
    navigator.navigateTo(newLocation);
    setSelectedTabKey(newSelectedTabKey);
    setIsMenuOpen(false);
  };

  const onMenuClicked = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onWindowScrolled = React.useCallback((sizeScrolled: number): void => {
    setHasScrolled(sizeScrolled > 10);
  }, []);

  useWindowScroll(onWindowScrolled);

  return (
    <Box variant={getVariant('navBar', hasScrolled && 'navBarScrolled')} zIndex={999} height='3.4em'>
      <Stack direction={Direction.Vertical} isFullWidth={true} isFullHeight={true}>
        <Stack direction={Direction.Horizontal} isFullWidth={true} isFullHeight={true} contentAlignment={Alignment.Fill} childAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          <Stack.Item shrinkFactor={1} shouldShrinkBelowContentSize={true}>
            <LinkBase target='/' isFullHeight={true}>
              {logoImageUrl ? (
                <IpfsImage source={logoImageUrl} alternativeText={`${collection ? collection.name : ''} Gallery`} isFullHeight={true} maxHeight='2em' />
              ) : (
                <Text variant='header1'>{`${collection ? collection.name : ''} Gallery`}</Text>
              )}
            </LinkBase>
          </Stack.Item>
          <Spacing />
          <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
            <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
              <TabBar.Item variant='narrow' tabKey={TAB_KEY_GALLERY} text='Gallery' />
              {getChain(projectId) === 'ethereum' && (
                <TabBar.Item variant='narrow' tabKey={TAB_KEY_MEMBERS} text='Members' />
              )}
              {getChain(projectId) === 'ethereum' && (
                <TabBar.Item variant='narrow' tabKey={TAB_KEY_HOLDINGS} text='Member Holdings' />
              )}
            </TabBar>
          </ResponsiveHidingView>
          <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
            <LinkBase onClicked={onMenuClicked}>
              {selectedTabKey === TAB_KEY_GALLERY ? (
                <Text variant='branded'>Gallery</Text>
              ) : selectedTabKey === TAB_KEY_MEMBERS ? (
                <Text variant='branded'>Members</Text>
              ) : selectedTabKey === TAB_KEY_HOLDINGS ? (
                <Text variant='branded'>Member Holdings</Text>
              ) : (
                <React.Fragment />
              )}
            </LinkBase>
          </ResponsiveHidingView>
          <Stack.Item shrinkFactor={1} growthFactor={1}>
            <Spacing />
          </Stack.Item>
          <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
            <Box isFullWidth={false}>
              { chain === 'ethereum' && (
                <React.Fragment>
                  { account ? (
                    <AccountViewLink address={account.address} target={`/members/${account.address}`} />
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
            <Box variant='unrounded-navBar-navBarScrolled'>
              <Stack direction={Direction.Vertical} isFullWidth={true} childAlignment={Alignment.Center} shouldAddGutters={true} paddingStart={PaddingSize.Wide} paddingEnd={PaddingSize.Wide}>
                <Button text='Gallery' variant={getVariant(selectedTabKey === TAB_KEY_GALLERY ? 'navBarSelected' : null)} onClicked={(): void => onTabKeySelected(TAB_KEY_GALLERY)} />
                <Button text='Members' variant={getVariant(selectedTabKey === TAB_KEY_MEMBERS ? 'navBarSelected' : null)} onClicked={(): void => onTabKeySelected(TAB_KEY_MEMBERS)} />
                { chain === 'ethereum' && (
                  <React.Fragment>
                    { account ? (
                      <AccountViewLink address={account.address} target={`/members/${account.address}`} />
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
    </Box>
  );
};
