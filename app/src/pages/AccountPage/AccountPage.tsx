import React from 'react';

import { SubRouterOutlet, useLocation, useNavigator, useStringRouteParam } from '@kibalabs/core-react';
import { Alignment, Button, ColorSettingView, Dialog, Direction, EqualGrid, Head, KibaIcon, Link, LoadingSpinner, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { useAccount, useLoginSignature, useOnLoginClicked } from '../../AccountContext';
import { GalleryToken, GalleryUser } from '../../client/resources';
import { AccountView } from '../../components/AccountView';
import { TokenCard } from '../../components/TokenCard';
import { useGlobals } from '../../globalsContext';

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

  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  const updateTokens = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setGalleryTokens(undefined);
    }
    if (!accountAddress || !collection) {
      setGalleryTokens(undefined);
      return;
    }
    notdClient.queryCollectionTokens(collection.address, 100, 0, accountAddress).then((retrievedGalleryTokens: GalleryToken[]): void => {
      setGalleryTokens(retrievedGalleryTokens);
    }).catch((error: unknown): void => {
      console.error(error);
      setGalleryTokens(null);
    });
  }, [notdClient, collection, accountAddress]);

  React.useEffect((): void => {
    updateTokens();
  }, [updateTokens]);

  const updateUser = React.useCallback(async (shouldClear = false): Promise<void> => {
    if (shouldClear) {
      setGalleryUser(undefined);
    }
    if (!accountAddress || !collection) {
      setGalleryUser(undefined);
      return;
    }
    notdClient.getGalleryUser(collection.address, accountAddress).then((retrievedGalleryUser: GalleryUser): void => {
      setGalleryUser(retrievedGalleryUser);
    }).catch((error: unknown): void => {
      console.error(error);
      setGalleryUser(null);
    });
  }, [notdClient, collection, accountAddress]);

  React.useEffect((): void => {
    updateUser();
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

  return (
    <React.Fragment>
      <Head>
        <title>{`${accountAddress} | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
        <Spacing />
        <AccountView
          address={accountAddress}
          textVariant='header2'
          imageSize='2em'
          shouldUseYourAccount={true}
        />
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
        <Stack.Item growthFactor={1} shrinkFactor={1}>
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
