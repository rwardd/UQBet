import React, { FC, useContext } from "react";
import { GlobalState } from "../globalState";
import { COLORS, FONT_SIZE } from "../theme";
import { Loading } from "./Loading";

const Header: FC = () => {
  const { tokenData, balance, selectedAddress } = useContext(GlobalState);
  console.log(useContext(GlobalState));

  const logo = (
    <h1
      style={{
        fontSize: FONT_SIZE.title,
      }}
    >
      UQBet
    </h1>
  );

  const balanceDisplay = () => {
    if (!tokenData || !balance) {
      return <Loading />;
    } else {
      return (
        <h3 style={{ marginRight: "75px" }}>Balance: {`${balance}`} tokens</h3>
      );
    }
  };

  return (
    <div style={headerStyling}>
      {logo}
      {balanceDisplay()}
    </div>
  );
};

const headerStyling: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  color: COLORS.white,
  padding: "15px",
};

export default Header;
