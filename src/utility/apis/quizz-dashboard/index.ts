import { NewCourseTypes, PopularQuizTypes, QuizModeType, QuizNewSpecialityTypes, QuizSpecialityTypes } from "@/utility";
import axiosInstance from "../axiosInstance";

export const fetchQuizzPatientStatsApi = async (payload: any) => {
  const API_URL = `/quizz/all-quizz-patient-statistic`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchQuizzStatsApi = async (payload: any) => {
  const API_URL = `/quizz/all-quizz-statistic`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPopularQuizzes = async (): Promise<PopularQuizTypes[]> => {
  const API_URL = `/quizz/all-popular-speciality`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export const fetchQuizModes = async (): Promise<QuizModeType[]> => {
  const API_URL = `/settings/quizz/type/all?page=0&size=10`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export const fetchQuizThemes = async (): Promise<QuizSpecialityTypes[]> => {
  const API_URL = `/quizz/speciality/all?page=0&size=10`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export const fetchDiscoveryMedicalSpecialityApi = async (payload: any) => {
  const API_URL = `/quizz/course/all-quizz-course-patient-statistic`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCourseBySpecialityApi = async (payload: any) => {
  const API_URL = `/quizz/course/all-course-by-speciality`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCourseDetailsApi = async (payload: any) => {
  const API_URL = `/quizz/course/view-course`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadCoursePdfApi = async (payload: any) => {
  const API_URL = `/quizz/course/download-course-pdf`;
  try {
    const response = await axiosInstance.post(API_URL, payload, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWhatsNewQuiz = async (): Promise<QuizNewSpecialityTypes[]> => {
  const API_URL = `/quizz/all-new-by-speciality`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export const fetchWhatsNewCourse = async (): Promise<NewCourseTypes["results"]> => {
  const API_URL = `/quizz/course/all-new-course`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export const searchSpecialitiesApi = async (page: number, size: number, query: string) => {
  try {
    const API_URL = `/quizz/speciality/search?page=${page}&size=${size}`;
    const response = await axiosInstance.post(API_URL, { search: query });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const quizzCheckStatusApi = async (payload: any) => {
  const API_URL = `/quizz/play/check-started-quizz`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const launchQuizApi = async (payload: any) => {
  const API_URL = `/quizz/play/launch`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentQuestionApi = async (payload: any) => {
  const API_URL = `/quizz/play/get-current-question`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const validateQuizAnswerApi = async (payload: any) => {
  const API_URL = `/quizz/play/question/submit`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const launchQuizAssocieApi = async (payload: any) => {
  const API_URL = `/quizz/play/launch-quizz-course`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 1st Block in Duel - My profile
export const fetchInvitationSharedQuizStatsList = async () => {
  const API_URL = `/quizz/play/all-duel-invitation-initiated-by-inviter`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.results;
  } catch (error) {
    return [];
  }
};

// 2nd Block in Duel - My profile
export const fetchInvitationList = async () => {
  const API_URL = `/quizz/play/all-duel-invitation-initiated-by-user`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.results;
  } catch (error) {
    return [];
  }
};

export const lastQuizPlayedApi = async (payload: any) => {
  const API_URL = `/quizz/play/last-quizz-game-played`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
