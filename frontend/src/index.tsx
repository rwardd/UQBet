import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/DeprecatedDapp";
import UQBet from "./components/UQBet";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import { GlobalStateProvider } from "./globalState";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

declare global {
  interface Window {
    ethereum: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UQBet />} />
          <Route path='/DeprecatedDapp' element={<Dapp />} />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
