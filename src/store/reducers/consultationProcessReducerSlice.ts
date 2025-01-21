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
  isActive: boolean;
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
        isActive: true,
      });
    },
    addChildrenConsultationProcess: (state, action: PayloadAction<ConsultationProcessState[]>) => {
      const parentId = action.payload[0]?.parentId;

      // Vérifier l'existence du parent dans l'état
      const parentConsultationProcess = state.find(consultation => consultation.parentId === parentId);

      if (parentConsultationProcess) {
        const { practitioner, rdvId, tarif, daySlot, timeSlot } = parentConsultationProcess;

        // Filtrer les nouveaux enfants qui ne sont pas déjà dans l'état global
        const newChildren = action.payload.filter(
          child => !state.some(existingChild => existingChild.childrenId === child.childrenId && existingChild.parentId === child.parentId)
        );

        if (newChildren.length > 0) {
          const newChildrenConsultationProcess = newChildren.map(child => ({
            profile: child.profile,
            practitioner,
            rdvId,
            tarif,
            daySlot,
            timeSlot,
            completedSteps: 1,
            selectedMotifs: [],
            otherMotifText: "",
            confirmed: false,
            information: false,
            parentId: child.parentId,
            patientId: child.patientId,
            childrenId: child.childrenId,
            isActive: false,
          }));

          // Ajouter les nouvelles consultations sans modifier l'état initial
          return [...state, ...newChildrenConsultationProcess];
        }
      }
      return state; // Retourner l'état inchangé si aucune action n'est nécessaire
    },
    setProcessRdvId: (state, action: PayloadAction<{ rdvId: number; parentId: number | null }>) => {
      const consultationProcess = state.find(consultation => consultation.parentId === action.payload.parentId);
      if (consultationProcess) {
        consultationProcess.rdvId = action.payload.rdvId;
      }

      const updatedState = state.map(consultation => {
        if (consultation.parentId === action.payload?.parentId) {
          consultation.rdvId = action.payload.rdvId;
        }
        return consultation;
      });

      state = updatedState;
    },
    resetConsultationProcess: state => {
      state.length = 0;
    },
    setProcessIsActive: (state, action: PayloadAction<{ isActive: boolean; patientId: number | null }>) => {
      // Désactiver tous les processus d'abord
      state.forEach(consultation => {
        consultation.isActive = false;
      });

      // Trouver le processus correspondant et l'activer
      const consultationProcess = state.find(consultation => consultation.patientId === action.payload.patientId);
      if (consultationProcess) {
        consultationProcess.isActive = action.payload.isActive;
      }
    },
    setProcessCompletedSteps: (state, action: PayloadAction<{ completedSteps: number; patientId: number | null }>) => {
      const consultationProcess = state.find(consultation => consultation.patientId === action.payload.patientId);
      if (consultationProcess) {
        consultationProcess.completedSteps = Math.max(consultationProcess.completedSteps, action.payload.completedSteps);
      }
    },

    setConsultationMotifs: (state, action: PayloadAction<{ selectedMotifs: Array<string>; patientId: number | null }>) => {
      if (action.payload.patientId) {
        const consultationProcess = state.find(consultation => consultation.patientId === action.payload.patientId);
        if (consultationProcess) {
          consultationProcess.selectedMotifs = action.payload.selectedMotifs;
        }
      }
    },

    setConsultationOtherMotifText: (state, action: PayloadAction<{ otherMotifText: string; patientId: number | null }>) => {
      if (action.payload.patientId) {
        const consultationProcess = state.find(consultation => consultation.patientId === action.payload.patientId);
        if (consultationProcess) {
          consultationProcess.otherMotifText = action.payload.otherMotifText;
        }
      }
    },
  },
});

export const {
  startConsultationProcess,
  addChildrenConsultationProcess,
  resetConsultationProcess,
  setProcessRdvId,
  setProcessIsActive,
  setProcessCompletedSteps,
  setConsultationMotifs,
  setConsultationOtherMotifText,
} = consultationProcessReducer.actions;
export const selectConsultationProcess = (state: RootState) => state.consultationProcess;
export const getActiveProcess = (state: RootState) => {
  return state.consultationProcess.find(consultation => consultation.isActive) || null;
};

export default consultationProcessReducer.reducer;
