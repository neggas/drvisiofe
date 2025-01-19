"use client";
import { CustomButton, CustomImage, CustomLink, CustomNav, DynamicHtmlTag, HeadingTag, QuizzSidebar } from "@/components";
import {
  fetchIPAddress,
  fetchQuizzPatientStatsApi,
  fetchQuizzStatsApi,
  getLocalStorageData,
  setLocalStorageData,
  clearLocalStorageData,
  FIVE_DAYS_IN_MS,
} from "@/utility";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setPatientStats, setQuizzStats } from "@/store/reducers/guestDetailsSlice";
import { HiMiniXMark, HiBars3 } from "react-icons/hi2";
import { t } from "i18next";

type IBaseTemplateProps = {
  children: ReactNode;
};

type UserTrackingData = {
  ipAddress: string | null;
  macAddress: string | null;
  timestamp: number;
  firstName: string;
  lastName: string;
  phone: string;
};

const QuizzTemplate: React.FC<IBaseTemplateProps> = ({ children }) => {
  const pathName = usePathname() || "";
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(null);
  const dispatch = useDispatch();

  const initializeTrackingData = async () => {
    const currentTimestamp = Date.now();
    const storedData: UserTrackingData | null = getLocalStorageData("guest_user_data", null);

    if (!storedData || currentTimestamp - storedData.timestamp > FIVE_DAYS_IN_MS) {
      dispatch(setPatientStats(null));
      dispatch(setQuizzStats(null));
      clearLocalStorageData("guest_user_data");

      const ipAddress = await fetchIPAddress();
      const macAddress = uuidv4();

      const newTrackingData: UserTrackingData = {
        ipAddress,
        macAddress,
        timestamp: currentTimestamp,
        firstName: "Ludo",
        lastName: "Brule",
        phone: "+33664715473",
      };

      setLocalStorageData("guest_user_data", newTrackingData);
      setTrackingData(newTrackingData);
    } else {
      setTrackingData(storedData);
    }
  };

  const fetchPatientStats = async () => {
    const storedTrackingData = getLocalStorageData("guest_user_data", null);

    if (storedTrackingData) {
      const { ipAddress, macAddress, firstName, lastName, phone } = storedTrackingData;

      const payload = {
        firstName,
        lastName,
        phone,
        ipAddress,
        macAddress,
      };

      try {
        const patientStats = await fetchQuizzPatientStatsApi(payload);
        dispatch(setPatientStats(patientStats.data));

        const quizzStats = await fetchQuizzStatsApi(payload);
        dispatch(setQuizzStats(quizzStats.data));
      } catch (error) {}
    }
  };

  useEffect(() => {
    const initializeAndFetch = async () => {
      await initializeTrackingData();
    };

    initializeAndFetch();
  }, []);

  useEffect(() => {
    if (trackingData) {
      fetchPatientStats();
    }
  }, [trackingData]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-2 lg:gap-y-0 h-full lg:h-auto">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[20%] relative h-[10%] lg:h-auto">
        <QuizzSidebar />
        {/* quizz navbar toggle menu button start*/}
        <CustomButton
          as="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-black absolute z-50 shadow-sm shadow-gray-300 border-0 btn-secondary min-w-10 top-0">
          {isOpen ? <HiMiniXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
        </CustomButton>
        {/* quizz navbar toggle menu button end*/}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[80%] bg-transparent h-[90%] lg:h-full bg-red-100 overflow-hidden">
        {isOpen ? "" : children}
        {/* Quizz Side Menu only for mobile Start */}
        <DynamicHtmlTag
          type="div"
          className={`h-full gradient-main pt-4 rounded-xl bg-gradient-to-r  from-sky-500 to-indigo-500 ${isOpen ? "" : "hidden"}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-white flex-col lg:flex-row h-auto min-h-max lg:min-h-full text-center ps-4 xl:ps-6 pe-4 xl:pe-6 pb-5 rounded-b-xl quiz-inner-dashboard [&&]:h-full">
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
        {/* Quizz Side Menu only for mobile Start */}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default QuizzTemplate;
