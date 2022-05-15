import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { IRoute, MockStorage, Router } from '@kibalabs/core-react';
import { Head, IHeadRootProviderProps, KibaApp } from '@kibalabs/ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AccountControlProvider } from './AccountContext';
import { NotdClient } from './client/client';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { HomePage } from './pages/HomePage';
import { buildAppTheme } from './theme';

declare global {
  export interface Window {
    KRT_API_URL?: string;
    KRT_WEB3STORAGE_API_KEY?: string;
  }
}

const requester = new Requester(undefined, undefined, false);
const notdClient = new NotdClient(requester, typeof window !== 'undefined' ? window.KRT_API_URL : undefined);
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());

const theme = buildAppTheme();

const globals: IGlobals = {
  requester,
  notdClient,
  localStorageClient,
};

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
}

export const App = (props: IAppProps): React.ReactElement => {
  const routes: IRoute[] = [
    { path: '/*', page: HomePage },
  ];

  return (
    <KibaApp theme={theme} background={{ linearGradient: 'rgb(0, 0, 0), rgb(25, 24, 37)' }} setHead={props.setHead} isFullPageApp={true}>
      <Head headId='app'>
        <title>MDTP Gallery</title>
      </Head>
      <AccountControlProvider>
        <GlobalsProvider globals={globals}>
          <Router staticPath={props.staticPath} routes={routes} />
        </GlobalsProvider>
      </AccountControlProvider>
      <ToastContainer />
    </KibaApp>
  );
};
