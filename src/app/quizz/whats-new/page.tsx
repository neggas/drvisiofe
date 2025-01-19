"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag, LatestDiscoveryTab, LatestQuizzTab } from "@/components";
import React, { useState } from "react";

const tabs = [
  { label: "Derniers quizz ajoutés", component: LatestQuizzTab, iconSrc: "/images/latest-quiz-icon.svg" },
  { label: "Dernières découvertes des maladies ajoutées", component: LatestDiscoveryTab, iconSrc: "/images/latest-discovery-icon.svg" },
];

const WhatsNew = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <DynamicHtmlTag type="div" className="relative h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12 pb-2">
        <CustomImage src="/images/news-icon.svg" alt="news-icon" width={20} height={20} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          nouveautés
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 h-full">
        <DynamicHtmlTag
          type="div"
          className="bg-white flex-col lg:flex-row h-auto min-h-full text-center pt-2 lg:pt-4 pb-4 rounded-b-xl quiz-inner-dashboard quizz-whats-new">
          <HeadingTag type="h2" className="text-blue font-semibold text-sm mx-auto block pb-3 lg:hidden uppercase h-[5%] overflow-hidden">
            nouveautés
          </HeadingTag>
          <DynamicHtmlTag
            type="div"
            className="identifyTabs flex border-b-[1px] border-blue px-1 mx-4 md:mx-6 lg:hidden mb-2 lg:mb-4 h-[55px] lg:h-[15%] overflow-visible">
            {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                <CustomButton
                  id={`news_tab-${index}`}
                  className={`tabs me-2 px-1 md:px-2 py-1 text-3xs md:text-xs font-semibold ${index === activeTab ? "active-tab" : "non-active-tab"}`}
                  onClick={() => setActiveTab(index)}>
                  <CustomImage
                    src={tab.iconSrc}
                    alt={`tab-${index}-icon`}
                    width={24}
                    height={24}
                    className="w-4 md:w-5 h-4 md:h-5 mx-auto mb-1 md:mb-2"
                  />
                  <DynamicHtmlTag type="span">{tab.label}</DynamicHtmlTag>
                </CustomButton>
              </React.Fragment>
            ))}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-[95%] border border-slate-200 m-auto rounded-xl relative h-[73%] lg:h-full overflow-hidden">
            <DynamicHtmlTag type="div" className="news-gradient-bg">
              <DynamicHtmlTag type="div" className="text-left w-11/12 m-auto pt-3 2xl:pt-5">
                <HeadingTag type="h2" className="text-xs md:text-base xl:text-lg 2xl:text-2xl text-white font-family-Gagalin">
                  NOUVEAUTÉS !!!
                </HeadingTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* Render tabs and content only for mobile */}
            <DynamicHtmlTag type="div" className="lg:hidden">
              {tabs.map((tab, index) => (
                <DynamicHtmlTag
                  type="div"
                  role="tabpanel"
                  className="tab-content h-full"
                  key={index}
                  style={{ display: activeTab === index ? "block" : "none" }}>
                  <tab.component />
                </DynamicHtmlTag>
              ))}
            </DynamicHtmlTag>
            {/* Render tabs and content only for mobile */}
            {/* Desktop view of boxes */}
            <DynamicHtmlTag
              type="div"
              className="hidden lg:flex sm:flex-col md:flex-row gap-5 justify-between px-2 md:px-7 xl:pt-3 2xl:pt-5 items-stretch">
              {/* Card-box-one */}
              <DynamicHtmlTag type="div" className="hidden lg:block w-full lg:w-3/6">
                <LatestQuizzTab />
              </DynamicHtmlTag>
              {/* Card-box-two */}
              <DynamicHtmlTag type="div" className="hidden lg:block w-full lg:w-3/6">
                <LatestDiscoveryTab />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex items-end justify-between absolute bottom-0 w-full">
              <DynamicHtmlTag type="div" className="w-1/4 md:w-2/6">
                <CustomImage
                  src="/images/news-left-icon.svg"
                  alt="news-left-icon"
                  width={280}
                  height={100}
                  className="rounded-bl-xl w-44 md:w-48 lg:w-52 xl:w-52 2xl:w-72"
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-3/5 md:w-2/6">
                <CustomImage
                  src="/images/what-new-bottom.svg"
                  alt="what-new-bottom"
                  width={400}
                  height={150}
                  className="w-48 lg:w-56 xl:w-60 2xl:w-80 mx-auto lg:mx-0"
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-1/4 md:w-2/6">
                <CustomImage
                  src="/images/news-right-icon.svg"
                  alt="news-right-icon"
                  width={100}
                  height={100}
                  className="rounded-br-xl me-0 ms-auto w-12 md:w-16 lg::w-14 xl:w-14 2xl:w-24"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-full flex lg:hidden px-4 md:px-6 absolute bottom-0.5">
            <CustomButton type="button" className="[&&]:text-2xs card-btn w-28 md:w-32 py-1 rounded-xl font-semibold text-white ms-auto mt-3 lg:mt-0">
              Découvrir
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default WhatsNew;
