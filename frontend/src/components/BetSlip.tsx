import React, { FC, useContext } from "react";
import { COLORS, BOX } from "../theme";
import { GlobalState } from "../globalState";
import { ethers } from "ethers";


const BetSlip: FC = () => {
  const {
    bettingContract,
  } = useContext(GlobalState);

  function testLog() {
    console.log("Hello")
    console.log(bettingContract);
    if (bettingContract !== undefined) {
      bettingContract.depositToA(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
    }
  }

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
      <input type='submit' onClick={testLog} />
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
