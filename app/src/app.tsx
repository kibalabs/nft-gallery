import React from 'react';

import { IRoute, Router } from '@kibalabs/core-react';
import { Head, IHeadRootProviderProps, KibaApp } from '@kibalabs/ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AccountControlProvider } from './AccountContext';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { HomePage } from './pages/HomePage';
import { buildAppTheme } from './theme';

declare global {
  export interface Window {
    KRT_API_URL?: string;
    KRT_WEB3STORAGE_API_KEY?: string;
  }
}

const theme = buildAppTheme();

const globals: IGlobals = {
};

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
}

export const App = (props: IAppProps): React.ReactElement => {
  const routes: IRoute[] = [
    { path: '/*', page: HomePage },
  ];

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={true}>
      <Head headId='app'>
        <title>Token Gallery</title>
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
