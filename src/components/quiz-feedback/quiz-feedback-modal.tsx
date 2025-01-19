import React from "react";
import { CustomButton, CustomImage, DynamicHtmlTag } from "@/components";

interface QuizFeedbackProps {
  isAnswerCorrect: boolean | null;
  explanation: string;
  handleNext: () => void;
  nbGoodAnswers: number;
  nbBadAnswers: number;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ isAnswerCorrect, handleNext, explanation }) => {
  return (
    <DynamicHtmlTag type="div" className="w-full">
      {/* Answer Explanation Block */}
      {isAnswerCorrect !== null && (
        <DynamicHtmlTag
          type="div"
          className={`w-full flex items-center justify-start rounded-lg p-2 text-base-100 shadow-md gap-5 mt-0 md:mt-1 lg:mt-4 xl:mt-1 2xl:mt-4 ${
            isAnswerCorrect ? "bg-gradient-to-b from-indigo-500 to-sky-500" : "bg-red-600"
          }`}>
          {isAnswerCorrect ? (
            <DynamicHtmlTag
              type="div"
              className="w-full right-card lg:flex items-center justify-start rounded-lg p-0 md:p-2 text-base-100 gap-2 md:gap-5">
              <DynamicHtmlTag type="div" className="w-full flex lg:w-32 lg:flex lg:items-center lg:justify-center lg:mr-2">
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag
                    type="span"
                    className="flex items-center justify-center w-6 2xl:w-7 h-6 2xl:h-7 bg-gradient-to-l from-[#61B34B] to-[#40AF6B] rounded-full lg:relative bottom-3 2xl:bottom-5">
                    <CustomImage src="/images/right-icon.svg" alt="right-icon" width={20} height={20} className="w-3 2xl:w-5" />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full flex justify-between mt-0 lg:mt-5 xl:mt-1 lg:block">
                  <DynamicHtmlTag type="div" className="flex gap-1 lg:block font-family-Gagalin pt-1 lg:pt-0">
                    <DynamicHtmlTag type="div" className="uppercase pl-2 text-xs 2xl:text-base">
                      Bonne
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="uppercase text-xs 2xl:text-base lg:relative lg:right-[10px]">
                      Réponse !
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="lg:hidden">
                    <DynamicHtmlTag type="span" className="font-medium text-xs relative bottom-1 xl:text-xs 2xl:text-sm">
                      EXPLICATIONS
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4 lg:mt-0">
                <DynamicHtmlTag type="div" className="text-sm">
                  <DynamicHtmlTag type="span" className="hidden lg:block font-medium xl:text-xs 2xl:text-sm">
                    EXPLICATIONS
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="mt-2 w-full">
                    <DynamicHtmlTag type="p" className="text-xs max-h-14 overflow-y-auto">
                      {explanation}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          ) : (
            <DynamicHtmlTag
              type="div"
              className="w-full cross-card lg:flex items-center justify-start rounded-lg p-0 md:p-2 text-white gap-2 md:gap-5">
              <DynamicHtmlTag
                type="div"
                className="w-full justify-center lg:h-auto lg:w-32 flex lg:flex-nowrap lg:items-center lg:justify-center lg:mr-2">
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag
                    type="span"
                    className="flex items-center justify-center w-6 2xl:w-7 h-6 2xl:h-7 bg-red-600 rounded-full lg:relative bottom-3 2xl:bottom-5">
                    <CustomImage src="/images/cross-icon.svg" alt="cross-icon" width={20} height={20} className="w-4 2xl:w-5" />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full flex justify-between mt-0 lg:mt-5 xl:mt-1 lg:block">
                  <DynamicHtmlTag type="div" className="flex gap-1 lg:block font-family-Gagalin pt-1 lg:pt-0">
                    <DynamicHtmlTag type="div" className="uppercase pl-2 text-xs 2xl:text-base">
                      MAUVAISE
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="uppercase text-xs 2xl:text-base lg:relative lg:right-[10px]">
                      Réponse !
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="lg:hidden">
                    <DynamicHtmlTag type="span" className="font-medium text-xs relative bottom-1 xl:text-xs 2xl:text-sm">
                      EXPLICATIONS
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4 lg:mt-0">
                <DynamicHtmlTag type="div" className="text-sm">
                  <DynamicHtmlTag type="span" className="hidden lg:block font-medium xl:text-xs 2xl:text-sm">
                    EXPLICATIONS
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="mt-2 w-full">
                    <DynamicHtmlTag type="p" className="text-xs max-h-14 overflow-y-auto">
                      {explanation}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
      )}
      <DynamicHtmlTag type="div" className="w-full mt-2 md:mt-3 flex justify-end">
        <CustomButton
          type="button"
          className="w-32 md:w-40 lg:w-44 text-base-100 font-bold shadow-md rounded-full card-btn bg-gradient-to-b from-sky-500 to-indigo-500 py-1.5 lg:py-2 px-3 lg:px-4 text-2xs xl:text-xs 2xl:text-lg"
          onClick={handleNext}>
          Suivant
        </CustomButton>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default QuizFeedback;
