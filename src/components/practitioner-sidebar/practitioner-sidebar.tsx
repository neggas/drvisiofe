"use client";
import React, { useEffect, useState } from "react";
import { DynamicHtmlTag, CustomImage, CustomNav, CustomLink, HeadingTag, CustomSelect, ProposModal } from "@/components";
import { usePathname } from "next/navigation";
import { GLOBAL_LANGUAGE_OPTIONS } from "@/utility";
import i18n from "../../../i18n";

const PractitionerSidebar = () => {
  const pathName = usePathname() || "";

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };

  useEffect(() => {}, [pathName]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // MessageModalBox
  const openMessageModal = () => setIsModalOpen(true);
  const closeMessageModal = () => setIsModalOpen(false);

  return (
    <DynamicHtmlTag type="div" className="relative mb-3 lg:mb-0 h-full">
      <DynamicHtmlTag type="div" className="h-full shadow-md">
        <DynamicHtmlTag
          type="div"
          className="bg-white flex flex-col min-h-full text-center pb-0 lg:pb-2 rounded-b-lg sidebar-main h-full relative justify-between">
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag type="div" className="flex items-center justify-between gap-1 lg:block px-4 md:px-5">
              <DynamicHtmlTag type="div" className="flex items-center lg:block text-center pt-1 2xl:pb-4 gap-2 md:gap-3">
                <CustomImage src={"/images/logos/logoBlue.png"} alt="Logo" width={200} height={80} className="w-40 lg:w-full" />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="p"
              className="ms-auto w-4/5 text-left text-sm md:text-sm xl:text-xs 2xl:text-sm text-black font-semibold pb-2 border-b-2 my-5">
              Tableau de bord
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="main-patient-side-menu mt-0 lg:mt-4 2xl:mt-5 rounded-b-lg lg:rounded-b-none">
              <CustomNav
                defaultActiveKey="/patient-dashboard/welcome"
                className="hidden lg:flex flex-col justify-between lg:justify-normal gap-1 xl:gap-1 2xl:gap-2 px-0 md:px-3 lg:px-0 overflow-x-scroll lg:overflow-hidden pb-2 2xl:pb-3 bg-white rounded-b-lg lg:rounded-b-none">
                <CustomLink
                  href="/practitioner-dashboard/welcome"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/welcome", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/home-icon.svg"
                      alt="welcome"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Accueil
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/profile"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/profile", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/practitioner-profile.svg"
                      alt="practitioner-profile"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Profil
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/agenda"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/agenda", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/practitioner-agenda.svg"
                      alt="practitioner-agenda"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Agenda
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/teleconsultations"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/teleconsultations", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/practitioner-téléconsultations.svg"
                      alt="practitioner-téléconsultations"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Téléconsultations
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/activity-report"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/activity-report", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/activity-report.svg"
                      alt="activity-report"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Rapport d’activité
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/my-patients"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/my-patients", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/top-identity-icon.svg"
                      alt="identity-icon"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Mes patients
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/model-orders"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/model-orders", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/orders-icon.svg"
                      alt="orders-icon"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Ordonnances types
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/practitioner-dashboard/connection-test"
                  className={`min-w-full py-0.5 2xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-row gap-1 lg:gap-3 justify-normal text-xs lg:text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/practitioner-dashboard/connection-test", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-7 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 h-7 2xl:h-8 flex items-center justify-center">
                    <CustomImage
                      src="/images/connection-test.svg"
                      alt="connection-test-icon"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 max-w-max"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Test de connexion
                  </DynamicHtmlTag>
                </CustomLink>
              </CustomNav>

              <CustomSelect
                className="lg:hidden mobile-language-select rounded-none w-[97%] btn btn-secondary shadow-none justify-self-start mx-1 text-left block border-none [&&]:border-b border-gray-950 py-3 text-sm uppercase font-semibold text-gray-950 px-3 [&&]:opacity-100"
                placeholder={i18n.language === "fr" ? "FR" : "EN"}
                options={GLOBAL_LANGUAGE_OPTIONS}
                value={i18n.language}
              />
              <CustomLink
                href=""
                onClick={openMessageModal}
                className="lg:hidden mx-1 text-left block border-b border-gray-950 py-3 text-sm uppercase font-semibold text-gray-950 px-3">
                À PROPOS
              </CustomLink>
              <CustomLink
                href=""
                className="lg:hidden mx-1 text-left block border-b border-gray-950 py-3 text-sm uppercase font-semibold text-gray-950 px-3">
                SE DECONNECTER
              </CustomLink>
              <DynamicHtmlTag type="div" className="w-[50%] absolute bottom-3 left-[25%] text-center pt-0 2xl:pt-3 lg:block">
                <CustomImage
                  src="/images/logos/chatboot.png"
                  alt="octopus-icon"
                  width={80}
                  height={80}
                  className="w-20 2xl:w-36 h-20 2xl:h-36 m-auto max-w-max"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <ProposModal isOpen={isModalOpen} onClose={closeMessageModal} />
    </DynamicHtmlTag>
  );
};

export default PractitionerSidebar;
