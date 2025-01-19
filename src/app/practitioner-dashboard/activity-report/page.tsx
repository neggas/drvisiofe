"use client";
import { CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import React from "react";

const ActivityReport = () => {
  return (
    <DynamicHtmlTag type="div" className="flex h-full">
      <DynamicHtmlTag type="div" className="h-[96%] w-[70%] rounded-md overflow-hidden bg-white relative m-[1%] me-[.5%]">
        <DynamicHtmlTag type="div" className="custom-gradient-blue mb-2 xl:mb-2 p-1 hidden lg:block">
          <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-white lg:text-center capitalize">
            rapport d’activité
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
          <DynamicHtmlTag type="div" className="w-full h-[98%]">
            <DynamicHtmlTag type="div" className="py-2 w-full mb-3 flex justify-between items-center h-[8%] overflow-hidden"></DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>{" "}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="h-[96%] w-[30%] rounded-md overflow-hidden bg-white relative m-[1%] ms-[.5%]">
        <DynamicHtmlTag type="div" className="custom-gradient-blue mb-2 xl:mb-2 p-1 hidden lg:block">
          <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-white lg:text-center capitalize">
            Récapitulatif
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
          <DynamicHtmlTag type="div" className="w-full h-[98%]">
            <HeadingTag type="h4" className="text-center font-semibold">
              Activités
            </HeadingTag>
            <DynamicHtmlTag type="div" className="flex gap-2 items-center justify-center mt-4">
              <DynamicHtmlTag type="span" className="text-center w-24 py-1 px-4 text-xs rounded-full bg-green-50 text-white">
                23050€
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="lg:text-xs 2xl:text-sm font-semibold">
                Revenu total du mois en cours
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-2 items-center justify-center mt-4">
              <DynamicHtmlTag type="span" className="text-center w-24 py-1 px-4 text-xs rounded-full bg-green-700 text-white">
                + 8%
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="lg:text-xs 2xl:text-sm font-semibold">
                Comparaison au mois dernier
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomImage src="/images/graph-one.png" alt="graph-one" width={400} height={350} className="w-full h-52 2xl:h-72 my-10" />
            <CustomImage src="/images/graph-two.png" alt="graph-two" width={400} height={350} className="w-full h-52 2xl:h-72 my-10" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default ActivityReport;
