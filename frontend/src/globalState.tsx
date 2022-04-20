import React, { ReactNode } from "react";

// This is our global state

export const GlobalState = React.createContext<Partial<IGlobalState>>({});

export interface IGlobalState {
  tokenData: any;
  setTokenData: any;
  selectedAddress: any;
  setSelectedAddress: any;
  balance: any;
  setBalance: any;
  txBeingSent: any;
  setTxBeingSet: any;
  transactionError: any;
  setTransactionError: any;
  networkError: any;
  setNetworkError: any;
}

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = (
  props
) => {
  const { children } = props;

  const [tokenData, setTokenData] = React.useState(undefined);
  const [selectedAddress, setSelectedAddress] = React.useState(undefined);
  const [balance, setBalance] = React.useState(undefined);
  const [txBeingSent, setTxBeingSet] = React.useState(undefined);
  const [transactionError, setTransactionError] = React.useState(undefined);
  const [networkError, setNetworkError] = React.useState(undefined);

  const initialState: IGlobalState = {
    tokenData,
    setTokenData,
    selectedAddress,
    setSelectedAddress,
    balance,
    setBalance,
    txBeingSent,
    setTxBeingSet,
    transactionError,
    setTransactionError,
    networkError,
    setNetworkError,
  };

  return (
    <GlobalState.Provider value={initialState}>{children}</GlobalState.Provider>
  );
};
