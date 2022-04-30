import React, { FC, useContext } from "react";
import { GlobalState } from "../globalState";
import { COLORS, FONT_SIZE } from "../theme";
import { Loading } from "./Loading";

const Header: FC = () => {
  const { selectedAddress } = useContext(GlobalState);
  const logo = (
    <h1
      style={{
        fontSize: FONT_SIZE.title,
      }}
    >
      UQBet
    </h1>
  );

  const accountDisplay = () => {

      return (
        <div style={accountDisplayStyling}>
          <h5>Account: {`${selectedAddress}`} </h5>
        </div>
      );

  };

  return (
    <div style={headerStyling}>
      {logo}
      {accountDisplay()}
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
  marginBottom: "20px",
};

const accountDisplayStyling: React.CSSProperties = {
  marginRight: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  alignSelf: "flex-end",
};

export default Header;
