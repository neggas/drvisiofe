"use client";
import React, { useEffect, useState } from "react";
import {
  CustomImage,
  DynamicHtmlTag,
  CustomButton,
  HeadingTag,
  PointsObtainedTab,
  QuizzesCompletedTab,
  SharedQuizzesTab,
  CustomFullScreenLoader,
} from "@/components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { getLocalStorageData } from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";

const tabs = [
  { label: "Points obtenus", component: PointsObtainedTab, iconSrc: "/images/obtained.svg" },
  { label: "Quizz réalisés", component: QuizzesCompletedTab, iconSrc: "/images/latest-quiz-icon.svg" },
  { label: "Quizz partagés", component: SharedQuizzesTab, iconSrc: "/images/shared-icon-tab.svg" },
];

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  const loggedInUser = useSelector(selectLoginResponse);

  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);

  useEffect(() => {
    // Show loader when component mounts
    dispatch(showLoader("quiz-dashboard"));

    const timer = setTimeout(() => {
      // Hide loader after the component is "ready"
      dispatch(hideLoader());
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading) {
    return <CustomFullScreenLoader />; // Render loader if loading
  }

  return (
    <DynamicHtmlTag type="div" className="my-profile-main h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12 pb-2">
        <CustomImage src="/images/quizz-user.svg" alt="news-icon" width={20} height={20} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          {t("quiz_profile")}
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 h-full  ${loggedInUser && isTeleconsultationBooked ? "quiz-small-height" : ""}`}>
        <DynamicHtmlTag
          type="div"
          className="bg-white flex-col lg:flex-row h-auto min-h-full py-1 lg:py-2 2xl:py-4 px-2 lg:px-4 rounded-b-xl quiz-inner-dashboard [&&]:overflow-hidden">
          <HeadingTag type="h2" className="text-blue font-semibold text-sm mx-auto block pb-1 uppercase text-center lg:hidden">
            {t("quiz_profile")}
          </HeadingTag>
          <DynamicHtmlTag type="div" className="identifyTabs flex border-b-[1px] border-blue px-1 mx-1 md:mx-6 lg:hidden mb-4 justify-between">
            {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                <CustomButton
                  id={`profile_tab-${index}`}
                  className={`tabs me-2 px-1 md:px-2 py-1 text-[14px] md:text-xs font-semibold ${index === activeTab ? "active-tab" : "non-active-tab"}`}
                  onClick={() => setActiveTab(index)}>
                  <CustomImage src={tab.iconSrc} alt={`tab-${index}-icon`} width={24} height={24} className="w-7 h-7 mx-auto" />
                  <DynamicHtmlTag type="span">{tab.label}</DynamicHtmlTag>
                </CustomButton>
              </React.Fragment>
            ))}
          </DynamicHtmlTag>
          {/* Render tabs and content only for mobile */}
          <DynamicHtmlTag type="div" className="lg:hidden quiz-inner-tabs overflow-y-scroll">
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

          <DynamicHtmlTag type="div" className="gap-5 h-full hidden lg:flex">
            <DynamicHtmlTag type="div" className="w-full lg:w-6/12 hidden lg:block">
              {/* Box-One-Profile-Start */}
              <PointsObtainedTab />
              {/* Box-One-Profile-End */}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full lg:w-6/12 hidden lg:flex flex-col h-full justify-between">
              {/* Box-Two-Profile-Start */}
              <QuizzesCompletedTab />
              {/* Box-Two-Profile-End */}
              {/* Box-Three-Profile-Start */}
              <SharedQuizzesTab />
              {/* Box-Three-Profile-End */}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default MyProfile;
