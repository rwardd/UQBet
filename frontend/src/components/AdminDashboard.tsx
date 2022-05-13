import React, { FC } from "react";
import { Link } from "react-router-dom";
import { BOX, COLORS } from "../theme";
import PurpleButton from "./PurpleButton";
import AddFixture from "./transactionComponents/AddFixture";
import GetBets from "./viewComponents/GetBets";
import GetFixtures from "./viewComponents/GetFixtures";

const AdminDashboard: FC = () => {
  return (
    <div style={adminDashboardStyle}>
      <div style={dashboardHeaderStyle}>
        <h2>You are the owner of this contract</h2>
        <Link to='/admin/AddFixture'>
          <PurpleButton>Add Fixture</PurpleButton>
        </Link>
      </div>
      <br />
      <GetFixtures />
      <GetBets />
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

const dashboardHeaderStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export default AdminDashboard;
