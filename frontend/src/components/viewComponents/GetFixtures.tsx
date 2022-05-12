import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { GlobalState } from "../../globalState";

const GetFixtures: FC = () => {
  let fixturesList: any[] = [];
  const { bettingContract } = useContext(GlobalState);
  const [fixtures, setFixture] = useState<any[]>(fixturesList);
  const [bets, setBets] = useState<any[]>(fixturesList);
  const componentIsMounted = useRef(true);

  async function _getFixtures() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      //const fixtures = await bettingContract.getFixtures();
      let fixtureList: any[] = [];
      if (componentIsMounted.current) {
        const fixtureCount = await bettingContract.getFixtureCount();
        for (let i = 0; i < fixtureCount; i++) {
          fixtureList.push(await bettingContract.getFixture(i));
        }
      }

      return fixtureList;
    }
  }

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

  useEffect(() => {
    (async () => {
      const fixtureList = await _getFixtures();
      const betList = await _getBets();
      setFixture(fixtureList);
      setBets(betList);
    })();
  });

  function populateTableData(fixtureList: any[]) {
    setFixture(fixtureList);
  }

  console.log(fixtures);

  function renderTableData() {
    return fixtures.map((fixture) => {
      return (
        <tr key={fixture[0].toString()}>
          <td>{fixture[0].toString()}</td>
          <td>{fixture[1].toString()}</td>
          <td>{fixture[2].toString()}</td>
          <td>{fixture[3].toString()}</td>
        </tr>
      );
    });
  }

  function renderTableHeader() {
    const header = ["Fixture ID", "Home", "Away", "Date"];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
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

  renderBetData();

  return (
    <div>
      <h3>Get fixtures</h3>
      <table style={fixtureStyle}>
        <tbody style={innerFixtureStyle}>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
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

export default GetFixtures;
