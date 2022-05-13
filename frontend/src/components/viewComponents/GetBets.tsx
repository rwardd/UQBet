import React, { FC, useContext, useState } from "react";
import { GlobalState } from "../../globalState";

const GetBets: FC = () => {
  const [bets, setBets] = useState(null);
  const { bettingContract } = useContext(GlobalState);

  async function _getBets() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      let betList: any[] = [];
      const betCount = await bettingContract.getBetCounter();

      console.log(betCount);
      for (let i = 0; i < betCount; i++) {
        betList.push(await bettingContract.getBet(i));
      }
      return betList;
    }
  }

  function renderBetHeader() {
    const header = ["Bet ID", "Amount", "FixtureID", "Team", "PunterID"];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  function renderBetData() {
    console.log(bets);
  }

  return (
    <div>
      <h3>Get Bets</h3>
      <table style={fixtureStyle}>
        <tbody style={innerFixtureStyle}>
          <tr>{renderBetHeader()}</tr>
        </tbody>
      </table>
    </div>
  );
};

const fixtureStyle: React.CSSProperties = {
  border: "solid black",
};
const innerFixtureStyle: React.CSSProperties = {
  border: "solid black",
};

export default GetBets;
