import { GenderApiResponse } from "@/utility";
import axiosInstance from "../axiosInstance";
import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const IP_API_URL = process.env.NEXT_PUBLIC_API_GEO_IP_URL || "";

export const genderListingApi = async (): Promise<GenderApiResponse> => {
  try {
    const API_URL = "/settings/gender/all";
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const nationalityListingApi = async (page: number = 0, size: number = 250) => {
  try {
    const API_URL = `/settings/nationality/all?page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getcountryListingApi = async (page: number = 0, size: number = 250) => {
  try {
    const API_URL = `/settings/country/all?page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getcityListingApi = async (page: number = 0, size: number = 250) => {
  try {
    const API_URL = `/settings/city/all?page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const countryListingApi = async (search: string, page: number = 0, size: number = 10) => {
  try {
    const API_URL = `/settings/country/auto-complete?page=${page}&size=${size}`;
    const response = await axiosInstance.post(API_URL, { search });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cityAutoCompleteApi = async (searchText: string, countryId: number, page: number = 0, size: number = 10) => {
  const API_URL = `/settings/city/auto-complete?page=${page}&size=${size}`;
  try {
    const response = await axiosInstance.post(API_URL, { search: searchText, countryId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postalCodeAutoCompleteApi = async (searchText: string, countryId: number, page: number = 0, size: number = 10) => {
  const API_URL = `/settings/city/postal-code/auto-complete?page=${page}&size=${size}`;
  try {
    const response = await axiosInstance.post(API_URL, { search: searchText, countryId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLanguagesApi = async () => {
  const API_URL = `/settings/spoken-language/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAvatarsApi = async () => {
  const API_URL = `/settings/default-avatar/all?isActive=true`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLatestCguApi = async () => {
  const API_URL = `/cgu/PATIENT/latest`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLatestNoticeApi = async () => {
  const API_URL = `/notice/PATIENT/latest`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchIPAddress = async (): Promise<string | null> => {
  const API_URL = IP_API_URL;
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.ip;
  } catch (error) {
    return null;
  }
};

export const medicalAntecedentListingApi = async (search: string, page: number = 0, size: number = 10) => {
  try {
    const API_URL = `/settings/medical-antecedent/autocomplete?page=${page}&size=${size}`;
    const response = await axiosInstance.post(API_URL, { search });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchmedicalAntecedentApi = async () => {
  const API_URL = `/settings/medical-antecedent/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMedicalTreatmentApi = async () => {
  const API_URL = `/settings/medical-treatment/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMedicalAllergyApi = async () => {
  const API_URL = `/settings/medical-allergy/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMedicalCategoryDocumentApi = async () => {
  const API_URL = `/settings/medical-category-document/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const fetchMedicalPartExamListApi = async () => {
  const API_URL = `/settings/medical-part-examined/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const fetchMedicallateralityListApi = async () => {
  const API_URL = `/settings/medical-laterality/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const fetchMedicalConsultationTypeListApi = async () => {
  const API_URL = `/settings/medical-consultation-type/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
