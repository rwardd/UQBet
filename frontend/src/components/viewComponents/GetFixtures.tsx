import {
  Button,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { GlobalState } from "../../globalState";
import { Fixture } from "../../types";
import AdminFixtureControls from "../AdminFixtureControls";
import FixtureControls from "../FixtureControls";

interface GetFixturesProps {
  getSelectOption?: boolean;
  admin?: boolean;
  setSelectedFixture?: React.Dispatch<React.SetStateAction<any>>;
}

const GetFixtures: FC<GetFixturesProps> = (props) => {
  const { getSelectOption, setSelectedFixture, admin } = props;
  const { bettingContract } = useContext(GlobalState);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const hasFetchedData = useRef(false);

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

  useEffect(() => {
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
        <TableRow key={fixId.toString()}>
          <TableCell>{home}</TableCell>
          <TableCell>{away}</TableCell>
          <TableCell>{date}</TableCell>
          {!admin && (
            <TableCell>
              <FixtureControls
                fixture={fixture}
                refreshFixtureData={_getFixtures}
              />
            </TableCell>
          )}
          {admin && (
            <TableCell>
              <AdminFixtureControls
                fixture={fixture}
                refreshFixtureData={_getFixtures}
              />
            </TableCell>
          )}
        </TableRow>
      );
    });

    return <TableBody>{fixtureData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Home", "Away", "Date"];
    if (getSelectOption) {
      columns.push("Select");
    }
    if (admin) {
      columns.push("Controls");
    }

    const tableCells = columns.map((columnTitle) => {
      return (
        <TableCell scope='col' border='bottom' key={columnTitle}>
          {columnTitle}
        </TableCell>
      );
    });

    return (
      <TableHeader>
        <TableRow>{tableCells}</TableRow>
      </TableHeader>
    );
  }

  function table() {
    return (
      <Table>
        {tableHeader()}
        {tableData()}
      </Table>
    );
  }

  return (
    <div>
      {fixtures.length === 0 ? "There are currently no fixtures" : table()}
    </div>
  );
};

export default GetFixtures;
