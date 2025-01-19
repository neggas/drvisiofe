"use client";

import React, { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { DynamicHtmlTag, RegistrationSteps, RegisterSidebar } from "@/components";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { DASHBOARD_LINK } from "@/utility";

type IBaseTemplateProps = {
  children: ReactNode;
};

const RegistrationTemplate = (props: IBaseTemplateProps) => {
  const router = useRouter();
  const loggedInUser = useSelector(selectLoginResponse);
  const { children } = props;

  // If user is already login then redirect to dashboard
  useEffect(() => {
    if (loggedInUser?.data?.id) {
      router.push(DASHBOARD_LINK);
    }
  }, []);

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[30%] xl:w-[20%] sidebar-main">
        <RegisterSidebar />
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className="w-[100%] lg:w-[70%] xl:w-[80%] bg-white rounded-lg md:shadow-lg sm:px-4 sm:py-2 lg:flex flex-col relative">
        <RegistrationSteps />
        {children}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default RegistrationTemplate;
