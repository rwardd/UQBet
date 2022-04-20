import { render } from "@testing-library/react";
import React, { FC, HTMLAttributeAnchorTarget } from "react";

const BetSlip: FC = () => {
  return (
    <div>
      <h2>BetSlip</h2>
      <h3>Team A</h3>
      <h3>Total Amount: x ETH</h3>
      <h5>Enter an amount to bid:</h5>
      <input></input>
      <input type='submit' />
      <br />
      <h3>Team B</h3>
      <h3>Total Amount: x ETH</h3>
      <h5>Enter an amount to bid:</h5>
      <input></input>
      <input type='submit' />
    </div>
  );
};

export default BetSlip;
