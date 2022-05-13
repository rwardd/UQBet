import React, { FC, useContext, useState } from "react";
import { COLORS, BOX } from "../theme";
import { GlobalState } from "../globalState";
import { ethers } from "ethers";
import GetFixtures from "./viewComponents/GetFixtures";
import { Fixture } from "../types";
import GetBets from "./viewComponents/GetBets";
import { Heading } from "grommet";

const BetSlip: FC = () => {
  const { bettingContract } = useContext(GlobalState);

  const [homeTeamBet, setHomeTeamBet] = useState(0);
  const [awayTeamBet, setAwayTeamBet] = useState(0);
  const [selectedFixture, setSelectedFixture] = useState<null | Fixture>(null);

  async function submitHomeTeamBet(event: any) {
    event.preventDefault();
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      await bettingContract.placeBet(
        selectedFixture?.fixId,
        selectedFixture?.home,
        ethers.utils.parseEther(homeTeamBet.toString()),
        { value: ethers.utils.parseEther(homeTeamBet.toString()) }
      );
    }
  }

  async function submitAwayTeamBet(event: any) {
    event.preventDefault();
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      await bettingContract.placeBet(
        selectedFixture?.fixId,
        selectedFixture?.away,
        ethers.utils.parseEther(awayTeamBet.toString()),
        { value: ethers.utils.parseEther(awayTeamBet.toString()) }
      );
    }
  }

  return (
    <div style={betSlipStyling}>
      <Heading
        margin={{ bottom: "small" }}
        alignSelf='center'
        textAlign='center'
        level='1'
      >
        Place a bet
      </Heading>
      <GetFixtures getSelectOption setSelectedFixture={setSelectedFixture} />
      <h3>Home Team: {selectedFixture && selectedFixture.home}</h3>
      {/* <h3>Total Amount: x ETH</h3> */}
      <form onSubmit={submitHomeTeamBet}>
        <label>
          Enter an amount to bid:
          <input
            type='number'
            value={homeTeamBet}
            onChange={(e) => setHomeTeamBet(parseInt(e.target.value))}
          />
          <button>Submit</button>
        </label>
      </form>
      <br />
      <h3>Away Team: {selectedFixture && selectedFixture.away}</h3>
      <form onSubmit={submitAwayTeamBet}>
        <label>
          Enter an amount to bid:
          <input
            type='number'
            value={awayTeamBet}
            onChange={(e) => setAwayTeamBet(parseInt(e.target.value))}
          />
          <button>Submit</button>
        </label>
      </form>
      <GetBets />
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
