"use client";
import React from "react";
import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";

const UpcomingConsultationsEmpty = () => {
  return (
    <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-[92%] flex flex-col">
      <DynamicHtmlTag type="div" className="w-11/12 md:w-9/12 mx-auto flex flex-col justify-center items-center h-full">
        <CustomImage
          src="/images/venir-empty.svg"
          alt="consultations-venir"
          width={200}
          height={200}
          className="w-28 lg:w-48 h-28 lg:h-48 max-w-max mx-auto"
        />
        <HeadingTag type="h2" className="text-xs md:text-base text-center text-blue mt-5 font-bold">
          Vous n{"’"}avez aucune téléconsultation de prévu, Pour consulter un praticien cliquez sur « prendre un RDV »
        </HeadingTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default UpcomingConsultationsEmpty;
