import { Box, Button, Layer } from "grommet";
import React, { FC } from "react";

interface SetResultModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetResultModal: FC<SetResultModalProps> = (props) => {
  const { show, setShow } = props;

  return (
    <Box>
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Button label='close' onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

export default SetResultModal;
