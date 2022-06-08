import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { IRoute, MockStorage, Router, useFavicon, useInitialization } from '@kibalabs/core-react';
import { Head, IHeadRootProviderProps, KibaApp } from '@kibalabs/ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AccountControlProvider } from './AccountContext';
import { NotdClient } from './client/client';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { HomePage } from './pages/HomePage';
import { buildProjectTheme } from './theme';
import { getBackground, getEveryviewCode, getIcon } from './util';
import { EveryviewTracker } from '@kibalabs/everyview-tracker';

declare global {
  export interface Window {
    KRT_API_URL?: string;
    KRT_WEB3STORAGE_API_KEY?: string;
  }
}

const requester = new Requester(undefined, undefined, false);
const notdClient = new NotdClient(requester, typeof window !== 'undefined' && window.KRT_API_URL ? window.KRT_API_URL : undefined);
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());

const theme = buildProjectTheme();

const globals: IGlobals = {
  requester,
  notdClient,
  localStorageClient,
};

const routes: IRoute<IGlobals>[] = [
  { path: '/*', page: HomePage },
];

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
  pageData?: unknown | undefined | null;
}

export const App = (props: IAppProps): React.ReactElement => {
  useFavicon(getIcon() || undefined);

  useInitialization((): void => {
    const everyviewCode = getEveryviewCode();
    if (everyviewCode) {
      const tracker = new EveryviewTracker(everyviewCode);
      tracker.initialize();
      tracker.trackApplicationOpen();
    }
  });

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={true} background={getBackground()}>
      <Head headId='app'>
        <title>Token Gallery</title>
      </Head>
      <GlobalsProvider globals={globals}>
        <AccountControlProvider>
          <Router staticPath={props.staticPath} routes={routes} />
        </AccountControlProvider>
      </GlobalsProvider>
      <ToastContainer />
    </KibaApp>
  );
};
