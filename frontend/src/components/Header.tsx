import React, { useContext, FC, ReactNode } from "react";
import { COLORS, FONT_SIZE } from "../theme";
import { GlobalState } from "../globalState";
import { ConnectWallet } from "./ConnectWallet";
import { globalAgent } from "http";
import { HARDHAT_NETWORK_ID } from "./UQBet";

const Header: FC = () => {
  const globalState = useContext(GlobalState);

  return (
    <div style={headerStyling}>
      <h1
        style={{
          color: COLORS.white,
          fontSize: FONT_SIZE.title,
          padding: "15px",
        }}
      >
        UQBet
      </h1>
    </div>
  );
};

const headerStyling: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
};

export default Header;
