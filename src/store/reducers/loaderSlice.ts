import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  isLoading: boolean;
  loaderType:
    | "quiz-dashboard"
    | "quiz-course"
    | "disease-discovery"
    | "medical-discovery-navigation"
    | "add-child"
    | "update-patient"
    | "start-quiz"
    | "start-new-quiz"
    | "resume-quiz-question"
    | "medical-profile"
    | "teleconsultationfuture"
    | "medical-document"
    | "checking-auth"
    | "unauthorized"
    | "deletePatientInfantLoader"
    | "addPatientInfantLoader"
    | "payment_started"
    | "nearby-patient-consultation"
    | "motifs-loader"
    | null;
}

const initialState: LoaderState = {
  isLoading: false,
  loaderType: null,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<LoaderState["loaderType"]>) => {
      state.isLoading = true;
      state.loaderType = action.payload;
    },
    hideLoader: state => {
      state.isLoading = false;
      state.loaderType = null;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
