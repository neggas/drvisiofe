import React from "react";
import { DynamicHtmlTag } from "@/components";

interface CardProps {
  children: React.ReactNode;
  className: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <>
      <DynamicHtmlTag className={className} type="div">
        {children}
      </DynamicHtmlTag>
    </>
  );
};

export default Card;
