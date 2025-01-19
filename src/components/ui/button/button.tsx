import React from "react";

interface CustomButtonProps {
  className?: string;
  href?: string;
  onClick?: any;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
  style?: React.CSSProperties;
  as?: string;
  id?: string;
  [dataAttr: string]: any;
}

export const CustomButton = (props: CustomButtonProps) => {
  const { className, href, onClick, style, children, disabled, type, title, id, ...dataAttributes } = props;
  const buttonProps = {
    className,
    onClick,
    disabled,
    type: type ?? "button",
    title,
    style,
    id: id ?? "",
    ...dataAttributes,
  };

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return <button {...buttonProps}>{children}</button>;
};

export default CustomButton;
