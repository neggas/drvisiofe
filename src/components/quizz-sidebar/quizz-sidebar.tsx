"use client";
import React, { useEffect, useState } from "react";
import { DynamicHtmlTag, CustomImage, CustomButton, CustomNav, CustomLink, HeadingTag } from "@/components";
import { usePathname } from "next/navigation";
import { HiBars3, HiMiniXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { API_URL, fetchIPAddress, fetchQuizzPatientStatsApi, fetchQuizzStatsApi, getLocalStorageData } from "@/utility";
import { setPatientStats, setQuizzStats } from "@/store/reducers/guestDetailsSlice";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store";

const QuizzSidebar = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname() || "";
  const dispatch = useDispatch();

  const loggedInUserData = useSelector(selectLoginResponse);
  const patientStats = useSelector((state: RootState) => state.guestDetails.patientStats);
  const guestUserData = getLocalStorageData("guest_user_data", {});

  const avatarUrl = loggedInUserData?.data?.avatar
    ? `${API_URL}${loggedInUserData.data.avatar.url}`
    : patientStats?.avatar
      ? `${API_URL}${patientStats.avatar.url}`
      : "/images/quiz-profile.svg"; // Fallback if no avatar found

  const fullName = loggedInUserData
    ? `${loggedInUserData.data.firstName} ${loggedInUserData.data.lastName}`.trim()
    : guestUserData
      ? `${guestUserData.firstName} ${guestUserData.lastName}`.trim()
      : "Prénom Nom";

  const pointsEarned = patientStats?.data?.points || "0";

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  useEffect(() => {
    if (loggedInUserData?.data?.id) {
      const fetchData = async () => {
        const guestUserData = getLocalStorageData("guest_user_data", {});
        const ipAddress = await fetchIPAddress();
        const payload = {
          firstName: loggedInUserData?.data?.firstName || "",
          lastName: loggedInUserData?.data?.lastName || "",
          ipAddress: ipAddress || guestUserData.ipAddress || "",
          macAddress: guestUserData.macAddress || "",
        };
        try {
          const patientStatsResponse = await fetchQuizzPatientStatsApi(payload);
          dispatch(setPatientStats(patientStatsResponse));

          const quizzStatsResponse = await fetchQuizzStatsApi(payload);
          dispatch(setQuizzStats(quizzStatsResponse));
        } catch (error) {}
      };
      fetchData();
    }
  }, [loggedInUserData, dispatch]);

  return (
    <DynamicHtmlTag type="div" className="relative">
      <HeadingTag type="h1" className="text-black font-semibold ps-6 pb-2 text-sm sm:hidden lg:inline-block">
        {t("quiz_medical")}
      </HeadingTag>
      <DynamicHtmlTag type="div" className="flex items-center justify-between sm:flex lg:hidden mb-2 lg:mb-0">
        <CustomButton
          as="button"
          className="lg:hidden p-2 text-black relative z-50 shadow-sm shadow-gray-300 border-0 btn-secondary min-w-10 opacity-0">
          {isOpen ? <HiMiniXMark className="w-6 h-6 hidden" /> : <HiBars3 className="w-6 h-6 hidden" />}
        </CustomButton>
        <DynamicHtmlTag type="h2" className="text-black text-sm font-semibold">
          {t("quiz_medical")}
        </DynamicHtmlTag>
        <CustomImage key={avatarUrl} src={avatarUrl} alt="quiz-profile" width={45} height={45} className="rounded-full w-10 h-10" />
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`fixed inset-0 w-[90%] m-auto lg:relative lg:bg-transparent lg:flex lg:flex-col lg:w-auto lg:h-auto lg:p-0 ${
          isOpen ? "top-48" : "-translate-y-full"
        } lg:translate-y-0 z-40`}>
        <DynamicHtmlTag type="div" className="gradient-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500">
          <DynamicHtmlTag
            type="div"
            className="bg-white flex-col lg:flex-row h-auto min-h-max lg:min-h-full text-center ps-4 xl:ps-6 pe-4 xl:pe-6 pb-5 rounded-b-xl quiz-inner-dashboard">
            <DynamicHtmlTag type="div" className="sm:hidden lg:block">
              <DynamicHtmlTag type="div" className="text-center pt-3 2xl:pt-6 pb-1 2xl:pb-3">
                <DynamicHtmlTag type="span" className="rounded-full border border-black xl:p-1 2xl:p-2 inline-block">
                  <CustomImage
                    key={avatarUrl}
                    src={avatarUrl}
                    alt="quiz-profile"
                    width={80}
                    height={80}
                    className="img-fluid rounded-full w-16 2xl:w-20 h-16 2xl:h-20"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-center text-2xs 2xl:text-xs text-black font-normal uppercase pb-0.5 2xl:pb-1">
                {t("quiz_welcome")}
              </DynamicHtmlTag>

              <DynamicHtmlTag type="p" className="text-center text-xs 2xl:text-sm text-black font-semibold pb-2 2xl:pb-3">
                {fullName}
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="span"
                className="rounded-2xl text-xs 2xl:text-sm font-medium border border-black py-1.5 2xl:py-1 px-5 2xl:px-7 inline-block mb-5 2xl:mb-7">
                {pointsEarned} points
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="sm:block lg:hidden pt-4 pb-5">
              <HeadingTag type="h3" className="font-semibold">
                MENU
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="main-quiz-side-menu">
              <CustomNav defaultActiveKey="/quizz/my-profile" className="flex-col gap-3">
                <CustomLink
                  href="/quizz/my-profile"
                  className={`custom-grey-btn py-2 md:py-1 2xl:py-2 px-2 rounded-3xl shadow-sm shadow-gray-300 flex gap-2 text-xs md:text-2xs xl:text-xs 2xl:text-sm items-center ${getActiveRoute(pathName, "/quizz/my-profile", "menu-active")}`}>
                  <CustomImage src="/images/main-profile.svg" alt="main-profile" width={35} height={35} className="w-7 2xl:w-8 h-7 2xl:h-8" />
                  <DynamicHtmlTag type="span" className="quiz-side-text text-left">
                    {t("quiz_sidebar_my_profile")}
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/quizz/disease-discovery"
                  className={`custom-grey-btn py-2 md:py-1 2xl:py-2 px-2 rounded-3xl shadow-sm shadow-gray-300 flex gap-2 text-xs md:text-2xs xl:text-xs 2xl:text-sm items-center ${getActiveRoute(pathName, "/quizz/disease-discovery", "menu-active")}`}>
                  <CustomImage src="/images/maladies.svg" alt="maladies" width={35} height={35} className="w-7 2xl:w-8 h-7 2xl:h-8" />
                  <DynamicHtmlTag type="span" className="quiz-side-text text-left">
                    {t("quiz_sidebar_disease-discovery")}
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/quizz/quizz-course"
                  className={`custom-grey-btn py-2 md:py-1 2xl:py-2 px-2 rounded-3xl shadow-sm shadow-gray-300 flex gap-2 text-xs md:text-2xs xl:text-xs 2xl:text-sm items-center ${getActiveRoute(pathName, "/quizz/quizz-course", "menu-active")}`}>
                  <CustomImage src="/images/quizz.svg" alt="quizz" width={35} height={35} className="w-7 2xl:w-8 h-7 2xl:h-8" />
                  <DynamicHtmlTag type="span" className="quiz-side-text text-left">
                    Quizz
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/quizz/whats-new"
                  className={`custom-grey-btn py-2 md:py-1 2xl:py-2 px-2 rounded-3xl shadow-sm shadow-gray-300 flex gap-2 text-xs md:text-2xs xl:text-xs 2xl:text-sm items-center ${getActiveRoute(pathName, "/quizz/whats-new", "menu-active")}`}>
                  <CustomImage src="/images/nouveautés.svg" alt="nouveautés" width={35} height={35} className="w-7 2xl:w-8 h-7 2xl:h-8" />
                  <DynamicHtmlTag type="span" className="quiz-side-text text-left">
                    {t("quiz_whats_new")}
                  </DynamicHtmlTag>
                </CustomLink>
              </CustomNav>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default QuizzSidebar;
