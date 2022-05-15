import React, { FC } from "react";
import { BOX, COLORS } from "../../theme";
import Header from "../Header";
import GetBets from "../viewComponents/GetBets";

const MyBetsPage: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  return (
    <>
      <Header />
      <div style={myBetsStyle}>
        <h1 style={{ textAlign: "center", fontSize: "50px" }}>My Bets</h1>
      </div>
    </>
  );
};

const myBetsStyle: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  margin: "auto",
};

export default MyBetsPage;
