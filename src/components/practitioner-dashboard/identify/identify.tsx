"use client";
import { CustomButton, CustomDatePicker, CustomImage, CustomInput, CustomLabel, CustomSelect, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";

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

const PractitionerIdentifyTab = () => {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };

  return (
    <DynamicHtmlTag type="div" className="w-full">
      <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-2 xl:mb-2 p-1 hidden lg:block">
        <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-customBlue lg:text-center uppercase">
          IDENTITÉ
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex items-center justify-between lg:px-5 relative -mt-5 lg:mt-0 2xl:my-3 py-5">
        <CustomButton type="button" className="absolute left-0 flex justify-between items-center gap-2 lg:hidden">
          <CustomImage src="/images/edit-icon.png" alt="edit-icon" width={20} height={20} className="w-5" />
          <DynamicHtmlTag type="span" className="text-customBlue">
            modi.
          </DynamicHtmlTag>
        </CustomButton>
        <DynamicHtmlTag type="div" className="w-full">
          <CustomImage src="/images/quiz-profile.svg" alt="user-img" width={50} height={50} className="rounded-full w-14 2xl:w-24 xl:w-16 mx-auto" />
        </DynamicHtmlTag>
        <CustomInput type="file" className="hidden" name="" id="identifyUpload" />
        <CustomLabel
          htmlFor="identifyUpload"
          className="text-3xs 2xl:text-2xs leading-none card-btn flex w-fit items-center justify-center gap-x-2 px-4 py-1 rounded-xl cursor-pointer [&&]:absolute right-0 lg:right-5">
          <CustomImage src="/images/camera.svg" alt="camera" width={15} height={15} />
          <DynamicHtmlTag type="span" className="text-3xs 2xl:text-sm 2xl:leading-relaxed xl:text-2xs leading-none font-semibold text-white">
            importer
          </DynamicHtmlTag>
        </CustomLabel>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="lg:p-4 xl:p-4 pb-0 pt-0 ">
        <DynamicHtmlTag type="div" className="flex gap-2 flex-col lg:flex-row">
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Nom</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Nom"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Prénom</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Prénom"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none disabled:bg-gray-300"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Date de naissance</CustomLabel>
            <DynamicHtmlTag
              type="div"
              className="form-date-picker date-picker flex items-center outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200  py-1 px-2">
              <DynamicHtmlTag type="span" className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">
                <CustomDatePicker selected={startDate} onChange={(date: any) => handleDateOptionChange(date)} dateFormat={"dd/MM/yyyy"} />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Genre</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Genre"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none disabled:bg-gray-300"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col w-full mt-2">
          <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Nationnalité</CustomLabel>
          <CustomInput
            type="text"
            name=""
            placeholder="Nationnalité"
            className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none"
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 flex-wrap">
          <DynamicHtmlTag type="div" className="flex flex-col w-full">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Pays</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Pays"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 pe-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Ville</CustomLabel>
            <CustomInput
              type="text"
              name=""
              placeholder="Ville"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2 ps-1 mt-2">
            <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Code postal</CustomLabel>
            <CustomInput
              type="number"
              name=""
              placeholder="Code postal"
              className="outline-none text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2">
          <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Adresse</CustomLabel>
          <CustomInput
            type="text"
            name=""
            placeholder="Adresse"
            className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none rounded-md border border-gray-200 font-semibold py-1 px-2 outline-none"
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2 w-full">
          <CustomLabel className="pb-1 ps-2 text-2xs xl:text-3xs 2xl:text-xs xl:leading-none">Langues parlées</CustomLabel>
          <CustomSelect
            options={Langues}
            className="timing-select language-multiselect outline-none text-2xs xl:text-3xs 2xl:text-xs xl:leading-none rounded-md border border-gray-200 font-semibold"
            isMulti
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2">
          <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Téléphone</CustomLabel>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2">
            <DynamicHtmlTag
              type="div"
              className="bg-gray-300 w-2/12 rounded-l-md py-1 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed leading-tight text-center font-semibold">
              +33
            </DynamicHtmlTag>
            <CustomInput
              type="number"
              name=""
              placeholder="686 38 67 50 28"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none font-semibold py-1 px-2 outline-none w-8/12"
            />
            <CustomLabel className="ps-2 text-[.6rem] leading-tight 2xl:leading-relaxed font-semibold text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
              Vérifié
            </CustomLabel>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2">
          <CustomLabel className="ps-2 text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none">Adresse email</CustomLabel>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2 px-1">
            <CustomInput
              type="email"
              name=""
              placeholder="Adresse email"
              className="text-2xs xl:text-2xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none font-semibold py-1 px-2 outline-none w-10/12"
            />
            <CustomLabel className="ps-2 text-[.6rem] leading-tight 2xl:leading-relaxed font-semibold text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
              Vérifié
            </CustomLabel>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default PractitionerIdentifyTab;
