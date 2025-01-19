"use client";
import { CustomButton, CustomImage, CustomLabel, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const MarchéTab = () => {
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
            <HeadingTag type="h4" className="w-32 lg:w-40 font-bold text-xs lg:text-lg lg:ms-5 lg:mt-0">
              Notre marché et nos propositions de valeur
            </HeadingTag>
            <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto font-semibold -mt-10 hidden lg:block text-center">
              Notre société, DrVisio, se positionne à l{"'"}avant-garde de la digitalisation des services de santé par le biais de la
              téléconsultation, en créant des ponts numériques entre les professionnels de santé et les patients.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto -mt-12 lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row">
            <DynamicHtmlTag type="div" className="lg:w-8/12">
              <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm my-4 text-justify">
                Notre proposition de valeur réside dans la mise à disposition d{"'"}une plateforme de santé intuitive, sécurisée et complète, qui
                répond aux impératifs d{"'"}immédiateté et de flexibilité des soins médicaux contemporains.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm my-4 text-justify">
                Notre proposition de valeur réside dans la mise à disposition d{"'"}une plateforme de santé intuitive, sécurisée et complète, qui
                répond aux impératifs d{"'"}immédiateté et de flexibilité des soins médicaux contemporains.
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            <DynamicHtmlTag type="p" className="w-full text-2xs mx-auto font-semibold my-4 lg:hidden text-center">
              Notre société, DrVisio, se positionne à l{"'"}avant-garde de la digitalisation des services de santé par le biais de la
              téléconsultation, en créant des ponts numériques entre les professionnels de santé et les patients.
            </DynamicHtmlTag>
            <CustomImage src="/images/marché-img.png" alt="marché-img" width={450} height={200} className="w-7/12 lg:w-4/12" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      {currentScreen === 2 && (
        <DynamicHtmlTag type="div" className="screen-2 h-5/6 lg:h-full flex items-start lg:items-center">
          <DynamicHtmlTag type="div" className="lg:w-11/12 flex flex-col h-full overflow-y-scroll lg:overflow-hidden mt-2 lg:mt-0">
            <DynamicHtmlTag type="div" className="flex items-center justify-between w-full flex-col lg:flex-row-reverse">
              <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-xm font-semibold leading-relaxed lg:ps-16">
                <DynamicHtmlTag type="p" className="mb-4 text-justify">
                  Sur le marché B2B, notre vision est holistique et inclus les entreprises de toute envergure, offrant à leurs employés l{"'"}avantage
                  d{"'"}une accessibilité aux soins sans frontières physiques, attribut essentiel pour une main-d{"'"}œuvre de plus en plus nomade et
                  télétravaillant. L{"'"}ajout de notre service à leur portefeuille de prestations sociales représente pour eux un atout stratégique,
                  renforçant leur image de marque autant qu{"'"}augmentant la satisfaction et la productivité des employés grâce à une gestion
                  optimisée de leur santé.
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="lg:mb-4 text-justify">
                  Concernant l{"'"}expansion de notre offre en dehors du cadre des entreprises, nos projets incluent l{"'"}intégration de nos
                  solutions au sein des collectivités territoriales et des établissements de santé comme les cliniques et les hôpitaux, oeuvrant ainsi
                  à la réduction des inégalités d{"'"}accès aux soins. Les pharmacies et les campus universitaires représentent également des axes de
                  croissance significatifs, où nos {"'"}box{"'"} de consultation à distance seront des relais physiques essentiels dans l{"'"}
                  échiquier de l{"'"}accès élargi à la santé.
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex items-end flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-5">
                <CustomImage
                  src="/images/marché-img2.png"
                  alt="produit-img1"
                  width={200}
                  height={200}
                  className="lg:ms-1 w-6/12 lg:w-10/12 m-auto lg:mx-0"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="lg:mb-4 text-justify lg:ps-16 text-2xs lg:text-xm font-semibold leading-relaxed">
              L{"'"}innovation est la pierre angulaire de DrVisio. Nous offrons des abonnements souples adaptés aux besoins spécifiques de chaque
              entité, tout en veillant à l{"'"}implantation de nos postes de consultation à distance. Ces installations, véritables vitrines
              technologiques, sont conçues pour fonctionner comme des mini-cliniques autonomes, disposant des derniers progrès en matière de
              connectivité et d{"'"}outils de diagnostic, et sont un pas de plus vers une médecine préventive et integrée dans la vie quotidienne des
              individus.
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="lg:mb-4 text-justify lg:ps-16 text-2xs lg:text-xm font-semibold leading-relaxed">
              L{"'"}innovation est la pierre angulaire de DrVisio. Nous offrons des abonnements souples adaptés aux besoins spécifiques de chaque
              entité, tout en veillant à l{"'"}implantation de nos postes de consultation à distance. Ces installations, véritables vitrines
              technologiques, sont conçues pour fonctionner comme des mini-cliniques autonomes, disposant des derniers progrès en matière de
              connectivité et d{"'"}outils de diagnostic, et sont un pas de plus vers une médecine préventive et integrée dans la vie quotidienne des
              individus.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      <DynamicHtmlTag type="div" className="flex flex-col items-center mx-auto lg:mt-auto pb-5">
        <CustomLabel className="font-semibold text-2xs lg:text-md my-3">Nos propositions de valour</CustomLabel>
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

export default MarchéTab;
