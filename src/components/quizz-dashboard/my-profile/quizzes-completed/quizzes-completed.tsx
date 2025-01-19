"use client";
import React, { useState } from "react";
import { CustomButton, CustomImage, DynamicHtmlTag } from "@/components";
import { API_URL, fetchPopularQuizzes, PopularQuizTypes } from "@/utility";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedQuizId } from "@/store/reducers/quizSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { selectPatientStats, selectQuizzStats } from "@/store/reducers/guestDetailsSlice";

const QuizzesCompletedTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const quizzStats = useSelector(selectQuizzStats);
  const patientQuizzStats = useSelector(selectPatientStats);
  const lastQuizPlayed = useSelector((state: RootState) => state.quiz.lastQuizPlayData);
  const loggedInUserData = useSelector(selectLoginResponse);

  const [popularQuizzes, setPopularQuizzes] = useState<PopularQuizTypes[]>([]);

  const fullName = loggedInUserData
    ? `${loggedInUserData.data.firstName} ${loggedInUserData.data.lastName}`.trim()
    : quizzStats
      ? `${quizzStats?.quizzUser?.firstName} ${quizzStats?.quizzUser?.lastName}`.trim()
      : "Prénom Nom";

  const handleQuizPickerClick = (quizId: number) => {
    dispatch(setSelectedQuizId(quizId.toString()));
    router.push("/quizz/quizz-course");
  };

  React.useEffect(() => {
    const getQuizzes = async () => {
      const quizzes = await fetchPopularQuizzes();
      setPopularQuizzes(quizzes.slice(0, 4));
    };
    getQuizzes();
  }, []);

  return (
    <DynamicHtmlTag type="div" className="most-popular-quizzes lg:h-[65.5%]">
      {/* Mobile top dashboard profile start */}
      <DynamicHtmlTag type="div" className="flex justify-between gap-3 lg:hidden mb-3 md:mb-4">
        <DynamicHtmlTag type="div" className="text-center w-1/3 bg-white border border-slate-200 rounded-lg pt-0.5">
          <CustomImage src={"/images/coin-banner.svg"} alt="coin-banner" width={82} height={104} className="w-8 md:w-10 h-8 md:h-14 mx-auto" />
          <DynamicHtmlTag
            type="div"
            className="flex items-center gap-1 bg-black rounded-full px-0.5 md:px-1 py-0.5 md:py-1 mt-1 md:mt-2 justify-center w-11/12 mx-auto">
            <CustomImage src={"/images/star.svg"} alt="star" width={20} height={20} className="w-2 h-2" />
            <DynamicHtmlTag type="span" className="text-3xs md:text-2xs text-white">
              {t("quiz_level_heading")} {patientQuizzStats?.level || "0"}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex gap-3 mt-2 mb-2 justify-center items-center">
            <DynamicHtmlTag type="p" className="text-base font-semibold">
              {patientQuizzStats?.points}
            </DynamicHtmlTag>
            <CustomImage src={"/images/coin.svg"} alt="coin" width={44} height={44} className="w-6 h-6" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="div"
          className="good-morning-main mobile-morning-bg flex gap-2 lg:items-center rounded-lg w-4/6 shadow-lg justify-between px-2 pt-2 pb-1">
          <DynamicHtmlTag type="div" className="flex flex-col items-start">
            <DynamicHtmlTag type="p" className="text-white text-[2vw] md:text-xs lg:text-sm 2xl:text-base font-medium">
              {t("quiz_welcome_name")} &nbsp;
              {fullName}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[2vw] md:text-xs lg:text-sm 2xl:text-base font-medium pb-3 md:pb-4 2xl:pb-6">
              {t("quiz_welcome_medical_space")}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-white text-[2vw] font-medium lg:mt-3">
              {lastQuizPlayed && lastQuizPlayed?.quizzType ? (
                <>
                  Dernier quizz effectué : <DynamicHtmlTag type="br" /> {lastQuizPlayed.quizzType.name} {lastQuizPlayed.speciality.name} -{" "}
                  {lastQuizPlayed.quizzType.numberOfQuestion} questions
                </>
              ) : (
                "Vous n’avez pas effectué de quizz"
              )}{" "}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex items-center">
            <CustomImage src={"/images/default-profile.svg"} alt="default-profile" width={160} height={181} className="w-28 h-14 lg:h-24" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Mobile top dashboard profile end */}
      <DynamicHtmlTag
        type="div"
        className="md:shadow-lg px-2 md:px-3 py-1 xl:py-2 2xl:py-3 rounded-lg h-full border-[1px] border-slate-200 md:border-none lg:overflow-hidden">
        <DynamicHtmlTag type="div" className="popular-quizzes h-full flex flex-col justify-start pb-1 md:pb-0">
          <DynamicHtmlTag type="p" className="text-center text-xs lg:text-2xs 2xl:text-sm font-semibold mb-3 2xl:mb-4 uppercase">
            {t("most_popular_quizz_heading")}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3 2xl:gap-4 lg:overflow-y-scroll h-full">
            {popularQuizzes.map(quiz => (
              <DynamicHtmlTag key={quiz.id} type="div" className="w-full h-full">
                <DynamicHtmlTag
                  type="div"
                  style={{ background: quiz.color }}
                  className="text-center py-2 md:py-3 px-2 md:px-6 rounded-lg flex flex-col items-center justify-center"
                  title={quiz.name}>
                  <CustomImage
                    src={`${API_URL}${quiz.file?.url}`}
                    alt={quiz.name}
                    width={62}
                    height={77}
                    className="w-8 md:w-10 lg:w-5 xl:w-10 2xl:w-14 h-8 md:h-10 lg:h-5 xl:h-10 2xl:h-14 my-0 mx-auto"
                  />
                  <DynamicHtmlTag
                    type="div"
                    className="text-3xs md:text-2xs lg:text-3xs xl:text-2xs 2xl:text-sm font-medium text-white mt-1 2xl:mt-2 uppercase line-clamp-1">
                    {quiz.name}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <CustomButton
                  className="card-btn text-white rounded-full mt-2 2xl:mt-3 py-1 xl:py-0.5 2xl:py-1 px-2 xl:px-4 text-3xs xl:text-2xs 2xl:text-xs mx-auto lg:me-0 block"
                  onClick={() => handleQuizPickerClick(quiz.id)}>
                  {t("quiz_theme_picker")}
                </CustomButton>
              </DynamicHtmlTag>
            ))}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="completed-quizzes lg:h-[95%] xl:h-full overflow-y-scroll hidden">
          <DynamicHtmlTag type="p" className="text-center text-xs 2xl:text-sm font-semibold mb-3 2xl:mb-4 uppercase">
            vos quizz réalisés
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3 2xl:gap-4">
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-red-500 to-orange-500 py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Cardiologie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="51" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    51%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#49B9B1] to-[#8AC057] py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Endocrinologie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="16" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    16%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#004994] to-[#4C509E] py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Neurologie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="22" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    22%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#46519E] to-[#804493] py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Pédiatrie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="51" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    51%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#FDC424] to-[#EE713C] py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Nephrologie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="73" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    73%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#4C519F] to-[#A1BDE4] py-1 2xl:py-3 px-2 md:px-3 rounded-lg relative">
                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2 justify-end absolute -top-1 right-2">
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                  <CustomImage src="/images/star.svg" alt="star-image" width={16} height={16} className="w-2 2xl:w-3 h-2 2xl:h-3" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs font-medium text-white">
                  Gastro-entérologie
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full justify-between flex items-center mt-0.5 2xl:mt-1">
                  <DynamicHtmlTag type="progress" id="quiz-progress" value="89" max="100" className="h-1 w-9/12 md:w-10/12"></DynamicHtmlTag>
                  <DynamicHtmlTag type="label" htmlFor="quiz-progress" className="text-2xs md:text-3xs 2xl:text-xs text-white leading-normal">
                    89%
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton className="card-btn text-white rounded-full mt-1 2xl:mt-3 py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs mx-auto lg:me-0 block">
                Reprendre
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default QuizzesCompletedTab;
