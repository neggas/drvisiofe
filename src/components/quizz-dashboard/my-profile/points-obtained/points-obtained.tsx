"use client";
import React, { useEffect, useState } from "react";
import { CustomButton, CustomImage, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { selectPatientStats, selectQuizzStats } from "@/store/reducers/guestDetailsSlice";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useTranslation } from "react-i18next";
import { formatToTwoDecimalPlaces, getLocalStorageData, lastQuizPlayedApi, LastQuizPlayedApiResponse } from "@/utility";
import { setLastQuizPlayData } from "@/store/reducers/quizSlice";

const PointsObtainedTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const quizzStats = useSelector(selectQuizzStats);
  const patientQuizzStats = useSelector(selectPatientStats);
  const [PointsModalOpen, PointsIsModalOpen] = useState(false);
  const [lastQuizPlayed, setLastQuizPlayed] = useState<LastQuizPlayedApiResponse | null>(null);

  const loggedInUserData = useSelector(selectLoginResponse);

  const fullName = loggedInUserData
    ? `${loggedInUserData.data.firstName} ${loggedInUserData.data.lastName}`.trim()
    : quizzStats
      ? `${quizzStats?.quizzUser?.firstName} ${quizzStats?.quizzUser?.lastName}`.trim()
      : "Prénom Nom";

  const openPointsModal = () => {
    PointsIsModalOpen(true);
  };

  const closePointsModal = () => PointsIsModalOpen(false);

  const fetchLastQuizPlayed = async () => {
    const guestUserData = getLocalStorageData("guest_user_data", {});

    const payload = {
      firstName: guestUserData.firstName || "",
      lastName: guestUserData.lastName || "",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
    };

    try {
      const data = await lastQuizPlayedApi(payload);
      setLastQuizPlayed(data);
      dispatch(setLastQuizPlayData(data?.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchLastQuizPlayed();
  }, []);

  return (
    <DynamicHtmlTag type="div" className="points-screen flex flex-col h-full lg:justify-between">
      {/* Profile Dashboard screen start */}
      <DynamicHtmlTag
        type="div"
        className="good-morning-main flex gap-3 2xl:gap-6 justify-between rounded-lg shadow-lg md:shadow-none px-2 md:px-3 2xl:px-4 pt-2.5 md:pt-3 2xl:pt-4 pb-2.5 md:pb-3 2xl:pb-4 lg:h-[31.5%] lg:overflow-hidden">
        <DynamicHtmlTag type="div">
          <DynamicHtmlTag type="p" className="text-white text-[16px] md:text-xs lg:text-sm 2xl:text-base font-medium">
            {t("quiz_welcome_name")} &nbsp;
            {fullName}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-white text-2xs md:text-xs lg:text-sm 2xl:text-base font-medium pb-3 md:pb-4 2xl:pb-6">
            {t("quiz_welcome_medical_space")}
          </DynamicHtmlTag>

          <DynamicHtmlTag type="p" className="text-white text-[14px] lg:text-2xs xl:text-xs 2xl:text-sm opacity-75 xl:mt-5">
            {lastQuizPlayed && lastQuizPlayed.data?.quizzType ? (
              <>
                Dernier quizz effectué : <DynamicHtmlTag type="br" /> {lastQuizPlayed.data.quizzType.name} {lastQuizPlayed.data.speciality.name} -{" "}
                {lastQuizPlayed.data.quizzType.numberOfQuestion} questions
              </>
            ) : (
              "Vous n’avez pas effectué de quizz"
            )}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex items-center justify-center">
          <CustomImage
            src={"/images/default-profile.svg"}
            alt="default-profile"
            width={160}
            height={181}
            className="w-24 lg:w-28 xl:w-32 xl:max-w-[80%] 2xl:max-w-full 2xl:w-44 h-20 md:h-[70%] lg:h-28 lg:max-h-[90%] xl:h-32 2xl:h-44"
          />
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Profile Dashboard screen end */}

      {/* Profile Points screen start */}
      <DynamicHtmlTag
        type="div"
        className="h-auto md:h-[calc(100%-360px)] lg:h-[31.5%] coin-main md:shadow-lg rounded-lg py-1 2xl:py-4 px-3 md:px-4 flex justify-between my-3 lg:my-0 gap-2 items-center border-[1px] border-slate-200 md:border-none lg:overflow-hidden">
        <DynamicHtmlTag type="div" className="text-center w-2/5 xl:w-2/6">
          <CustomImage
            src={"/images/coin-banner.svg"}
            alt="coin-banner"
            width={82}
            height={104}
            className="w-9 md:w-12 lg:w-8 xl:w-12 2xl:w-14 h-9 md:h-12 2xl:h-20 mx-auto"
          />
          <DynamicHtmlTag
            type="div"
            className="flex items-center gap-1 md:gap-2 bg-black rounded-full px-0.5 md:px-1 lg:px-2 py-0.5 md:py-1 mt-2 justify-center w-11/12 xl:w-9/12 mx-auto">
            {/* {patientQuizzStats?.nbStar?.length > 0 && ( */}
            <CustomImage src={"/images/star.svg"} alt="star" width={20} height={20} className="w-2 md:w-3 h-2 md:h-3" />
            {/* )} */}
            <DynamicHtmlTag type="span" className="text-[10px] md:text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs text-white">
              {t("quiz_level_heading")} {patientQuizzStats?.data?.level || "0"}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex gap-2 md:gap-3 mt-2 md:mt-3 lg:mt-1 xl:mt-3 justify-center items-center">
            <DynamicHtmlTag type="p" className="text-lg xl:text-xl 2xl:text-2xl font-semibold">
              {/* {formatToTwoDecimalPlaces(patientQuizzStats?.drVisioMoney || 0)} */}
              {patientQuizzStats?.data?.points}
            </DynamicHtmlTag>
            <CustomImage src={"/images/coin.svg"} alt="coin" width={44} height={44} className="w-7 md:w-8 lg:w-6 xl:w-8 h-7 md:h-8 lg:h-6 xl:h-8" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="text-center w-3/5 xl:w-8/12">
          <DynamicHtmlTag type="div" className="sm:text-[12px] md:text-2xs lg:text-3xs xl:text-xs 2xl:text-sm">
            <DynamicHtmlTag type="p" className="font-semibold">
              {/* {t("quiz_points_message")} */}
              Il te manque {`${patientQuizzStats?.data?.nbMissingPointsToNextRank || "0"}`} points
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="font-semibold">
              {t("quiz_points_continue_message")}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="font-medium text-2xs xl:text-xs 2xl:text-sm mt-1 md:mt-2 lg:mt-1 xl:mt-2 2xl:mt-4 text-center">
              {t("quiz_points_value_text")}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-0.5 md:mt-2 flex items-center justify-center gap-2 completed-quizzes">
              <DynamicHtmlTag type="p" className="text-black text-2xs xl:text-xs 2xl:text-sm">
                {patientQuizzStats?.data?.points || "0"} pts
              </DynamicHtmlTag>
              <DynamicHtmlTag type="progress" value={"100"} max="100" className="h-1.5 w-9/12 md:w-5/12 rounded-full progress-point"></DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-black text-2xs xl:text-xs 2xl:text-sm">
                {`${formatToTwoDecimalPlaces(patientQuizzStats?.data?.drVisioMoney || 0)}€`}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton
              onClick={openPointsModal}
              className={`card-btn text-white rounded-2xl mt-1 md:mt-2 lg:mt-1 xl:mt-2 2xl:mt-6 py-0.5 md:py-1 px-1 md:px-2 lg:px-3 text-[12px]  lg:text-3xs xl:text-2xs 2xl:text-sm
                ${!loggedInUserData ? "cursor-not-allowed disabled:opacity-30" : ""}`}
              title={!loggedInUserData ? t("quiz_points_insufficient_message") : ""}
              disabled={!loggedInUserData}>
              {t("quiz_utilize_earned_points")}
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Profile Points screen end */}
      <DynamicHtmlTag
        type="div"
        className="flex flex-wrap h-full items-center justify-center gap-x-0 gap-y-2 p-2 sm:pb-10 md:pb-20 lg:pb-10 sm:row lg:h-[33%] sm:justify-between sm:items-end lg:overflow-hidden">
        <DynamicHtmlTag type="div" className="w-[49%] h-[48%] mb-[1%]">
          <DynamicHtmlTag type="div" className="question-answered-main rounded-lg px-2 md:px-3 py-2 xl:py-4 2xl:py-6 w-full h-full">
            <DynamicHtmlTag type="div" className="flex justify-between mb-1 md:mb-0">
              <DynamicHtmlTag type="p" className="text-lg 2xl:text-2xl text-white font-semibold">
                {quizzStats?.data?.nbAnsweredQuestion}
              </DynamicHtmlTag>
              <CustomImage src={"/images/question-answered.svg"} alt="question-answered" width={38} height={38} className="w-6 2xl:w-8 h-6 2xl:h-8" />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[14px] md:text-2xs xl:text-xs 2xl:text-sm">
              {t("quiz_questions_answered")}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-[49%] h-[48%] mb-[1%]">
          <DynamicHtmlTag type="div" className="good-answer-main rounded-lg px-2 md:px-3 py-2 xl:py-4 2xl:py-6 w-full h-full">
            <DynamicHtmlTag type="div" className="flex justify-between mb-1 md:mb-0">
              <DynamicHtmlTag type="p" className="text-lg 2xl:text-2xl text-white font-semibold">
                {`${quizzStats?.data?.percentGoodAnswers || "0"}%`}
              </DynamicHtmlTag>
              <CustomImage src={"/images/good-answer.svg"} alt="good-answer" width={38} height={38} className="w-6 2xl:w-8 h-6 2xl:h-8" />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[14px] md:text-2xs xl:text-xs 2xl:text-sm">
              {t("quiz_correct_answer_count")}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-[49%] h-[48%] mb-[1%]">
          <DynamicHtmlTag type="div" className="Discovery-main rounded-lg px-2 md:px-3 py-2 xl:py-4 2xl:py-6 w-full h-full">
            <DynamicHtmlTag type="div" className="flex justify-between mb-1 md:mb-0">
              <DynamicHtmlTag type="p" className="text-lg 2xl:text-2xl text-white font-semibold">
                {quizzStats?.data?.nbReadCourse || "0"}
              </DynamicHtmlTag>
              <CustomImage src={"/images/Discovery-icon.svg"} alt="Discovery-icon" width={38} height={38} className="w-6 2xl:w-8 h-6 2xl:h-8" />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[14px] md:text-2xs xl:text-xs 2xl:text-sm">
              {t("quiz_course_read_count")}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="w-[49%] h-[48%] mb-[1%]">
          <DynamicHtmlTag type="div" className="shared-quiz-main rounded-lg px-2 md:px-3 py-2 xl:py-4 2xl:py-6 w-full h-full">
            <DynamicHtmlTag type="div" className="flex justify-between mb-1 md:mb-0">
              <DynamicHtmlTag type="p" className="text-lg 2xl:text-2xl text-white font-semibold">
                {quizzStats?.data?.nbSharedQuizz || "0"}
              </DynamicHtmlTag>
              <CustomImage src={"/images/shared-quiz.svg"} alt="shared-quiz" width={38} height={38} className="w-6 2xl:w-8 h-6 2xl:h-8" />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[14px] md:text-2xs xl:text-xs 2xl:text-sm">
              {t("quiz_shared_count")}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Points Modal Box Start */}
      <CustomModal isOpen={PointsModalOpen} onClose={closePointsModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl bg-transparent">
        <DynamicHtmlTag type="div" className="bg-transparent flex items-center justify-between gap-2 px-2 pb-2">
          <HeadingTag type="h2" className="text-white font-semibold flex items-center">
            <CustomImage src="/images/euro-sign.svg" alt="euro-sign" width={25} height={25} className="w-6 h-6 me-2" />
            {t("quiz_utilize_earned_points")}
          </HeadingTag>
          <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-2xl" as="button" onClick={closePointsModal}>
            <IoCloseSharp className="w-5 h-5" />
          </CustomButton>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4 rounded-xl">
          <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-6 flex flex-col">
            <CustomImage src="/images/coin-banner.svg" alt="coin-banner" width={80} height={90} className="w-16 md:w-20 h-20 md:h-24 mx-auto" />
            <DynamicHtmlTag type="p" className="pb-1 text-xs text-center font-medium md:w-11/12 mx-auto mt-3">
              {t("quiz_claim_points_text")}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-sm mx-auto font-semibold mt-2">
              <DynamicHtmlTag type="span">{t("quiz_points_value")} </DynamicHtmlTag>{" "}
              <DynamicHtmlTag type="span">{t("quiz_points_money_value")}</DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-2 mt-3 md:mt-5 justify-center items-center">
              <DynamicHtmlTag type="span" className="text-sm font-semibold">
                {t("quiz_user_earned_points_text")}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="span" className="text-xl md:text-2xl font-semibold">
                {patientQuizzStats?.points}
              </DynamicHtmlTag>
              <CustomImage src={"/images/coin.svg"} alt="coin" width={44} height={44} className="w-9 md:w-10 h-9 md:h-10" />
            </DynamicHtmlTag>
            <CustomButton
              as="button"
              className="text-sm cstm-btn mt-3 md:mt-5 flex justify-center py-2 px-1 w-3/6 md:w-2/6 view-more-btn rounded-xl text-white font-semibold mx-auto">
              {`${formatToTwoDecimalPlaces(patientQuizzStats?.drVisioMoney || 0)}€`}
            </CustomButton>
            <DynamicHtmlTag type="p" className="text-xs text-center mt-4 font-semibold">
              {t("quiz_points_usage_text")}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Points Modal Box End */}
    </DynamicHtmlTag>
  );
};

export default PointsObtainedTab;
