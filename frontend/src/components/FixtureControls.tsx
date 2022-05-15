import React, { FC, useState } from "react";
import { Button } from "grommet";
import { Fixture } from "../types";
import PlaceBetModal from "./PlaceBetModal";

interface FixtureControlProps {
  fixture: Fixture;
}

const FixtureControls: FC<FixtureControlProps> = (props) => {
  const { fixture } = props;
  const [showModal, setShowModal] = useState(false);

  function getLabel(): string {
    if (fixture.active) {
      return "Place bet";
    }

    if (!fixture.active) {
      return "Finished";
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
        <PlaceBetModal
          setShow={setShowModal}
          show={showModal}
          fixture={fixture}
        />
      )}
    </>
  );
};

export default FixtureControls;
