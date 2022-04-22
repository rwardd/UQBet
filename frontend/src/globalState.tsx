import React, { ReactNode } from "react";

// This is our global state

export const GlobalState = React.createContext<Partial<IGlobalState>>({});

export interface IGlobalState {
  // The info of the token (i.e. It's Name and symbol)
  tokenData: any;
  setTokenData: any;
  // The user's address
  selectedAddress: any;
  setSelectedAddress: any;
  // The user's balance
  balance: any;
  setBalance: any;
  // The ID about transactions being sent
  txBeingSent: any;
  setTxBeingSet: any;
  // Any possible transaction error
  transactionError: any;
  setTransactionError: any;
  // Any network error
  networkError: any;
  setNetworkError: any;
  // Function to reset state
  resetState: () => void;
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
  function resetState() {
    setTokenData(undefined);
    setSelectedAddress(undefined);
    setBalance(undefined);
    setTxBeingSet(undefined);
    setTransactionError(undefined);
    setNetworkError(undefined);
  }

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
    resetState,
  };

  return (
    <GlobalState.Provider value={initialState}>{children}</GlobalState.Provider>
  );
};
