import { ethers } from "ethers";
import {
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { GlobalState } from "../../globalState";
import { Bet } from "../../types";

const GetBets: FC = (props) => {
  const { bettingContract } = useContext(GlobalState);
  const [userBets, setUserBets] = useState<any[]>([]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    async function _getUserBets() {
      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      } else {
        let userBets = [];
        const userBetIds = await bettingContract.getUserBets();

        for (let i = 0; i < userBetIds.length; i++) {
          userBets.push(await bettingContract.getBet(userBetIds[i]));
        }

        setUserBets(userBets);
      }
    }

    if (!hasFetchedData.current) {
      // Fetch Data
      _getUserBets();
      hasFetchedData.current = true;
    }
  });

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
      <Heading margin={{ bottom: "small" }} level='2'>
        Bets
      </Heading>
      {userBets.length === 0 ? "You haven't placed any bets" : table()}
    </div>
  );
};

export default GetBets;
