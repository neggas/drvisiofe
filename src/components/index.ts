export { default as Header } from "./header/header";
export { default as Footer } from "./footer/footer";
export { default as HomePage } from "../app/home";
export * from "./ui";
export * from "../images";
export { default as RegisterSidebar } from "./registration-sidebar/index";
export { default as CookiesModalBox } from "./cookies-modal/cookies-modal";

export { default as Steps } from "./steps/steps";
export { default as RegistrationSteps } from "./steps/registrationSteps";
export { default as PractitionerRegistrationSteps } from "./steps/PractitionerRegistrationStep";
export { default as CustomModal } from "./modal/modal";

export { default as QuizzSidebar } from "./quizz-sidebar/quizz-sidebar";
export { default as PatientDashboardSidebar } from "./patient-dashboard-sidebar/patient-dashboard-sidebar";
export { default as CustomSlickCarousel } from "./slick-carousel/slick-carousel";

export { default as UpcomingConsultations } from "./teleconsultations-tabs/upcoming-consultations/upcoming-consultations";
export { default as MedicalHistory } from "./medical-profile-tabs/medical-history-tab/medical-history";
export { default as Allergies } from "./medical-profile-tabs/allergies-tab/allergies-tab";
export { default as Mesures } from "./medical-profile-tabs/mesures-tab/mesures-tab";
export { default as EmptyHistory } from "./empty-history/empty-history";
export { default as EmptyDocument } from "../app/patient-dashboard/documents/empty-document/page";

export { default as PrescriptionsCare } from "../app/patient-dashboard/documents/prescriptions-care/page";
export { default as XRayUltraSound } from "../app/patient-dashboard/documents/x-ray-ultrasound/page";
export { default as MedicalCartificate } from "../app/patient-dashboard/documents/medical-certificates/page";
export { default as PreventionScreen } from "../app/patient-dashboard/documents/prevention-screening/page";
export { default as AdministrativeDocument } from "../app/patient-dashboard/documents/administrative-documents/page";
export { default as OtherDocument } from "../app/patient-dashboard/documents/other-document/page";

// Search Practitioner
export * from "./search";
export { default as PractitionerProfile } from "./practitioner/profile";

export { WithoutAuth } from "./withoutAuth";
export { WithAuth } from "./withAuth";

// Authentication
export * from "./login";
export { default as ForgotPasswordPage } from "./forgot-password/forgotPasswordPage";
export { default as ForgotPasswordOtpPage } from "./forgot-password/forgotPasswordOtpPage";
export { default as ResetPasswordPage } from "./reset-password/resetPasswordPage";
export { default as PageFallback } from "./pageFallback";

// Patient Dashboard
export * from "./patient-dashboard";

export { default as DeleteModal } from "./delete-modal/delete-modal";
export { default as MedicalTreatments } from "./medical-profile-tabs/medical-treatments-tab/medical-treatments";
export { default as TeleconsultationRequests } from "./teleconsultations-tabs/teleconsultation-requests/teleconsultation-requests";
export { default as PastConsultations } from "./teleconsultations-tabs/past-consultations/past-consultations";
export { default as TeleconsultationProposal } from "./teleconsultations-tabs/teleconsultation-proposal/teleconsultation-proposal";
export { default as MessageModal } from "./message-modal/message-modal";
export { default as DeleteTeleconsultationsModal } from "./delete-teleconsultations-modal/delete-teleconsultations-modal";
export { default as PastConsultationsEmpty } from "./teleconsultations-tabs/past-consultations-empty/past-consultations-empty";
export { default as UpcomingConsultationsEmpty } from "./teleconsultations-tabs/upcoming-consultations-empty/upcoming-consultations-empty";
export { default as TeleconsultationRequestsEmpty } from "./teleconsultations-tabs/teleconsultation-requests-empty/teleconsultation-requests-empty";
export { default as TeleconsultationProposalEmpty } from "./teleconsultations-tabs/teleconsultation-proposal-empty/teleconsultation-proposal-empty";
export { default as TermConditionNotice } from "./cgu-notice-term/index";
export { default as DocumentSteps } from "./document-steps/document-step";
export { default as QuizFeedback } from "./quiz-feedback/quiz-feedback-modal";
export { default as CguAndNoticeTerm } from "./cgu-notice-term";
export { default as JoinMeetingModal } from "./join-meeting-modal/join-meeting-modal";
export { default as ProposModal } from "./propos-modal/propos-modal";
export { default as MarchéTab } from "./propos-tabs/marché/marché";
export { default as Introductiontab } from "./propos-tabs/introduction/introduction";
export { default as ProduitTab } from "./propos-tabs/produit/produit";
export { default as LatestQuizzTab } from "./quizz-dashboard/whats-new/latest-quizz-tab/latest-quizz-tab";
export { default as LatestDiscoveryTab } from "./quizz-dashboard/whats-new/latest-discovery-tab/latest-discovery-tab";
export { default as PointsObtainedTab } from "./quizz-dashboard/my-profile/points-obtained/points-obtained";
export { default as QuizzesCompletedTab } from "./quizz-dashboard/my-profile/quizzes-completed/quizzes-completed";
export { default as SharedQuizzesTab } from "./quizz-dashboard/my-profile/shared-quizzes/shared-quizzes";
export { default as PractitionerSidebar } from "./practitioner-sidebar/practitioner-sidebar";

//Practitioner Authentication
export { default as PractitionerRegisterSidebar } from "./practitionerRegistrationSidebar/index";
export { default as PractitionerDocumentUploadModal } from "./document-upload-modal/doc-upload-modal";
export { default as DeleteDocument } from "./delete-modal/delete-modal";
export { default as PractitionerIdentifyTab } from "./practitioner-dashboard/identify/identify";
export { default as PatientInfo } from "./patient-info-modal/patient-info-modal";
export { default as AgendaIdentity } from "./practitioner-modal-tabs/identity/identity";
export { default as AgendaAllergy } from "./practitioner-modal-tabs/allergy/allergy";
export { default as AgendaMedicalHistory } from "./practitioner-modal-tabs/background/background";
export { default as AgendaBackGround } from "./practitioner-modal-tabs/background/background";
export { default as AgendaMeasurements } from "./practitioner-modal-tabs/measurements/measurement";
export { default as AgendaTeleconsultations } from "./practitioner-modal-tabs/teleconsultation/teleconsultations";
export { default as AgendaTreatments } from "./practitioner-modal-tabs/treatments/treatment";
export { default as ProfessionalInformation } from "./practitioner-dashboard/professional-information/professional-information";
export { default as MesDocuments } from "./practitioner-dashboard/mes-documents/mes-documents";
export * from "./practitioner-modal-tabs/document";
export { default as PractitionerMyPatients } from "./practitioner-dashboard/my-patients/my-patients";
export { default as PractitionerRefferingPhysician } from "./practitioner-dashboard/reffering-physician/reffering-physician";
