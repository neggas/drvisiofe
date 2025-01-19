"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import React from "react";

const Welcome = () => {
  return (
    <DynamicHtmlTag type="div" className="h-full">
      <DynamicHtmlTag type="div" className="px-3 md:px-11 xl:px-10 rounded-md h-full practitioner-document-main pb-0 overflow-hidden">
        <HeadingTag
          type="h1"
          className="text-black pt-5 lg:pt-7 xl:pt-9 2xl:pt-10 text-center lg:text-left text-xs md:text-xs lg:text-xl xl:text-2xl 2xl:text-3xl font-bold w-10/12 mx-auto">
          Découvrez la nouveauté de DrVisio
        </HeadingTag>
        <DynamicHtmlTag type="div" className="h-[95%] lg:h-5/6 flex items-center">
          <DynamicHtmlTag type="div" className="">
            <DynamicHtmlTag type="div" className="grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4 xl:gap-16 2xl:gap-20 items-center">
              <DynamicHtmlTag type="div">
                <HeadingTag type="h2" className="text-lg md:text-lg lg:text-xl xl:text-3xl 2xl:text-5xl font-bold text-blue pb-0 md:pb-0.5">
                  L’intelligence Artificielle
                </HeadingTag>
                <DynamicHtmlTag type="p" className="text-sky-600 text-sm md:text-base lg:text-lg 2xl:text-3xl font-bold pb-2 lg:pb-5">
                  au service des comptes rendus
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="overscroll-y-auto h-[30dvh] lg:h-[40dvh]">
                  <DynamicHtmlTag type="p" className="text-2xs lg:text-3xs xl:text-xs 2xl:text-base text-blue mt-2 lg:mt-3 xl:mt-5">
                    Reconnaissance vocale et transcription automatique.
                    <br />
                    Toutes ces méthodes et ces astuces ont pour objectif de nous faire gagner un temps considérable.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-2xs lg:text-3xs xl:text-xs 2xl:text-base pt-2 lg:pt-3 text-blue">
                    Tous mobilisés contre le cancer du sein ! Le dépistage, parlez-en autour de vous. jdhvhegb au moins une fois par an et dès 50
                    ans,Tous mobilisés contre le cancer du sein ! Le dépistage, parlez-en autour de vous. jdhegb au moins une fois par an et dès 50
                    ans, oh es astuces ont pour objectif de nous faire gagne.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-2xs lg:text-3xs xl:text-xs 2xl:text-base pt-2 lg:pt-3 text-blue">
                    Tous mobilisés contre le cancer du sein ! Le dépistage, parlez-en autour de vous. jdhvhegb au moins une fois par an et dès 50
                    ans,Tous mobie.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div">
                <CustomImage
                  src={"/images/welcome-info.webp"}
                  alt="document-banner"
                  width={600}
                  height={400}
                  className="banner-img w-3/6 md:w-1/2 lg:w-3/4 2xl:w-3/4 mx-auto lg:me-[4%]"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton className="card-btn rounded-full text-xs lg:text-2xs xl:text-sm font-semibold text-white px-3 py-1 mx-auto block mt-3 md:mt-4 lg:mt-11">
              Voir la démo
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Welcome;
