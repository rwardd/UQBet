import React, { FC } from "react";
import { BOX, COLORS } from "../theme";
import AddFixture from "./transactionComponents/AddFixture";
import GetFixtures from "./viewComponents/GetFixtures";

const AdminDashboard: FC = () => {
  return (
    <div style={adminDashboardStyle}>
      <h2>You are the owner of this contract</h2>
      <br />
      <AddFixture />
      <GetFixtures />
      <h3>Set Winner (Transaction)</h3>
      <h3>Distribute Winnings (Transaction)</h3>
    </div>
  );
};

const adminDashboardStyle: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  margin: "auto",
};

export default AdminDashboard;
