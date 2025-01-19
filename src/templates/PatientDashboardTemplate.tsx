"use client";
import React, { ReactNode } from "react";
import { DynamicHtmlTag, PatientDashboardSidebar } from "@/components";
import { usePathname } from "next/navigation";

type IBaseTemplateProps = {
  children: ReactNode;
};

const PatientDashboardTemplate = (props: IBaseTemplateProps) => {
  const pathName = usePathname() || "";
  const currentSplitURL = pathName.split("/");
  const { children } = props;

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 h-full dashboard-main">
      <DynamicHtmlTag type="div" className="w-full lg:w-[20%]">
        <PatientDashboardSidebar />
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full lg:w-[80%] bg-transparent overflow-hidden h-full">
        {children}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default PatientDashboardTemplate;
