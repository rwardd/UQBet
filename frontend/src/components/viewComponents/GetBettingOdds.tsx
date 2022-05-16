import { BigNumber, ethers } from "ethers";
import { Spinner } from "grommet";
import React, { useContext, useEffect, useState, FC } from "react";
import { GlobalState } from "../../globalState";
import { BettingOdds } from "../../types";

interface GetOddsProps {
  fixtureId: BigNumber;
}
const GetOdds: FC<GetOddsProps> = (props) => {
  const { fixtureId } = props;
  const { bettingContract } = useContext(GlobalState);
  const [odds, setOdds] = useState<undefined | BettingOdds>(undefined);

  /**
   * This funciton will try to reduce the odds down to the simplest fraction.
   *
   * This calculation get tricky with decimals so we have floored the value
   * of the bets first. This will mean that the odds are always under estimated.
   */
  function processBettingOdds(home: BigNumber, away: BigNumber): BettingOdds {
    function greatestCommonDivisor(a: number, b: number): number {
      return b !== 0 ? greatestCommonDivisor(b, a % b) : a;
    }

    const _home = Math.floor(Number(ethers.utils.formatEther(home)));
    const _away = Math.floor(Number(ethers.utils.formatEther(away)));

    const gcd =
      _home === 0 || _away === 0 ? 1 : greatestCommonDivisor(_home, _away);

    return { homeBets: _home / gcd, awayBets: _away / gcd };
  }

  async function _getBettingTotals() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      const bettingOdds = await bettingContract.getBettingOdds(fixtureId);

      // Reduce ratio
      const formattedOdds = processBettingOdds(
        bettingOdds.homeBets,
        bettingOdds.awayBets
      );

      setOdds(formattedOdds);
    }
  }

  useEffect(() => {
    // Refresh every second
    const interval = setInterval(() => _getBettingTotals(), 1000);
    return () => {
      clearInterval(interval);
    };
  });

  if (!odds) {
    return <Spinner />;
  } else {
    return <div>{`${odds.homeBets}:${odds.awayBets}`}</div>;
  }
};

export default GetOdds;
