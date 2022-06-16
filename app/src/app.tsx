import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { IRoute, MockStorage, Router, useFavicon, useInitialization } from '@kibalabs/core-react';
import { EveryviewTracker } from '@kibalabs/everyview-tracker';
import { Head, IHeadRootProviderProps, KibaApp } from '@kibalabs/ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AccountControlProvider } from './AccountContext';
import { NotdClient } from './client/client';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { PageDataProvider } from './PageDataContext';
import { HomePage } from './pages/HomePage';
import { getHomePageData } from './pages/HomePage/getHomePageData';
import { UserPage } from './pages/UserPage/UserPage';
import { buildProjectTheme } from './theme';
import { getBackground, getEveryviewCode, getIcon } from './util';

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
};

export const routes: IRoute<IGlobals>[] = [
  { path: '/*', page: HomePage, getPageData: getHomePageData },
  { path: '/accounts/:accountAddress', page: UserPage, getPageData: getHomePageData },
];

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
  pageData?: unknown | undefined | null;
}

export const App = (props: IAppProps): React.ReactElement => {
  useFavicon(getIcon(projectId) || undefined);

  useInitialization((): void => {
    const everyviewCode = getEveryviewCode(projectId);
    if (everyviewCode) {
      const tracker = new EveryviewTracker(everyviewCode);
      tracker.initialize();
      tracker.trackApplicationOpen();
    }
  });

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={true} background={getBackground(projectId)}>
      <Head headId='app'>
        <title>Token Gallery</title>
      </Head>
      <PageDataProvider initialData={props.pageData}>
        <GlobalsProvider globals={globals}>
          <AccountControlProvider>
            <Router staticPath={props.staticPath} routes={routes} />
          </AccountControlProvider>
        </GlobalsProvider>
      </PageDataProvider>
      <ToastContainer />
    </KibaApp>
  );
};
