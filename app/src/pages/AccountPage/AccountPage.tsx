import React from 'react';

import { dateToString } from '@kibalabs/core';
import { SubRouterOutlet, useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, ContainingView, Dialog, Direction, EqualGrid, getVariant, Head, IconButton, KibaIcon, Link, List, LoadingSpinner, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, TabBar, Text, TextAlignment, useColors } from '@kibalabs/ui-react';
import ReactTooltip from 'react-tooltip';

import { useWeb3Account, useWeb3LoginSignature, useWeb3OnLoginClicked } from '@kibalabs/web3-react';
import { CollectionToken, GalleryOwnedCollection, GalleryToken, GalleryUser, GalleryUserBadge, TokenTransfer } from '../../client/resources';
import { AccountView } from '../../components/AccountView';
import { StatefulCollapsibleBox } from '../../components/CollapsibleBox';
import { IpfsImage } from '../../components/IpfsImage';
import { TokenCard } from '../../components/TokenCard';
import { UserTokenTransferRow } from '../../components/TokenTransferRow';
import { useGlobals } from '../../globalsContext';
import { getBadges, IBadge, isBadgesEnabled } from '../../util';

const TAB_KEY_OWNED = 'TAB_KEY_OWNED';
const TAB_KEY_TRANSACTIONS = 'TAB_KEY_TRANSACTIONS';
const TAB_KEY_OTHER = 'TAB_KEY_OTHER';
const TAB_KEY_BADGES = 'TAB_KEY_BADGES';

export interface IBadgesViewProps {
  badges: IBadge[];
  userBadges: GalleryUserBadge[];
}

export const BadgesView = (props: IBadgesViewProps): React.ReactElement => {
  const colors = useColors();

  const ownedBadgeAchievedDateMap = React.useMemo((): Record<string, Date> => {
    return props.userBadges.reduce((accumulator: Record<string, Date>, current: GalleryUserBadge): Record<string, Date> => {
      accumulator[current.badgeKey] = current.achievedDate;
      return accumulator;
    }, {});
  }, [props.userBadges]);

  return (
    <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Center} shouldAddGutters={true} shouldWrapItems={true} defaultGutter={PaddingSize.Wide}>
      {props.badges.map((badge: IBadge): React.ReactElement => (
        <React.Fragment key={badge.key}>
          <div data-tip data-for={`BadgesView-${badge.key}`}>
            <Box variant={getVariant('badge', ownedBadgeAchievedDateMap[badge.key] ? '' : 'badgeUnobtained')} isFullWidth={false} shouldClipContent={true}>
              <IpfsImage variant='unrounded' isLazyLoadable={false} source={badge.imageUrl} alternativeText={badge.name} width='3em' height='3em' />
            </Box>
          </div>
          <ReactTooltip id={`BadgesView-${badge.key}`} effect='solid' backgroundColor={colors.backgroundLight10} border={true} borderColor={colors.backgroundDark10}>
            <Box maxWidth='300px'>
              <Stack direction={Direction.Vertical} shouldAddGutters={true}>
                <Text variant='bold'>{badge.name}</Text>
                <Text>{badge.description}</Text>
                {ownedBadgeAchievedDateMap[badge.key] ? (
                  <Text>{`Achieved on: ${dateToString(ownedBadgeAchievedDateMap[badge.key], 'yyyy-MM-dd HH:mm')}`}</Text>
                ) : (
                  <Text variant='note'>Not held</Text>
                )}
              </Stack>
            </Box>
          </ReactTooltip>
        </React.Fragment>
      ))}
    </Stack>
  );
};

