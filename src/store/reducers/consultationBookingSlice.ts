import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface ConsultationBookingState {
  practitionerId?: number;
  patientId?: number;
  childrenPatientId?: number | null;
  daySlot?: string;
  timeSlot?: string;
  completedSteps: number;
  rdvId?: number;
  avatar?: string;
  name?: string;
  tarif?: string;
  speciality?: string;
  selectedDate?: string;
  tarifInformation?: { tarif: number; serviceFee: number; tarifTotal: number; tarifPenality: number };
  selectedMotifs: Array<string | { id: number; name: string }>;
  otherMotifText?: string;
  confirmed: boolean;
  information: boolean;
}

const initialState: ConsultationBookingState = {
  completedSteps: 1, // Start with first step as completed by default
  selectedMotifs: [],
  otherMotifText: "",
  confirmed: false,
  information: false,
};

const consultationBookingSlice = createSlice({
  name: "consultationBooking",
  initialState,
  reducers: {
    setConsultationPractitionerId: (state, action: PayloadAction<number>) => {
      state.practitionerId = action.payload;
    },
    setTimeSlot: (state, action: PayloadAction<{ daySlot: string; timeSlot: string }>) => {
      state.daySlot = action.payload.daySlot;
      state.timeSlot = action.payload.timeSlot;
    },
    setSelectedPatientId: (state, action: PayloadAction<{ patientId: number; childrenPatientId?: number | null }>) => {
      state.patientId = action.payload.patientId;
      state.childrenPatientId = action.payload.childrenPatientId || null;
    },
    setCompletedStep: (state, action: PayloadAction<number>) => {
      state.completedSteps = Math.max(state.completedSteps, action.payload);
    },
    setRdvId: (state, action: PayloadAction<number>) => {
      console.log("action.payload", action.payload);
      state.rdvId = action.payload;
    },
    setPractitionerAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setPractitionerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPractitionerTarif: (state, action: PayloadAction<string>) => {
      state.tarif = action.payload;
    },
    setSpeciality: (state, action: PayloadAction<string>) => {
      state.speciality = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | Date>) => {
      const date = typeof action.payload === "string" ? new Date(action.payload) : action.payload;
      state.selectedDate = date.toISOString().split("T")[0];
    },

    setTarifInformation: (state, action: PayloadAction<{ tarif: number; serviceFee: number; tarifTotal: number; tarifPenality: number }>) => {
      state.tarifInformation = action.payload;
    },
    setSelectedMotifs: (state, action: PayloadAction<string[]>) => {
      state.selectedMotifs = action.payload; // Store selected motifs
    },
    setOtherMotifText: (state, action: PayloadAction<string>) => {
      state.otherMotifText = action.payload;
    },
    setConfirmed: (state, action: PayloadAction<boolean>) => {
      state.confirmed = action.payload;
    },
    setInformation: (state, action: PayloadAction<boolean>) => {
      state.information = action.payload;
    },
    resetConsultationBooking: state => {
      const { selectedDate } = state;
      return {
        ...initialState,
        completedSteps: 0, // Reset to initial state
        selectedDate, // Preserve the selectedDate
      };
    },
  },
});

export const {
  setConsultationPractitionerId,
  setTimeSlot,
  setSelectedPatientId,
  setCompletedStep,
  setRdvId,
  resetConsultationBooking,
  setPractitionerAvatar,
  setPractitionerName,
  setPractitionerTarif,
  setSpeciality,
  setSelectedDate,
  setTarifInformation,
  setSelectedMotifs,
  setOtherMotifText,
  setConfirmed,
  setInformation,
} = consultationBookingSlice.actions;

export const selectConsultationBooking = (state: RootState) => state.consultationBooking;

export default consultationBookingSlice.reducer;
