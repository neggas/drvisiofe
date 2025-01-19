import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface GuestDetailsState {
  patientStats: any | null; // Holds the data from fetchQuizzPatientStatsApi
  quizzStats: any | null; // Holds the data from fetchQuizzStatsApi
}

const initialState: GuestDetailsState = {
  patientStats: null,
  quizzStats: null,
};

const guestDetailsSlice = createSlice({
  name: "guestDetails",
  initialState,
  reducers: {
    setPatientStats: (state, action: PayloadAction<any>) => {
      state.patientStats = action.payload; // Store patient stats
    },
    setQuizzStats: (state, action: PayloadAction<any>) => {
      state.quizzStats = action.payload; // Store quizz stats
    },
    clearGuestDetails: state => {
      state.patientStats = null;
      state.quizzStats = null;
    },
  },
});

// Export actions to be used in components or functions
export const { setPatientStats, setQuizzStats, clearGuestDetails } = guestDetailsSlice.actions;

// Selectors to access data from Redux store
export const selectPatientStats = (state: RootState) => state.guestDetails.patientStats;
export const selectQuizzStats = (state: RootState) => state.guestDetails.quizzStats;

export default guestDetailsSlice.reducer;
