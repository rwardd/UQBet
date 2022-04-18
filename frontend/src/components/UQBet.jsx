import React from "react";
import { COLORS } from "../theme";

function UQBet(props) {
  document.body.style = `background: ${COLORS.purple};`;

  return <h1 style={{ color: COLORS.white }}>UQBet</h1>;
}

export default UQBet;
