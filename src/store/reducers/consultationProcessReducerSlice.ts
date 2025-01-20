import { PatientsType, PractitionerType } from "@/utility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Avatar {
  id: number;
  name: string | null;
  extension: string | null;
  size: number;
  path: string | null;
  url: string | null;
  data: string | null;
  dataBytes: string | null;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number] | null;
}

export interface ConsultationProcessState {
  practitionerId?: number;
  daySlot?: string;
  timeSlot?: string;
  completedSteps: number;
  rdvId?: number;
  avatar?: Avatar;
  name?: string;
  tarif?: string;
  speciality?: string;
  selectedDate?: string;
  tarifInformation?: { tarif: number; serviceFee: number; tarifTotal: number; tarifPenality: number };
  selectedMotifs: Array<string | { id: number; name: string }>;
  otherMotifText?: string;
  confirmed: boolean;
  information: boolean;
  profile: PatientsType | null;
  practitioner: PractitionerType | null;
  parentId: number | null;
  patientId: number | null;
  childrenId: number | null;
}

const initialState: ConsultationProcessState[] = [];

export const consultationProcessReducer = createSlice({
  name: "consultationProcess",
  initialState,
  reducers: {
    startConsultationProcess: (state, action: PayloadAction<ConsultationProcessState>) => {
      state.push({
        ...action.payload,
        completedSteps: 1,
        selectedMotifs: [],
        otherMotifText: "",
        confirmed: false,
        information: false,
        childrenId: null,
        patientId: action.payload.patientId,
        parentId: action.payload.patientId,
        avatar: action.payload.avatar as Avatar,
      });
    },
  },
});

export const { startConsultationProcess } = consultationProcessReducer.actions;
export const selectConsultationProcess = (state: RootState) => state.consultationProcess;

export default consultationProcessReducer.reducer;
