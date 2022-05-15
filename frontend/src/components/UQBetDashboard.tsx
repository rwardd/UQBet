import React, { FC } from "react";
import { COLORS, BOX } from "../theme";
import GetFixtures from "./viewComponents/GetFixtures";
import { Box, Distribution, Heading } from "grommet";
import GetBets from "./viewComponents/GetBets";
import ActiveBets from "./ActiveBets";

const UQBetDashboard: FC = () => {
  const [userBets, refreshBets] = GetBets();

  return (
    <div style={betSlipStyling}>
      <Heading margin={{ bottom: "medium" }} level='2'>
        Welcome to your dashboard.
      </Heading>
      <Distribution
        values={[
          { value: 50, color: "brand" },
          { value: 20, color: COLORS.lightPurple },
          { value: 30, color: "light-2" },
        ]}
      >
        {(value) => (
          <Box
            pad='medium'
            style={{ borderRadius: BOX.borderRadius }}
            background={value.color}
            fill
          >
            {value.value === 50 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3'>
                  Fixtures
                </Heading>
                <GetFixtures refreshBets={refreshBets} />
              </>
            )}
            {value.value === 20 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3' color='white'>
                  Active Bets
                </Heading>
                <ActiveBets userBets={userBets} refreshBets={refreshBets} />
              </>
            )}
            {value.value === 30 && (
              <>
                <Heading margin={{ bottom: "small" }} level='3'>
                  Completed Bets
                </Heading>
                <ActiveBets userBets={userBets} refreshBets={refreshBets} />
              </>
            )}
          </Box>
        )}
      </Distribution>
    </div>
  );
};

const betSlipStyling: React.CSSProperties = {
  color: COLORS.purple,
  backgroundColor: "white",
  borderRadius: BOX.borderRadius,
  padding: BOX.padding,
  width: "75%",
  minHeight: "650px",
  margin: "auto",
};

export default UQBetDashboard;
