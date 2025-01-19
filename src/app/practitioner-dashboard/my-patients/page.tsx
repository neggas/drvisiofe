"use client";
import { CustomButton, DynamicHtmlTag, PractitionerMyPatients, PractitionerRefferingPhysician } from "@/components";
import React, { useState } from "react";

const tabs = [
  { label: "Mes patients", component: "PractitionerMyPatients" },
  { label: "Vos demandes de médecin référent", component: "Referringphysician" },
];

const getComponent = (type: string) => {
  switch (type) {
    case "PractitionerMyPatients":
      return <PractitionerMyPatients />;
    case "Referringphysician":
      return <PractitionerRefferingPhysician />;
  }
};
const Mypatients = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <DynamicHtmlTag type="div" className="h-[96%] rounded-md overflow-hidden bg-white relative m-[1%] p-3">
      <DynamicHtmlTag type="div" className="flex sticky top-0 z-50 bg-white my-patient-tabs">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <CustomButton
              className={`tabs ${tab.component} w-fit px-3 me-6 text-left text-2xs lg:text-3xs xl:text-xs 2xl:text-sm font-semibold capitalize ${index === activeTab ? "active-tab" : "non-active-tab"}`}
              onClick={() => setActiveTab(index)}>
              {tab.label}
            </CustomButton>
          </React.Fragment>
        ))}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="overflow-auto h-full pb-5">
        {tabs.map((tab, index) => (
          <DynamicHtmlTag
            type="div"
            role="tabpanel"
            className="tab-content h-full"
            key={index}
            style={{ display: activeTab === index ? "block" : "none" }}>
            <tab.component />
            {getComponent(tab.component)}
          </DynamicHtmlTag>
        ))}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Mypatients;
