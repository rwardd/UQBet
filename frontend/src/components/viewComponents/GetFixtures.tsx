import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { GlobalState } from "../../globalState";
import { Fixture } from "../../types";

interface GetFixturesProps {
  getSelectOption?: boolean;
  setSelectedFixture?: React.Dispatch<React.SetStateAction<any>>;
}

const GetFixtures: FC<GetFixturesProps> = (props) => {
  const { getSelectOption, setSelectedFixture } = props;
  const { bettingContract } = useContext(GlobalState);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    async function _getFixtures() {
      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      } else {
        let fixtureList = [];
        const fixtureCount = await bettingContract.getFixtureCount();

        for (let i = 0; i < fixtureCount; i++) {
          fixtureList.push(await bettingContract.getFixture(i));
        }

        setFixtures(fixtureList);
      }
    }

    if (!hasFetchedData.current) {
      // Fetch Data
      _getFixtures();
      hasFetchedData.current = true;
    }
  });

  function tableData() {
    const fixtureData = fixtures.map((fixture: Fixture) => {
      const { fixId, home, away, date } = fixture;
      return (
        <tr key={fixId.toString()}>
          <td>{fixId.toString()}</td>
          <td>{home}</td>
          <td>{away}</td>
          <td>{date}</td>
          {getSelectOption && setSelectedFixture && (
            <td>
              <button onClick={() => setSelectedFixture(fixture)}>
                Select
              </button>
            </td>
          )}
        </tr>
      );
    });

    return <tbody style={innerFixtureStyle}>{fixtureData}</tbody>;
  }

  function tableHeader() {
    let columns = ["Fixture ID", "Home", "Away", "Date"];
    if (getSelectOption) {
      columns.push("Select");
    }

    const headers = columns.map((columnTitle) => {
      return <th key={columnTitle}>{columnTitle.toUpperCase()}</th>;
    });

    return (
      <thead>
        <tr>{headers}</tr>
      </thead>
    );
  }

  return (
    <div>
      <h3>Fixtures</h3>
      <table style={fixtureStyle}>
        {tableHeader()}
        {tableData()}
      </table>
    </div>
  );
};;

const fixtureStyle: React.CSSProperties = {
  border: "solid black",
};
const innerFixtureStyle: React.CSSProperties = {
  border: "solid black",
};

export default GetFixtures;
