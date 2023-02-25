import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { IRoute, MockStorage, Router, SubRouter, useFavicon, useInitialization } from '@kibalabs/core-react';
import { EveryviewTracker } from '@kibalabs/everyview-tracker';
import { Alignment, BackgroundView, Direction, Head, IHeadRootProviderProps, KibaApp, ResponsiveHidingView, ScreenSize, Stack } from '@kibalabs/ui-react';
import { Web3AccountControlProvider } from '@kibalabs/web3-react';
import { ToastContainer } from 'react-toastify';

import { Collection, CollectionAttribute, CollectionToken } from './client';
import { NotdClient } from './client/client';
import { FloatingView } from './components/FloatingView';
import { Footer } from './components/Footer';
import { NavBar } from './components/NavBar';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { IGalleryPageData, PageDataProvider } from './PageDataContext';
import { AccountPage } from './pages/AccountPage';
import { HomePage } from './pages/HomePage';
import { getHomePageData } from './pages/HomePage/getHomePageData';
import { MemberHoldingsPage } from './pages/MemberHoldingsPage';
import { MembersPage } from './pages/MembersPage/MembersPage';
import { TokenPage } from './pages/TokenPage';
import { buildProjectTheme } from './theme';
import { getBackground, getCollectionAddress, getEveryviewCode, getIconImageUrl, isSuperCollection } from './util';

import './fonts.css';
import 'react-toastify/dist/ReactToastify.css';


declare global {
  export interface Window {
    KRT_API_URL?: string;
    KRT_PROJECT?: string;
  }
}

const requester = new Requester(undefined, undefined, false);
const notdClient = new NotdClient(requester, typeof window !== 'undefined' && window.KRT_API_URL ? window.KRT_API_URL : undefined);
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());

const projectId = (typeof window !== 'undefined' ? window.KRT_PROJECT : process.env.KRT_PROJECT) || 'mdtp';
const theme = buildProjectTheme(projectId);

export const globals: IGlobals = {
  projectId,
  requester,
  notdClient,
  localStorageClient,
  collection: undefined,
  collectionAttributes: undefined,
  allTokens: undefined,
};

export const routes: IRoute<IGlobals>[] = [
  { path: '/',
    page: HomePage,
    getPageData: getHomePageData,
    subRoutes: [
      { path: 'tokens/:tokenId', page: TokenPage },
    ] },
  { path: '/accounts/:accountAddress',
    page: AccountPage,
    getPageData: getHomePageData,
    subRoutes: [
      { path: 'tokens/:tokenId', page: TokenPage },
    ] },
  { path: '/members/:accountAddress',
    page: AccountPage,
    getPageData: getHomePageData,
    subRoutes: [
      { path: 'tokens/:tokenId', page: TokenPage },
    ] },
  { path: '/members',
    page: MembersPage,
    getPageData: getHomePageData,
    subRoutes: [
      { path: 'tokens/:tokenId', page: TokenPage },
    ] },
  { path: '/member-holdings',
    page: MemberHoldingsPage,
    getPageData: getHomePageData,
    subRoutes: [
      { path: 'tokens/:tokenId', page: TokenPage },
    ] },
];

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
  pageData?: IGalleryPageData | null;
}

