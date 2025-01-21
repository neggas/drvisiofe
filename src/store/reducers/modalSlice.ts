import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  modalType:
    | "addDosierMedicalDocument"
    | "documentShowModal"
    | "previewDocumentModal"
    | "documentDeleteModal"
    | "uploadDocument"
    | "categoryModal"
    | "quizProgress"
    | "gameProgress"
    | "uploadPractitionerDoc"
    | "showPractitionerDoc"
    | "showPreviewImage"
    | "showTeleConsultationsDocument"
    | "showMedicalDocument"
    | "loginPractitionerModal"
    | "deleteDocumentModal"
    | "showPatientInfo"
    | "deletePatientInfant"
    | "addPatientInfant"
    | "editMutelleConsultationProcess"
    | "deleteMutelleConsultationProcess"
    | "cookieModal"
    | "messageModal"
    | "emptySSNModal"
    | "cancelPaymentModal"
    | "rdvAlreadyStarted"
    | "processNoticeModal"
    | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalState["modalType"]>) => {
      state.isOpen = true;
      state.modalType = action.payload;
    },
    closeModal: state => {
      state.isOpen = false;
      state.modalType = null;
    },
    resetModal: state => {
      state.isOpen = false;
      state.modalType = null;
    },
  },
});

export const { openModal, closeModal, resetModal } = modalSlice.actions;
export default modalSlice.reducer;
