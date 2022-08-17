import React from 'react';

import { dateToString } from '@kibalabs/core';
import { IMultiAnyChildProps, useInitialization } from '@kibalabs/core-react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

import { useGlobals } from './globalsContext';

export type Account = {
  address: string;
  signer: ethers.Signer;
}

export type LoginSignature = {
  message: string;
  signature: string;
}

type AccountControl = {
  web3: ethers.providers.Web3Provider | undefined | null;
  account: Account | undefined | null;
  loginSignature: LoginSignature | undefined | null;
  onLinkAccountsClicked: () => void;
  onLoginClicked: () => Promise<LoginSignature | null>;
}

export const AccountContext = React.createContext<AccountControl | undefined | null>(undefined);

interface IAccountControlProviderProps extends IMultiAnyChildProps {
}

export const AccountControlProvider = (props: IAccountControlProviderProps): React.ReactElement => {
  const { localStorageClient } = useGlobals();
  const [web3, setWeb3] = React.useState<ethers.providers.Web3Provider | null | undefined>(undefined);
  const [account, setAccount] = React.useState<Account | undefined | null>(undefined);
  const [loginCount, setLoginCount] = React.useState<number>(0);

  const loadWeb3 = async (): Promise<void> => {
    const provider = await detectEthereumProvider() as ethers.providers.ExternalProvider;
    if (!provider) {
      setAccount(null);
      return;
    }
    const web3Connection = new ethers.providers.Web3Provider(provider);
    setWeb3(web3Connection);
  };

  const onAccountsChanged = React.useCallback(async (accountAddresses: string[]): Promise<void> => {
    if (!web3) {
      return;
    }
    const linkedAccounts = accountAddresses.map((accountAddress: string): ethers.Signer => web3.getSigner(accountAddress));
    if (linkedAccounts.length === 0) {
      return;
    }
    // NOTE(krishan711): metamask only deals with one account at the moment but returns an array for future compatibility
    const linkedAccount = linkedAccounts[0];
    const linkedAccountAddress = await linkedAccount.getAddress();
    setAccount({ address: linkedAccountAddress, signer: linkedAccount });
  }, [web3]);

  const loadAccounts = React.useCallback(async (): Promise<void> => {
    if (!web3) {
      return;
    }
    // @ts-expect-error
    onAccountsChanged(await web3.provider.request({ method: 'eth_accounts' }));
    // @ts-expect-error
    web3.provider.on('accountsChanged', onAccountsChanged);
  }, [web3, onAccountsChanged]);

  React.useEffect((): void => {
    loadAccounts();
  }, [loadAccounts]);

  const onLinkAccountsClicked = async (): Promise<void> => {
    if (!web3) {
      return;
    }
    // @ts-expect-error
    web3.provider.request({ method: 'eth_requestAccounts', params: [] }).then(async (): Promise<void> => {
      await loadWeb3();
    }).catch((error: unknown): void => {
      if ((error as Error).message?.includes('wallet_requestPermissions')) {
        toast.error('You already have a MetaMask request window open, please find it!');
      } else {
        toast.error('Something went wrong connecting to MetaMask. Please try refresh the page / your browser and try again');
      }
    });
  };

  const loginSignature = React.useMemo((): LoginSignature | null => {
    if (!account || loginCount < 0) {
      return null;
    }
    const stringValue = localStorageClient.getValue(`account-signature-${account.address}`);
    if (!stringValue) {
      return null;
    }
    const signature = JSON.parse(stringValue);
    // TODO(krishan711): could do some checking here
    return signature as LoginSignature;
  }, [account, loginCount, localStorageClient]);

  const onLoginClicked = async (): Promise<LoginSignature | null> => {
    if (!account) {
      return null;
    }
    const message = `TOKEN_PAGE_LOGIN - ${dateToString(new Date())}`;
    try {
      const signature = await account.signer.signMessage(message);
      const newLoginSignature = { message, signature };
      localStorageClient.setValue(`account-signature-${account.address}`, JSON.stringify(newLoginSignature));
      setLoginCount(loginCount + 1);
      return newLoginSignature;
    } catch (error: unknown) {
      console.error(error);
    }
    return null;
  };

  useInitialization((): void => {
    loadWeb3();
  });

  return (
    <AccountContext.Provider value={{ account, loginSignature: loginSignature as LoginSignature, onLinkAccountsClicked, onLoginClicked, web3 }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export const useWeb3 = (): ethers.providers.Web3Provider | undefined | null => {
  const accountsControl = React.useContext(AccountContext);
  if (!accountsControl) {
    throw Error('accountsControl has not been initialized correctly.');
  }
  return accountsControl.web3;
};

export const useAccount = (): Account | undefined | null => {
  const accountsControl = React.useContext(AccountContext);
  if (!accountsControl) {
    throw Error('accountsControl has not been initialized correctly.');
  }
  return accountsControl.account;
};

export const useOnLinkAccountsClicked = (): (() => void) => {
  const accountsControl = React.useContext(AccountContext);
  if (!accountsControl) {
    throw Error('accountsControl has not been initialized correctly.');
  }
  return accountsControl.onLinkAccountsClicked;
};

export const useOnLoginClicked = (): (() => Promise<LoginSignature | null>) => {
  const accountsControl = React.useContext(AccountContext);
  if (!accountsControl) {
    throw Error('accountsControl has not been initialized correctly.');
  }
  return accountsControl.onLoginClicked;
};

export const useLoginSignature = (): LoginSignature | undefined | null => {
  const accountsControl = React.useContext(AccountContext);
  if (!accountsControl) {
    throw Error('accountsControl has not been initialized correctly.');
  }
  return accountsControl.loginSignature;
};
