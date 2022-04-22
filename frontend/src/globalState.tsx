import React, { ReactNode, useState } from "react";

// This is our global state

export const GlobalState = React.createContext<Partial<IGlobalState>>({});

export interface IGlobalState {
  // The info of the token (i.e. It's Name and symbol)
  tokenData: ITokenData | undefined;
  setTokenData: any;
  // The user's address
  selectedAddress: string | undefined;
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
interface ITokenData {
  name: string;
  symbol: string;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = (
  props
) => {
  const { children } = props;

  const [tokenData, setTokenData] = useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [txBeingSent, setTxBeingSet] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);

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
