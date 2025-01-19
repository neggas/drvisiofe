"use client";
import { CustomButton, CustomImage, CustomLink, DocumentSteps, DynamicHtmlTag, HeadingTag } from "@/components";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { getLocalStorageData } from "@/utility";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
type IBaseTemplateProps = {
  children?: ReactNode;
};

const DocumentTemplate = (props: IBaseTemplateProps) => {
  // const router = useRouter(); // To handle redirection
  const pathName = usePathname() || "";
  const currentSplitURL = pathName.split("/");
  const { children } = props;
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);
  const [isRepotsOpen, setisRepotsOpen] = useState(true);
  const reportsClose = () => {
    setisRepotsOpen(true);
  };
  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };
  return (
    <>
      <DynamicHtmlTag type="div" className="items-center gap-x-2 ps-3 pb-2 hidden lg:flex">
        <CustomImage src="/images/document-menu-icon.svg" alt="documents-icon" width={15} height={15} />
        <HeadingTag type="h2" className="text-black font-semibold [&&]:text-sm uppercase">
          DOCUMENTS
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`gradient-main identity-main rounded-xl lg:bg-gradient-to-r from-sky-500 to-indigo-500 lg:pt-4 ${loggedInUser && isTeleconsultationBooked ? "small-height" : "normal-document-card-height normal-height"}`}>
        <DynamicHtmlTag
          type="div"
          className="bg-white flex-col lg:flex-row h-full overflow-hidden lg:overflow-auto min-h-full py-0 lg:py-5 rounded-xl lg:rounded-b-xl lg:rounded-t-none relative">
          <DynamicHtmlTag type="div" className="flex sm:flex-col lg:flex-row gap-4 px-0 lg:px-4 h-full">
            <DynamicHtmlTag
              type="div"
              className={`bg-gradient-to-r from-sky-500 to-indigo-500 pt-4 lg:pt-0 w-full h-full lg:w-[30%] shadow-none lg:shadow-lg rounded-xl ${getActiveRoute(pathName, "/patient-dashboard/documents/", "hide-mobile-cstm-doc-nav")}`}>
              <DocumentSteps />
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className={`w-full lg:w-[70%] rounded-lg h-auto lg:px-0 absolute left-0 lg:relative bg-base-100 ${isRepotsOpen ? "" : "hidden lg:block sm:px-4"}`}>
              {children}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
  );
};

export default DocumentTemplate;
