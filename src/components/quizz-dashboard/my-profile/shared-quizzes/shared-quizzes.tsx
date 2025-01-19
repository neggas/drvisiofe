"use client";
import React, { useEffect, useState } from "react";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import { useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useTranslation } from "react-i18next";
import { fetchInvitationList, fetchInvitationSharedQuizStatsList } from "@/utility";
import { RootState } from "@/store";
import { selectPatientStats, selectQuizzStats } from "@/store/reducers/guestDetailsSlice";

interface QuizStats {
  friendName: string;
  theme: string;
  result: "won" | "tie" | "lost";
}

interface QuizInvitationRequest {
  friendName: string;
  theme: string;
}

const SharedQuizzesTab = () => {
  const { t } = useTranslation();
  const [sharedQuizzes, setSharedQuizzes] = useState<QuizStats[]>([]);
  const [invitationRequests, setInvitationRequests] = useState<QuizInvitationRequest[]>([]);
  const isLoggedIn = useSelector(selectLoginResponse);
  const quizzStats = useSelector(selectQuizzStats);
  const patientQuizzStats = useSelector(selectPatientStats);
  const lastQuizPlayed = useSelector((state: RootState) => state.quiz.lastQuizPlayData);
  const loggedInUserData = useSelector(selectLoginResponse);

  const fullName = loggedInUserData
    ? `${loggedInUserData.data.firstName} ${loggedInUserData.data.lastName}`.trim()
    : quizzStats
      ? `${quizzStats?.quizzUser?.firstName} ${quizzStats?.quizzUser?.lastName}`.trim()
      : "Prénom Nom";

  useEffect(() => {
    if (isLoggedIn) {
      const fetchQuizzes = async () => {
        try {
          const data = await fetchInvitationSharedQuizStatsList();
          setSharedQuizzes(data || []);
        } catch (error) {
          setSharedQuizzes([]);
        }
      };

      fetchQuizzes();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchInvitations = async () => {
        try {
          const data = await fetchInvitationList();
          setInvitationRequests(data || []);
        } catch (error) {
          setInvitationRequests([]);
        }
      };

      fetchInvitations();
    }
  }, []);

  return (
    <DynamicHtmlTag type="div" className="md:shadow-lg most-popular-quizzes lg:h-[33%] lg:overflow-hidden">
      {/* Mobile top dashboard profile start */}
      <DynamicHtmlTag type="div" className="flex justify-between gap-3 lg:hidden mb-4">
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
        className="md:shadow-lg px-3 py-1 2xl:py-3 rounded-lg mt-2 md:mt-4 lg:mt-0 border border-slate-200 lg:border-none h-auto lg:h-full lg:overflow-hidden">
        <DynamicHtmlTag type="div" className="friend-shared-quizzes h-full flex items-center">
          <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row w-full h-[90%]">
            <DynamicHtmlTag
              type="div"
              className="w-full lg:w-3/5 border-b-[1px] lg:border-b-0 lg:border-e-[1px] border-black pb-1 md:pb-2 lg:pb-0 pe-0 lg:pe-2">
              <HeadingTag
                type="h3"
                className="text-xs lg:text-3xs xl:text-xs 2xl:text-sm font-semibold mb-1 md:mb-2 text-black text-center lg:text-left">
                {t("shared_quiz_with_heading")}
              </HeadingTag>
              {isLoggedIn ? (
                <>
                  {/* shared quizzes data box start */}
                  <DynamicHtmlTag type="div" className="h-[90%]">
                    <DynamicHtmlTag
                      type="div"
                      className="flex flex-row lg:flex-col xl:flex-row items-center lg:items-start justify-between gap-0.5 xl:gap-2 xl:h-[100%] pb-3 lg:pb-0">
                      <DynamicHtmlTag type="div" className="w-full xl:w-3/5 xl:h-[92%] content-center">
                        <DynamicHtmlTag
                          type="div"
                          className="share-friend-list overflow-y-auto max-h-32 md:max-h-16 lg:max-h-16 2xl:max-h-36 xl:max-h-[100%]">
                          {sharedQuizzes.length > 0 ? (
                            sharedQuizzes.map((quiz, index) => (
                              <DynamicHtmlTag
                                key={index}
                                type="div"
                                className="flex items-baseline justify-between border-b-[1px] border-slate-200 pb-0.5 2xl:pb-1">
                                <DynamicHtmlTag type="div" className="flex items-center gap-1 2xl:gap-2">
                                  <DynamicHtmlTag type="div" className="rounded-full border border-black w-4 h-4 p-0.5">
                                    <CustomImage
                                      src="/images/friend-avtar.svg"
                                      alt="friend-avtar"
                                      width={14}
                                      height={14}
                                      className="w-[0.875rem] rounded-full"
                                    />
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div">
                                    <HeadingTag type="h4" className="text-black text-3xs 2xl:text-2xs font-semibold">
                                      {quiz.friendName}
                                    </HeadingTag>
                                    <DynamicHtmlTag type="p" className="text-3xs">
                                      Thème - {quiz.theme}
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div">
                                  <DynamicHtmlTag
                                    type="span"
                                    className={`px-2 py-0.5 uppercase rounded-xl text-4xs text-white ${
                                      quiz.result === "won" ? "bg-green-200" : quiz.result === "tie" ? "bg-yellow-100" : "bg-red-600"
                                    }`}>
                                    {quiz.result}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            ))
                          ) : (
                            <DynamicHtmlTag type="div" className="challenge-friend xl:h-full content-center">
                              <HeadingTag type="h3" className="text-2xs md:text-2xs xl:text-xs flex justify-center items-center h-full">
                                Vous n{"’"}avez pas défié d{"’"}ami pour le moment.
                              </HeadingTag>
                            </DynamicHtmlTag>
                          )}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="w-full xl:w-2/5 hidden xl:block">
                        <CustomImage
                          src="/images/share-friend.svg"
                          alt="share-friend"
                          width={135}
                          height={135}
                          className="w-20 xl:w-28 2xl:w-36 h-20 xl:h-28 2xl:h-36 float-end lg:float-none lg:mx-auto"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {/* shared quizzes data box end */}
                </>
              ) : (
                <>
                  {/* shared quizzes empty box start */}
                  <DynamicHtmlTag type="div" className="">
                    <DynamicHtmlTag
                      type="div"
                      className="flex flex-row lg:flex-col xl:flex-row items-center justify-between gap-0.5 xl:gap-2 xl:h-full">
                      <DynamicHtmlTag type="div" className="w-full xl:w-3/5 xl:h-4/5">
                        <DynamicHtmlTag type="div" className="challenge-friend xl:h-full">
                          <HeadingTag type="h3" className="text-2xs md:text-2xs xl:text-xs flex justify-center items-center h-full">
                            Vous n{"’"}avez pas défié d{"’"}ami pour le moment.
                          </HeadingTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="w-full xl:w-3/5 xl:block">
                        <CustomImage
                          src="/images/share-friend.svg"
                          alt="share-friend"
                          width={135}
                          height={135}
                          className="w-20 xl:w-28 2xl:w-36 h-20 xl:h-28 2xl:h-36 float-end lg:float-none lg:mx-auto"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {/* shared quizzes empty box end */}
                </>
              )}
            </DynamicHtmlTag>
            {isLoggedIn ? (
              <>
                {/* Invitation request data box start */}
                <DynamicHtmlTag type="div" className="w-full lg:w-2/5 pt-3 lg:pt-0">
                  <HeadingTag type="h3" className="text-xs lg:text-3xs xl:text-xs font-semibold mb-1 2xl:mb-2 text-black text-center">
                    Demande d{"’"}invitation
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex h-[85%] items-center">
                    <DynamicHtmlTag type="div" className="w-3/5 lg:w-full">
                      <DynamicHtmlTag type="div" className="invitation-request lg:h-full lg:max-h-10 xl:max-h-20 2xl:max-h-28 overflow-y-scroll">
                        {invitationRequests.length > 0 ? (
                          invitationRequests.map((request, index) => (
                            <DynamicHtmlTag
                              key={index}
                              type="div"
                              className="flex items-center gap-1 2xl:gap-2 justify-center border border-black rounded-xl w-10/12 xl:w-8/12 2xl:w-9/12 mx-auto py-0.5 2xl:py-1">
                              <DynamicHtmlTag type="div" className="rounded-full border border-black w-5 h-5 p-0.5">
                                <CustomImage
                                  src="/images/invite-friend-avtar.svg"
                                  alt="invite-friend-avtar"
                                  width={15}
                                  height={15}
                                  className="w-[0.938rem] rounded-full"
                                />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="text-start">
                                <HeadingTag type="h4" className="text-black text-3xs 2xl:text-2xs font-semibold leading-tight">
                                  {request.friendName}
                                </HeadingTag>
                                <DynamicHtmlTag type="p" className="text-4xs 2xl:text-3xs">
                                  Thème - {request.theme}
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          ))
                        ) : (
                          <DynamicHtmlTag type="div" className="no-request my-2 xl:my-auto h-full">
                            <HeadingTag
                              type="h3"
                              className="text-2xs md:text-2xs xl:text-xs flex justify-start lg:justify-center items-center h-full">
                              Vous n{"’"}avez pas de demande
                            </HeadingTag>
                          </DynamicHtmlTag>
                        )}
                      </DynamicHtmlTag>
                      {invitationRequests.length > 0 && (
                        <DynamicHtmlTag
                          type="div"
                          className="w-9/12 lg:w-11/12 xl:w-10/12 flex items-center justify-between gap-1 xl:gap-3 mx-auto mt-2">
                          <CustomButton className="card-btn text-white rounded-full py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs block">
                            Accepter
                          </CustomButton>
                          <CustomButton className="card-btn text-white rounded-full py-0.5 2xl:py-1 px-2 text-3xs 2xl:text-2xs block">
                            Refuser
                          </CustomButton>
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-2/5 block lg:hidden">
                      <CustomImage
                        src="/images/share-friend.svg"
                        alt="share-friend"
                        width={135}
                        height={135}
                        className="w-28 2xl:w-28 h-28 2xl:h-28 float-start lg:float-none lg:mx-auto"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {/* Invitation request data box end */}
              </>
            ) : (
              <>
                {/* Invitation request empty box start */}
                <DynamicHtmlTag type="div" className="lg:w-2/5 pt-2 lg:pt-0 ps-0 lg:ps-2 flex flex-col justify-between">
                  <HeadingTag type="h3" className="text-xs lg:text-3xs xl:text-xs 2xl:text-sm font-semibold mb-1 2xl:mb-2 text-black text-center">
                    {t("quiz_invitation_request_heading")}
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="no-request my-2 xl:my-4">
                    <HeadingTag type="h3" className="text-2xs md:text-2xs xl:text-xs flex justify-start lg:justify-center items-center">
                      Vous n{"’"}avez pas de demande
                    </HeadingTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="w-full lg:w-11/12 xl:w-10/12 flex items-center justify-end lg:justify-between gap-2 lg:gap-1 xl:gap-3 mx-auto mt-0 lg:mt-2">
                    <CustomButton
                      className="card-btn text-white rounded-full py-0.5 2xl:py-1 px-1 xl:px-4 text-3xs 2xl:text-2xs block cursor-not-allowed disabled:opacity-30"
                      disabled>
                      Accepter
                    </CustomButton>
                    <CustomButton
                      className="card-btn text-white rounded-full py-0.5 2xl:py-1 px-1 xl:px-4 text-3xs 2xl:text-2xs block cursor-not-allowed disabled:opacity-30"
                      disabled>
                      Refuser
                    </CustomButton>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {/* Invitation request empty box end */}
              </>
            )}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default SharedQuizzesTab;
