"use client";
import { CustomButton, DynamicHtmlTag, PractitionerIdentifyTab, ProfessionalInformation, MesDocuments, HeadingTag, CustomImage } from "@/components";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(1); // State to track the current screen

  // Handler to move to the next screen
  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    }
  };
  // Handler to move to the previous screen
  const handlePrev = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };
  return (
    <DynamicHtmlTag type="div" className="h-full rounded-md px-3 lg:p-6 overflow-auto lg:overflow-hidden bg-white pb-1 lg:pb-0">
      <DynamicHtmlTag type="div" className="bg-sky-100 p-2 -mx-3 flex lg:hidden mb-3 sticky z-10 top-0">
        <DynamicHtmlTag type="div" className="flex gap-3 w-full justify-between px-2">
          <CustomButton type="button" className="disabled:opacity-60" onClick={handlePrev} disabled={currentScreen === 1}>
            <CustomImage src="/images/back-arrow.png" alt="arrow icon" width={10} height={10} />
          </CustomButton>
          <HeadingTag type="div" className=" font-semibold text-customBlue text-2xs">
            {currentScreen === 1
              ? "IDENTITÉ"
              : currentScreen === 2
                ? "INFORMATIONS PROFESSIONNELLES"
                : currentScreen === 3
                  ? "MES DOCUMENTS"
                  : "IDENTITÉ"}
          </HeadingTag>
          <CustomButton type="button" className="disabled:opacity-60 rotate-180" onClick={handleNext} disabled={currentScreen === 3}>
            <CustomImage src="/images/back-arrow.png" alt="arrow icon" width={10} height={10} />
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex lg:hidden">
        {currentScreen === 1 && (
          <DynamicHtmlTag type="div" className="w-full lg:w-1/3 lg:rounded-xl lg:shadow-md h-full overflow-hidden lg:border-2 border-gray-200">
            <PractitionerIdentifyTab />
          </DynamicHtmlTag>
        )}
        {currentScreen === 2 && (
          <DynamicHtmlTag type="div" className="w-full lg:w-1/3 lg:rounded-xl lg:shadow-md h-full overflow-hidden lg:border-2 border-gray-200">
            <ProfessionalInformation />
          </DynamicHtmlTag>
        )}
        {currentScreen === 3 && (
          <DynamicHtmlTag type="div" className="w-full lg:w-1/3 lg:rounded-xl lg:shadow-md h-full overflow-hidden lg:border-2 border-gray-200">
            <MesDocuments />
          </DynamicHtmlTag>
        )}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden lg:flex h-full gap-x-5 flex-col lg:flex-row practitioner-doctor-profile">
        <DynamicHtmlTag type="div" className="w-full lg:w-1/3 rounded-xl shadow-md h-full overflow-hidden border-2 border-gray-200">
          <PractitionerIdentifyTab />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-full lg:w-1/3 rounded-xl shadow-md h-full overflow-hidden border-2 border-gray-200">
          <ProfessionalInformation />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-full lg:w-1/3 flex flex-col h-full">
          <DynamicHtmlTag type="div" className="w-full rounded-xl shadow-md h-full overflow-hidden border-2 border-gray-200">
            <MesDocuments />
          </DynamicHtmlTag>
          <CustomButton
            type="button"
            className="card-btn w-1/4 rounded-full py-1 2xl:py-2 px-3 2xl:px-6 mt-10 ms-auto text-sm font-semibold text-white">
            Modifier
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Profile;
