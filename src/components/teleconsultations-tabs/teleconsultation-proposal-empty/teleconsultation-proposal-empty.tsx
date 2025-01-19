"use client";
import React from "react";
import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";

const TeleconsultationProposalEmpty = () => {
  return (
    <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-[92%] flex flex-col">
      <DynamicHtmlTag type="div" className="w-11/12 md:w-9/12 mx-auto flex flex-col justify-center items-center h-full">
        <CustomImage
          src="/images/proposition-empty.svg"
          alt="proposition-empty"
          width={200}
          height={200}
          className="w-28 lg:w-48 h-28 lg:h-48 max-w-max mx-auto"
        />
        <HeadingTag type="h2" className="text-xs md:text-base text-center text-blue mt-2 font-bold">
          Si un médecin souhaite vous revoir, vous verrez sa proposition ici.
        </HeadingTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default TeleconsultationProposalEmpty;
