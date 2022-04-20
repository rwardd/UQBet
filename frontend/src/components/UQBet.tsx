import React, { FC, ReactComponentElement, ReactNode, useContext } from "react";
import { GlobalState, IGlobalState } from "../globalState";
import { COLORS } from "../theme";
import { ConnectWallet } from "./ConnectWallet";
import Header from "./Header";
import { NoWalletDetected } from "./NoWalletDetected";

// This is the Hardhat Network id, you might change it in the hardhat.config.js.
// If you are using MetaMask, be sure to change the Network id to 1337.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
export const HARDHAT_NETWORK_ID = "1337";

const UQBet: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  const globalState = useContext(GlobalState);

  // This method checks if Metamask selected network is Localhost:8545
  function _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    globalState.setNetworkError("Please connect Metamask to Localhost:8545");

    return false;
  }

  async function _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.

    globalState.setSelectedAddress(
      await window.ethereum.request({
        method: "eth_requestAccounts",
      })
    );

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!_checkNetwork()) {
      return;
    }
  }

  // This method just clears part of the state.
  function _dismissNetworkError() {
    globalState.setNetworkError(undefined);
  }

  // Ethereum wallets inject the window.ethereum object. If it hasn't been
  // injected, we instruct the user to install MetaMask.
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  // The next thing we need to do, is to ask the user to connect their wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So, if it hasn't been saved yet, we have
  // to show the ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the _connectWallet method.
  if (!globalState.selectedAddress) {
    return (
      <ConnectWallet
        connectWallet={() => _connectWallet()}
        networkError={globalState.networkError}
        dismiss={() => _dismissNetworkError()}
      />
    );
  }

  return (
    <>
      <Header />
    </>
  );
};

export default UQBet;
