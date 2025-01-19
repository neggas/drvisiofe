"use client";
import React, { useRef, useState } from "react";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import { IoCloseSharp } from "react-icons/io5";

const EmptyDocument = () => {
  const [page, setPage] = useState(0);

  return (
    <>
      <DynamicHtmlTag type="div" className="tabs-content rounded-t-lg pt-0" id="document-view">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Comptes rendus
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex lg:hidden items-center justify-between mt-2 pb-4 border-b border-slate-100 mx-4">
        <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-2xl lg:hidden">
          Ajouter un document
        </CustomButton>
        <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" as="button">
          <IoCloseSharp className="w-5 h-5" />
        </CustomButton>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-[92%] flex flex-col">
        <DynamicHtmlTag type="div" className="mx-auto mt-[10%] justify-center">
          <CustomImage src="/images/empty-doc-img.svg" alt="not-document" width={400} height={400} className=" max-w-max mx-auto" />
          <HeadingTag type="h2" className="text-base text-blue mt-5 font-bold text-center">
            Vous n’avez pas de document
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex justify-end items-end h-full">
          <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-2xl hidden lg:inline-block">
            Ajouter un document
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
  );
};

export default EmptyDocument;
