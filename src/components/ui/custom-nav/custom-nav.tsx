"use client";
import React, { ReactNode } from "react";
import { DynamicHtmlTag } from "@/components";

interface CustomNavProps {
  className?: string;
  children: ReactNode;
  defaultActiveKey?: string;
}

export const CustomNav = (props: CustomNavProps) => {
  const { children, className, defaultActiveKey } = props;
  return (
    <DynamicHtmlTag type="nav" className={`flex ${className ?? ""}`}>
      {children}
    </DynamicHtmlTag>
  );
};

export default CustomNav;
