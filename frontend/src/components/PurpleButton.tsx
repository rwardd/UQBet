import React, { FC } from "react";
import { BOX, COLORS, FONT_SIZE } from "../theme";

interface ButtonProp {
  children?: string;
  onClick?: () => any;
}

const PurpleButton: FC<ButtonProp> = (props) => {
  const { children, onClick } = props;

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

const buttonStyle: React.CSSProperties = {
  color: "white",
  backgroundColor: COLORS.purple,
  borderRadius: BOX.borderRadius,
  border: 0,
  height: "45px",
  width: "150px",
};
export default PurpleButton;
