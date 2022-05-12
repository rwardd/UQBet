import React, { FC, useContext, useEffect, useState } from "react";
import { COLORS, BOX } from "../theme";
import { GlobalState } from "../globalState";
import { ethers } from "ethers";

const BetSlip: FC = () => {
  let fixturesList: any[] = [];
  let teamA = "";
  let teamB = "";
  let teamAVal = "";
  let teamBVal = "";
  const { bettingContract } = useContext(GlobalState);
  const [fixtures, setFixture] = useState<any[]>(fixturesList);
  const [dropValue, setDropValue] = useState("0");
  // const componentIsMounted = useRef(true);

  async function _getFixtures() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      //const fixtures = await bettingContract.getFixtures();
      let fixtureList: any[] = [];
      // if (componentIsMounted.current) {
      const fixtureCount = await bettingContract.getFixtureCount();
      for (let i = 0; i < fixtureCount; i++) {
        fixtureList.push(await bettingContract.getFixture(i));
      }
      // }

      return fixtureList;
    }
  }

  useEffect(() => {
    (async () => {
      const fixtureList = await _getFixtures();
      setFixture(fixtureList);
    })();
  });

  if (fixtures.length !== 0) {
    teamA = fixtures[0][1].toString();
    teamB = fixtures[0][2].toString();
  }

  console.log(fixtures);

  const handleDropChange = (event: any) => {
    setDropValue(event.target.value);
    teamA = fixtures[parseInt(event.target.value)][1];
    teamB = fixtures[parseInt(event.target.value)][2];

    //console.log(teamA, teamB)
  };

  async function handleTeamASubmit(event: any) {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      await bettingContract.placeBet(
        parseInt(dropValue),
        teamA,
        ethers.utils.parseEther(teamAVal),
        { value: ethers.utils.parseEther(teamAVal) }
      );
    }
  }

  async function handleTeamBSubmit(event: any) {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      await bettingContract.placeBet(
        parseInt(dropValue),
        teamB,
        ethers.utils.parseEther(teamBVal),
        { value: ethers.utils.parseEther(teamBVal) }
      );
    }
  }

  function handleInputAChange(event: any) {
    teamAVal = event.target.value.toString();
    //console.log(event.target.value)
  }

  function handleInputBChange(event: any) {
    teamBVal = event.target.value.toString();
    //console.log(event.target.value)
  }
  return (
    <div style={betSlipStyling}>
      <h2>BetSlip (this does nothing atm)</h2>
      <div>
        <h3>Select Fixture</h3>
        <select value={dropValue} onChange={handleDropChange}>
          {fixtures.map((fixture) => (
            <option value={fixture[0].toString()}>
              {fixture[0].toString()}
            </option>
          ))}
        </select>
      </div>
      <h3>Team A: {teamA}</h3>
      <h3>Total Amount: x ETH</h3>
      <h5>Enter an amount to bid:</h5>
      <input onChange={handleInputAChange}></input>
      <input type='submit' onClick={handleTeamASubmit} />
      <br />
      <h3>Team B: {teamB}</h3>
      <h3>Total Amount: x ETH</h3>
      <h5>Enter an amount to bid:</h5>
      <input onChange={handleInputBChange}></input>
      <input type='submit' onClick={handleTeamBSubmit} />
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
