"use client";
import React from "react";
import { CustomButton, CustomImage, CustomInput, CustomLabel, DynamicHtmlTag, HeadingTag } from "@/components";

interface EmptyScreenProps {
  title: string;
  paragraph: string;
  button: string;
  uniqueId: string;
  onConfirm?: () => void;
}

const EmptyHistory: React.FC<EmptyScreenProps> = ({ title, paragraph, button, uniqueId, onConfirm }) => {
  const checkboxId = `history-checkbox-${uniqueId}`;
  return (
    <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full flex flex-col">
      <DynamicHtmlTag type="div" className="mx-auto mt-5 lg:mt-[8%]">
        <CustomImage
          src="/images/not-history-main.svg"
          alt="not-history-main"
          width={200}
          height={200}
          className="w-28 lg:w-40 2xl:w-48 h-28 lg:h-40 2xl:h-48 max-w-max mx-auto"
        />
        <HeadingTag type="h2" className="text-sm 2xl:text-base text-center text-blue mt-5 font-bold">
          {title}
        </HeadingTag>
        {/* <DynamicHtmlTag type="div" className="cstm-form-group flex items-center mt-2 justify-center">
          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
            <CustomInput className="" type="checkbox" id={checkboxId} />
            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor={checkboxId}>
              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
            </CustomLabel>
          </DynamicHtmlTag>
          <CustomLabel htmlFor="affection" className="ps-3 sm:text-xs font-normal cstm-lable">
            {paragraph}
          </CustomLabel>
        </DynamicHtmlTag> */}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="hidden lg:flex justify-end items-end h-full">
        <CustomButton
          as="button"
          onClick={onConfirm}
          className="card-btn text-2xs 2xl:text-xs text-white py-1.5 2xl:py-2 px-3 font-semibold rounded-2xl inline-block">
          {button}
        </CustomButton>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default EmptyHistory;
