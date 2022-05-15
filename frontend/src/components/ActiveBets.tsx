import { ethers } from "ethers";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "grommet";
import React, { FC } from "react";
import { Bet } from "../types";

interface ActiveBetsProps {
  userBets: Bet[];
}

const ActiveBets: FC<ActiveBetsProps> = (props) => {
  const { userBets } = props;

  function tableData() {
    const betData = userBets.map((bet: Bet) => {
      const { betId, team, amount, won } = bet;
      const formattedAmount = ethers.utils.formatEther(amount);
      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell>{formattedAmount}</TableCell>
          <TableCell>{won.toString()}</TableCell>
        </TableRow>
      );
    });

    return <TableBody>{betData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Team", "Amount", "Won"];

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
    <div style={{ marginBottom: "15px" }}>
      {userBets.length === 0 ? "You don't have any actve bets" : table()}
    </div>
  );
};

export default ActiveBets;
