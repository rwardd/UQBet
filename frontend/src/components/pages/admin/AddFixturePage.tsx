import React, { FC } from "react";
import { BOX, COLORS } from "../../../theme";
import Header from "../../Header";
import AddFixture from "../../transactionComponents/AddFixture";
import BackButton from "../../utils/BackButton";

const AddFixturePage: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  return (
    <>
      <Header admin />
      <div style={addFixturePageStyle}>
        <div style={headerStyle}>
          <BackButton
            style={{
              position: "absolute",
              justifySelf: "center",
            }}
          />
          <h2
            style={{
              textAlign: "center",
              justifySelf: "center",
              flexGrow: 1,
            }}
          >
            Add fixture
          </h2>
        </div>
        <AddFixture />
      </div>
    </>
  );
};

const addFixturePageStyle: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  margin: "auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

export default AddFixturePage;
