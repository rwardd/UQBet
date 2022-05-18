import { useCallback, useContext, useEffect, useState } from "react";
import { REFRESH_RATE } from "../../constants";
import { GlobalState } from "../../globalState";
import { Bet } from "../../types";

type BetsHook = [bets: Bet[] | null, refresh: () => void];

// Returns a hook that returns bets and refresh function
const GetBets = (): BetsHook => {
  const { bettingContract } = useContext(GlobalState);
  const [userBets, setUserBets] = useState<any[] | null>(null);

  const _getUserBets = useCallback(async () => {
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
  }, [bettingContract]);

  useEffect(() => {
    // Refresh every second
    _getUserBets();
    const interval = setInterval(() => _getUserBets(), REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  }, [_getUserBets]);

  return [userBets, _getUserBets];
};

export default GetBets;
