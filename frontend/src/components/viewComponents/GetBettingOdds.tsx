import { BigNumber } from "ethers";
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

  function processBettingOdds(home: BigNumber, away: BigNumber): BettingOdds {
    function greatestCommonDivisor(a: BigNumber, b: BigNumber): BigNumber {
      return !b.isZero() ? greatestCommonDivisor(b, a.mod(b)) : a;
    }

    console.log(home.isZero(), away.isZero());
    const gcd =
      home.isZero() || away.isZero()
        ? BigNumber.from(1)
        : greatestCommonDivisor(home, away);
    const _home = home.div(gcd).toNumber();
    const _away = away.div(gcd).toNumber();

    return { homeBets: _home, awayBets: _away };
  }

  async function _getBettingOdds() {
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
    const interval = setInterval(() => _getBettingOdds(), 1000);
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
