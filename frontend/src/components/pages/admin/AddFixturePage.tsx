import React, { FC } from "react";
import { BOX, COLORS } from "../../../theme";
import Header from "../../Header";
import AddFixture from "../../transactionComponents/AddFixture";

const AddFixturePage: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  return (
    <>
      <Header admin />
      <div style={adminDashboardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Add fixture
        </h2>
        <AddFixture />
      </div>
    </>
  );
};

const adminDashboardStyle: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "60%",
  margin: "auto",
};



export default AddFixturePage;
