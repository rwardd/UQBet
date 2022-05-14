import { Box, Text, Layer, NameValueList, NameValuePair } from "grommet";
import React, { FC } from "react";
import { BOX, COLORS } from "../../theme";
import { Fixture } from "../../types";
import SetInvalidated from "../transactionComponents/SetInvalidated";
import SetWinner from "../transactionComponents/SetWinner";

interface ConfirmResultModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  fixture: Fixture;
  refreshFixtureData: () => void;
}

const ConfirmResultModal: FC<ConfirmResultModalProps> = (props) => {
  const { show, setShow, fixture, refreshFixtureData } = props;
  const { fixId, home, away, date } = fixture;

  function fixtureDetails() {
    return (
      <Box width='medium' margin={{ bottom: "medium" }} justify='center'>
        <NameValueList>
          <NameValuePair name='Home team'>
            <Text color='text-strong'>{home}</Text>
          </NameValuePair>
          <NameValuePair name='Away team'>
            <Text color='text-strong'>{away}</Text>
          </NameValuePair>
          <NameValuePair name='Date'>
            <Text color='text-strong'>{date}</Text>
          </NameValuePair>
        </NameValueList>
      </Box>
    );
  }

  return (
    <Box>
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          style={modalStyling}
          position='top'
          margin='none'
          animation='fadeIn'
        >
          <h3 style={titleStyling}>{`Confirm result`}</h3>
          {fixtureDetails()}
          <SetWinner
            team={home}
            fixtureID={fixId}
            setShow={setShow}
            refreshFixtureData={refreshFixtureData}
          />
          <SetWinner
            team={away}
            fixtureID={fixId}
            setShow={setShow}
            refreshFixtureData={refreshFixtureData}
          />
          <SetInvalidated
            fixtureID={fixId}
            setShow={setShow}
            refreshFixtureData={refreshFixtureData}
          />
        </Layer>
      )}
    </Box>
  );
};

const titleStyling: React.CSSProperties = {
  color: COLORS.purple,
  marginBottom: "20px",
};

const modalStyling: React.CSSProperties = {
  padding: BOX.padding,
  borderRadius: BOX.borderRadius,
  marginTop: "10%",
};

export default ConfirmResultModal;
