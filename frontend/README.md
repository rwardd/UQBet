# UQBet Dapp

This directory contains the fonrtent source files of the UQBet betting site.
It can be used to interact with the UQBet contract, built using React.

## Running the Dapp

This project uses [`create-react-app`](https://create-react-app.dev/), so most
configuration files are handled by it.

To run it, you just need to execute `yarn start` in a terminal, and open
[http://localhost:3000](http://localhost:3000).

To learn more about what `create-react-app` offers, you can read
[its documentation](https://create-react-app.dev/docs/getting-started).

## Architecture of UQBet

UQBet consists of multiple React Components, which you can find in `src/components`.

The components that call the contract can are under `src/components/transactionComponents` and `src/components/viewComponents`. Transaction components require gas to be used, and change the state of the contract. View components are free to use, and only view the state of the contract.

You can use the return  statements in the  `src/components/UQBet.tsx` component as a starting point. It has comments explaining each part and is where you connect to the Web3 wallet and load the bettingContract.

