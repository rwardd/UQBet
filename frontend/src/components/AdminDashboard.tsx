import { Button } from "grommet";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { BOX, COLORS } from "../theme";
import GetFixtures from "./viewComponents/GetFixtures";

const AdminDashboard: FC = () => {
  return (
    <div style={adminDashboardStyle}>
      <div style={dashboardHeaderStyle}>
        <h2>Welcome to the Admin Dashboard!</h2>
        <Link to='/admin/AddFixture'>
          <Button primary label='Add Fixture' />
        </Link>
      </div>
      <br />
      <GetFixtures admin />
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
