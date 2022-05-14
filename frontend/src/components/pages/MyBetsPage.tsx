import React, { FC } from "react";
import { BOX, COLORS } from "../../theme";
import Header from "../Header";

const MyBetsPage: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  return (
    <>
      <Header />
      <div style={myBetsStyle}>Hello</div>
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
