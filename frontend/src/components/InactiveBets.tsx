import { ethers } from "ethers";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "grommet";
import { Checkmark, Clear, Close } from "grommet-icons";
import React, { FC } from "react";
import { Bet } from "../types";

interface InactiveBetsProps {
  userBets: Bet[];
}

const InactiveBets: FC<InactiveBetsProps> = (props) => {
  const { userBets } = props;

  const inactiveBets = userBets.filter((bet) => bet.payedOut);
  console.log(inactiveBets);
  function betStatus(won: boolean, invalidated: boolean) {
    if (won && !invalidated) {
      return <Checkmark color='status-ok' />;
    } else if (!won) {
      return <Close color='status-error' />;
    } else {
      return <Clear color='status-warning' />;
    }
  }

  function tableData() {
    const betData = inactiveBets.map((bet: Bet) => {
      const { betId, team, amount, won, invalidated } = bet;

      const formattedAmount = ethers.utils.formatEther(amount);

      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell>{formattedAmount}</TableCell>
          <TableCell style={{ alignItems: "center" }}>
            {betStatus(won, invalidated)}
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
      {inactiveBets.length === 0
        ? "You don't have any completed bets"
        : table()}
    </div>
  );
};

export default InactiveBets;
