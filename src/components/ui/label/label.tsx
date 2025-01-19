import React from "react";

interface CustomLabelProps {
  className: string;
  htmlFor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLLabelElement>) => void;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { className, htmlFor, children, style, onClick } = props;
  return (
    <label className={`${className} relative`} htmlFor={htmlFor} style={style} onClick={onClick}>
      {children}
    </label>
  );
};

export default CustomLabel;
