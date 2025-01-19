import React, { ReactNode } from "react";

interface CustomListItemsProps {
  className?: string;
  children: ReactNode;
  onClick?: any;
}

export const CustomListItems = (props: CustomListItemsProps) => {
  const { children, className, onClick } = props;
  return (
    <li className={className ?? ""} onClick={onClick}>
      {children}{" "}
    </li>
  );
};
export default CustomListItems;
