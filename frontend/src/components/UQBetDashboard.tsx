import React, { FC, useContext, useState } from "react";
import { COLORS, BOX } from "../theme";
import { GlobalState } from "../globalState";
import { ethers } from "ethers";
import GetFixtures from "./viewComponents/GetFixtures";
import { Fixture } from "../types";
import { Box, Distribution, Heading } from "grommet";
import GetBets from "./viewComponents/GetBets";
import ActiveBets from "./ActiveBets";

const UQBetDashboard: FC = () => {
  const { bettingContract } = useContext(GlobalState);

  const [homeTeamBet, setHomeTeamBet] = useState(0);
  const [awayTeamBet, setAwayTeamBet] = useState(0);
  const [selectedFixture, setSelectedFixture] = useState<null | Fixture>(null);
  const [userBets, refresh] = GetBets();

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
      <Heading margin={{ bottom: "medium" }} level='2'>
        Welcome to your UQBet Dashboard!
      </Heading>
      <Distribution
        values={[
          { value: 50, color: "brand" },
          { value: 20, color: COLORS.lightPurple },
          { value: 30, color: "light-2" },
        ]}
      >
        {(value) => (
          <Box
            pad='medium'
            style={{ borderRadius: BOX.borderRadius }}
            background={value.color}
            fill
          >
            {/* <Text size='large'>Your mum</Text> */}
            {value.value == 50 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3'>
                  Fixtures
                </Heading>
                <GetFixtures
                  getSelectOption
                  setSelectedFixture={setSelectedFixture}
                />
              </>
            )}
            {value.value == 20 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3' color='white'>
                  Active Bets
                </Heading>
                <ActiveBets userBets={userBets} />
              </>
            )}
            {value.value == 30 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3'>
                  Completed Bets
                </Heading>
                <ActiveBets userBets={userBets} />
              </>
            )}
          </Box>
        )}
      </Distribution>
      {/* <h3>Home Team: {selectedFixture && selectedFixture.home}</h3>
      <h3>Total Amount: x ETH</h3>
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
      </form> */}
    </div>
  );
};

const betSlipStyling: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  height: "650px",
  margin: "auto",
};

export default UQBetDashboard;
