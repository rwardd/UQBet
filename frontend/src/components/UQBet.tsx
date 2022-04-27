import React, { FC, useContext } from "react";
import { GlobalState } from "../globalState";
import { COLORS } from "../theme";
import { ConnectWallet } from "./ConnectWallet";
import Header from "./Header";
import Web3 from 'web3';
import { NoWalletDetected } from "./NoWalletDetected";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";
import BetSlip from "./BetSlip";


// This is the Hardhat Network id, you might change it in the hardhat.config.js.
// If you are using MetaMask, be sure to change the Network id to 1337.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
export const HARDHAT_NETWORK_ID = "1337";

const UQBet: FC = () => {
  const {
    setNetworkError,
    selectedAddress,
    networkError,
    setSelectedAddress,
    setTokenData,
    setBalance,
    resetState,
  } = useContext(GlobalState);

  let _token: ethers.Contract;
  let _pollDataInterval: any;
  
  /**
   * Function defintions
   */

  // This method checks if Metamask selected network is Localhost:8545
  function _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError("Please connect Metamask to Localhost:8545");

    return false;
  }

  async function _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    const _provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    _token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      _provider.getSigner(0)
    );
  }

  
  async function _updateBalance(userAddress: string) {
    const balance = await _token.balanceOf(userAddress);
    setBalance(balance);
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  function _startPollingData(userAddress: string) {
    _pollDataInterval = setInterval(() => _updateBalance(userAddress), 1000);

    // We run it once immediately so we don't have to wait for it
    _updateBalance(userAddress);
  }

  function _stopPollingData() {
    clearInterval(_pollDataInterval);
    _pollDataInterval = undefined;
  }

  function _initialize(userAddress: string) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    setSelectedAddress(userAddress);

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    _initializeEthers();

    _startPollingData(userAddress);
  }

  // This method just clears part of the state.
  function _dismissNetworkError() {
    setNetworkError(undefined);
  }

  // This method is run when the user clicks the Connect. It connects the
  // dapp to the user's wallet, and initializes it.
  async function _connectWallet() {
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [accountAddy] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!_checkNetwork()) {
      return;
    }

    _initialize(accountAddy);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", (newAddress: any) => {
      _stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        if (resetState) {
          return resetState();
        }
      }

      _initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", () => {
      _stopPollingData();
      if (resetState) {
        return resetState();
      }
    });
  }

  /**
   * Return statements
   */

  document.body.style.backgroundColor = COLORS.purple;

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
  if (!selectedAddress) {
    return (
      <ConnectWallet
        connectWallet={() => _connectWallet()}
        networkError={networkError}
        dismiss={() => _dismissNetworkError()}
      />
    );
  }

  return (
    <>
      <Header />
      <BetSlip />
    </>
  );
};

export default UQBet;
