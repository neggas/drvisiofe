"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DynamicHtmlTag, CustomButton, CustomImage, CustomNav, CustomLink, HeadingTag, CustomModal } from "@/components";
import { usePathname } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { selectCreatePatientData } from "@/store/reducers/createPatientsSlice";

const RegistrationSteps = () => {
  const createPatientData = useSelector(selectCreatePatientData);
  const pathName = usePathname() || "";
  const router = useRouter();
  const homeNavigation = () => {
    router.push("/");
  };

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath === linkPath ? activeClass : "";
  };

  useEffect(() => {}, [pathName]);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const openExitModal = () => setIsExitModalOpen(true);
  const closeExitModal = () => setIsExitModalOpen(false);

  return (
    <DynamicHtmlTag
      type="div"
      className="grid grid-cols-12 sm:pb-0 lg:pb-4 sm:bg-light lg:bg-transparent md:mx-[-1.25rem] lg:mx-auto mb-3 lg:mb-0 w-full">
      <DynamicHtmlTag type="div" className="sm:hidden lg:inline-block">
        <CustomButton className="w-fit inline-block previous-btn" onClick={homeNavigation}>
          <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full" />
        </CustomButton>
      </DynamicHtmlTag>

      {/* --- Tab section start --- */}
      <DynamicHtmlTag type="div" className="tab-section sm:col-span-12 lg:col-span-10 lg:px-0 rounded-full">
        <CustomNav defaultActiveKey="/create-patient/identity" className="flex-column steps-menu light-gradient flex rounded-md">
          <CustomLink
            href="/create-patient/identity"
            className={`steps-links sm:w-1/2 lg:w-2/6 ${getActiveRoute(pathName, "/create-patient/identity", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              1
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Identité</DynamicHtmlTag>
          </CustomLink>
          <CustomLink
            href={createPatientData && createPatientData.createIdentity ? `/create-patient/medical-data` : ``}
            className={`steps-links w-2/6 sm:hidden lg:flex ${getActiveRoute(pathName, "/create-patient/medical-data", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              2
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Données médicales</DynamicHtmlTag>
          </CustomLink>
          <CustomLink
            href={createPatientData && createPatientData.createIdentity ? `/create-patient/general-conditions` : ``}
            className={`steps-links w-2/6 sm:hidden lg:flex [&&]:rounded-r-none [&&]:shadow-none ${getActiveRoute(pathName, "/create-patient/general-conditions", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              3
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Conditions générales et notice</DynamicHtmlTag>
          </CustomLink>
          <CustomLink href="#!" className={`steps-links sm:w-1/2 lg:w-1/6 [&&]:shadow-none lg:hidden`}>
            Etape 1/6
          </CustomLink>
        </CustomNav>
      </DynamicHtmlTag>
      {/* --- Tab section end ---- */}

      {/* --- Close Button Start ---  */}
      {/* <DynamicHtmlTag type="div" className="text-end sm:hidden lg:inline-block">
        <CustomButton
          className="w-fit inline-block p-1 revert-light-gradient shadow-md shadow-slate-400 rounded-full"
          as="button"
          onClick={openExitModal}>
          <IoCloseSharp className="w-5 h-5" />
        </CustomButton>
      </DynamicHtmlTag> */}
      {/* --- Close Button End ---  */}

      {/*Exit from Process Custom Modal Starts */}
      {/* <CustomModal isOpen={isExitModalOpen} onClose={closeExitModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <MdClose
              onClick={closeExitModal}
              className="absolute top-6 right-2 cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
            />
            <HeadingTag type="h3" className="text-blue font-semibold text-xl/8 w-8/12 m-auto text-center mt-5">
              Êtes-vous sûre de vouloir quitter la prise de rendez-vous ?
            </HeadingTag>

            <DynamicHtmlTag type="div" className="w-full flex md:gap-x-3 justify-center my-10">
              <CustomImage src="/images/danger-icon.svg" width={18} height={18} alt="danger" className="" />
              <HeadingTag type="h4" className="text-sm font-bold my-5">
                Attention, le créneau horaire ne sera pas reservé
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-x-10 justify-center mb-3">
              <CustomButton
                className={`text-sm btn-danger cstm-btn flex py-2 px-1 justify-center w-3/6  md:w-2/6 view-more-btn rounded-full text-white font-semibold`}
                onClick={closeExitModal}>
                ANNULER
              </CustomButton>
              <CustomButton
                onClick={closeExitModal}
                className={`text-sm cstm-btn flex py-2 px-1 justify-center w-3/6  md:w-2/6 view-more-btn rounded-full text-white font-semibold`}>
                QUITTER
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal> */}
      {/* Exit from Process Custom Modal Ends */}
    </DynamicHtmlTag>
  );
};
export default RegistrationSteps;
