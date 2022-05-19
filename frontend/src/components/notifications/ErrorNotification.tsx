import React, { FC, useContext } from "react";
import { Notification } from "grommet";
import { GlobalState } from "../../globalState";

const ErrorNotification: FC = () => {
  const { transactionError, setTransactionError } = useContext(GlobalState);

  return (
    <>
      {transactionError && (
        <div style={{ overflow: "scroll" }}>
          <Notification
            toast
            title='Error'
            message={`${transactionError?.message.slice(0, 120)}...`}
            onClose={() => {
              setTransactionError(undefined);
            }}
            status='warning'
          />
        </div>
      )}
    </>
  );
};

export default ErrorNotification;
