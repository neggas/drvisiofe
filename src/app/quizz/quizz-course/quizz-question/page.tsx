"use client";
import {
  CustomButton,
  CustomFullScreenLoader,
  CustomImage,
  CustomLink,
  CustomList,
  CustomListItems,
  DynamicHtmlTag,
  HeadingTag,
  QuizFeedback,
} from "@/components";
import { RootState } from "@/store";
import { setPatientStats, setQuizzStats } from "@/store/reducers/guestDetailsSlice";
import { authorizeAccess } from "@/store/reducers/quizSlice";
import {
  API_URL,
  fetchQuizzPatientStatsApi,
  fetchQuizzStatsApi,
  getAlphabetLabel,
  getCurrentQuestionApi,
  getLocalStorageData,
  setLocalStorageData,
  validateQuizAnswerApi,
} from "@/utility";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const QuizzQuestion = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const quizzPlayId = useSelector((state: RootState) => state.quiz?.quizzPlayId);
  const isAuthorized = useSelector((state: RootState) => state.quiz.isAuthorized);
  const [questionData, setQuestionData] = useState<any>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [nbGoodAnswers, setNbGoodAnswers] = useState(0);
  const [nbBadAnswers, setNbBadAnswers] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<number[]>([]);
  const fromQuizAssocie = getLocalStorageData("fromQuizAssocie", true);

  useEffect(() => {
    if (fromQuizAssocie && quizzPlayId) {
      setLocalStorageData("fromQuizAssocie", false);
      dispatch(authorizeAccess());
    } else if (!isAuthorized) {
      router.push("/quizz/quizz-course");
    }
  }, [fromQuizAssocie, quizzPlayId, isAuthorized, dispatch, router]);

  const fetchQuestionData = async () => {
    const guestUserData = getLocalStorageData("guest_user_data", {});
    const payload = {
      quizzPlayId: quizzPlayId,
      firstName: guestUserData.firstName || "",
      lastName: guestUserData.lastName || "",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
    };

    try {
      const response = await getCurrentQuestionApi(payload);

      let data;
      if (response && response.code === 1 && response.data) {
        data = response.data;
      } else {
        data = response;
      }

      setQuestionData(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (quizzPlayId) {
      fetchQuestionData();
    }
  }, [quizzPlayId]);

  const handleAnswerClick = (answerId: number) => {
    if (!submitted) {
      setSelectedAnswerIds(prevSelectedAnswerIds => {
        if (prevSelectedAnswerIds.includes(answerId)) {
          return prevSelectedAnswerIds.filter(id => id !== answerId);
        } else {
          return [...prevSelectedAnswerIds, answerId];
        }
      });
    }
  };

  const handleNext = async () => {
    if (progressPercent >= 100) {
      setQuizCompleted(true);
    } else {
      await fetchQuestionData(); // Fetch the next question
      setSelectedAnswerIds([]);
      setSubmitted(false);
      setQuizResult(null);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswerIds.length === 0) return;

    const guestUserData = getLocalStorageData("guest_user_data", {});

    const payload = {
      quizzPlayId: quizzPlayId,
      quizzPlayQuestionId: questionData?.id,
      firstName: guestUserData.firstName || "",
      lastName: guestUserData.lastName || "",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
      answerIds: selectedAnswerIds,
    };

    try {
      const response = await validateQuizAnswerApi(payload);
      if (response && response.code === 1) {
        // Existing code for updating stats
        const statsPayload = {
          firstName: guestUserData.firstName || "",
          lastName: guestUserData.lastName || "",
          phone: guestUserData.phone || "",
          ipAddress: guestUserData.ipAddress || "",
          macAddress: guestUserData.macAddress || "",
        };

        const quizzStats = await fetchQuizzStatsApi(statsPayload);

        const patientQuizzStats = await fetchQuizzPatientStatsApi(statsPayload);
        dispatch(setQuizzStats(quizzStats));
        dispatch(setPatientStats(patientQuizzStats));
        setQuizResult(response.data);
        setProgressPercent(response.data.progressPercent || 0);
        setNbGoodAnswers(response.data.nbGoodAnswers || 0);
        setNbBadAnswers(response.data.nbBadAnswers || 0);
        setPoints(response.data.points || 0);
        setSubmitted(true);

        // Update questionData with updated correctAnswer values
        const updatedQuestion = response.data.quizz.questions.find((q: any) => q.id === questionData.question.id);
        if (updatedQuestion && updatedQuestion.questionAnswerPropositions) {
          setQuestionData((prevQuestionData: any) => ({
            ...prevQuestionData,
            question: {
              ...prevQuestionData.question,
              questionAnswerPropositions: updatedQuestion.questionAnswerPropositions,
            },
          }));
        }

        // Determine if the user's answer is correct
        const allCorrectAnswerIds = updatedQuestion.questionAnswerPropositions.filter((ans: any) => ans.correctAnswer).map((ans: any) => ans.id);

        const isCorrect = selectedAnswerIds.every(id => allCorrectAnswerIds.includes(id)) && selectedAnswerIds.length === allCorrectAnswerIds.length;
        setIsAnswerCorrect(isCorrect);
      }
    } catch (error) {}
  };

  if (!questionData || !questionData.question) {
    return <div>Aucune question trouvée </div>;
  }

  const { question } = questionData;
  const explanation = question.explanation;

  return (
    <DynamicHtmlTag type="div" className="relative h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex px-4 mb-1 lg:mb-0">
        <CustomImage src="/images/quiz.svg" alt="quiz" width={25} height={25} />
        <HeadingTag type="h2" className="font-semibold text-sm px-2 relative top-1">
          QUIZZ
        </HeadingTag>
      </DynamicHtmlTag>

      {quizCompleted ? (
        // Congratulation Block
        <DynamicHtmlTag
          type="div"
          className="gradient-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 lg:mt-2 h-auto quiz-invite-main-start overflow-hidden lg:overflow-auto">
          <DynamicHtmlTag
            type="div"
            className="w-full bg-base-100 items-center rounded-b-lg justify-center p-2 lg:p-4 xl:p-2 bg-[url('/images/background-image.svg')] bg-cover bg-center quiz-inner-dashboard">
            <DynamicHtmlTag type="div" className="h-full p-1 md:p-2">
              <HeadingTag type="h2" className="font-bold text-sm lg:text-lg lg:hidden md:mb-1 lg:mb-0 text-center">
                Quizz
              </HeadingTag>
              <DynamicHtmlTag type="div" className="w-full">
                <HeadingTag type="h2" className="text-black px-2 text-xs md:text-base lg:text-lg 2xl:text-xl uppercase font-family-Gagalin">
                  Mini Quizz
                </HeadingTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full courses-row">
                <DynamicHtmlTag type="div" className="bg-gradient-to-tl from-red-500 to-orange-500 rounded-lg p-2">
                  <DynamicHtmlTag type="div" className="flex justify-center relative top-[-20px] md:-top-6 lg:top-[-30px] items-center">
                    <DynamicHtmlTag type="div" className="rounded-full lg:rounded-2xl border-2 border-base-100 overflow-hidden">
                      <DynamicHtmlTag
                        type="div"
                        className="course-cards cardiology w-32 md:w-44 lg:w-64 xl:w-72 line-clamp-1 text-center text-base-100 rounded-xl px-1 md:px-3 py-1 text-xs md:text-sm 2xl:text-lg font-semibold leading-[inherit]">
                        {question.speciality && question.speciality.name}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="flex gap-1 items-center md:flex-row relative bottom-2 md:bottom-5 text-base-100 lg:px-2 md:px-4">
                    <DynamicHtmlTag type="div" className="absolute bottom-0 md:-bottom-3 lg:bottom-0 -top-8 md:-top-1.5 2xl:top-0 lg:block">
                      <DynamicHtmlTag type="span" className="block text-2xs md:text-base">
                        Question
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="px-1 max-w-max font-semibold text-xs lg:text-sm">
                        <DynamicHtmlTag type="span" className="text-base md:text-lg 2xl:text-xl">
                          {questionData.nbTotalQuestion}
                        </DynamicHtmlTag>
                        /{questionData.nbTotalQuestion}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className="text-2xs md:text-base xl:text-sm 2xl:text-lg text-center font-bold w-full relative top-2.5 lg:left-[16px] mb-2">
                      Félicitations
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full quiz-inner-response flex flex-col justify-between">
                <DynamicHtmlTag type="div" className="h-[76%] lg:h-[87%] overflow-auto">
                  <DynamicHtmlTag type="div" className="text-center mt-2 2xl:mt-5">
                    <CustomImage
                      src="/images/coin-banner.svg"
                      alt="coin-banner"
                      width={82}
                      height={104}
                      className="h-14 lg:h-20 xl:h-24 2xl:h-32 w-14 lg:w-20 xl:w-24 2xl:w-32 mx-auto"
                    />
                    <DynamicHtmlTag type="p" className="text-xs md:text-sm lg:text-base xl:text-sm 2xl:text-lg font-semibold 2xl:mt-5">
                      Tu as terminé le quizz avec {points} points !
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-2xs md:text-xs lg:text-sm xl:text-xs 2xl:text-lg">
                      <DynamicHtmlTag type="p" className="text-sky-800 mt-1">
                        N&apos;oubliez pas de vous connecter pour ajouter les points gagnés à votre profil.
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="p" className="text-sky-800">
                        Hors connexion, les points ne seront pas cumulés.
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex justify-center items-center mt-1 md:mt-2 2xl:mt-6">
                    <DynamicHtmlTag type="div" className="flex gap-3 md:gap-4 lg:gap-5">
                      <DynamicHtmlTag type="span" className="text-xl xl:text-2xl 2xl:text-3xl font-bold relative top-5">
                        + {points}
                      </DynamicHtmlTag>
                      <CustomImage
                        src="/images/wincoins.svg"
                        alt="wincoins"
                        width={80}
                        height={50}
                        className="h-14 lg:h-16 2xl:h-16 w-9 lg:w-10 2xl:w-14"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex justify-center gap-4 xl:mt-2 2xl:mt-4">
                    <DynamicHtmlTag
                      type="div"
                      className="bg-gradient-to-t from-green-700 to-green-500 text-base-100 rounded-lg p-1 md:p-2 lg:p-3 w-36 lg:w-44">
                      <DynamicHtmlTag type="p" className="text-base md:text-xl lg:text-xl 2xl:text-2xl font-bold">
                        {nbGoodAnswers}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="p" className="text-2xs md:text-xs 2xl:text-sm">
                        Bonnes réponses
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className="bg-gradient-to-t from-red-500 to-red-700 text-base-100 rounded-lg p-1 md:p-2 lg:p-3 w-36 lg:w-44">
                      <DynamicHtmlTag type="p" className="text-base md:text-xl lg:text-xl 2xl:text-2xl font-bold">
                        {nbBadAnswers}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="p" className="text-2xs md:text-xs 2xl:text-sm">
                        Mauvaises réponses
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {/* Response buttons start */}
                <DynamicHtmlTag type="div" className="absolute bottom-2 left-0 px-3 w-full flex justify-between mt-1 xl:mt-0 2xl:mt-5 gap-4">
                  <CustomLink
                    href="/quizz/my-profile"
                    className="w-1/2 text-center lg:w-60 card-btn bg-gradient-to-b from-sky-500 to-indigo-500 text-base-100 text-2xs md:text-xs lg:text-sm 2xl:text-base px-2 md:px-3 lg:px-3 xl:px-6 py-1 lg:py-1.5 2xl:py-2 rounded-full font-semibold">
                    Voir mon profil
                  </CustomLink>
                  <CustomLink
                    href="/quizz/quizz-course"
                    className="w-1/2 lg:w-60 text-center card-btn bg-gradient-to-b from-sky-500 to-indigo-500 text-base-100 text-2xs md:text-xs lg:text-sm 2xl:text-base px-2 md:px-3 lg:px-3 xl:px-6 py-1 lg:py-1.5 2xl:py-2 rounded-full font-semibold">
                    Faire un autre quizz
                  </CustomLink>
                </DynamicHtmlTag>
                {/* Response buttons end */}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      ) : (
        <>
          <DynamicHtmlTag
            type="div"
            className="gradient-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 lg:mt-2 h-auto quiz-invite-main-start">
            {question.questionType === "TRUE_FALSE" ? (
              // Render Vrai/Faux question block
              <DynamicHtmlTag
                type="div"
                className="w-full bg-base-100 items-center rounded-b-lg justify-center p-2 lg:p-4 xl:p-2 quiz-inner-dashboard z-20 relative">
                <DynamicHtmlTag
                  type="div"
                  className="absolute inset-0 h-full w-full -z-10 opacity-55"
                  style={{
                    backgroundColor: question.speciality.color || "#0F2133",
                    maskImage: `url(/images/background-image.svg)`,
                    WebkitMaskImage: `url(/images/background-image.svg)`,
                    maskSize: "cover",
                    WebkitMaskSize: "cover",
                    maskPosition: "center top",
                    WebkitMaskPosition: "center top",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
                <DynamicHtmlTag type="div" className="flex flex-col justify-between h-full">
                  <DynamicHtmlTag type="div" className="flex flex-col items-center justify-center">
                    <HeadingTag type="h2" className="font-bold text-sm lg:text-lg lg:hidden mb-2 lg:mb-0">
                      Quizz
                    </HeadingTag>
                    <DynamicHtmlTag type="div" className="w-full">
                      <HeadingTag type="h2" className="text-black text-2xs md:text-xs px-2 lg:text-lg uppercase font-family-Gagalin">
                        Mini Quizz
                      </HeadingTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full courses-row">
                      <DynamicHtmlTag type="div" className="bg-gradient-to-tl from-red-500 to-orange-500 rounded-lg p-2">
                        <DynamicHtmlTag type="div" className="flex justify-center relative top-[-20px] md:top-[-30px] items-center">
                          <DynamicHtmlTag type="div" className="rounded-full border-2 border-white overflow-hidden">
                            <DynamicHtmlTag
                              type="div"
                              className="course-cards cardiology lg:w-60 text-center text-base-100 rounded-xl px-4 md:px-3 py-1 text-xs md:text-lg xl:text-sm 2xl:text-lg font-semibold">
                              {question.speciality && question.speciality.name}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="div"
                          className="flex gap-1 items-center md:flex-row relative bottom-2 md:bottom-5 text-base-100 lg:px-2 md:px-4">
                          <DynamicHtmlTag type="div" className="absolute bottom-4 lg:bottom-[1px] lg:block">
                            <DynamicHtmlTag type="span" className="text-2xs md:text-lg xl:text-sm 2xl:text-lg font-bold">
                              Question
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="px-1 max-w-max font-semibold text-2xs">
                              <DynamicHtmlTag type="span" className="text-sm md:text-lg 2xl:text-xl">
                                {questionData.indexQuestion}
                              </DynamicHtmlTag>
                              /{questionData.nbTotalQuestion}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag
                            type="div"
                            className="text-2xs md:text-base xl:text-sm 2xl:text-lg text-center font-bold w-full relative mb-2 px-8">
                            {question.title}
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="quiz-question-inner-tab w-full quizz-question-heght-mobile overflow-y-auto">
                      <DynamicHtmlTag type="div" className="w-full  lg:w-6/12 mx-auto mt-2 2xl:mt-5 grid grid-cols-1 gap-4 md:gap-10">
                        <DynamicHtmlTag type="div" className="flex gap-5 flex-col-reverse md:flex-row items-center lg:max-h-max overflow-y-auto">
                          <DynamicHtmlTag type="div" className="flex justify-center items-center w-1/3 2xl:w-1/2">
                            <DynamicHtmlTag
                              type="div"
                              className="w-[180px] h-[80px] lg:w-full lg:h-full xl:w-[80%] xl:h-[80%] rounded-md border border-gray-500 overflow-hidden">
                              {question.image && (
                                <CustomImage
                                  src={`${API_URL}${question.image.url}`}
                                  alt="question-image"
                                  width={150}
                                  height={100}
                                  className="w-full h-full object-contain lg:object-cover"
                                />
                              )}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="div" className="w-full lg:w-2/3 2xl:w-1/2">
                            <DynamicHtmlTag type="div" className="w-full flex flex-col gap-2">
                              <CustomList className="flex lg:block items-center space-x-2 lg:space-x-0 lg:space-y-2">
                                {question.questionType === "TRUE_FALSE" &&
                                  question.questionAnswerPropositions?.length > 0 &&
                                  question.questionAnswerPropositions.map((answer: any, index: number) => (
                                    <CustomListItems
                                      key={answer.id}
                                      onClick={() => {
                                        if (!submitted && !quizResult) handleAnswerClick(answer.id);
                                      }}
                                      className={`text-2xs lg:text-xs 2xl:text-sm cursor-pointer w-full flex items-center justify-center py-1 2xl:py-2 rounded-full font-semibold mt-1 md:mt-2 lg:mt-0 border-[4px]
                                    ${
                                      submitted
                                        ? answer.correctAnswer
                                          ? selectedAnswerIds.includes(answer.id)
                                            ? // Correct answer selected by user
                                              "bg-green-500 text-base-100 border-green-600"
                                            : // Correct answer not selected by user
                                              "custom-grey-btn font-bold border-green-600"
                                          : selectedAnswerIds.includes(answer.id)
                                            ? // Incorrect answer selected by user
                                              "bg-red-500 text-base-100 border-[2px] border-red-500"
                                            : // Incorrect answer not selected
                                              "custom-grey-btn font-bold border-[2px]"
                                        : selectedAnswerIds.includes(answer.id)
                                          ? // Before submission, selected answer
                                            "bg-gradient-to-b from-sky-500 to-indigo-500 border-[3px] border-sky-500 text-base-100"
                                          : // Before submission, unselected answer
                                            "custom-grey-btn font-bold text-base-100 border-[2px]"
                                    }
                                    ${submitted ? "cursor-not-allowed opacity-85" : "hover:bg-gray-300"}`}>
                                      {answer.texte}
                                    </CustomListItems>
                                  ))}
                              </CustomList>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="w-[104px] lg:w-[191px] mx-auto mt-3 xl:mt-2 2xl:mt-5">
                        <CustomButton
                          className={`text-xs xl:text-sm 2xl:text-lg custom-grey-btn text-white font-semibold py-1 2xl:py-2 px-4 rounded-full w-full ${
                            selectedAnswerIds.length > 0 && !submitted && !quizResult
                              ? "card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer"
                              : "from-silver-500 to-silver-400 cursor-not-allowed"
                          }`}
                          disabled={selectedAnswerIds.length === 0 || submitted || quizResult}
                          onClick={handleSubmit}>
                          Valider
                        </CustomButton>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {quizResult && (
                    <QuizFeedback
                      isAnswerCorrect={isAnswerCorrect}
                      explanation={explanation}
                      handleNext={handleNext}
                      nbGoodAnswers={quizResult.nbGoodAnswers}
                      nbBadAnswers={quizResult.nbBadAnswers}
                    />
                  )}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            ) : (
              // Render multiple-choice question block
              <DynamicHtmlTag
                type="div"
                className="w-full bg-base-100 items-center rounded-b-lg justify-center p-2 lg:p-4 xl:p-2 quiz-inner-dashboard z-20 relative xx">
                <DynamicHtmlTag
                  type="div"
                  className="absolute inset-0 h-full w-full -z-10 opacity-55"
                  style={{
                    backgroundColor: question.speciality.color || "#0F2133",
                    maskImage: `url(/images/background-image.svg)`,
                    WebkitMaskImage: `url(/images/background-image.svg)`,
                    maskSize: "cover",
                    WebkitMaskSize: "cover",
                    maskPosition: "center top",
                    WebkitMaskPosition: "center top",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
                <DynamicHtmlTag type="div" className="flex flex-col justify-between h-full">
                  <DynamicHtmlTag type="div" className="flex flex-col items-center justify-center pt-0 pb-2 px-2 lg:p-2">
                    <HeadingTag type="h2" className="font-bold text-sm lg:text-lg lg:hidden mb-2 lg:mb-0">
                      Quizz
                    </HeadingTag>
                    <DynamicHtmlTag type="div" className="w-full">
                      <HeadingTag type="h2" className="text-black px-2 text-2xs md:text-base lg:text-lg 2xl:text-xl uppercase font-family-Gagalin">
                        Mini Quizz
                      </HeadingTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full courses-row">
                      <DynamicHtmlTag type="div" className="rounded-lg p-1 lg:p-2" style={{ backgroundColor: question.speciality.color }}>
                        <DynamicHtmlTag type="div" className="flex justify-center relative top-[-20px] md:-top-6 lg:top-[-30px] items-center">
                          <DynamicHtmlTag type="div" className="rounded-full lg:rounded-2xl border-2 border-base-100 overflow-hidden">
                            <DynamicHtmlTag
                              type="div"
                              className="w-32 md:w-44 lg:w-64 xl:w-72 line-clamp-1 text-center text-base-100 rounded-xl px-1 md:px-3 py-1 text-xs md:text-sm 2xl:text-lg font-semibold leading-[inherit]"
                              style={{ backgroundColor: question.speciality.color }}>
                              {question.speciality && question.speciality.name}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="div"
                          className="flex gap-1 items-center md:flex-row relative bottom-2 md:bottom-5 text-base-100 lg:px-2 md:px-4">
                          <DynamicHtmlTag type="div" className="absolute bottom-0 md:-bottom-3 lg:bottom-0 -top-5 md:-top-1.5 xl:-top-2 lg:block">
                            <DynamicHtmlTag type="div" className="absolute bottom-8 md:bottom-auto lg:block text-2xs md:text-base">
                              Question
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="px-1 max-w-max font-semibold text-2xs md:text-sm mt-2 lg:mt-4">
                              <DynamicHtmlTag type="span" className="text-sm md:text-lg 2xl:text-xl">
                                {questionData.indexQuestion}
                              </DynamicHtmlTag>
                              /{questionData.nbTotalQuestion}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag
                            type="div"
                            className="text-2xs md:text-base xl:text-sm 2xl:text-lg text-center font-bold w-full relative top-2.5 lg:left-[16px] mb-2">
                            {question.title}
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="quiz-question-inner-tab w-full quizz-question-heght-mobile overflow-y-auto">
                      <DynamicHtmlTag
                        type="div"
                        className="w-full md:w-4/5 xl:w-6/12 mx-auto mt-3 lg:mt-5 xl:mt-2 2xl:mt-5 grid grid-cols-1 gap-4 md:gap-10">
                        <DynamicHtmlTag type="div" className="flex gap-1 md:gap-4 lg:gap-5 flex-row items-center">
                          <DynamicHtmlTag type="div" className="flex justify-center items-center w-2/5 md:w-1/2 lg:w-2/5 2xl:w-1/2">
                            <DynamicHtmlTag type="div" className="rounded-md border border-gray-500 overflow-hidden">
                              {question.image && (
                                <CustomImage
                                  src={`${API_URL}${question.image.url}`}
                                  alt="question-image"
                                  width={150}
                                  height={100}
                                  className="w-32 md:w-40 lg:w-44 2xl:w-60 h-32 md:h-40 lg:h-44 2xl:h-60 object-cover"
                                />
                              )}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="div" className="w-3/5 md:w-1/2 lg:w-3/5 xl:w-1/2">
                            <DynamicHtmlTag type="div" className="w-full flex flex-col gap-1 md:gap-2">
                              <CustomList className="flex lg:block flex-wrap items-center lg:space-y-2 justify-between">
                                {question.questionAnswerPropositions &&
                                  question.questionAnswerPropositions.map((answer: any, index: number) => (
                                    <CustomListItems
                                      key={answer.id}
                                      onClick={() => {
                                        if (!submitted && !quizResult) handleAnswerClick(answer.id);
                                      }}
                                      className={`text-2xs lg:text-xs 2xl:text-sm cursor-pointer w-full flex items-center justify-center py-1 2xl:py-2 rounded-full font-semibold mt-1 md:mt-2 lg:mt-0 border
                                        ${
                                          submitted
                                            ? answer.correctAnswer
                                              ? selectedAnswerIds.includes(answer.id)
                                                ? // Correct answer selected by user
                                                  "bg-green-500 text-base-100 border-[2px] border-green-600"
                                                : // Correct answer not selected by user
                                                  "custom-grey-btn font-bold border-[4px] border-green-600"
                                              : selectedAnswerIds.includes(answer.id)
                                                ? // Incorrect answer selected by user
                                                  "bg-red-500 text-base-100 border-[2px] border-red-500"
                                                : // Incorrect answer not selected
                                                  "custom-grey-btn font-bold border-[2px]"
                                            : selectedAnswerIds.includes(answer.id)
                                              ? // Before submission, selected answer
                                                "bg-gradient-to-b from-sky-500 to-indigo-500 border-[3px] border-sky-500 text-base-100"
                                              : // Before submission, unselected answer
                                                "custom-grey-btn font-bold text-base-100 border-[2px]"
                                        }
                                        ${submitted ? "cursor-not-allowed opacity-85" : "hover:bg-gray-300"}`}>
                                      {answer.texte}
                                    </CustomListItems>
                                  ))}
                              </CustomList>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="w-full justify-center flex mt-2 lg:mt-4 xl:mt-2 2xl:mt-4">
                        <CustomButton
                          className={`w-[104px] lg:w-[191px] text-2xs lg:text-xs xl:text-sm 2xl:text-lg custom-grey-btn text-base-100 font-semibold py-1 md:py-1.5 xl:py-1 2xl:py-2 px-2 lg:px-4 rounded-full ${
                            selectedAnswerIds && !submitted && !quizResult
                              ? "card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer"
                              : "from-silver-500 to-silver-400 cursor-not-allowed"
                          }`}
                          disabled={!selectedAnswerIds || submitted || quizResult}
                          onClick={handleSubmit}>
                          Valider
                        </CustomButton>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {quizResult && (
                    <QuizFeedback
                      isAnswerCorrect={isAnswerCorrect}
                      explanation={explanation}
                      handleNext={handleNext}
                      nbGoodAnswers={quizResult.nbGoodAnswers}
                      nbBadAnswers={quizResult.nbBadAnswers}
                    />
                  )}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
        </>
      )}
    </DynamicHtmlTag>
  );
};

export default QuizzQuestion;
