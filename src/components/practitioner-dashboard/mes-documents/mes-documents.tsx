"use client";
import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
import { LuFile } from "react-icons/lu";

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

const MesDocuments = () => {
  return (
    <DynamicHtmlTag type="div" className="w-full">
      <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-2 xl:mb-2 p-1 hidden lg:block">
        <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-customBlue lg:text-center uppercase">
          Mes Documents
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex p-5 w-full flex-wrap text-xs">
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            passport
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-red-500 mx-auto rounded-md relative">
            <CustomImage src="/images/passport.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-red-500" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            Resume
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-yellow-200 mx-auto rounded-md relative">
            <CustomImage src="/images/cv.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-yellow-200" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            Attestation d’inscription au conseil de l’ordre
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-green-500 mx-auto rounded-md relative">
            <CustomImage src="/images/dr-des.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-green-500" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            passport
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-purple-500 mx-auto rounded-md relative">
            <CustomImage src="/images/passport.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-purple-500" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            passport
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-green-500 mx-auto rounded-md relative">
            <CustomImage src="/images/passport.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-green-500" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-1/2 p-2">
          <HeadingTag type="h4" className="text-center font-semibold flex h-10 capitalize line-clamp-2 items-end justify-center">
            passport
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border-2 border-yellow-500 mx-auto rounded-md relative">
            <CustomImage src="/images/passport.png" alt="passport" width={200} height={300} className="w-24 h-32 mx-auto" />
            <LuFile className="absolute right-2 bottom-2 w-6 h-6 text-yellow-500" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default MesDocuments;
