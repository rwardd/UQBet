import React, { FC } from "react";
import { COLORS, BOX } from "../theme";

const BetSlip: FC = () => {
  return (
    <div style={betSlipStyling}>
      <h2>BetSlip (this does nothing atm)</h2>
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

const betSlipStyling: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  margin: "auto",
};

export default BetSlip;
