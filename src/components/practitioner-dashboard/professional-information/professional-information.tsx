"use client";
import { CustomButton, CustomImage, CustomInput, CustomLabel, CustomSelect, DynamicHtmlTag, HeadingTag } from "@/components";
import React from "react";

const Langues = [
  { value: "FR - Français", label: "FR - Français" },
  { value: "EN - English", label: "EN - English" },
  { value: "ES - Espagnol", label: "ES - Espagnol" },
  { value: "DE - Deutsch", label: "DE - Deutsch" },
  { value: "TR - Türkçe", label: "TR - Türkçe" },
  { value: "RO - Româna", label: "RO - Româna" },
  { value: "Espagnol", label: "Espagnol" },
  { value: "Deutsch", label: "Deutsch" },
  { value: "Türkçe", label: "Türkçe" },
  { value: "Româna", label: "Româna" },
];

const ProfessionalInformation = () => {
  return (
    <DynamicHtmlTag type="div" className="w-full">
      <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-2 xl:mb-2 p-1 hidden lg:block">
        <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-customBlue lg:text-center uppercase">
          informations professionnelles
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex items-center justify-center lg:px-5 relative -mt-5 lg:mt-0 2xl:my-3">
        <CustomImage
          src="/images/professional-img.png"
          alt="professional-img"
          width={220}
          height={80}
          className="w-3/6 lg:w-5/6 xl:w-2/6 2xl:w-3/6"
        />
        <CustomButton type="button" className="absolute left-0 flex justify-between items-center gap-2 lg:hidden">
          <CustomImage src="/images/edit-icon.png" alt="edit-icon" width={20} height={20} className="w-5" />
          <DynamicHtmlTag type="span" className="text-customBlue">
            modi.
          </DynamicHtmlTag>
        </CustomButton>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="lg:p-4 xl:p-4 pb-0 pt-0 ">
        <DynamicHtmlTag type="div" className="flex gap-2 flex-col lg:flex-row">
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Numéro RPPS</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="0000000000"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Numéro CDOM</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="0000000000"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none disabled:bg-gray-300"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Numéro FINESS</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="0000000000"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none disabled:bg-gray-300"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Nméro ADELI</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="00 00 0000 0"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none disabled:bg-gray-300"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col w-full mt-2">
          <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Type d’activité</CustomLabel>
          <CustomInput
            type="text"
            name=""
            placeholder="Libérale"
            className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none"
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 flex-wrap">
          <DynamicHtmlTag type="div" className="flex flex-col w-full">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Spécialité</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Spécialité"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 w-full">
            <CustomLabel className="pb-1 ps-2 text-2xs xl:text-3xs 2xl:text-xs xl:leading-none">Langues parlées</CustomLabel>
            <CustomSelect
              options={Langues}
              className="timing-select outline-none text-2xs xl:text-3xs 2xl:text-xs xl:leading-none rounded-md border border-gray-200 font-semibold"
              isMulti
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 w-full">
            <CustomLabel className="pb-1 ps-2 text-2xs xl:text-3xs 2xl:text-xs xl:leading-none">Langues parlées</CustomLabel>
            <CustomSelect
              options={Langues}
              className="timing-select outline-none text-2xs xl:text-3xs 2xl:text-xs xl:leading-none rounded-md border border-gray-200 font-semibold"
              isMulti
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 pe-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Secteur</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Secteur"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 ps-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Tarif minimum</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="Tarif minimum"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 pe-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Tarif maximum</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="Tarif maximum"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 ps-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Tiers payant</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="Tiers payant"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default ProfessionalInformation;
