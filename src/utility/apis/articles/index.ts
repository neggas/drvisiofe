import axiosInstance from "../axiosInstance";

export const allArticleList = async (page: number = 0, size: number = 250) => {
  try {
    const API_URL = `/article/all-article?page=0&size=10&isPublished=true`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const articleDetailsApi = async (id: number) => {
  try {
    const API_URL = `/article/view/${id}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
