import React, { FC } from "react";
import { BOX, FONT_SIZE } from "../../theme";

interface FormFieldProps {
  fieldName: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const FormField: FC<FormFieldProps> = (props) => {
  const { fieldName, type, value, onChange } = props;

  return (
    <label style={formFieldStyle}>
      <h4>{fieldName}</h4>
      <input
        style={formFieldInputStyle}
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

const formFieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "15px",
};

const formFieldInputStyle: React.CSSProperties = {
  borderRadius: BOX.borderRadius,
  border: "1px solid #ccc",
  fontSize: FONT_SIZE.four,
  width: "40%",
  padding: "5px",
  paddingLeft: "10px",
};

export default FormField;
