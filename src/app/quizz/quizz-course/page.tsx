"use client";

import { CustomButton, CustomFullScreenLoader, CustomImage, CustomLink, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import { useViewport } from "@/hooks/useviewport";
import { RootState } from "@/store";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { resetModal, openModal, closeModal } from "@/store/reducers/modalSlice";
import { authorizeAccess, clearSelectedQuizId, setQuizId, setQuizzPlayId } from "@/store/reducers/quizSlice";
import {
  API_URL,
  fetchQuizModes,
  fetchQuizThemes,
  getCurrentQuestionApi,
  getLocalStorageData,
  launchQuizApi,
  QuizModeType,
  QuizSpecialityTypes,
  quizzCheckStatusApi,
  quizzCourseSchema,
} from "@/utility";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

interface ThematiqueComputedStyle {
  thematiqueContainer: {
    style: string;
  };
  thematiqueButtonContainer: {
    style: string;
  };
}

const defaultThematiqueComputedStyle: ThematiqueComputedStyle = {
  thematiqueButtonContainer: {
    style: "grid grid-cols-2",
  },
  thematiqueContainer: {
    style: "h-auto",
  },
};

export default function QuizCourse() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSelectedQuizId = searchParams.get("selectedQuizId");
  const [quizModes, setQuizModes] = useState<QuizModeType[]>([]);
  const [quizThemes, setQuizThemes] = useState<QuizSpecialityTypes[]>([]);
  const [selectedMode, setSelectedMode] = useState<number | undefined>(undefined);
  const [selectedTheme, setSelectedTheme] = useState<number>();
  const [selectedThemeData, setSelectedThemeData] = useState<QuizSpecialityTypes | null>(null);
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isAuthorized = useSelector((state: RootState) => state.quiz.isAuthorized);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const isQuizModesFetched = useRef(false);
  const isQuizThemesFetched = useRef(false);
  const selectedQuizId = useSelector((state: RootState) => state.quiz?.selectedQuizId);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [progressPercent, setProgressPercent] = useState(0);
  const quizzPlayId = useSelector((state: RootState) => state.quiz?.quizzPlayId);
  const [nbStar, setNbStar] = useState(0);
  const loggedInUser = useSelector(selectLoginResponse);
  const viewPort = useViewport();

  const [computedThematiqueStyle, setThematiqueStyle] = useState<ThematiqueComputedStyle>(defaultThematiqueComputedStyle);

  const fetchQuizType = async () => {
    if (isQuizModesFetched.current) return;
    isQuizModesFetched.current = true;
    const modes = await fetchQuizModes();
    setQuizModes(modes);
  };

  const fetchQuizSpeciality = async () => {
    if (isQuizThemesFetched.current) return;
    isQuizThemesFetched.current = true;
    const themes = await fetchQuizThemes();
    setQuizThemes(themes);
  };

  const defiModeIndex = quizModes.findIndex(mode => mode.name === "Defiez un ami");

  const openQuizProgressModal = () => {
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("quizProgress")));
  };

  const closeQuizProgressModal = () => {
    dispatch(closeModal());
  };

  const openGameProgressModal = () => {
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("gameProgress")));
  };

  const closeGameProgressModal = () => {
    dispatch(closeModal());
  };

  const startNewQuiz = async () => {
    dispatch(showLoader("start-new-quiz"));
    try {
      if (selectedMode === undefined || selectedTheme === undefined) {
        return;
      }

      const guestUserData = getLocalStorageData("guest_user_data", {});

      const filteredSpeciality = quizThemes.filter(theme => theme.speciality.nbAssociatedQuiz > 0)[selectedTheme!];

      const payload = {
        quizzTypeId: quizModes[selectedMode].id,
        specialityId: filteredSpeciality.speciality.id,
        firstName: guestUserData.firstName || "",
        lastName: guestUserData.lastName || "",
        ipAddress: guestUserData.ipAddress || "",
        macAddress: guestUserData.macAddress || "",
      };

      const launchResponse = await launchQuizApi(payload);
      const quizId = launchResponse.data?.id;
      dispatch(setQuizId(quizId));
      dispatch(setQuizzPlayId(quizId));
      dispatch(authorizeAccess());
      router.push("/quizz/quizz-course/quizz-question");
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleResumeQuiz = async () => {
    dispatch(showLoader("resume-quiz-question"));

    try {
      if (selectedMode === undefined || selectedTheme === undefined) {
        return;
      }

      const guestUserData = getLocalStorageData("guest_user_data", {});
      const payload = {
        quizzPlayId: quizzPlayId,
        firstName: guestUserData.firstName || "",
        lastName: guestUserData.lastName || "",
        ipAddress: guestUserData.ipAddress || "",
        macAddress: guestUserData.macAddress || "",
      };

      // Get the current question of the ongoing quiz
      const response = await getCurrentQuestionApi(payload);
      const quizId = response.data?.quizId || response.data?.id;
      dispatch(setQuizId(quizId));
      dispatch(authorizeAccess());
      router.push("/quizz/quizz-course/quizz-question");
    } catch (error) {}
  };

  const handleStartQuiz = async () => {
    setErrors({});
    dispatch(showLoader("start-quiz"));
    try {
      // Validate the selected mode and theme
      await quizzCourseSchema.validate({ selectedMode, selectedTheme }, { abortEarly: false });

      if (selectedMode === undefined || selectedTheme === undefined) {
        throw new Error("Mode or Theme is not selected.");
      }

      const guestUserData = getLocalStorageData("guest_user_data", {});
      const filteredSpeciality = quizThemes.filter(theme => theme.speciality.nbAssociatedQuiz > 0)[selectedTheme!];

      const payload = {
        quizzTypeId: quizModes[selectedMode].id,
        specialityId: filteredSpeciality.speciality.id, // Use filtered speciality ID
        firstName: guestUserData.firstName || "",
        lastName: guestUserData.lastName || "",
        ipAddress: guestUserData.ipAddress || "",
        macAddress: guestUserData.macAddress || "",
      };

      try {
        // Check if there's an existing quiz in progress
        const response = await quizzCheckStatusApi(payload);

        if (response.code === 1 && response.data && response.data.status === "STARTED") {
          // Quiz is already started, open the modal
          setProgressPercent(response.data.progressPercent || 0);
          setNbStar(response.data.nbStar || 0);
          dispatch(setQuizzPlayId(response.data.id));
          setSelectedThemeData((prev: any) => ({
            ...prev,
            speciality: { ...prev?.speciality, progressPercent: response.data.progressPercent || 0 },
          }));
          selectedMode === defiModeIndex ? openGameProgressModal() : openQuizProgressModal();
        } else {
          // No quiz in progress, start a new one
          await startNewQuiz();
        }
      } catch (error: any) {
        // If the quiz is not found (no quiz in progress), start a new quiz
        if (error.response && error.response.status === 400 && error.response.data?.codeMessage === "QUIZZ_PLAY_STARTED_NOT_FOUND") {
          await startNewQuiz();
        }
      }
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleModeChange = (index: number) => {
    setSelectedMode(index);
    setErrors(prevErrors => ({ ...prevErrors, selectedMode: "" }));
  };

  const handleThemeChange = (index: number) => {
    const themeId = quizThemes.filter(theme => theme.speciality.nbAssociatedQuiz > 0)[index].speciality.id;

    setSelectedTheme(index);
    setSelectedThemeData(quizThemes.find(theme => theme.speciality.id === themeId) || null);
    setErrors(prevErrors => ({ ...prevErrors, selectedTheme: "" }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Show loader before fetching data
        dispatch(showLoader("quiz-course"));

        await fetchQuizType();
        await fetchQuizSpeciality();
        if (selectedMode === undefined && quizModes.length > 0) {
          setSelectedMode(0);
        }
      } finally {
        dispatch(hideLoader());
      }
    };

    loadData();

    return () => {
      dispatch(closeModal());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedQuizId && quizThemes.length > 0) {
      const filteredThemes = quizThemes.filter(theme => theme.speciality.nbAssociatedQuiz > 0);
      const matchingThemeIndex = filteredThemes.findIndex(theme => theme.speciality.id === Number(selectedQuizId));
      if (matchingThemeIndex !== -1) {
        setSelectedTheme(matchingThemeIndex);
        setSelectedThemeData(filteredThemes[matchingThemeIndex]);
        setSelectedMode(0);
      }
    }

    return () => {
      dispatch(clearSelectedQuizId()); // Reset the selectedQuizId
    };
  }, [selectedQuizId, quizThemes, dispatch]);

  useEffect(() => {
    if (urlSelectedQuizId && quizThemes.length > 0) {
      const filteredThemes = quizThemes.filter(theme => theme.speciality.nbAssociatedQuiz > 0);
      const matchingThemeIndex = filteredThemes.findIndex(theme => theme.speciality.id === Number(urlSelectedQuizId));
      if (matchingThemeIndex !== -1) {
        setSelectedTheme(matchingThemeIndex);
        setSelectedThemeData(filteredThemes[matchingThemeIndex]);
        setSelectedMode(0); // Default mode
      }
    }
  }, [urlSelectedQuizId, quizThemes]);

  useEffect(() => {
    const themesBeShow = quizThemes.filter(theme => theme.nbAssociatedQuiz > 0);

    if (viewPort.width < 768 && themesBeShow.length < 8) {
      setThematiqueStyle({
        thematiqueButtonContainer: {
          style: "h-full  flex flex-col justify-evenly",
        },
        thematiqueContainer: {
          style: "h-full",
        },
      });
    } else {
      setThematiqueStyle(defaultThematiqueComputedStyle);
    }
  }, [viewPort, quizThemes]);

  if (isLoading) {
    return <CustomFullScreenLoader />;
  }

  return (
    <DynamicHtmlTag type="div" className="h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12">
        <CustomImage src="/images/quiz.svg" alt="quiz" width={25} height={25} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          quizz
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="gradient-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 lg:mt-2 h-full">
        <DynamicHtmlTag
          type="div"
          className="w-full bg-base-100 flex flex-col items-center rounded-b-lg justify-between px-3 2xl:px-4 py-2 2xl:py-4 quiz-inner-dashboard h-auto min-h-full single-discovery">
          <DynamicHtmlTag type="div" className="h-full w-full flex flex-col gap-2 md:gap-3.5">
            <HeadingTag type="h2" className="text-xs text-blue uppercase text-center pb-1 font-semibold lg:hidden">
              QUIZZ
            </HeadingTag>
            <DynamicHtmlTag type="div" className="bg-base-100 rounded-lg shadow-lg w-full lg:h-[30%] mb-1 lg:mb-0">
              <HeadingTag type="h2" className="text-xs font-semibold text-center pt-1 pb-1 2xl:pt-3">
                {t("quiz_type")}
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex flex-wrap justify-center lg:justify-between p-1 bg-base-100 rounded-lg px-1 md:px-2 lg:px-4">
                {quizModes.map((mode, index) => (
                  <DynamicHtmlTag key={index} type="div" className="w-6/12 lg:w-4/12 p-1 lg:p-2">
                    <CustomButton
                      className={`w-full py-2 md:py-3 2xl:py-6 px-0.5 md:px-1 2xl:px-2 rounded-lg shadow-lg text-center ${
                        selectedMode !== undefined && selectedMode !== index
                          ? "bg-gradient-to-t from-silver-500 to-silver-400 text-gray-500 opacity-50"
                          : "bg-gradient-to-b from-indigo-500 to-sky-500 text-white"
                      } ${!loggedInUser && mode.name === "Defiez un ami" ? "cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => (!loggedInUser && mode.name === "Defiez un ami" ? null : handleModeChange(index))}
                      disabled={!loggedInUser && mode.name === "Defiez un ami"}
                      title={!loggedInUser && mode.name === "Defiez un ami" ? "Veuillez vous connecter pour choisir ce mode" : ""}>
                      <DynamicHtmlTag type="div" className="text-[18px] lg:text-sm xl:text-base 2xl:text-lg font-family-Gagalin">
                        {mode.name}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="text-[13px] md:text-2xs lg:text-xs 2xl:text-sm mt-0.5 md:mt-1">
                        {mode.numberOfQuestion} {t("quiz_random_question_text")}
                      </DynamicHtmlTag>
                    </CustomButton>
                  </DynamicHtmlTag>
                ))}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="bg-base-100 rounded-lg shadow-lg px-0 pb-0 lg:pb-1 2xl:pb-2 lg:px-4 w-full h-[70%] md:h-[60%] overflow-auto mb-1 lg:mb-0">
              <HeadingTag type="h2" className="text-xs font-semibold text-center pt-1 2xl:pt-2 h-[10%] mb-2 md:mb-0 sticky top-0 bg-white z-10">
                CHOISIR UNE THÉMATIQUE
              </HeadingTag>
              {/* THEME RESPONSIVE */}
              <DynamicHtmlTag type="div" className={`w-full ${computedThematiqueStyle.thematiqueContainer.style}`}>
                <DynamicHtmlTag
                  type="div"
                  className={`${computedThematiqueStyle.thematiqueButtonContainer.style} md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-4 px-2 pt-2 pb-2 lg:pb-0  rounded-lg`}>
                  {quizThemes
                    .filter(theme => theme.speciality.nbAssociatedQuiz > 0)
                    .map((theme, filteredIndex) => (
                      <DynamicHtmlTag key={theme.speciality.id} type="div" className="flex h-full">
                        <CustomButton
                          className={`w-full course-quizs py-1 md:py-3 2xl:py-5 px-1 2xl:px-2 rounded-lg text-center relative ${
                            selectedTheme === filteredIndex ? "outline outline-2 2xl:outline-4 outline-offset-4" : ""
                          }`}
                          style={{
                            backgroundColor: selectedTheme === filteredIndex || selectedTheme === undefined ? theme.speciality.color : "#d3d3d3",
                            color: selectedTheme === filteredIndex ? "#fff" : "#000",
                            outlineColor: selectedTheme === filteredIndex ? theme.speciality.color : "",
                          }}
                          onClick={() => handleThemeChange(filteredIndex)}>
                          <CustomImage
                            src={`${API_URL}${theme.speciality.file?.url}`}
                            alt={theme.speciality.name}
                            width={62}
                            height={77}
                            className="w-6 md:w-10 2xl:w-12 h-6 md:h-10 2xl:h-12 m-auto"
                          />
                          <DynamicHtmlTag
                            type="div"
                            className="font-semibold text-[13px]  md:text-xs lg:text-sm xl:text-2xs 2xl:text-base text-white line-clamp-1 lg:line-clamp-none">
                            {theme.speciality.name}
                          </DynamicHtmlTag>
                          <DynamicHtmlTag
                            type="div"
                            className="absolute top-1 right-1 md:right-2 text-[13px] md:text-xs lg:text-sm font-semibold text-white">
                            {theme.speciality.nbAssociatedQuiz}
                          </DynamicHtmlTag>
                        </CustomButton>
                      </DynamicHtmlTag>
                    ))}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full flex justify-end lg:h-[8%]">
              <DynamicHtmlTag
                type="div"
                className="bg-red mt-auto mb-0"
                title={
                  selectedMode === undefined || selectedTheme === undefined
                    ? "Sélectionnez à la fois le mode quiz et le thème pour continuer."
                    : errors.selectedMode && errors.selectedTheme
                      ? `${errors.selectedMode}, ${errors.selectedTheme}`
                      : errors.selectedMode
                        ? errors.selectedMode
                        : errors.selectedTheme
                          ? errors.selectedTheme
                          : ""
                }>
                <CustomButton
                  title="Sélectionnez à la fois le mode de quizz et le thème pour continuer"
                  className={`py-1 lg:py-2 px-4 lg:px-5 2xl:px-6 card-btn bg-gradient-to-l from-indigo-500 to-sky-500 text-base-100 rounded-full font-semibold text-xs lg:text-sm xl:text-xs 2xl:text-lg ${
                    selectedMode === undefined || selectedTheme === undefined || errors.selectedMode || errors.selectedTheme
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  onClick={handleStartQuiz}
                  disabled={selectedMode === undefined || selectedTheme === undefined || !!(errors.selectedMode || errors.selectedTheme)}>
                  {selectedMode === defiModeIndex ? "Partager le quizz" : "Commencer"}
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* <DynamicHtmlTag type="div" className="w-full flex justify-end lg:h-[8%]">
            <DynamicHtmlTag
              type="div"
              className="bg-red mt-auto mb-0"
              title={
                selectedMode === undefined || selectedTheme === undefined
                  ? "Sélectionnez à la fois le mode quiz et le thème pour continuer."
                  : errors.selectedMode && errors.selectedTheme
                    ? `${errors.selectedMode}, ${errors.selectedTheme}`
                    : errors.selectedMode
                      ? errors.selectedMode
                      : errors.selectedTheme
                        ? errors.selectedTheme
                        : ""
              }>
              <CustomButton
                className={`py-1 lg:py-2 px-4 lg:px-5 2xl:px-6 card-btn bg-gradient-to-l from-indigo-500 to-sky-500 text-base-100 rounded-full font-semibold text-xs lg:text-sm xl:text-xs 2xl:text-lg ${
                  selectedMode === undefined || selectedTheme === undefined || errors.selectedMode || errors.selectedTheme
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={handleStartQuiz}
                disabled={selectedMode === undefined || selectedTheme === undefined || !!(errors.selectedMode || errors.selectedTheme)}>
                {selectedMode === defiModeIndex ? "Partager le quizz" : "Commencer"}
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag> */}
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Quiz Progress Modal Start    */}
      {modalType === "quizProgress" && (
        <CustomModal
          id="quiz_process"
          isOpen={isModalOpen && modalType === "quizProgress"}
          onClose={closeQuizProgressModal}
          modalClassName="w-5/6 md:w-full md:max-w-2xl rounded-xl outline-none">
          <DynamicHtmlTag type="div" className="modal-box rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <MdClose
                onClick={closeQuizProgressModal}
                className="ms-auto cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-base-100"
              />
              <DynamicHtmlTag type="div" className="text-xs md:text-sm lg:text-lg font-semibold text-center flex-grow">
                Attention, vous avez déjà un quizz {selectedThemeData?.speciality.name || "..."} en cours !
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex justify-center">
                <DynamicHtmlTag type="div" className="w-full lg:w-4/6 p-1 md:p-2 lg:p-4 border border-gray-700 rounded-lg mt-4 lg:mt-5">
                  <DynamicHtmlTag
                    type="div"
                    className="rounded-lg p-4 relative"
                    style={{ backgroundColor: selectedThemeData?.speciality.color || "#f3f4f6" }}>
                    <DynamicHtmlTag type="div" className="flex justify-end absolute top-[-12px] right-[30px]">
                      {Array.from({ length: nbStar }).map((_, index) => (
                        <CustomImage key={index} src="/images/stars.svg" alt="star" width={50} height={50} className="mr-1" />
                      ))}
                    </DynamicHtmlTag>{" "}
                    <DynamicHtmlTag type="div" className="flex flex-col items-center justify-between h-14">
                      <DynamicHtmlTag type="div" className="w-full font-semibold text-sm lg:text-lg text-base-100">
                        {selectedThemeData?.speciality.name || "N/A"}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="w-full flex gap-5 items-center">
                        <DynamicHtmlTag type="div" className="w-full bg-gray-200 rounded-full h-2">
                          <DynamicHtmlTag type="div" className="px-2 bg-base-100 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="span" className="text-right text-sm text-base-100 relative">
                          {progressPercent}%
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-5">
                <DynamicHtmlTag type="p" className="text-center font-bold text-xs md:text-sm lg:text-lg">
                  Souhaitez-vous reprendre la partie existante
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-center font-bold text-xs md:text-sm lg:text-lg">
                  ou créer un nouveau quizz {selectedThemeData?.speciality.name || "N/A"} ?
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-center text-xs md:text-sm text-red-500 mt-4 md:mt-5">
                  (Attention: si vous créez un nouveau quizz, la partie en cours sera annulée)
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full flex gap-1 md:gap-4 lg:gap-5 justify-between mt-4 md:mt-5 lg:mt-7 md:px-6">
                <CustomButton
                  onClick={handleResumeQuiz}
                  className="w-[208px] card-btn bg-gradient-to-r from-sky-500 to-indigo-500 text-base-100 px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold text-3xs md:text-xs lg:text-sm text-center">
                  REPRENDRE LA PARTIE
                </CustomButton>
                <CustomButton
                  onClick={startNewQuiz}
                  className="w-[208px] card-btn bg-gradient-to-r from-sky-500 to-indigo-500 text-base-100 px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold text-3xs md:text-xs lg:text-sm text-center">
                  NOUVEAU QUIZZ
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Quiz Progress Modal End  */}

      {/* Quiz Game Progress Modal Start    */}
      {modalType === "gameProgress" && (
        <CustomModal
          id="game_process"
          isOpen={isModalOpen && modalType === "gameProgress"}
          onClose={closeGameProgressModal}
          modalClassName="w-full md:max-w-[38rem] rounded-xl outline-none">
          <DynamicHtmlTag type="div" className="modal-box rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4 rounded-b-lg">
              <MdClose
                onClick={closeGameProgressModal}
                className="ml-auto cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-base-100"
              />
              <DynamicHtmlTag type="div" className="w-8/12 mx-auto lg:w-full text-xs md:text-sm lg:text-lg font-semibold text-center lg:mt-2">
                Attention, vous avez déjà un quizz {selectedThemeData?.speciality.name || "N/A"} en cours !
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="lg:px-10 mt-5">
                <DynamicHtmlTag type="div" className="rounded-md p-3 flex items-center justify-between border border-gray-500">
                  <DynamicHtmlTag type="div" className="px-2 lg:px-4 w-9/12">
                    <DynamicHtmlTag type="div" className="flex gap-3">
                      <CustomImage src="/images/player.svg" alt="player" width={40} height={40} className="rounded-full" />
                      <DynamicHtmlTag type="div">
                        <HeadingTag type="h2" className="text-xs font-bold">
                          Romain Guérin
                        </HeadingTag>
                        <DynamicHtmlTag type="span" className="text-sm text-gray-500">
                          Thème - {selectedThemeData?.speciality.name || "N/A"}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex-grow mt-3">
                      <DynamicHtmlTag type="div" className="flex gap-5 items-center">
                        <DynamicHtmlTag type="div" className="w-full bg-gray-200 rounded-full h-1">
                          <DynamicHtmlTag type="div" className="px-2 bg-black h-1 rounded-full w-[51%]" />
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="span" className="text-right text-sm text-black relative font-semibold">
                          51%
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-3/12 flex justify-end items-end">
                    <CustomImage src="/images/quiz-modal.svg" alt="quiz-modal" width={80} height={80} />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4 lg:mt-5 text-center">
                <DynamicHtmlTag type="p" className="font-bold text-xs md:text-sm lg:text-lg">
                  Souhaitez-vous reprendre la partie existante
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="font-bold text-xs md:text-sm lg:text-lg">
                  ou créer un nouveau quizz {selectedThemeData?.speciality.name || "N/A"} ?
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-center text-xs md:text-sm text-red-500 mt-4 md:mt-5">
                  (Attention: si vous créez un nouveau quizz, la partie en cours sera annulée)
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full flex gap-1 md:gap-3 lg:gap-5 justify-between mt-4 md:mt-7 lg:px-6">
                <CustomLink
                  href=""
                  className="text-center w-full card-btn sm:w-[208px] bg-gradient-to-r from-sky-500 to-indigo-500 text-3xs md:text-xs lg:text-sm text-base-100 px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold">
                  REPRENDRE LA PARTIE
                </CustomLink>
                <CustomButton className="text-center w-full card-btn sm:w-[208px] bg-gradient-to-r from-sky-500 to-indigo-500 text-3xs md:text-xs lg:text-sm text-base-100 px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold">
                  NOUVEAU QUIZZ
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Quiz Game Progress Modal End  */}
    </DynamicHtmlTag>
  );
}
