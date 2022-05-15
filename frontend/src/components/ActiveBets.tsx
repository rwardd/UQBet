import { ethers } from "ethers";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "grommet";
import React, { FC } from "react";
import { Bet } from "../types";
import RetrieveFunds from "./transactionComponents/RetrieveFunds";

interface ActiveBetsProps {
  userBets: Bet[];
  refreshBets: () => void;
}

const ActiveBets: FC<ActiveBetsProps> = (props) => {
  const { userBets, refreshBets } = props;

  const filteredActiveBets = userBets.filter((bet) => !bet.payedOut);

  function tableData() {
    const betData = filteredActiveBets.map((bet: Bet) => {
      const { betId, team, amount } = bet;

      const formattedAmount = ethers.utils.formatEther(amount);

      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell>{formattedAmount}</TableCell>
          <TableCell>
            <RetrieveFunds bet={bet} refreshBets={refreshBets} />
          </TableCell>
        </TableRow>
      );
    });

    return <TableBody>{betData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Team", "Amount", "Result"];

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
      {filteredActiveBets.length === 0
        ? "You don't have any actve bets"
        : table()}
    </div>
  );
};

export default ActiveBets;
