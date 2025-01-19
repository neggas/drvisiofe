"use client";
import { DynamicHtmlTag, HeadingTag } from "@/components";
import React from "react";

const ConnectionTest = () => {
  return (
    <DynamicHtmlTag type="div" className="h-full">
      <HeadingTag type="h2" className="text-[4vw] font-semibold  w-full flex align-middle items-center justify-center h-full text-primary">
        Connection Test
      </HeadingTag>
    </DynamicHtmlTag>
  );
};

export default ConnectionTest;
