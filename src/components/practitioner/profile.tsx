"use client";

import React from "react";
import { DynamicHtmlTag, HeadingTag, CustomImage, CustomList, CustomListItems } from "@/components";
import { PractitionerType } from "@/utility";

interface ProfileProps {
  practitioner: PractitionerType;
}

const Profile: React.FC<ProfileProps> = ({ practitioner }) => {
  return (
    <DynamicHtmlTag
      type="div"
      className="bg-base-100 px-4 py-1 md:px-5 md:py-3 lg:py-5 rounded-2xl col-span-1 lg:col-span-2 xl:col-span-1 lg:h-full lg:overflow-auto sticky md:static lg:sticky top-0 z-[100] md:mb-4 lg:mb-0">
      <DynamicHtmlTag
        type="div"
        className="flex p-2 md:p-0 items-center gap-3 border md:border-0 border-gray-200 rounded-lg md:rounded-none md:me-auto md:mt-3 lg:mt-0 sticky md:static lg:sticky top-0 z-10 bg-base-100">
        {Object.keys(practitioner).length > 0 && (
          <CustomImage
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${practitioner?.avatar?.url}`}
            placeholderSrc={"https://via.placeholder.com/150"}
            alt={practitioner?.firstName}
            width={66}
            height={65}
            className="w-8 lg:w-12"
          />
        )}
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs md:text-xs leading-4 text-blue font-bold">
            {Object.keys(practitioner).length > 0 && `Dr. ${practitioner?.firstName} ${practitioner?.lastName}`}
          </HeadingTag>
          <HeadingTag type="h3" className="text-sm md:text-xs font-semibold text-lightgrey">
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.speciality?.name}
          </HeadingTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start gap-5 mt-6">
        <CustomImage src={"/images/info-icon.svg"} alt="info-icon" width={15} height={15} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Numéro RPPS
          </HeadingTag>
          <HeadingTag type="h3" className="text-xs font-semibold text-darktext">
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.rpps}
          </HeadingTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start	gap-5 mt-4">
        <CustomImage src={"/images/currency-icon.svg"} alt="currency-icon" width={15} height={15} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Tarifs téléconsultation
          </HeadingTag>
          <HeadingTag type="h3" className="text-xs font-semibold text-darktext">
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.tarifMin ? practitioner.practitionerData.tarifMin + "€" : ""}
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.tarifMax
              ? "à " + practitioner.practitionerData.tarifMax + "€"
              : ""}
          </HeadingTag>
          <DynamicHtmlTag type="p" className="font-semibold text-[0.5rem]">
            Ces honoraires vous sont communiqués à titre indicatif par le praticien. Ils peuvent varier suivant l’acte réalisé pendant la
            téléconsultation. En cas d’évolution de tarif, le praticien doit vous informer pendant le rendez-vous.
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="font-semibold text-[0.5rem]">
            A la fin de la téléconsultation, vous serez débitée et recevrez un récapitulatif de paiement.
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start gap-5 mt-4">
        <CustomImage src={"/images/location.svg"} alt="location" width={13} height={12} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Localisation
          </HeadingTag>
          <HeadingTag type="h3" className="text-xs font-semibold text-darktext">
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.city?.cityName} (
            {Object.keys(practitioner).length > 0 && practitioner?.practitionerData?.postalCode})
          </HeadingTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start gap-5 mt-4">
        <CustomImage src={"/images/language.svg"} alt="language" width={16} height={15} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Langue(s) parlée(s)
          </HeadingTag>
          <HeadingTag type="h3" className="text-xs font-semibold text-darktext">
            {Object.keys(practitioner).length > 0 &&
              practitioner?.spokenLanguages
                .map(language => {
                  return language.name;
                })
                .join(" / ")}
          </HeadingTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start	gap-5 mt-4">
        <CustomImage src={"/images/documents-icon.svg"} alt="documents" width={15} height={18} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Délivrance de documents
          </HeadingTag>
          <DynamicHtmlTag type="div" className="text-xs font-semibold text-darktext">
            <CustomList>
              {Object.keys(practitioner).length > 0 &&
                practitioner?.practitionerData?.deliveryDocument.map(document => {
                  return <CustomListItems key={document.id}>{document.name}</CustomListItems>;
                })}
            </CustomList>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden md:flex items-start gap-5 mt-4">
        <CustomImage src={"/images/diploma-icon.svg"} alt="diploma" width={15} height={20} />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h4" className="text-xs leading-4 text-customBlue font-bold">
            Diplôme(s)
          </HeadingTag>
          <DynamicHtmlTag type="div" className="text-xs font-semibold text-darktext">
            <CustomList>
              {Object.keys(practitioner).length > 0 &&
                practitioner?.practitionerData?.practitionerDiplomas.map(diploma => {
                  return <CustomListItems key={diploma.id}>{diploma?.file?.name}</CustomListItems>;
                })}
            </CustomList>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Profile;
