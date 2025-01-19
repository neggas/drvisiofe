"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components/ui";
import React, { useState } from "react";

const AgendaIdentity = () => {
  const [showSecondColumn, setShowSecondColumn] = useState(false);

  const handleNextClick = () => {
    setShowSecondColumn(true);
  };
  const handlePreviousClick = () => {
    setShowSecondColumn(false);
  };
  return (
    <DynamicHtmlTag type="div" className="rounded-lg px-4 lg::h-[33rem] 2xl:h-[28rem] overflow-y-auto">
      <DynamicHtmlTag type="div" className={`grid gap-6 ${showSecondColumn ? "grid-cols-1" : "grid-cols-1"} lg:grid-cols-2 lg:gap-6 xl:gap-28`}>
        <DynamicHtmlTag type="div" className={`mt-4 ${showSecondColumn && "hidden lg:block"}`}>
          <DynamicHtmlTag type="div" className="flex items-center mb-4 gap-7 xl:gap-24">
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2 items-center">
                <HeadingTag type="h2" className="text-2xs lg:text-xs xl:text-sm font-semibold text-sky-200">
                  Profil patient
                </HeadingTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="span" className="rounded-full border border-black p-1 inline-block">
                    <CustomImage
                      src={"/images/adeline.svg"}
                      alt="profile"
                      width={50}
                      height={50}
                      className="img-fluid rounded-full w-5 xl:w-8 2xl:w-10 max-w-max"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            <DynamicHtmlTag type="div" className="lg:hidden flex gap-2">
              <CustomImage src="/images/pencil-edit.svg" alt="edit" width={20} height={20}></CustomImage>
              <DynamicHtmlTag type="span" className="text-2xs text-sky-300 relative top-[5px]">
                Modifier
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2">
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Prénom
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Adeline
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Nom
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Arpin
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Date de naissance
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Française
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Sexe
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Féminin
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Poids
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              60 kg
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Taille
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              1,65 cm
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Nationalit
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Française
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Langues parlées
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Français
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Adresse
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              2 rue de la place au cas où ladresse est grande
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Ville
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Bordeaux
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Code postal
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              33000
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Pays
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              France
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Téléphone
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              +33 06 38 67 50 28
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Adresse email
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              adelinearpin@gmail.com
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex justify-end mb-2 lg:mb-0 mt-10  px-4 pb-2 lg:py-0 lg:hidden">
            <CustomButton as="button" className="w-36 card-btn text-xs text-white py-2 px-3 font-semibold rounded-full" onClick={handleNextClick}>
              Suivant
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className={`mt-4 ${!showSecondColumn && "hidden lg:block"}`}>
          <DynamicHtmlTag type="div" className="flex justify-between">
            <HeadingTag type="h2" className="text-2xs lg:text-xs xl:text-sm font-semibold text-sky-200 mt-2 xl:mt-4">
              Médecin traitant
            </HeadingTag>
            <DynamicHtmlTag type="div" className="lg:hidden flex gap-2">
              <CustomImage src="/images/pencil-edit.svg" alt="edit" width={20} height={20}></CustomImage>
              <DynamicHtmlTag type="span" className="text-2xs text-sky-300 relative top-[5px]">
                Modifier
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2 mb-6 2xl:gap-2 lg:mb-0 xl:mb-2">
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Médecin traitant
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Dr Franck Dupont
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Ville
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Bordeaux
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Code postal
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              33000
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <HeadingTag type="h2" className="text-2xs lg:text-xs xl:text-sm font-semibold text-sky-200 mt-2 xl:mt-4">
            Personne à contacter
          </HeadingTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2 mb-6 2xl:gap-2 lg:mb-0 xl:mb-2">
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Prénom
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Adeline
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Nom
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Arpin
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Téléphone
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              +33 06 38 67 50 28
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Adresse email
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              adelinearpin@gmail.com
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <HeadingTag type="h2" className="text-2xs lg:text-xs xl:text-sm font-semibold text-sky-200 mt-2 xl:mt-4">
            Sécurité sociale
          </HeadingTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2 mb-6 2xl:gap-2 lg:mb-0 xl:mb-2">
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              N° sécurité sociale
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              2 85 04 75 588 157 80
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <HeadingTag type="h2" className="text-2xs lg:text-xs xl:text-sm font-semibold text-sky-200 mt-2 xl:mt-4 lg:mb-0">
            Mutuelle
          </HeadingTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-2">
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              N° carte
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              2 85 04 75 588 157 80
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-light">
              Validité
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-2xs lg:text-2xs 2xl:text-xs font-medium">
              Du 01/01/2024 au 31/01/2024
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="mt-4 hidden xl:flex justify-end mb-2">
            <CustomButton type="button" className="w-36 cstm-btn block card-btn text-white py-1 rounded-full text-xs">
              Modifier
            </CustomButton>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="mt-10 flex justify-end mb-3 xl:hidden lg:mt-3">
            <CustomButton type="button" className="w-36 cstm-btn block card-btn text-white py-2 rounded-full text-xs" onClick={handlePreviousClick}>
              Précédent
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};
export default AgendaIdentity;
