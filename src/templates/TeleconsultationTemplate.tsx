"use client";
import { DynamicHtmlTag, SideBar, Steps } from "@/components";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { getLocalStorageData } from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useSelector } from "react-redux";
type IBaseTemplateProps = {
  children: ReactNode;
};

const TeleconsultationTemplate = (props: IBaseTemplateProps) => {
  const pathName = usePathname() || "";
  const currentSplitURL = pathName.split("/");
  const { children } = props;
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[27%] xl:w-[20%] sidebar-main">
        <SideBar
          selectedSpecialty={""}
          setSeleectedSpecialty={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          localDate={""}
          setLocalDate={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          setFirstName={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          setLastName={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          firstName={""}
          lastName={""}
          setFilter={function (value: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`w-[100%] lg:w-[73%] xl:w-[80%] bg-white rounded-lg md:shadow-lg sm:px-4 sm:py-2 lg:flex flex-col relative h-full ${loggedInUser && isTeleconsultationBooked ? "process-main-login" : "process-main"}`}>
        <Steps />
        {currentSplitURL[1] === "consultationprocess" || currentSplitURL[1] === "consultationprocess" ? "" : <Steps />}
        {children}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default TeleconsultationTemplate;
