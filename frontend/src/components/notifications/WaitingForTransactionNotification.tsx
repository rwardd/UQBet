import React, { FC, useContext } from "react";
import { Notification } from "grommet";
import { GlobalState } from "../../globalState";

const WaitingForTransactionNotification: FC = (props) => {
  const { txBeingSent } = useContext(GlobalState);

  return (
    <>
      {txBeingSent && (
        <Notification
          toast
          message={` Waiting for transaction to be mined`}
          onClose={() => {
            console.log("nothing");
          }}
          status='normal'
        />
      )}
    </>
  );
};

export default WaitingForTransactionNotification;
