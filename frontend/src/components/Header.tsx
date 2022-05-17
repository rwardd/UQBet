import { Button } from "grommet";
import { Header as GrommetHeader } from "grommet";
import React, { FC, useContext } from "react";
import { GlobalState } from "../globalState";
import { COLORS, FONT_SIZE } from "../theme";
import { Loading } from "./utils/Loading";

const Header: FC = () => {
  const { balance, selectedAddress } = useContext(GlobalState);

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
    if (!balance) {
      return <Loading />;
    } else {
      return (
        <div style={accountDisplayStyling}>
          <h3>Balance: {`${balance} ETH`}</h3>
          <h5>Account: {`${selectedAddress}`} </h5>
        </div>
      );
    }
  };

  return (
    <div style={headerStyling}>
      <GrommetHeader background='brand'>
        <Button icon={logo} hoverIndicator />
      </GrommetHeader>
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
  marginBottom: "15px",
};

const accountDisplayStyling: React.CSSProperties = {
  marginRight: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

export default Header;
