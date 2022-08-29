import React from 'react';

import { dateToRelativeString, dateToString, shortFormatEther } from '@kibalabs/core';
import { SubRouterOutlet, useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Button, ColorSettingView, Dialog, Direction, EqualGrid, Head, IconButton, Image, KibaIcon, Link, List, LoadingSpinner, PaddingSize, Spacing, Stack, TabBar, Text, TextAlignment } from '@kibalabs/ui-react';
import { BigNumber } from 'ethers';

import { useAccount, useLoginSignature, useOnLoginClicked } from '../../AccountContext';
import { GalleryToken, GalleryUser, TokenTransfer } from '../../client/resources';
import { AccountView, AccountViewLink } from '../../components/AccountView';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';

const TAB_KEY_OWNED = 'TAB_KEY_OWNED';
const TAB_KEY_TRANSACTIONS = 'TAB_KEY_TRANSACTIONS';

interface ITokenTransferRowProps {
  userAddress: string;
  tokenTransfer: TokenTransfer;
}

const TokenTransferRow = (props: ITokenTransferRowProps): React.ReactElement => {
  let action = '';
  let actionSecondary: string | null = null;
  const isSender = props.tokenTransfer.fromAddress === props.userAddress;
  const hasValue = props.tokenTransfer.value.gt(BigNumber.from(0));
  let iconId = '';
  if (props.tokenTransfer.isSwap || props.tokenTransfer.isMultiAddress) {
    action = 'Swapped';
    iconId = 'ion-trail-sign';
    actionSecondary = 'with';
}  else if (props.tokenTransfer.fromAddress === '0x0000000000000000000000000000000000000000') {
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
        <Image height='1em' width='1em' source={props.tokenTransfer.token.resizableImageUrl || props.tokenTransfer.token.imageUrl || ''} alternativeText='.' />
        <Spacing variant={PaddingSize.Narrow} />
        <Text>{props.tokenTransfer.token.name}</Text>
        <Spacing variant={PaddingSize.Default} />
      </Stack>
      {actionSecondary && (
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullWidth={true}>
          <Text>{actionSecondary}</Text>
          <Spacing variant={PaddingSize.Default} />
          {isSender ? (
            <AccountViewLink address={props.tokenTransfer.toAddress} target={`/accounts/${props.tokenTransfer.toAddress}`} />
          ) : (
            <AccountViewLink address={props.tokenTransfer.fromAddress} target={`/accounts/${props.tokenTransfer.fromAddress}`} />
          )}
        </Stack>
      )}
      {hasValue && (
        <Text>{`for ${shortFormatEther(props.tokenTransfer.value)}`}</Text>
      )}
    </Stack>
  );
};

export const AccountPage = (): React.ReactElement => {
  const { notdClient, collection } = useGlobals();
  const location = useLocation();
  const navigator = useNavigator();
  const account = useAccount();
  const loginSignature = useLoginSignature();
  const onLoginClicked = useOnLoginClicked();
  const accountAddress = useStringRouteParam('accountAddress');
  const [galleryTokens, setGalleryTokens] = React.useState<GalleryToken[] | null | undefined>(undefined);
  const [galleryUser, setGalleryUser] = React.useState<GalleryUser | null | undefined>(undefined);
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>(TAB_KEY_OWNED);
  const [recentTransfers, setRecentTransfers] = React.useState<TokenTransfer[] | null | undefined>(undefined);

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

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
    navigator.navigateTo(`/accounts/${accountAddress}`);
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
    // TODO(krishan711): get this from notdClient when its no longer protected access
    // @ts-ignore
    window.open(`${window.KRT_API_URL}/gallery/v1/twitter-login?${new URLSearchParams(params).toString()}`);
  };

  const onTabKeySelected = (newSelectedTabKey: string): void => {
    setSelectedTabKey(newSelectedTabKey);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`${accountAddress} | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
        <Spacing />
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
        <TabBar contentAlignment={Alignment.Start} isFullWidth={false} onTabKeySelected={onTabKeySelected} selectedTabKey={selectedTabKey}>
          <TabBar.Item variant='narrow' tabKey={TAB_KEY_OWNED} text='Owned Tokens' />
          <TabBar.Item variant='narrow' tabKey={TAB_KEY_TRANSACTIONS} text='Activity' />
        </TabBar>
        <Stack.Item growthFactor={1} shrinkFactor={1}>
          {selectedTabKey === TAB_KEY_OWNED ? (
            <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
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
                      target={`/accounts/${accountAddress}/tokens/${galleryToken.collectionToken.tokenId}`}
                    />
                  ))}
                </EqualGrid>
              )}
            </Stack>
          ) : (
            <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} isScrollableVertically={true} isFullHeight={true} isFullWidth={true}>
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
                        <TokenTransferRow userAddress={accountAddress} tokenTransfer={tokenTransfer} />
                      </List.Item>
                    ))}
                  </List>
                </React.Fragment>
              )}
            </Stack>
          )}
        </Stack.Item>
      </Stack>
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
