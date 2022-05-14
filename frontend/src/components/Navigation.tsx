import { Menu } from "grommet";
import React from "react";
import { useNavigate } from "react-router-dom";

export const UQBetNavigation = () => {
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
  return <Menu label={"Menu"} items={items} />;
};
