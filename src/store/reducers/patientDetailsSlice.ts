import { PatientsType, PatientsState, getLocalStorageData } from "@/utility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const initialState: any = {
  data: null,
  list: null,
  file: null,
  alreadyHasPractioner: null,
  childlist: null,
  PatientError: null,
  patientSidebarDeatils: null,
  healthcardImage: null,
  MedicalData: null,
  MedicalDetails: null,
  UpdateCatrgoryID: null,
  addMobileDocumentValue: null,
};

const createPatientsSlice = createSlice({
  name: "patientDetails",
  initialState,
  reducers: {
    setPatientDetailsData: (state, action: PayloadAction<any>) => {
      // const PatientId = getLocalStorageData("PatientId", null);
      state.data = action.payload;

      // if (PatientId && PatientId === action.payload.id) {
      //   // If IDs match, update the state
      //   state.data = action.payload;
      // } else {
      //   return;
      // }
    },
    setMobileTabAddDocument: (state, action: PayloadAction<any>) => {
      state.addMobileDocumentValue = action.payload;
    },
    setChildDetailsData: (state, action: PayloadAction<any>) => {
      state.list = action.payload;
    },
    setDashboardProfileUpdate: (state, action: PayloadAction<any>) => {
      state.file = action.payload;
    },

    setalreadyHasPractionerUpdate: (state, action: PayloadAction<any>) => {
      state.alreadyHasPractioner = action.payload;
    },
    setChildListSelect: (state, action: PayloadAction<any>) => {
      state.childlist = action.payload;
    },
    setUpdateINTPatientError: (state, action: PayloadAction<any>) => {
      state.PatientError = action.payload;
    },
    setPatientSidebarDetails: (state, action: PayloadAction<any>) => {
      const PatientId = getLocalStorageData("PatientId", null);
      if (PatientId && PatientId === action.payload.id) {
        // If IDs match, update the state
        state.patientSidebarDeatils = action.payload;
      } else if (action.payload.id === PatientId && PatientId) {
        state.patientSidebarDeatils = action.payload;
      } else {
        return;
      }
    },
    sethealthcardImage: (state, action: PayloadAction<any>) => {
      state.healthcardImage = action.payload;
    },
    clearPatientErrors: state => {
      state.PatientError = null;
    },
    setMedicalDocumentCategoryList: (state, action: PayloadAction<any>) => {
      state.MedicalDetails = action.payload;
    },
    setMedicalDocumentCategoryID: (state, action: PayloadAction<any>) => {
      state.CatrgoryID = action.payload;
    },
    setMedicalDocumentUpateCategoryID: (state, action: PayloadAction<any>) => {
      state.UpdateCatrgoryID = action.payload;
    },
  },
});

export const {
  setPatientDetailsData,
  setChildDetailsData,
  setDashboardProfileUpdate,
  setalreadyHasPractionerUpdate,
  setChildListSelect,
  clearPatientErrors,
  setUpdateINTPatientError,
  setPatientSidebarDetails,
  sethealthcardImage,
  setMedicalDocumentCategoryList,
  setMedicalDocumentCategoryID,
  setMedicalDocumentUpateCategoryID,
  setMobileTabAddDocument,
} = createPatientsSlice.actions;

export const selectPatientDetailsData = (state: RootState) => state.patientDetails.data;
export const selectChildDetailsData = (state: RootState) => state.patientDetails.list;
export const selectdashboardProfileUpdate = (state: RootState) => state.patientDetails.file;
export const selectalreadyHasPractionerUpdate = (state: RootState) => state.patientDetails.alreadyHasPractioner;
export const selectChildListSelect = (state: RootState) => state.patientDetails.childlist;
export const selectUpdatePatientError = (state: RootState) => state.patientDetails.PatientError;
export const selectPatientSidebarDetails = (state: RootState) => state.patientDetails.patientSidebarDeatils;
export const selecthealthcardImage = (state: RootState) => state.patientDetails.healthcardImage;
export const selectMedicalDocumentCategoryList = (state: RootState) => state.patientDetails.MedicalDetails;
export const selectMedicalDocumentCategoryID = (state: RootState) => state.patientDetails.CatrgoryID;
export const selectMedicalDocumentUpdateCategoryID = (state: RootState) => state.patientDetails.UpdateCatrgoryID;
export const selectAddMedicalDocumentValue = (state: RootState) => state.patientDetails.addMobileDocumentValue;

export default createPatientsSlice.reducer;
