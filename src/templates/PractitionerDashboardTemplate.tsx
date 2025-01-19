"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomLink,
  CustomModal,
  CustomSelect,
  DynamicHtmlTag,
  HeadingTag,
  PractitionerSidebar,
  ProposModal,
} from "@/components";
import { usePathname } from "next/navigation";
import { GLOBAL_LANGUAGE_OPTIONS } from "@/utility";
import i18n from "../../i18n";
import { IoCloseSharp, IoMenuOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

type IBaseTemplateProps = {
  children: ReactNode;
};

const PractitionerDashboardTemplate = (props: IBaseTemplateProps) => {
  const pathName = usePathname() || "";
  const currentSplitURL = pathName.split("/");
  const { children } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  // MessageModalBox
  const openMessageModal = () => setIsModalOpen(true);
  const closeMessageModal = () => setIsModalOpen(false);
  const [isProfileInforModalOpen, setisProfileInforModalOpen] = useState(true);
  const closeProfileInforModal = () => setisProfileInforModalOpen(false);
  const [isVisible, setIsVisible] = useState(true); // Initially visible

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the div after 3 seconds
    }, 5000);

    // Cleanup function to clear the timeout when component unmounts
    return () => clearTimeout(timer);
  }, []); // Runs only once after the component mounts

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };
  useEffect(() => {}, [pathName]);

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-3 gap-y-0 lg:gap-y-0 h-full dashboard-main relative overflow-hidden">
      <DynamicHtmlTag
        type="div"
        onClick={toggleMenu}
        className={`${menuOpen ? "-translate-x-0" : "-translate-x-[120%]"} transition-all duration-500 ease-in-out lg:-translate-x-0 w-[60%] lg:w-[15%] overflow-hidden rounded-md bg-white h-[96dvh] lg:h-full lg:block absolute lg:relative z-50`}>
        <IoCloseCircleOutline onClick={toggleMenu} className="w-5 h-5 absolute top-1 z-50 right-1 hover:text-primary lg:hidden" />
        <PractitionerSidebar />
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full lg:w-[85%] gap-y-3 flex flex-col bg-transparent overflow-hidden rounded-md h-full">
        {/* top Navbar Start  */}
        <DynamicHtmlTag type="div" className="bg-white h-[6%] rounded-md">
          <DynamicHtmlTag type="div" className="h-full px-2 flex items-center justify-between py-[.3dvh]">
            <DynamicHtmlTag type="div" className="flex items-center h-full gap-2 justify-between w-full lg:w-fit">
              <DynamicHtmlTag type="div" className="lg:hidden">
                <IoMenuOutline onClick={toggleMenu} className="w-7 h-8 text-primary" />
              </DynamicHtmlTag>
              <HeadingTag type="h3" className="lg:hidden text-sm xl:text-xs 2xl:text-sm font-semibold">
                Accueil
              </HeadingTag>
              <DynamicHtmlTag type="span" className="rounded-full border border-black p-1 inline-block">
                <CustomImage
                  src={"/images/dr-profile.png"}
                  alt="dr-profile"
                  width={20}
                  height={20}
                  className="img-fluid rounded-full w-5 xl:w-6 2xl:w-8 max-w-max h-4 xl:h-6"
                />
              </DynamicHtmlTag>
              <HeadingTag type="h3" className="hidden lg:block lg:text-2xs xl:text-xs 2xl:text-sm font-semibold">
                Dr. Nom Prénom
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="lg:flex items-center justify-start hidden">
              <DynamicHtmlTag type="div" className="md:block">
                <CustomSelect
                  className="btn btn-secondary bg-gradient-to-t to-white from-white shadow-none uppercase justify-self-start cursor-pointer text-2xs md:text-sm lg:text-2xs xl:text-xs 2xl:text-sm py-1 xl:py-0 2xl:py-1 border-x-1 border-gray-400 border-y-0 rounded-none"
                  placeholder={i18n.language === "fr" ? "FR" : "EN"}
                  options={GLOBAL_LANGUAGE_OPTIONS}
                  value={i18n.language}
                />
              </DynamicHtmlTag>
              <CustomLink
                href=""
                onClick={openMessageModal}
                className="text-2xs md:text-sm lg:text-2xs xl:text-xs 2xl:text-sm font-semibold text-gray-700 px-3 py-1 xl:py-0 2xl:py-1 border-r-2 border-gray-400 ">
                À PROPOS
              </CustomLink>
              <DynamicHtmlTag type="div" className="ps-3">
                <CustomButton
                  type="button"
                  className="bg-sky-300 text-2xs md:text-sm lg:text-2xs xl:text-xs 2xl:text-sm font-semibold text-white py-2 lg:py-0.5 xl:py-1 rounded-full px-5">
                  Déconnexion
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* top Navbar End  */}
        <DynamicHtmlTag type="div" className="bg-gray-100 h-[85%] lg:h-[93%] rounded-md practitioner-dashboard-main p-0">
          {children}
        </DynamicHtmlTag>
        {/* footer for mobile Start */}
        <DynamicHtmlTag type="div" className="bg-white h-[6%] rounded-md lg:hidden">
          <DynamicHtmlTag type="div" className="h-full px-2 flex items-center justify-between">
            <DynamicHtmlTag type="div" className="flex items-center justify-between w-full px-11">
              <CustomLink
                href="/practitioner-dashboard/welcome"
                className="text-2xs md:text-sm xl:text-xs 2xl:text-sm font-semibold text-gray-700 px-3 py-1 xl:py-0 2xl:py-1">
                <CustomImage
                  src="/images/home-icon.svg"
                  alt="home-icon"
                  width={20}
                  height={20}
                  className={`w-6 h-6 ${getActiveRoute(pathName, "/practitioner-dashboard/welcome", "cstm-blue-filter")}`}
                />
              </CustomLink>
              <CustomLink
                href="/practitioner-dashboard/profile"
                className="text-2xs md:text-sm xl:text-xs 2xl:text-sm font-semibold text-gray-700 px-3 py-1 xl:py-0 2xl:py-1">
                <CustomImage
                  src="/images/profile-icon.svg"
                  alt="profile-icon"
                  width={20}
                  height={20}
                  className={`w-6 h-6 ${getActiveRoute(pathName, "/practitioner-dashboard/profile", "cstm-blue-filter")}`}
                />
              </CustomLink>
              <CustomLink
                href="/practitioner-dashboard/agenda"
                className="text-2xs md:text-sm xl:text-xs 2xl:text-sm font-semibold text-gray-700 px-3 py-1 xl:py-0 2xl:py-1">
                <CustomImage
                  src="/images/agenda-icon.svg"
                  alt="agenda-icon"
                  width={20}
                  height={20}
                  className={`w-6 h-6 ${getActiveRoute(pathName, "/practitioner-dashboard/agenda", "cstm-blue-filter")}`}
                />
              </CustomLink>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* footer for mobile End */}
      </DynamicHtmlTag>
      {/* Profile Info Modal Box Start */}
      <CustomModal
        isOpen={isProfileInforModalOpen}
        onClose={closeProfileInforModal}
        modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl outline-none">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className={`${isVisible ? "" : "hidden"} bg-base-100 py-2 lg:pt-4 lg:pb-6 px-2 lg:px-6 `}>
            <CustomImage
              src={"/images/dr-profiles.png"}
              alt="dr-profile"
              width={120}
              height={120}
              className="rounded-full w-14 xl:w-28 h-14 xl:h-28 mx-auto border border-customBlue mb-3"
            />
            <HeadingTag type="h4" className="text-xs xl:text-xl font-bold text-center block">
              Bonjour Docteur
            </HeadingTag>
            <HeadingTag type="h4" className="text-xs xl:text-xl font-bold text-center block">
              Franck Dupont
            </HeadingTag>
            <DynamicHtmlTag type="p" className="text-xs xl:text-lg font-semibold text-center block mt-8">
              Bienvenue dans votre dashboard
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-xs xl:text-lg font-semibold text-center block mt-8">
              Votre compte est en cours de validation
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-xs xl:text-lg font-semibold text-center block mt-8">
              Merci de patienter..
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className={`${isVisible ? "hidden" : ""} bg-base-100 py-2 lg:pt-4 lg:pb-6 px-2 lg:px-6 `}>
            <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2 mb-3 relative">
              <HeadingTag type="h2" className="text-blue font-bold text-lg text-center uppercase w-full">
                INFORMATIONS
              </HeadingTag>
              <CustomButton
                className="w-fit inline-block custom-grey-btn p-0.5 rounded-full absolute right-0 top-0"
                as="button"
                onClick={closeProfileInforModal}>
                <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div">
              <DynamicHtmlTag type="p" className="w-6/12 mx-auto text-xs xl:text-lg font-semibold text-center block mt-6">
                Vous pouvez gérer ici votre profil et votre planning.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-xs xl:text-lg font-semibold text-center block my-3">
                En ce qui concerne vos téléconsultations elles devront être réalisées sur un pc ou une tablette pour que la qualité avec votre patient
                soit optimale.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-xs xl:text-lg font-semibold text-center block mt-6">
                Merci de votre compréhension.
              </DynamicHtmlTag>
              <CustomButton
                type="button"
                onClick={closeProfileInforModal}
                className="card-btn rounded-full text-xs lg:text-2xs xl:text-sm font-semibold text-white px-5 py-1 mx-auto block mt-5 lg:mt-11">
                J’ai compris
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Profile Info Modal Box End */}
      {/* Propos MOdal Start  */}
      <ProposModal isOpen={isModalOpen} onClose={closeMessageModal} />
      {/* Propos MOdal End  */}
    </DynamicHtmlTag>
  );
};

export default PractitionerDashboardTemplate;
