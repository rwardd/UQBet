import { Menu } from "grommet";
import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme";

export const UQBetMenu = () => {
  let navigate = useNavigate();
  const items = [
    {
      label: "Place Bets",
      onClick: () => {
        navigate("/");
      },
    },
    {
      label: "My Bets",
      onClick: () => {
        navigate("/myBets");
      },
    },
  ];
  return <Menu label={"Menu"} color={COLORS.white} items={items} />;
};
