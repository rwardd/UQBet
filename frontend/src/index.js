import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";
import UQBet from "./components/UQBet";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dapp />} />
        <Route path='/UQBet' element={<UQBet />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
