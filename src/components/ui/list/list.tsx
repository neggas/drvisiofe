import React, { ReactNode } from "react";

interface ListTypeProps {
  className?: string;
  children: ReactNode;
  tabIndex?: any;
  listType?: "ul" | "ol"; // Define list types
}

export const CustomList = (props: ListTypeProps) => {
  const { className, children, tabIndex, listType = "ul" } = props;

  const ListTag = listType;

  return (
    <ListTag className={className ?? ""} tabIndex={tabIndex}>
      {children}
    </ListTag>
  );
};

export default CustomList;
