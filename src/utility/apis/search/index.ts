import axiosInstance from "../axiosInstance";

export const searchPractitionerApi = async (
  localDate: string,
  speciality: string = "",
  page: number = 0,
  size: number = 10,
  minHour: string = "12:00",
  firstName: string = "",
  lastName: string = "",
  maxHour: string = "23:30",
  city: string = "",
  country: string = "",
  sector: string = "",
  userGender: string = "",
  title: string = ""
) => {
  try {
    const API_URL = `/teleconsultation/practitioner/slot/search?page=${page}&size=${size}&minHour=${minHour}&maxHour=${maxHour}&city=${city}&country=${country}&sector=${sector}&firstName=${firstName}&lastName=${lastName}&speciality=${speciality}&userGender=${userGender}&title=${title}&localDate=${localDate}`;
    const response = await axiosInstance.post(API_URL, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSpecialitiesApi = async () => {
  try {
    const API_URL = `/settings/speciality/all`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchPractitionerByPatternApi = async (page: number, size: number, query: string) => {
  try {
    const API_URL = `/teleconsultation/practitioner/search-by-pattern?page=${page}&size=${size}`;
    const response = await axiosInstance.post(API_URL, { search: query }, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPractitionerProfileApi = async (practitionerId: number) => {
  try {
    const API_URL = `/teleconsultation/practitioner/profile/${practitionerId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPractitionerTimeSlotsByDateRangeApi = async (practitionerId: number, startDate: string, endDate: string) => {
  try {
    const API_URL = `/teleconsultation/practitioner/slot/search-for-range-days?practitionerId=${practitionerId}&startDate=${startDate}&endDate=${endDate}`;
    const response = await axiosInstance.post(API_URL, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
