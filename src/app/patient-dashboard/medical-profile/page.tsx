"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag, MedicalHistory, Allergies, Mesures, MedicalTreatments } from "@/components";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { getLocalStorageData } from "@/utility";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const tabs = [
  { label: "Antécédents", component: MedicalHistory },
  { label: "Traitements médicamentaux", component: MedicalTreatments },
  { label: "Allergies", component: Allergies },
  { label: "Mesures (Poids, taille, IMC)", component: Mesures },
];

const MedicalProfile = () => {
  const [activeTab, setActiveTab] = useState(0); // Track active tab
  const [loadedTabs, setLoadedTabs] = useState([0]); // Track loaded tabs
  const [reloadFlags, setReloadFlags] = useState(tabs.map(() => false)); // Reload state for tabs
  const [isShowContent, setShowContent] = useState(false); // Control mobile content visibility
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);

  // Add active tab to the list of loaded tabs
  useEffect(() => {
    if (!loadedTabs.includes(activeTab)) {
      setLoadedTabs(prevLoaded => [...prevLoaded, activeTab]);
    }
  }, [activeTab, loadedTabs]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setShowContent(true);

    // Trigger reload logic for the tab
    setReloadFlags(prevFlags => {
      const updatedFlags = [...prevFlags];
      updatedFlags[index] = true; // Mark the tab for reload
      return updatedFlags;
    });

    // Reset the reload flag after some time
    setTimeout(() => {
      setReloadFlags(prevFlags => {
        const updatedFlags = [...prevFlags];
        updatedFlags[index] = false; // Reset reload flag
        return updatedFlags;
      });
    }, 0); // You can adjust timing if necessary
  };

  return (
    <>
      <DynamicHtmlTag type="div" className="items-center gap-x-2 ps-3 pb-2 hidden lg:flex">
        <CustomImage src="/images/profile-medical.svg" alt="profile-medical" width={18} height={15} />
        <HeadingTag type="h2" className="text-black font-semibold [&&]:text-sm uppercase">
          PROFIL MÉDICAL
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`pt-0 lg:pt-4 gradient-main identity-main rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 ${loggedInUser && isTeleconsultationBooked ? "small-height" : "normal-height"}`}>
        <DynamicHtmlTag
          type="div"
          className="bg-white flex-col lg:flex-row h-full overflow-hidden lg:overflow-auto min-h-full py-0 lg:py-5 rounded-b-xl rounded-t-xl lg:rounded-t-none relative">
          <DynamicHtmlTag type="div" className="flex sm:flex-col lg:flex-row gap-4 px-0 lg:px-4 lg:h-full">
            <DynamicHtmlTag
              type="div"
              className="bg-gradient-to-r from-sky-500 to-indigo-500 pt-4 lg:pt-0 w-full lg:w-[30%] shadow-none lg:shadow-lg rounded-xl">
              <DynamicHtmlTag type="div" className="bg-white p-3 border-slate-200 h-full rounded-b-xl rounded-none lg:rounded-xl">
                <DynamicHtmlTag type="div" className="text-black font-semibold px-0 md:px-2 xl:px-4">
                  <HeadingTag type="h3" className="text-2xs lg:text-[.8vw] xl:text-2xs 2xl:text-sm text-center">
                    PROFIL MÉDICAL
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-[2.5vw] md:text-[1.5vw] lg:text-[.6vw] xl:text-2xs 2xl:text-xs mt-1 xl:mt-4 xl:mb-8">
                    <DynamicHtmlTag type="span" className="font-medium">
                      Ces informations permettrons au médecin de
                    </DynamicHtmlTag>{" "}
                    mieux vous connaître et de mieux vous prendre en charge. Elles vous serviront également pour{" "}
                    <DynamicHtmlTag type="span" className="font-medium">
                      votre suivi.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="mt-3 md:mt-2 xl:mt-4 px-4 lg:px-0 lg:pr-10">
                  <DynamicHtmlTag type="div" className="flex flex-col gap-3 md:gap-2 xl:gap-6 main-tabs-section">
                    {tabs.map((tab, index) => (
                      <React.Fragment key={index}>
                        <CustomButton
                          id={`custom_tab-${index}`}
                          className={`text-[3vw] md:text-[1.5vw] lg:text-3xs xl:text-xs font-semibold block text-white py-2 md:py-2 lg:py-[.6vw] xl:py-3 2xl:py-4 text-left px-2 lg:px-4 relative rounded-xl ${index === activeTab ? "active-tab" : "non-active-tab"}`}
                          onClick={() => handleTabClick(index)}>
                          {tab.label}
                        </CustomButton>
                      </React.Fragment>
                    ))}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className={`w-full lg:w-[70%] shadow-none lg:shadow-lg rounded-xl border border-slate-200 h-full ${isShowContent ? "sm:block sm:absolute sm:left-0 sm:bg-white" : "hidden"} lg:block lg:relative`}>
              <CustomButton
                className="w-fit lg:hidden inline-block p-1 revert-light-gradient rounded-full mt-10 absolute right-2 z-40"
                as="button"
                onClick={() => setShowContent(false)}>
                <IoCloseSharp className="w-3 h-3" />
              </CustomButton>
              {tabs.map((tab, index) => (
                <DynamicHtmlTag
                  key={index}
                  type="div"
                  role="tabpanel"
                  className="tab-content h-full rounded-xl medical-profile-component"
                  style={{ display: activeTab === index ? "block" : "none" }}>
                  {loadedTabs.includes(index) &&
                    (!reloadFlags[index] ? (
                      <tab.component />
                    ) : (
                      <div>Loading...</div> // Show loading indicator while reloading
                    ))}
                </DynamicHtmlTag>
              ))}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
  );
};

export default MedicalProfile;
