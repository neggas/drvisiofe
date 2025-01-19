"use client";
import { CustomButton, CustomImage, CustomLabel, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const ProduitTab = () => {
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
    <DynamicHtmlTag type="div" className="w-full h-full flex flex-col justify-between">
      {/* Render screen content conditionally based on currentScreen */}
      {currentScreen === 1 && (
        <DynamicHtmlTag type="div" className="screen-1 h-full">
          <DynamicHtmlTag type="div" className="flex flex-col">
            <CustomImage src="/images/logos/logoBlue.png" width={100} height={100} alt="logo" className="mt-12 lg:hidden" />
            <HeadingTag type="h4" className="w-32 font-bold text-sm lg:text-lg lg:ms-5 lg:mt-0">
              Notre produit, notre service
            </HeadingTag>
            <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto text-center font-semibold hidden lg:block -mt-12">
              DrVisio redéfinit l{"'"}excellence en matière de solutions de téléconsultation grâce à un ensemble de fonctionnalités sophistiquées
              conçues spécifiquement pour les professionnels de la santé et leurs patients.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row">
            <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm lg:w-8/12">
              Notre application est l{"’"}intersection parfaite entre convivialité et innovation technologique, permettant une prise en charge
              médicale à distance de première qualité.
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="w-full text-xs mx-auto text-center font-semibold my-6 lg:hidden">
              DrVisio redéfinit l{"'"}excellence en matière de solutions de téléconsultation grâce à un ensemble de fonctionnalités sophistiquées
              conçues spécifiquement pour les professionnels de la santé et leurs patients.
            </DynamicHtmlTag>
            <CustomImage src="/images/produit-image.webp" alt="produitimage" width={450} height={200} className="w-7/12 lg:w-4/12" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      {currentScreen === 2 && (
        <DynamicHtmlTag type="div" className="screen-2 lg:h-full h-5/6">
          <DynamicHtmlTag type="div" className="flex items-center justify-between w-full lg:w-11/12 h-full me-auto flex-col lg:flex-row">
            <DynamicHtmlTag type="div" className="flex items-center flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-8 mt-5 lg:mt-0">
              <CustomImage src="/images/produit-img1.webp" alt="produit-img1" width={150} height={150} className="w-6/12 lg:w-8/12 me-1" />
              <CustomImage src="/images/produit-img2.webp" alt="produit-img1" width={150} height={150} className="ms-1 w-6/12 lg:w-8/12" />
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="w-full lg:w-8/12 text-2xs lg:text-sm font-semibold leading-relaxed lg:pe-16 overflow-y-scroll lg:overflow-hidden">
              <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                Facilité d{"'"}utilisation inégalée
              </HeadingTag>
              <DynamicHtmlTag type="p" className="mb-4 text-justify">
                DrVisio a été méticuleusement élaborée pour offrir une expérience utilisateur fluide et intuitive. Qu{"'"}il s{"'"}agisse d{"'"}une
                première inscription rapide, d{"'"}une prise de rendez-vous en quelques clics ou d{"'"}une navigation transparente au sein de l{"'"}
                application, tout a été pensé pour simplifier l{"'"}accès aux soins pour tous, quel que soit le niveau de familiarité avec les
                technologies digitales.
              </DynamicHtmlTag>
              <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                Assistant IA
              </HeadingTag>

              <DynamicHtmlTag type="p" className="mb-4 text-justify">
                Au cœur de notre système, un assistant intelligent basé sur l{"'"}intelligence artificielle joue un rôle pivot dans l{"'"}optimisation
                de l{"'"}expérience de téléconsultation. Cette technologie de pointe soutient les professionnels de la santé en ébauchant
                automatiquement les comptes rendus de consultation. Elle analyse les échanges durant la téléconsultation, synthétisant les
                informations cruciales en notes concises et précises, qui peuvent ensuite être validées par le médecin. Ce processus garantit une
                documentation claire et cohérente, tout en réduisant significativement le temps consacré à la paperasserie.
              </DynamicHtmlTag>
              <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                Pré-édition d{"'"}ordonnances intelligente
              </HeadingTag>

              <DynamicHtmlTag type="p" className="mb-4 text-justify">
                L{"'"}intelligence artificielle DrVisio va plus loin en proposant une rédaction intelligente d{"'"}ordonnances, élaborées sur la base
                des protocoles médicaux et des données patients, fournissant ainsi un support décisionnel inestimable. Les ordonnances pré-éditées
                sont personnalisables et peuvent être ajustées selon le jugement clinique du médecin, garantissant une précision sans faille et une
                pertinence thérapeutique.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      {currentScreen === 3 && (
        <DynamicHtmlTag type="div" className="screen-2 h-5/6 lg:h-full flex items-start lg:items-center">
          <DynamicHtmlTag type="div" className="lg:w-11/12 flex flex-col h-full overflow-y-scroll lg:overflow-hidden mt-2 lg:mt-0">
            <DynamicHtmlTag type="div" className="flex items-center justify-between w-full flex-col lg:flex-row">
              <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-sm font-semibold leading-relaxed lg:ps-16">
                <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                  Dashboard intuitif et complet
                </HeadingTag>
                <DynamicHtmlTag type="p" className="mb-4 text-justify">
                  Notre tableau de bord est l{"’"}épine dorsale de l{"’"}application, permettant aux médecins de gérer leurs consultations, de
                  visualiser les comptes rendus, d{"’"}accéder aux historiques de traitement et d{"’"}ordonnances avec une fluidité déconcertante. La
                  conception épurée et l{"’"}interface réactive fournissent un support optimal, améliorant ainsi l{"’"}efficacité du soignant et la
                  sécurité des patients
                </DynamicHtmlTag>
                <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                  Conformité et sécurité maximum
                </HeadingTag>
                <DynamicHtmlTag type="p" className="lg:mb-4 text-justify">
                  La sécurité des données est une priorité absolue. DrVisio répond aux normes et directives les plus strictes telles que HIPAA (Health
                  Insurance Portability and Accountability Act) pour les utilisateurs américains, ainsi que les normes RGPD pour l{"'"}Union
                  européenne. Ces cadres de conformité sont respectés pour assurer une protection maximale des données sensibles des patients.
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex items-end flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-5">
                <CustomImage
                  src="/images/produit-img2.webp"
                  alt="produit-img1"
                  width={200}
                  height={200}
                  className="lg:ms-1 w-6/12 lg:w-10/12 m-auto"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="lg:mb-4 text-justify text-xs lg:ps-16 text-2xs lg:text-sm font-semibold leading-relaxed">
              En bref, DrVisio est l{"'"}alliance parfaite entre technologie de pointe et fonctionnalité, mettant à disposition des professionnels de
              santé un outil complet et ergonomique pour la gestion de leur pratique médicale. Son tableau de bord intuitif, conforme aux normes
              internationales de sécurité, en fait un partenaire de choix pour les praticiens souhaitant optimiser leur efficacité et la sécurité de
              leurs patients. DrVisio peut propulser votre pratique médicale dans une nouvelle ère de la télémédecine.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      <DynamicHtmlTag type="div" className="flex flex-col items-center mx-auto lg:mt-auto pb-5 -mt-7">
        <CustomLabel className="font-semibold text-2xs lg:text-md my-3">Aperçu de l{"’"}entreprise</CustomLabel>
        <DynamicHtmlTag type="div" className="flex gap-3">
          <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 3}>
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
          <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 3}>
            <MdKeyboardArrowDown className="next-screen patient-custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default ProduitTab;