export const AccountPage = (): React.ReactElement => {
  const { notdClient, collection, projectId } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const account = useWeb3Account();
  const loginSignature = useWeb3LoginSignature();
  const onLoginClicked = useWeb3OnLoginClicked();
  const accountAddress = useStringRouteParam('accountAddress');
  const [galleryTokens, setGalleryTokens] = React.useState<GalleryToken[] | null | undefined>(undefined);
  const [ownedCollections, setOwnedCollections] = React.useState<GalleryOwnedCollection[] | null | undefined>(undefined);
  const [galleryUser, setGalleryUser] = React.useState<GalleryUser | null | undefined>(undefined);
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>(TAB_KEY_OWNED);
  const [recentTransfers, setRecentTransfers] = React.useState<TokenTransfer[] | null | undefined>(undefined);
  const [badges, setBadges] = React.useState<GalleryUserBadge[] | null | undefined>(undefined);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  const ownedBadgeAchievedDateMap = React.useMemo((): Record<string, Date> | undefined | null => {
    return badges?.reduce((accumulator: Record<string, Date>, current: GalleryUserBadge): Record<string, Date> => {
      accumulator[current.badgeKey] = current.achievedDate;
      return accumulator;
    }, {});
  }, [badges]);

  const updateTokens = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setGalleryTokens(undefined);
    }
    if (!accountAddress || !collection?.address) {
      setGalleryTokens(undefined);
      return;
    }
    notdClient.queryCollectionTokens(collection.address, 100, 0, accountAddress).then((retrievedGalleryTokens: GalleryToken[]): void => {
      setGalleryTokens(retrievedGalleryTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setGalleryTokens(null);
    });
  }, [notdClient, collection?.address, accountAddress]);

  React.useEffect((): void => {
    updateTokens();
  }, [updateTokens]);

  const updateBadges = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setBadges(undefined);
    }
    if (!accountAddress || !collection?.address) {
      setBadges(undefined);
      return;
    }
    notdClient.listUserBadges(collection.address, accountAddress).then((retrievedGalleryUserBadges: GalleryUserBadge[]): void => {
      setBadges(retrievedGalleryUserBadges);
    }).catch((error: unknown): void => {
      console.error(error);
      setBadges(null);
    });
  }, [notdClient, collection?.address, accountAddress]);

  React.useEffect((): void => {
    updateBadges();
  }, [updateBadges]);

  const updateOwnedCollections = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setOwnedCollections(undefined);
    }
    if (!accountAddress || !collection?.address) {
      setOwnedCollections(undefined);
      return;
    }
    notdClient.listUserOwnedCollections(collection.address, accountAddress).then((retrievedOwnedCollections: GalleryOwnedCollection[]): void => {
      setOwnedCollections(retrievedOwnedCollections);
    }).catch((error: unknown): void => {
      console.error(error);
      setOwnedCollections(null);
    });
  }, [notdClient, collection?.address, accountAddress]);

  React.useEffect((): void => {
    updateOwnedCollections();
  }, [updateOwnedCollections]);

  const updateTransfers = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setRecentTransfers(undefined);
    }
    if (!accountAddress || !collection?.address) {
      setRecentTransfers(undefined);
      return;
    }
    notdClient.listCollectionRecentTransfers(collection.address, accountAddress, 100, 0).then((retrievedRecentTransfers: TokenTransfer[]): void => {
      setRecentTransfers(retrievedRecentTransfers);
    }).catch((error: unknown): void => {
      console.error(error);
      setRecentTransfers(null);
    });
  }, [notdClient, collection?.address, accountAddress]);

  React.useEffect((): void => {
    updateTransfers();
  }, [updateTransfers]);

  const updateUser = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setGalleryUser(undefined);
    }
    if (!accountAddress || !collection?.address) {
      setGalleryUser(undefined);
      return;
    }
    notdClient.getGalleryUser(collection.address, accountAddress).then((retrievedGalleryUser: GalleryUser): void => {
      setGalleryUser(retrievedGalleryUser);
    }).catch((error: unknown): void => {
      console.error(error);
      setGalleryUser(null);
    });
  }, [notdClient, collection?.address, accountAddress]);

  React.useEffect((): void => {
    updateUser(true);
  }, [updateUser]);

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo(`/members/${accountAddress}`);
  };

  const onConnectTwitterClicked = async (): Promise<void> => {
    if (!account) {
      return;
    }
    let signature = loginSignature;
    if (!signature) {
      signature = await onLoginClicked();
    }
    if (!signature) {
      return;
    }
    const params = {
      account: account.address,
      signatureJson: encodeURIComponent(JSON.stringify(signature)),
      initialUrl: encodeURIComponent(window.location.toString()),
    };
    window.open(`${notdClient.baseUrl}/gallery/v1/twitter-login?${new URLSearchParams(params).toString()}`);
  };

  const onTabKeySelected = (newSelectedTabKey: string): void => {
    setSelectedTabKey(newSelectedTabKey);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`${accountAddress} | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <ContainingView>
        <Stack direction={Direction.Vertical} isFullHeight={false} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center}>
            <AccountView
              address={accountAddress}
              textVariant='header2'
              imageSize='2em'
              shouldUseYourAccount={true}
            />
            <IconButton icon={<KibaIcon iconId='ion-open-outline' />} target={`https://etherscan.io/address/${accountAddress}`} />
          </Stack>
          <React.Fragment>
            {galleryUser && galleryUser.joinDate ? (
              <Text>{`Joined on ${dateToString(galleryUser.joinDate, 'dd MMM yyyy')}`}</Text>
            ) : galleryUser && !galleryUser.joinDate && (
              <Text variant='note'>{'Never joined'}</Text>
            )}
          </React.Fragment>
          <React.Fragment>
            { galleryUser === undefined || galleryTokens?.length === 0 ? (
              null
            ) : galleryUser?.twitterProfile ? (
              <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center}>
                <KibaIcon iconId='ion-logo-twitter' />
                <Link text={`@${galleryUser.twitterProfile.username}`} target={`https://twitter.com/${galleryUser.twitterProfile.username}`} />
                <Text variant='note'>{`(${galleryUser.twitterProfile.followerCount} followers)`}</Text>
              </Stack>
            ) : accountAddress === account?.address ? (
              <React.Fragment>
                <Button variant='primary' text='Connect Twitter' iconLeft={<KibaIcon iconId='ion-logo-twitter' />} onClicked={onConnectTwitterClicked} />
              </React.Fragment>
            ) : (
              null
            )}
          </React.Fragment>
          <React.Fragment>
            {isBadgesEnabled(projectId) && (
              <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                <React.Fragment>
                  <Spacing />
                  {badges === undefined ? (
                    <LoadingSpinner />
                  ) : badges === null ? (
                    null
                  ) : (
                    <Box width='500px' maxWidth='90%'>
                      <BadgesView userBadges={badges} badges={getBadges(projectId)} />
                    </Box>
                  )}
                  <Spacing />
                </React.Fragment>
              </ResponsiveHidingView>
            )}
          </React.Fragment>
          <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
            <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
              <TabBar.Item variant='lined' tabKey={TAB_KEY_OWNED} text='Owned Tokens' />
              <TabBar.Item variant='lined' tabKey={TAB_KEY_TRANSACTIONS} text='Activity' />
              <TabBar.Item variant='lined' tabKey={TAB_KEY_OTHER} text='Other Projects' />
            </TabBar>
          </ResponsiveHidingView>
          <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
            <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
              <TabBar.Item variant='lined' tabKey={TAB_KEY_OWNED} text='Owned Tokens' />
              {isBadgesEnabled(projectId) && (
                <TabBar.Item variant='lined' tabKey={TAB_KEY_BADGES} text='Badges' />
              )}
              <TabBar.Item variant='lined' tabKey={TAB_KEY_TRANSACTIONS} text='Activity' />
              <TabBar.Item variant='lined' tabKey={TAB_KEY_OTHER} text='Other Projects' />
            </TabBar>
          </ResponsiveHidingView>
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            {selectedTabKey === TAB_KEY_OWNED ? (
              <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={false} isFullHeight={true} isFullWidth={true}>
                { galleryTokens === undefined ? (
                  <LoadingSpinner />
                ) : galleryTokens === null ? (
                  <Text variant='error' alignment={TextAlignment.Center}>Failed to load account tokens</Text>
                ) : galleryTokens.length === 0 ? (
                  <Text alignment={TextAlignment.Center}>No tokens owned</Text>
                ) : (
                  <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 3, extraLarge: 2 }} contentAlignment={Alignment.Center} childAlignment={Alignment.Start} shouldAddGutters={true}>
                    {galleryTokens.map((galleryToken: GalleryToken, index: number): React.ReactElement => (
                      <TokenCard
                        key={index}
                        token={galleryToken.collectionToken}
                        tokenCustomization={galleryToken.tokenCustomization}
                        tokenQuantity={galleryToken.quantity}
                        target={`/members/${accountAddress}/tokens/${galleryToken.collectionToken.tokenId}`}
                      />
                    ))}
                  </EqualGrid>
                )}
              </Stack>
            ) : selectedTabKey === TAB_KEY_BADGES ? (
              <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={false} isFullHeight={true} isFullWidth={true}>
                { badges === undefined ? (
                  <LoadingSpinner />
                ) : badges === null ? (
                  <Text variant='error' alignment={TextAlignment.Center}>Failed to load account tokens</Text>
                ) : badges.length === 0 ? (
                  <Text alignment={TextAlignment.Center}>No tokens owned</Text>
                ) : (
                  <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 3, extraLarge: 2 }} contentAlignment={Alignment.Center} childAlignment={Alignment.Start} shouldAddGutters={true}>
                    {getBadges(projectId).map((badge: IBadge): React.ReactElement => (
                      <Box key={badge.key} variant={getVariant(ownedBadgeAchievedDateMap && ownedBadgeAchievedDateMap[badge.key] ? '' : 'badgeUnobtained')} isFullWidth={true}>
                        <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center}>
                          <Box variant={getVariant('badge', ownedBadgeAchievedDateMap && ownedBadgeAchievedDateMap[badge.key] ? '' : 'badgeUnobtained')} isFullWidth={true} shouldClipContent={true}>
                            <IpfsImage variant='unrounded' isLazyLoadable={false} source={badge.imageUrl} alternativeText={badge.name} isFullHeight={true} isFullWidth={true} />
                          </Box>
                          <Text alignment={TextAlignment.Center} variant='bold'>{badge.name}</Text>
                          <Text alignment={TextAlignment.Center}>{badge.description}</Text>
                        </Stack>
                      </Box>
                    ))}
                  </EqualGrid>
                )}
              </Stack>
            ) : selectedTabKey === TAB_KEY_TRANSACTIONS ? (
              <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={false} isFullHeight={true} isFullWidth={true}>
                { recentTransfers === undefined ? (
                  <LoadingSpinner />
                ) : recentTransfers === null ? (
                  <Text variant='error' alignment={TextAlignment.Center}>Failed to load activity</Text>
                ) : recentTransfers.length === 0 ? (
                  <Text alignment={TextAlignment.Center}>No activity</Text>
                ) : (
                  <React.Fragment>
                    <List shouldShowDividers={true} isFullWidth={true}>
                      {recentTransfers.map((tokenTransfer: TokenTransfer): React.ReactElement => (
                        <List.Item key={tokenTransfer.tokenTransferId} itemKey={String(tokenTransfer.tokenTransferId)}>
                          <UserTokenTransferRow userAddress={accountAddress} tokenTransfer={tokenTransfer} />
                        </List.Item>
                      ))}
                    </List>
                  </React.Fragment>
                )}
              </Stack>
            ) : (
              <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={false} isFullHeight={true} isFullWidth={true} shouldAddGutters={true}>
                { ownedCollections === undefined ? (
                  <LoadingSpinner />
                ) : ownedCollections === null ? (
                  <Text variant='error' alignment={TextAlignment.Center}>Failed to load other projects</Text>
                ) : ownedCollections.length === 0 ? (
                  <Text alignment={TextAlignment.Center}>No other projects</Text>
                ) : (
                  <React.Fragment>
                    {ownedCollections.map((ownedCollection: GalleryOwnedCollection): React.ReactElement => (
                      <StatefulCollapsibleBox
                        key={ownedCollection.collection.address}
                        isCollapsedInitially={true}
                        headerView={(
                          <Stack direction={Direction.Horizontal} shouldAddGutters={true}>
                            <IpfsImage source={ownedCollection.collection.imageUrl || ''} height='1.5em' width='1.5em' alternativeText='' />
                            <Text>{ownedCollection.collection.name}</Text>
                            <Text variant='bold'>{`x${ownedCollection.tokens.length}`}</Text>
                          </Stack>
                        )}
                      >
                        <EqualGrid childSizeResponsive={{ base: 6, medium: 4, large: 3, extraLarge: 2 }} contentAlignment={Alignment.Start} childAlignment={Alignment.Start} shouldAddGutters={true}>
                          {ownedCollection.tokens.map((token: CollectionToken): React.ReactElement => (
                            <TokenCard
                              key={`${token.registryAddress}-${token.tokenId}`}
                              token={token}
                              tokenQuantity={1}
                              target={`https://tokenhunt.io/collections/${token.registryAddress}/tokens/${token.tokenId}`}
                            />
                          ))}
                        </EqualGrid>
                      </StatefulCollapsibleBox>
                    ))}
                  </React.Fragment>
                )}
                <Stack.Item growthFactor={1} shrinkFactor={1} />
              </Stack>
            )}
          </Stack.Item>
        </Stack>
      </ContainingView>
      <ColorSettingView variant='dialog'>
        <Dialog
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
          maxWidth='1000px'
          maxHeight='90%'
        >
          <SubRouterOutlet />
        </Dialog>
      </ColorSettingView>
    </React.Fragment>
  );
};
