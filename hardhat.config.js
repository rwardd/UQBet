require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY = "QXkgQV6qKc6DV_ckTc-u68krxm3vxkWt";
const ALCHEMY_ROPSTEN = "kK9-U9jQJVpCLDjzMceUganJau8Se4O2";

const RINKEBY_PRIVATE_KEY = "9601440df936795d22bc04ac76387d64804c733baeb48a359f0583d9fb1377cb";
const ROPSTEN_PRIVATE_KEY = "9e58b734493335162df72df916a9e72fc110fa12f14cdfe59586696a06a002a5";
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.


// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/kK9-U9jQJVpCLDjzMceUganJau8Se4O2",
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`],
      gasPrice: 4500000000,
      chainId: 3
    },
  },
  etherscan: {
    apiKey: 'GS5YFXIJNXFNCXUNDS2F9M6Z4XIQA7R7X4'
  }
};
