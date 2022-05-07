import React, { FC, useContext, useState } from "react";
import { findConfigFile } from "typescript";
import { GlobalState } from "../../globalState";

const GetFixtures: FC = () => {
  const { bettingContract } = useContext(GlobalState);
  const [fixture, setFixture] = useState(null);

  async function _getFixtures() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      const fixtures = await bettingContract.getFixtures();
      const f = await bettingContract.getFixture(fixtures[0]);
      console.log(fixtures);
      console.log(f);
      //   setFixture(f);
    }
  }

  _getFixtures();

  return (
    <>
      <h3>Get fixtures</h3>
    </>
  );
};

export default GetFixtures;
