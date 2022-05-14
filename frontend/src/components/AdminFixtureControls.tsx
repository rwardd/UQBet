import React, { FC, useState } from "react";
import { Button } from "grommet";
import { Fixture } from "../types";
import SetResultModal from "./transactionComponents/SetResultModal";

interface FixtureControlProps {
  fixture: Fixture;
}

const FixtureControls: FC<FixtureControlProps> = (props) => {
  const { fixture } = props;
  const [showModal, setShowModal] = useState(false);

  function getLabel(): string {
    console.log(fixture);
    if (fixture.active) {
      return "Set Result";
    }

    if (fixture.invalidated) {
      return "Invalidated";
    }

    if (fixture.payedOut) {
      return "Paid Out";
    }

    return "Error";
  }

  return (
    <>
      <Button
        primary
        label={getLabel()}
        disabled={!fixture.active}
        size='small'
        onClick={() => setShowModal(true)}
      />
      {fixture.active && (
        <SetResultModal setShow={setShowModal} show={showModal} />
      )}
    </>
  );
};

export default FixtureControls;
