import { BigNumber } from "ethers";

export type Fixture = {
  fixId: BigNumber;
  home: string;
  away: string;
  date: string;
  active: boolean;
  payedOut: boolean;
  invalidated: boolean;
  bets: any[];
};
