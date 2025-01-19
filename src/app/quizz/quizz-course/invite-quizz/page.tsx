"use client";
import { CustomButton, CustomForm, CustomImage, CustomInput, CustomLabel, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
const InviteQuizz = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };
  return (
    <DynamicHtmlTag type="div">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12 pb-2">
        <CustomImage src="/images/quiz.svg" alt="quiz" width={20} height={20} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          quizz
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="gradient-main pt-4 rounded-xl bg-gradient-to-l from-indigo-500 to-sky-500 quiz-invite-main-start">
        <DynamicHtmlTag type="div" className="bg-[#fff] rounded-b-xl quiz-inner-dashboard h-full">
          <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase lg:hidden text-center mt-2">
            quizz
          </HeadingTag>
          <DynamicHtmlTag type="div" className="h-[90%] lg:h-[98%] flex flex-col px-3 md:px-5 lg:px-6 justify-between">
            <DynamicHtmlTag type="div" className="shadow-lg rounded-lg p-2 lg:p-5 mb-1 lg:mb-3 mt-3 md:h-1/4 2xl:h-1/5">
              <DynamicHtmlTag type="div" className="flex items-center gap-3">
                <CustomLink
                  href="/quizz/quizz-course"
                  className="custom-grey-btn w-5 lg:w-8 h-5 lg:h-8 flex items-center justify-center [&&]:shadow-none rounded-full">
                  <CustomImage src="/images/back-icon.svg" alt="back-icon" width={8} height={8} className="w-1.5 lg:w-2.5 h-1.5 lg:h-2.5" />
                </CustomLink>
                <DynamicHtmlTag type="span" className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold">
                  Retour aux modes jeux et thèmatiques
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="div"
                className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold mt-2 lg:mt-4 xl:mt-2 2xl:mt-4 text-center flex flex-col lg:flex-row lg:gap-4 justify-center">
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="span">MODE DE QUIZZ :</DynamicHtmlTag> <DynamicHtmlTag type="span">Défier un ami </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="span">THÈMATIQUE : </DynamicHtmlTag>
                  <DynamicHtmlTag type="span">Cardiologie</DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="text-2xs font-semibold lg:text-xs mt-3 text-center">
                <DynamicHtmlTag type="span">LIEN : </DynamicHtmlTag>
                <CustomLink
                  className="text-customBlue xl:text-xs 2xl:text-sm"
                  href="ttps://drvisio-espace-quizz-médical//défierunami-thèmatique-cardiologie-20questionsaléatoires.com">
                  https://drvisio-espace-quizz-médical//défierunami-thèmatique-cardiologie-20questionsaléatoires.com
                </CustomLink>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="shadow-lg rounded-lg pt-0 lg:pt-3 pb-3 px-2 lg:px-5 mb-1 lg:mb-3 mt-3 relative overflow-scroll quiz-invite-inner md:h-2/3">
              <HeadingTag
                type="h4"
                className="text-xs 2xl:text-sm 2xl:my-3 uppercase text-center font-semibold sticky top-0 bg-white z-10 pt-1.5 lg:pt-0 pb-1 lg:pb-0">
                envoyer le lien
              </HeadingTag>
              <DynamicHtmlTag type="div" className={`flex my-3 flex-wrap lg:flex-nowrap gap-y-3 ${isOpen ? "hidden lg:flex" : ""}`}>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton onClick={toggleForm} type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/drvisio-icon.svg" alt="drvisio-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    DrVisio (espace Quizz)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/gmail-icon.svg" alt="gmail-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    Email
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/whatsapp-icon.svg" alt="whatsapp-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    WhatsApp
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/messanger-icon.svg" alt="messanger-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    Messenger
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/facebook-icon.svg" alt="facebook-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    Facebook
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/instagram-icon.svg" alt="instagram-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    Instagram
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-4/12 md:w-3/12 lg:w-1/5 flex flex-col items-center gap-y-1 lg:gap-y-3 xl:gap-y-1">
                  <CustomButton type="button" className="flex items-center justify-center rounded-full w-6/12">
                    <CustomImage src="/images/snapchat-icon.svg" alt="snapchat-icon" width={60} height={60} className="xl:w-10 2xl:w-16" />
                  </CustomButton>
                  <DynamicHtmlTag type="p" className="text-2xs text-center lg:text-xs px-1">
                    Snapchat
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="div"
                className={`p-3 h-full lg:h-auto rounded-lg lg:rounded-none w-full lg:border-t-2 border-black ${isOpen ? "absolute lg:relative bg-white top-0  left-0" : "hidden"}`}>
                <HeadingTag type="h4" className="text-xs uppercase text-center lg:hidden font-semibold mb-2">
                  envoyer le lien
                </HeadingTag>
                <CustomImage src="/images/drvisio-icon.svg" alt="drvisio-icon" width={45} height={45} className="mx-auto lg:hidden" />
                <HeadingTag type="h4" className="text-xs uppercase text-center mt-3 xl:mt-1 2xl:mt-3 mb-4 2xl:mb-5">
                  DrVisio (espace Quizz)
                </HeadingTag>
                <CustomForm>
                  <DynamicHtmlTag type="div" className="flex w-full lg:w-9/12 mx-auto flex-wrap gap-y-2">
                    <DynamicHtmlTag type="div" className="flex items-center gap-2 w-full lg:w-1/2 justify-between lg:pe-8">
                      <CustomLabel className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold w-1/2">Nom de votre ami:</CustomLabel>
                      <CustomInput
                        type="text"
                        id=""
                        name=""
                        placeholder="Nom de votre ami"
                        className="rounded-lg lg:rounded-2xl border border-gray-700 p-1 lg:p-2 outline-none sm:text-[9px] lg:text-xs w-1/2"
                      />
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-center gap-2 w-full lg:w-1/2 justify-between lg:pe-8">
                      <CustomLabel className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold w-1/2">Téléphone de votre ami:</CustomLabel>
                      <CustomInput
                        type="tel"
                        id=""
                        name=""
                        placeholder="Téléphone de votre ami"
                        className="rounded-lg lg:rounded-2xl border border-gray-700 p-1 lg:p-2 outline-none sm:text-[9px] lg:text-xs w-1/2"
                      />
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-center gap-2 w-full lg:w-1/2 justify-between lg:pe-8">
                      <CustomLabel className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold w-1/2">Prénom de votre ami:</CustomLabel>
                      <CustomInput
                        type="text"
                        id=""
                        name=""
                        placeholder="Prénom de votre ami"
                        className="rounded-lg lg:rounded-2xl border border-gray-700 p-1 lg:p-2 outline-none sm:text-[9px] lg:text-xs w-1/2"
                      />
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-center gap-2 w-full lg:w-1/2 justify-between lg:pe-8">
                      <CustomLabel className="text-2xs lg:text-xs xl:text-2xs 2xl:text-sm font-semibold w-1/2">
                        Adresse email de votre ami:
                      </CustomLabel>
                      <CustomInput
                        type="email"
                        id=""
                        name=""
                        placeholder="Adresse email de votre ami"
                        className="rounded-lg lg:rounded-2xl border border-gray-700 p-1 lg:p-2 outline-none sm:text-[9px] lg:text-xs w-1/2"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomForm>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex justify-end pb-1 lg:pb-0 pt-1 2xl:pt-3 md:h-[10%]">
              <CustomLink
                href="/quizz/quizz-course/quizz-question"
                className={`card-btn rounded-full py-1 px-4 2xl:px-6 text-white font-semibold text-sm 2xl:text-lg h-fit self-end ${isOpen ? "" : "pointer-events-none opacity-25"}`}>
                Envoyer le lien
              </CustomLink>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default InviteQuizz;
