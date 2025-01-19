"use client";
import React from "react";
import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";

const PastConsultationsEmpty = () => {
  return (
    <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-[92%] flex flex-col">
      <DynamicHtmlTag type="div" className="w-11/12 md:w-9/12 mx-auto flex flex-col justify-center items-center h-full">
        <CustomImage
          src="/images/past-consultations-empty.svg"
          alt="past-consultations"
          width={200}
          height={200}
          className="w-28 lg:w-48 h-28 lg:h-48 max-w-max mx-auto"
        />
        <HeadingTag type="h2" className="text-xs md:text-base text-center text-blue mt-5 font-bold">
          Vous trouverez ici l{"’"}historique de vos téléconsultations, c{"’"}est également ici que vous pourrez récupérer vos documents dès que la
          téléconsultation sera clôturée par le praticien.
        </HeadingTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default PastConsultationsEmpty;
