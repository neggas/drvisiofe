"use client";

import { DynamicHtmlTag, CustomImage, CustomButton, CustomLink } from "@/components";
import { useRouter } from "next/navigation";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export default function TeleconsultDoctor() {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/search");
  };
  return (
    <DynamicHtmlTag
      type="div"
      className="gradient-image rounded-b-xl grid sm:grid-cols-1 lg:grid-cols-2 place-items-center px-5 py-5 md:auto-cols-min relative">
      <DynamicHtmlTag type="div" className="w-full md:w-10/12 teleconsult-main-box">
        <DynamicHtmlTag type="h1" className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-5 lg:mb-20">
          Téléconsulter un
          <DynamicHtmlTag type="span" className="text-primary block leading-loose">
            Médecin
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <CustomImage
          src={"/images/main-banner.webp"}
          alt="banner"
          width={565}
          height={416}
          className="w-[80%] main-banner-image md:w-2/6 m-auto lg:hidden"
        />
        <DynamicHtmlTag type="div" className="flex flex-col gap-4 xl:gap-6 2xl:gap-8 mt-6 lg:mt-0">
          <CustomButton
            className="card-btn cstm-btn sm:w-11/12 lg:w-10/12 text-2xs md:text-base xl:text-lg 2xl:text-xl py-2 2xl:py-3"
            onClick={() => handleNavigation()}>
            Prendre un rendez-vous
          </CustomButton>
          <DynamicHtmlTag type="div" className="flex items-center gap-x-2.5 relative lg:mb-8">
            <CustomButton
              className="card-btn cstm-btn sm:w-11/12 lg:w-10/12 text-2xs md:text-base xl:text-lg 2xl:text-xl py-2 2xl:py-3"
              onClick={() => router.push("/waiting-room")}>
              Téléconsulter sans rendez-vous
            </CustomButton>
            <CustomButton
              data-tooltip-id="teleconsult-tooltip"
              className="lg:block absolute -right-2 xl:right-12 2xl:right-16"
              data-tooltip-place="bottom-start"
              data-tooltip-html="Si vous choisissez « Téléconsulter sans rendez-vous » nous mettrons tout en oeuvre pour vous prendre en charge le plus rapidement possible. En choisissant cette solution <strong>vous acceptez la téléconsultation avec le médecin que DrVisio vous attribuera.</strong>">
              <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={25} height={25} className="w-5 md:w-7 2xl:w-9 h-7 2xl:h-9" />
            </CustomButton>
            <Tooltip id="teleconsult-tooltip" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full md:w-11/12 hidden lg:block">
        <CustomImage src={"/images/main-banner.webp"} alt="banner" width={565} height={416} className=" md:mx-auto w-2/4 md:w-4/5 2xl:w-10/12" />
      </DynamicHtmlTag>
      <CustomLink href="/" className="w-fit inline-block p-1 revert-light-gradient rounded-full absolute right-3 top-2">
        <IoCloseSharp className="w-3 h-3 lg:w-5 lg:h-5" />
      </CustomLink>
    </DynamicHtmlTag>
  );
}