export const App = (props: IAppProps): React.ReactElement => {
  useFavicon(getIconImageUrl(projectId) || '/assets/icon.png');
  const [collection, setCollection] = React.useState<Collection | null | undefined>(props.pageData?.collection || undefined);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [allTokens, setAllTokens] = React.useState<CollectionToken[] | null | undefined>(props.pageData?.allTokens || undefined);
  const [otherCollections, setOtherCollections] = React.useState<Collection[] | undefined | null>(undefined);
  // const [collectionAttributes, setCollectionAttributes] = React.useState<CollectionAttribute[] | null | undefined>(undefined);
  const [otherCollectionAttributes, setOtherCollectionAttributes] = React.useState<Record<string, CollectionAttribute[]> | undefined | null>(undefined);

  useInitialization((): void => {
    const everyviewCode = getEveryviewCode(projectId);
    if (everyviewCode) {
      const tracker = new EveryviewTracker(everyviewCode);
      tracker.initialize();
      tracker.trackApplicationOpen();
    }
  });

  const updateCollection = React.useCallback(async (): Promise<void> => {
    const collectionAddress = getCollectionAddress(projectId);
    if (collectionAddress) {
      notdClient.getCollection(collectionAddress).then((retrievedCollection: Collection): void => {
        setCollection(retrievedCollection);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollection(null);
      });
      if (isSuperCollection(projectId)) {
        notdClient.listGalleryCollectionsInSuperCollection(projectId).then((retrievedCollections: Collection[]): void => {
          setOtherCollections(retrievedCollections);
          // TODO(krishan711): use the single api once available
          Promise.all(retrievedCollections.map((retrievedCollection: Collection): Promise<CollectionAttribute[]> => {
            return notdClient.listCollectionAttributes(retrievedCollection.address);
          })).then((retrievedCollectionAttributes: CollectionAttribute[][]): void => {
            const newOtherCollectionAttributes: Record<string, CollectionAttribute[]> = {};
            for (let i = 0; i < retrievedCollections.length; i += 1) {
              newOtherCollectionAttributes[retrievedCollections[i].address] = retrievedCollectionAttributes[i];
            }
            setOtherCollectionAttributes(newOtherCollectionAttributes);
          });
        }).catch((error: unknown): void => {
          console.error(error);
          setOtherCollections(null);
        });
      } else {
        setOtherCollections([]);
        notdClient.listCollectionAttributes(collectionAddress).then((retrievedCollectionAttributes: CollectionAttribute[]): void => {
          setOtherCollectionAttributes({ [collectionAddress]: retrievedCollectionAttributes });
        }).catch((error: unknown): void => {
          console.error(error);
          setOtherCollectionAttributes(null);
        });
      }
    // } else {
    //   const collectionDataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/data.json`);
    //   const collectionData = JSON.parse(collectionDataResponse.content);
    //   const newCollection = Collection.fromObject(collectionData.collection);
    //   const newCollectionAttributes = collectionData.collectionAttributes.map((record: Record<string, unknown>): CollectionAttribute => CollectionAttribute.fromObject(record));
    //   const newAllTokens = collectionData.collectionTokens.map((record: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(record));
    //   setCollection(newCollection);
    //   setOtherCollectionAttributes(newCollectionAttributes);
    //   setAllTokens(newAllTokens);
    }
  }, []);

  React.useEffect((): void => {
    updateCollection();
  }, [updateCollection]);

  const onWeb3AccountError = (error: Error): void => {
    console.error(error);
  };

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={false}>
      <Head headId='app'>
        <title>Token Gallery</title>
      </Head>
      <BackgroundView {...(getBackground(projectId) || {})}>
        <div style={{ position: 'fixed', height: '100vh', width: '100vw', zIndex: -1, top: 0, left: 0 }} />
      </BackgroundView>
      <PageDataProvider initialData={props.pageData}>
        <GlobalsProvider globals={{ ...globals, collection, otherCollections, allTokens, otherCollectionAttributes }}>
          <Web3AccountControlProvider localStorageClient={localStorageClient} onError={onWeb3AccountError}>
            <Router staticPath={props.staticPath}>
              <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} contentAlignment={Alignment.Start}>
                <NavBar />
                <SubRouter routes={routes} />
              </Stack>
            </Router>
          </Web3AccountControlProvider>
        </GlobalsProvider>
      </PageDataProvider>
      <ToastContainer />
      <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
        <FloatingView positionBottom='20px' positionRight='20px'>
          <Footer isSmall={true} tokenPageReferral={`gallery-${projectId}`} />
        </FloatingView>
      </ResponsiveHidingView>
    </KibaApp>
  );
};
