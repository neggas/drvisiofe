"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  CustomButton,
  CustomModal,
  DynamicHtmlTag,
  AgendaIdentity,
  CustomSelect,
  AgendaDocuments,
  AgendaBackGround,
  AgendaAllergy,
  AgendaMeasurements,
  AgendaTeleconsultations,
  AgendaTreatments,
  CustomImage,
} from "@/components";

interface PatientInformationProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientInfo: React.FC<PatientInformationProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabContainerRef = useRef<HTMLDivElement | null>(null);

  // Tab configuration
  const tabs = [
    { label: "Identité", component: AgendaIdentity },
    { label: "Antécédents", component: AgendaBackGround },
    { label: "Traitements", component: AgendaTreatments },
    { label: "Allergies", component: AgendaAllergy },
    { label: "Mesures", component: AgendaMeasurements },
    { label: "Téléconsultations", component: AgendaTeleconsultations },
    { label: "Documents", component: AgendaDocuments },
  ];

  // Update the indicator position and size when the active tab changes
  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      const newWidth = currentTab.offsetWidth;
      const newLeft = currentTab.offsetLeft;
      setIndicatorStyle({
        width: newWidth,
        left: newLeft,
      });
    }
  }, [activeTab]);

  // const handleTabClick = (index: number) => {
  //   setActiveTab(index);
  // };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (tabRefs.current[index]) {
      tabRefs.current[index].scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleNextClick = () => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };
  // Patient change options for the select dropdown
  const ChangePatient = [
    { value: "Changer de patient", label: "Changer de patient" },
    { value: "Vous", label: "Vous" },
    { value: "Charlotte", label: "Charlotte" },
    { value: "Théo", label: "Théo" },
  ];
  const [selectedPatient, setSelectedPatient] = useState(ChangePatient[0]);

  return (
    <CustomModal
      id="show_patient"
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="outline-none w-full sm:max-w-1/2 md:max-w-3xl rounded-xl lg:max-h-[36rem] xl:h-[78%] 2xl:h-[62%] overflow-hidden">
      {/* Header section */}
      <DynamicHtmlTag type="div" className="w-full bg-[#FBB03B] p-0 pt-4">
        <DynamicHtmlTag type="div" className="flex justify-between px-2 relative bottom-2">
          <DynamicHtmlTag type="span" className="text-sm font-semibold text-base-100">
            Ines Esnault - 60kg
          </DynamicHtmlTag>
          <DynamicHtmlTag type="span" className="text-sm font-semibold text-base-100">
            DOSSIER PATIENT
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Content section */}
      <DynamicHtmlTag type="div" className="bg-base-100">
        {/* Select dropdown */}
        <DynamicHtmlTag type="div" className="w-full flex justify-center mt-3">
          <DynamicHtmlTag type="div" className="patient-dashboard-dropdown w-48 practitioner-dashboard-agenda-select">
            <CustomSelect
              options={ChangePatient}
              defaultValue={ChangePatient[0]}
              onChange={setSelectedPatient}
              value={selectedPatient}
              className="rounded-full"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>

        {/* Tabs section with scrolling and next icon */}
        <DynamicHtmlTag type="div" className="relative mt-5 w-[95%] mx-auto">
          <DynamicHtmlTag type="div" className="flex overflow-x-auto justify-between whitespace-nowrap w-full patient-info" ref={tabContainerRef}>
            {tabs.map((tab, index) => (
              <CustomButton
                type="button"
                key={index}
                className={`pb-3 text-sm xl:text-xs 2xl:text-sm font-semibold px-2 transition-all duration-300 relative ${
                  index === activeTab ? "font-bold active-info-tab" : "font-semibold"
                }`}
                onClick={() => handleTabClick(index)}
                ref={(el: HTMLButtonElement | null) => {
                  tabRefs.current[index] = el;
                }}>
                {tab.label}
              </CustomButton>
            ))}
            <DynamicHtmlTag type="div" className="bg-gray-100 w-full left-0 absolute bottom-0 h-2 rounded-lg" />
          </DynamicHtmlTag>

          {/* Tab indicator */}
          <DynamicHtmlTag
            type="div"
            className="bg-sky-300 absolute bottom-0 h-2 rounded-lg"
            style={{ ...indicatorStyle, transition: "left 0.3s ease, width 0.3s ease" }}
          />

          {/* Next icon (only visible on mobile) */}
          <DynamicHtmlTag
            type="div"
            onClick={handleNextClick}
            className="absolute right-0 top-[-20px] bottom-0 flex items-center bg-gradient-to-l from-white cursor-pointer md:hidden">
            <CustomImage src="/images/nextarrow.svg" alt="next" className="" width={7} height={7}></CustomImage>
          </DynamicHtmlTag>
        </DynamicHtmlTag>

        {/* Tab content */}
        {tabs.map((tab, index) => (
          <DynamicHtmlTag
            key={index}
            type="div"
            role="tabpanel"
            className="tab-content h-full rounded-xl px-2"
            style={{ display: activeTab === index ? "block" : "none" }}>
            <tab.component />
          </DynamicHtmlTag>
        ))}
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default PatientInfo;
