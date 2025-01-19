"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DynamicHtmlTag, CustomButton, CustomImage, CustomNav, CustomLink } from "@/components";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { selectCreatePatientData } from "@/store/reducers/createPatientsSlice";

const PractitionerRegistrationSteps = () => {
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
        <CustomNav defaultActiveKey="/create-practitioner/identity" className="flex-column steps-menu light-gradient flex rounded-md">
          <CustomLink
            href="/create-practitioner/identity"
            className={`steps-links sm:w-1/2 lg:w-2/6 ${getActiveRoute(pathName, "/create-practitioner/identity", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              1
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Identité</DynamicHtmlTag>
          </CustomLink>
          <CustomLink
            href="/create-practitioner/validationCGUNotice"
            className={`steps-links w-2/6 sm:hidden lg:flex ${getActiveRoute(pathName, "/create-practitioner/validationCGUNotice", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              2
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Validation CGU et notice</DynamicHtmlTag>
          </CustomLink>
          <CustomLink
            href="/create-practitioner/email-validation"
            className={`steps-links w-2/6 sm:hidden lg:flex [&&]:rounded-r-none [&&]:shadow-none ${getActiveRoute(pathName, "/create-practitioner/email-validation", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              3
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Validation du mail</DynamicHtmlTag>
          </CustomLink>
          <CustomLink
            href="/create-practitioner/professional-profile"
            className={`steps-links w-2/6 sm:hidden lg:flex [&&]:rounded-r-none [&&]:shadow-none ${getActiveRoute(pathName, "/create-practitioner/professional-profile", "active")}`}>
            <DynamicHtmlTag type="span" className="nav-span revert-light-gradient p-0.5 w-5 h-5 rounded-full inline-block text-center">
              4
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span">Profil professionnel</DynamicHtmlTag>
          </CustomLink>
          <CustomLink href="#!" className={`steps-links sm:w-1/2 lg:w-1/6 [&&]:shadow-none lg:hidden`}>
            Etape 1/4
          </CustomLink>
        </CustomNav>
      </DynamicHtmlTag>
      {/* --- Tab section end ---- */}
    </DynamicHtmlTag>
  );
};
export default PractitionerRegistrationSteps;
