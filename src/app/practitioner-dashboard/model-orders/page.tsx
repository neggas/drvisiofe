"use client";
import { CustomAsyncSelect, CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const ModelOrders = () => {
  return (
    <DynamicHtmlTag type="div" className="flex h-full">
      <DynamicHtmlTag type="div" className="h-[96%] w-[30%] rounded-md overflow-hidden bg-white relative m-[1%] me-[.5%]">
        <DynamicHtmlTag type="div" className="bg-gradient-to-t from-pink-600 to-pink-700 mb-2 xl:mb-2 p-1 hidden lg:block">
          <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-white lg:text-center capitalize">
            Ordonnances types
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
          <DynamicHtmlTag type="div" className="w-full h-[98%]">
            <DynamicHtmlTag type="div" className="pt-0.5 pb-1 w-full mb-2 flex justify-between items-center h-[8%] overflow-hidden">
              <CustomButton
                type="button"
                className="bg-[#42A9E0] text-white py-1.5 2xl:py-2 px-2 2xl:px-3 rounded-full block text-2xs lg:text-xs mx-auto">
                Créer une nouvelle ordonnance
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex items-center justify-between px-4">
              <DynamicHtmlTag type="div" className="h-1/6 w-full md:w-7/12 2xl:w-8/12">
                <DynamicHtmlTag type="div" className="bg-gray-100 rounded-full px-4 py-1.5 flex items-center justify-start">
                  <IoSearchOutline className="text-blue text-lg 2xl:text-xl" />
                  {/* Need to change search functionality is static now */}
                  <CustomAsyncSelect
                    className="text-xs w-full quiz-searchbox"
                    placeholder="Recherche"
                    loadOptions={"loadSpecialityOptions"}
                    onChange={"handleSpecialityChange"}
                    value={"standard-orders"}
                    isClearable
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex gap-1 items-center">
                <DynamicHtmlTag type="span" className="font-semibold text-sm">
                  Filtre
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="border border-blue rounded-full w-7 h-7 p-1">
                  <CustomImage src="/images/filter-options-icon.svg" alt="filter" width={20} height={20} className="w-5 h-5" />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>{" "}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="h-[96%] w-[70%] rounded-md overflow-hidden bg-white relative m-[1%] ms-[.5%]">
        <DynamicHtmlTag type="div" className="mb-2 xl:mb-2 p-1 hidden lg:block">
          <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-white lg:text-center capitalize">
            Récapitulatif
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
          <DynamicHtmlTag type="div" className="w-full h-[98%]"></DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default ModelOrders;
