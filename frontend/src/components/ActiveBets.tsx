import { ethers } from "ethers";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "grommet";
import React, { FC } from "react";
import { Bet } from "../types";
import RetrieveFunds from "./transactionComponents/RetrieveFunds";
import GetOdds from "./viewComponents/GetBettingOdds";

interface ActiveBetsProps {
  userBets: Bet[];
  refreshBets: () => void;
}

const ActiveBets: FC<ActiveBetsProps> = (props) => {
  const { userBets, refreshBets } = props;

  const filteredActiveBets = userBets.filter((bet) => !bet.payedOut);

  function tableData() {
    const betData = filteredActiveBets.map((bet: Bet) => {
      const { betId, team, amount, fixId } = bet;

      const formattedAmount = ethers.utils.formatEther(amount);

      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell align='center'>{formattedAmount}</TableCell>
          <TableCell align='center'>
            <GetOdds fixtureId={fixId} />
          </TableCell>
          <TableCell align='center'>
            <RetrieveFunds bet={bet} refreshBets={refreshBets} />
          </TableCell>
        </TableRow>
      );
    });

    return <TableBody>{betData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Team", "Amount", "Odds", "Result"];

    const tableCells = columns.map((columnTitle) => {
      const align = columnTitle === columns[0] ? "left" : "center";

      return (
        <TableCell scope='col' border='bottom' key={columnTitle} align={align}>
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
    <div style={{ marginBottom: "15px" }}>
      {filteredActiveBets.length === 0
        ? "You don't have any actve bets"
        : table()}
    </div>
  );
};

export default ActiveBets;
