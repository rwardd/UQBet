import React, { FC } from "react";
import { BOX, COLORS, FONT_SIZE } from "../theme";

interface ButtonProp {
  children?: string;
  onClick?: () => any;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const PurpleButton: FC<ButtonProp> = (props) => {
  const { children, onClick, disabled, style } = props;

  return (
    <button
      style={{ ...buttonStyle, ...style }}
      onClick={onClick}
      disabled={disabled}
    >
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
