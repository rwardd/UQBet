import React, { useContext, useEffect, useState, useRef } from "react";
import { GlobalState } from "../../globalState";
import { Bet } from "../../types";

type BetsHook = [bets: Bet[], refresh: () => void];

// Returns a hook that returns bets and refresh function
const GetBets = (): BetsHook => {
  const { bettingContract } = useContext(GlobalState);
  const [userBets, setUserBets] = useState<any[]>([]);
  const hasFetchedData = useRef(false);

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

  useEffect(() => {
    if (!hasFetchedData.current) {
      _getUserBets();
      hasFetchedData.current = true;
    }
  });

  return [userBets, _getUserBets];
};

export default GetBets;
