import React from 'react';

import { LocalStorageClient, Requester, RestMethod } from '@kibalabs/core';
import { IRoute, MockStorage, Router, SubRouter, useFavicon, useInitialization } from '@kibalabs/core-react';
import { EveryviewTracker } from '@kibalabs/everyview-tracker';
import { Box, Direction, Head, IHeadRootProviderProps, KibaApp, ResponsiveHidingView, ScreenSize, Stack } from '@kibalabs/ui-react';
import { ToastContainer } from 'react-toastify';

import { AccountControlProvider } from './AccountContext';
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
import { MembersPage } from './pages/MembersPage/MembersPage';
import { TokenPage } from './pages/TokenPage';
import { buildProjectTheme } from './theme';
import { getBackground, getCollectionAddress, getEveryviewCode, getIcon } from './util';

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
  { path: '/members',
    page: MembersPage,
    getPageData: getHomePageData },
];

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
  pageData?: IGalleryPageData | null;
}

export const App = (props: IAppProps): React.ReactElement => {
  useFavicon(getIcon(projectId) || '/assets/icon.png');
  const [collection, setCollection] = React.useState<Collection | null | undefined>(props.pageData?.collection || undefined);
  const [allTokens, setAllTokens] = React.useState<CollectionToken[] | null | undefined>(props.pageData?.allTokens || undefined);
  const [collectionAttributes, setCollectionAttributes] = React.useState<CollectionAttribute[] | null | undefined>(undefined);

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
      notdClient.listCollectionAttributes(collectionAddress).then((retrievedCollectionAttributes: CollectionAttribute[]): void => {
        setCollectionAttributes(retrievedCollectionAttributes);
      }).catch((error: unknown): void => {
        console.error(error);
        setCollectionAttributes(null);
      });
    } else {
      const collectionDataResponse = await requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${projectId}/data.json`);
      const collectionData = JSON.parse(collectionDataResponse.content);
      const newCollection = Collection.fromObject(collectionData.collection);
      const newCollectionAttributes = collectionData.collectionAttributes.map((record: Record<string, unknown>): CollectionAttribute => CollectionAttribute.fromObject(record));
      const newAllTokens = collectionData.collectionTokens.map((record: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(record));
      setCollection(newCollection);
      setCollectionAttributes(newCollectionAttributes);
      setAllTokens(newAllTokens);
    }
  }, []);

  React.useEffect((): void => {
    updateCollection();
  }, [updateCollection]);

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={true} background={getBackground(projectId)}>
      <Head headId='app'>
        <title>Token Gallery</title>
      </Head>
      <PageDataProvider initialData={props.pageData}>
        <GlobalsProvider globals={{ ...globals, collection, allTokens, collectionAttributes }}>
          <AccountControlProvider>
            <Router staticPath={props.staticPath}>
              <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true}>
                <NavBar />
                <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
                  <Box variant='unrounded' shouldClipContent={true}>
                    <SubRouter routes={routes} />
                  </Box>
                </Stack.Item>
              </Stack>
            </Router>
          </AccountControlProvider>
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
