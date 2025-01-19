import axiosInstance from "../axiosInstance";

export const welcomeArticleList = async (page: number = 0, size: number = 250) => {
  try {
    const API_URL = `/information/all-information-published/INFORMATION?page=0&size=30`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientDeatils = async () => {
  try {
    const API_URL = `/user/patient/profile`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const patientNearbyList = async () => {
  try {
    const API_URL = `/user/patient/nearby/list`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registerPatientNearby = async (data: any) => {
  try {
    const API_URL = "/auth/register-patient-nearby";
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
export const updatePatientNearby = async (data: any) => {
  try {
    const API_URL = "/user/update/patient/nearby";
    const response = await axiosInstance.put(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getchildProfileApi = async (childId: string) => {
  try {
    const API_URL = `/user/patient/nearby/profile/${childId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNearbyChildlistApi = async (patientId: number) => {
  try {
    const API_URL = `/user/patient/nearby/list?patientId=${patientId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updatePatientApi = async (data: any) => {
  try {
    const API_URL = "/user/update/patient";
    const response = await axiosInstance.put(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteNearbyPatientApi = async (data: any) => {
  try {
    const API_URL = `user/delete/patient/nearby`;
    const response = await axiosInstance.delete(API_URL, {
      data,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addantecedentApi = async (payload: any) => {
  const API_URL = `/user/patient/add-antecedent`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addantecedentUpdateApi = async (payload: any) => {
  const API_URL = `/user/patient/update-antecedent`;
  try {
    const response = await axiosInstance.put(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getListAntecedentApi = async (patientId: any, page: number, size: number) => {
  try {
    const API_URL = `/user/patient/list-antecedent?patientId=${patientId}&page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteAntecedentApi = async (idPatient: any, idAntecedent: number) => {
  try {
    const API_URL = `/user/patient/delete-antecedent/${idPatient}/${idAntecedent}`;
    const response = await axiosInstance.delete(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addantecedentSurgeryUpdateApi = async (payload: any) => {
  const API_URL = `/user/patient/update-antecedent/surgery`;
  try {
    const response = await axiosInstance.put(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTreatmentApi = async (payload: any) => {
  const API_URL = `/user/patient/add-treatment`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListTreatmentApi = async (patientId: any, page: number, size: number, currentTreatment: boolean) => {
  try {
    const API_URL = `/user/patient/list-treatment?patientId=${patientId}&currentTreatment=${currentTreatment}&page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addisNoLongerTakeThisTreatmentUpdateApi = async (payload: any) => {
  const API_URL = `/user/patient/update-treatment/current`;
  try {
    const response = await axiosInstance.put(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTreatmentUpdateApi = async (payload: any) => {
  const API_URL = `/user/patient/update-treatment`;
  try {
    const response = await axiosInstance.put(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePatientNewsletterStatus = async (formData: FormData) => {
  try {
    const API_URL = `/user/update/patient/newsletter`;
    const response = await axiosInstance.put(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteTreatmentApi = async (idPatient: any, idTreatment: number) => {
  try {
    const API_URL = `/user/patient/delete-treatment/${idPatient}/${idTreatment}`;
    const response = await axiosInstance.delete(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addAllergyApi = async (payload: any) => {
  const API_URL = `/user/patient/add-allergy`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getListAllergyApi = async (patientId: any, page: number, size: number) => {
  try {
    const API_URL = `/user/patient/list-allergy?patientId=${patientId}&page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addallergyUpdateApi = async (payload: any) => {
  const API_URL = `/user/patient/update-allergy`;
  try {
    const response = await axiosInstance.put(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteAllergyApi = async (idPatient: any, idAllergy: number) => {
  try {
    const API_URL = `/user/patient/delete-allergy/${idPatient}/${idAllergy}`;
    const response = await axiosInstance.delete(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addWeightApi = async (payload: any) => {
  const API_URL = `/user/patient/add-weight`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addHeightApi = async (payload: any) => {
  const API_URL = `/user/patient/add-height`;
  try {
    const response = await axiosInstance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getListWeightApi = async (patientId: any) => {
  try {
    const API_URL = `/user/patient/list-weight?patientId=${patientId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getListheightApi = async (patientId: any) => {
  try {
    const API_URL = `/user/patient/list-height?patientId=${patientId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getListimcApi = async (patientId: any) => {
  try {
    const API_URL = `/user/patient/get-imc/${patientId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getteleconsultationfutureApi = async (patientId: any, page: number, size: number) => {
  try {
    const API_URL = `/teleconsultation/rdv/future/all/patient/${patientId}?page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getteleconsultationpatientApi = async (patientId: any, page: number, size: number) => {
  try {
    const API_URL = `/teleconsultation/rdv/past/all/patient/${patientId}?page=${page}&size=${size}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTeleconsultationApi = async (TeleconsultationID: number) => {
  try {
    const API_URL = `/teleconsultation/rdv/patient/cancel/${TeleconsultationID}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeleconsultationNextPatientApi = async (patientId: number) => {
  try {
    const API_URL = `/teleconsultation/rdv/next/patient/${patientId}?nbMinute=30`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const medicalTypeDocumentApi = async (categoryId: number) => {
  try {
    const API_URL = `/settings/medical-type-document/all/${categoryId}`;
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const AddMedicalDocument = async (data: any) => {
  try {
    const API_URL = "/user/patient/add-document";
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
export const MedicalCategoryDocumentByListApi = async (
  categoryId: number,
  patientId: number,
  page: number,
  size: number,
  byCreatedDateDesc: boolean
) => {
  const API_URL = `/user/patient/list-document/${categoryId}?patientId=${patientId}&page=${page}&sie=${size}&byCreatedDateDesc=${byCreatedDateDesc}`;
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMedicalDocumentApi = async (idPatient: any, categoryId: number) => {
  try {
    const API_URL = `/user/patient/delete-document/${idPatient}/${categoryId}`;
    const response = await axiosInstance.delete(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteMedicalListDocumentApi = async (payload: any) => {
  const API_URL = `/user/patient/delete-document-list`;
  try {
    const response = await axiosInstance.delete(API_URL, {
      data: payload, // Pass the payload under the `data` key
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const UpdateMedicalDocument = async (data: any) => {
  try {
    const API_URL = "/user/patient/update-document";
    const response = await axiosInstance.put(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const AddSampleFile = async (data: any) => {
  try {
    const API_URL = "/file-sample/add";
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
export const deleteDocumentFile = async (patientId: any, id: any) => {
  const API_URL = `/file-sample/delete/${patientId}/${id}`;
  try {
    const response = await axiosInstance.delete(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const teleconsultationListMedicalSituationDocumentApi = async (data: any, page: any, size: any) => {
  const API_URL = `/teleconsultation/rdv/list-medical-situation-document-by-page?page=${page}&size=${size}`;
  try {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
