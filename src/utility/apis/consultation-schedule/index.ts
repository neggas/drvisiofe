import axiosInstance from "../axiosInstance";

export const listOfBeneficiary = async (page: number = 0, size: number = 10) => {
  const API_URL = `/teleconsultation/rdv/all/patient?page=${page}&size=${size}`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createBeneficiary = async (payload: any) => {
  try {
    const API_URL = `/teleconsultation/rdv/create`;
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelRdv = async (rdvId: number) => {
  const API_URL = `/teleconsultation/rdv/patient/cancel/${rdvId}`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMotifs = async () => {
  try {
    const API_URL = `/settings/medical-motif/all`;
    const response = await axiosInstance.get(API_URL);
    return response.data?.data || [];
  } catch (error) {
    throw error;
  }
};

export const addMotif = async (payload: {
  practitionerId: number;
  patientId: number;
  rdvId: number | null;
  motifIdList: number[];
  otherMotif: string;
}) => {
  try {
    const API_URL = `/teleconsultation/rdv/add-motif`;
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listOfDynamicSituations = async () => {
  const API_URL = `/settings/health-right/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listOfWhySituations = async () => {
  const API_URL = `/settings/rdv-why/all`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSituation = async (data: any) => {
  try {
    const API_URL = "/teleconsultation/rdv/add-situation";
    const response = await axiosInstance.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateMedicalInformation = async (payload: any) => {
  try {
    const API_URL = `/teleconsultation/rdv/add-medical-information-validation`;
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateAppointment = async (payload: any) => {
  try {
    const API_URL = `/teleconsultation/rdv/add-medical-appointement-validation`;
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const medicalRecordsAdd = async (payload: any) => {
  try {
    const API_URL = `/teleconsultation/rdv/add-medical-situation`;
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dosierMedicalDocumentListingApi = async (payload: any, size = 10, page = 0) => {
  const API_URL = `/teleconsultation/rdv/list-medical-situation-document?size=${size}&page=${page}`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletedosierMedicalDocumentApi = async (payload: any) => {
  const API_URL = `/teleconsultation/rdv/delete-medical-situation-document`;
  try {
    const response = await axiosInstance.delete(API_URL, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMedicalSituationDocumentApi = async (data: any) => {
  try {
    const API_URL = "/teleconsultation/rdv/add-medical-situation-document";
    const response = await axiosInstance.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMedicalCategoryDocumentsApi = async () => {
  const API_URL = "/settings/medical-category-document/all";
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const appointmentPaymentApi = async (payload: any) => {
  const API_URL = `/teleconsultation/rdv/get-appointement-payment-link`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (rdvId: number) => {
  const API_URL = `/teleconsultation/rdv/patient/cancel/${rdvId}`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addSituationHelthCompl = async (data: any) => {
  try {
    const API_URL = "/teleconsultation/rdv/add-situation-health-compl";
    const response = await axiosInstance.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeMutuelleCard = async (data: any) => {
  const API_URL = `/teleconsultation/rdv/delete-situation-health-compl`;
  try {
    const response = await axiosInstance.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
