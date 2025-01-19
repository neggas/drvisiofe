"use client";
import { CustomButton, CustomImage, CustomLabel, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Introductiontab = () => {
  const [currentScreen, setCurrentScreen] = useState(1); // State to track the current screen

  // Handler to move to the next screen
  const handleNext = () => {
    if (currentScreen < 2) {
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
    <DynamicHtmlTag type="div" className="w-full h-full flex flex-col justify-between">
      {/* Render screen content conditionally based on currentScreen */}
      {currentScreen === 1 && (
        <DynamicHtmlTag type="div" className="screen-1 h-full">
          <DynamicHtmlTag type="div" className="flex flex-col">
            <CustomImage src="/images/logos/logoBlue.png" width={100} height={100} alt="logo" className="mt-12 lg:hidden" />
            <HeadingTag type="h4" className="w-32 font-bold text-sm lg:text-lg lg:ms-5 lg:mt-0">
              Introduction et aperçu de l{"'"}entreprise
            </HeadingTag>
            <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto text-center font-semibold -mt-12 hidden lg:block">
              Notre entreprise incarne l{"'"}épicentre de l{"'"}innovation contemporaine où la santé, la technologie de pointe et l{"'"}ingéniosité
              entrepreneuriale se fondent pour redéfinir l{"'"}expérience des soins à distance.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto -mt-12 lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row text-justify">
            <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm lg:w-8/12">
              Forts d{"'"}une vision audacieuse, nous avons conçu une solution de téléconsultation qui transcende les barrières physiques, offrant aux
              patients la liberté de consulter une diversité de spécialistes médicaux sans quitter le confort de leur foyer. Notre fondement repose
              sur une synergie unique : l{"'"}alliance d{"'"}une expertise médicale pointue, garantie par la finesse d{"'"}un médecin spécialiste, l
              {"'"}approche holistique d{"'"}un médecin généraliste dévoué au parcours de soin patient-centré, complétée par la prouesse technologique
              d{"'"}un architecte technique, dont l{"'"}excellence est certifiée par l{"'"}éminente école des mines.
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="w-full text-2xs mx-auto text-center font-semibold my-4 lg:hidden">
              Notre entreprise incarne l{"'"}épicentre de l{"'"}innovation contemporaine où la santé, la technologie de pointe et l{"'"}ingéniosité
              entrepreneuriale se fondent pour redéfinir l{"'"}expérience des soins à distance.
            </DynamicHtmlTag>
            <CustomImage src="/images/introfirst.png" alt="introfirst.png" width={450} height={200} className="w-7/12 lg:w-4/12" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      {currentScreen === 2 && (
        <DynamicHtmlTag type="div" className="screen-2 h-full">
          <DynamicHtmlTag type="div" className="flex items-center justify-between w-full lg:w-11/12 h-full me-auto flex-col lg:flex-row">
            <DynamicHtmlTag type="div" className="flex items-center flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-8 mt-5 lg:mt-0">
              <CustomImage src="/images/intro-welcome.webp" alt="intro-welcome" width={150} height={150} className="w-6/12 lg:w-8/12 me-1" />
              <CustomImage
                src="/images/intro-welcome-without-hover.webp"
                alt="intro-welcome-without-hover"
                width={150}
                height={150}
                className="ms-1 w-6/12 lg:w-8/12"
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-base font-semibold leading-relaxed lg:pe-16 text-justify">
              <DynamicHtmlTag type="p" className="my-2 lg:my-4">
                La plateforme que notre entreprise propose est le résultat d{"'"}une quête incessante d{"'"}excellence et d{"'"}accessibilité dans les
                soins de santé. Pensée pour être à la fois intuitive et avancée, elle se veut l{"'"}incarnation de la simplicité couplée à l{"'"}
                efficacité.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="my-2 lg:my-8">
                Conscients des enjeux actuels du secteur médical, nous avons développé une interface qui répond avec précision aux besoins des
                patients et des professionnels de santé, alliant ergonomie et technologie de pointe. Cette plateforme ne se limite pas à être un outil
                de téléconsultation; elle se présente comme un espace de convergence où la qualité des soins est rehaussée par une expérience
                utilisateur sans égale.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="my-2 lg:my-4">
                Notre équipe pluridisciplinaire, nourrie par l{"'"}innovation et l{"'"}expertise, a pour ambition de rendre les soins de santé plus
                inclusifs et de faire de cet accès élargi une réalité quotidienne pour tous. En bousculant les paradigmes, notre entreprise n{"'"}est
                pas seulement à l{"'"}avant-garde de la santé digitale; elle en redéfinit les contours pour un futur où la médecine de précision et l
                {"'"}accompagnement personnalisé deviennent la norme, accessibles à chacun, partout et à tout moment.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      <DynamicHtmlTag type="div" className="flex flex-col items-center mx-auto lg:mt-auto pb-5">
        <CustomLabel className="font-semibold text-2xs lg:text-md my-3">Aperçu de l’entreprise</CustomLabel>
        <DynamicHtmlTag type="div" className="flex gap-3">
          <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 2}>
            <MdKeyboardArrowDown className="custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
          </CustomButton>
          <CustomButton type="button" className="disabled:opacity-20 rotate-180" onClick={handlePrev} disabled={currentScreen === 1}>
            <MdKeyboardArrowDown className="custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Navigation buttons */}
      <DynamicHtmlTag type="div" className="absolute right-10 h-1/2 top-1/4 p-3 lg:flex hidden flex-col items-center justify-center">
        <DynamicHtmlTag type="div" className="flex flex-col items-center justify-center gap-y-3">
          <CustomButton type="button" className="disabled:opacity-20" onClick={handlePrev} disabled={currentScreen === 1}>
            <MdKeyboardArrowDown className="prev-screen patient-custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center rotate-180" />
          </CustomButton>
          <DynamicHtmlTag type="span" className="bg-gray-700 h-32 p-[0.5px]" />
          <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 2}>
            <MdKeyboardArrowDown className="next-screen patient-custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Introductiontab;
