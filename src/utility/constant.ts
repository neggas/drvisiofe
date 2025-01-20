export const NUMBER_OF_PRACTITIONERS_TO_FETCH = 12;
export const DASHBOARD_LINK = "/";

export const openApis = [
  "auth/login",
  "auth/login-with-security-code",
  "auth/send-security-code",
  "teleconsultation/practitioner/slot/search",
  "settings/speciality/all",
];

// Constant for Guest Data Expiry Time
export const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;

// Constant for Global Language Switcher Options
export const GLOBAL_LANGUAGE_OPTIONS = [
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
];
// Success Messages for Document Deletion
export const DOCUMENT_DELETION_MESSAGES = {
  SINGLE_DOCUMENT: "Le document a été supprimé avec succès.",
  MULTIPLE_DOCUMENTS: "La liste des documents a été supprimée avec succès.",
};

export const profileMedicalDeleteMessage = {
  AntécédentDeleteMessage: "Antécédent patient supprimé avec succès",
  TraitementDeleteMessage: "Traitement patient supprimé avec succès",
  AllergieDeleteMessage: "Allergie patient supprimée avec succès",
};
export const Patient_Dashboard_Message = {
  UpdateProfileMessage: "Le profile patient  a été mis à jours avec succès.",
};

export const Teleconsultation_Message = {
  Delete_Appointment: "RDV annulé par le patient",
};

export const CONSULTATION_PROCESS_ERROR_MESSAGES_CODE = {
  RDV_ALREADY_PRESENT: "RDV_ALREADY_PRESENT",
  SLOT_NOT_FOUND: "SLOT_NOT_FOUND",
  RDV_NOT_AVAILABLE: "RDV_NOT_AVAILABLE",
  RDV_NOT_FOUND: "RDV_NOT_FOUND",
  RDV_CANNOT_BE_TAKE_IF_DATE_IS_PASSED: "RDV_CANNOT_BE_TAKE_IF_DATE_IS_PASSED",
  RDV_STATUS_WRONG: "RDV_STATUS_WRONG",
  RDV_CANNOT_BE_TAKE_BECAUSE_BOOKING_DATE_IS_PASSED: "RDV_CANNOT_BE_TAKE_BECAUSE_BOOKING_DATE_IS_PASSED",
  RDV_MUST_BE_VALIDATED_BEFORE_TO_PAY: "RDV_MUST_BE_VALIDATED_BEFORE_TO_PAY",
  RDV_MUST_BE_FOR_PATIENT_OR_NEARBY: "RDV_MUST_BE_FOR_PATIENT_OR_NEARBY",
  RDV_ALREADY_PAYED: "RDV_ALREADY_PAYED",
  RDV_MUST_BE_PAYED: "RDV_MUST_BE_PAYED",
  RDV_PERIOD_NOT_FOUND: "RDV_PERIOD_NOT_FOUND",
  RDV_REQUEST_MUST_BE_FOR_PATIENT_OR_NEARBY: "RDV_REQUEST_MUST_BE_FOR_PATIENT_OR_NEARBY",
  RDV_REQUEST_NOT_FOUND: "RDV_REQUEST_NOT_FOUND",
  RDV_REQUEST_MUST_HAVE_A_PROPOSED_DATE: "RDV_REQUEST_MUST_HAVE_A_PROPOSED_DATE",
  RDV_REQUEST_MUST_BE_ACCEPTED_BY_PRACTITIONER: "RDV_REQUEST_MUST_BE_ACCEPTED_BY_PRACTITIONER",
  RDV_REQUEST_CORRESPOND_TO_ANOTHER_PATIENT: "RDV_REQUEST_CORRESPOND_TO_ANOTHER_PATIENT",
  RDV_REQUEST_CORRESPOND_TO_ANOTHER_PRACTITIONER: "RDV_REQUEST_CORRESPOND_TO_ANOTHER_PRACTITIONER",
  RDV_REQUEST_PERIOD_NOT_PERMIT_TO_ASK_PERIOD: "RDV_REQUEST_PERIOD_NOT_PERMIT_TO_ASK_PERIOD",
  RDV_REQUEST_FOR_THIS_PERIOD_ALREADY_EXIST: "RDV_REQUEST_FOR_THIS_PERIOD_ALREADY_EXIST",
  RDV_REQUEST_IS_CANCELLED: "RDV_REQUEST_IS_CANCELLED",
  RDV_WHY_NOT_FOUND: "RDV_WHY_NOT_FOUND",
};

export type CONSULTATION_PROCESS_ERROR_TYPES = keyof typeof CONSULTATION_PROCESS_ERROR_MESSAGES_CODE;

export const CONSULTAION_PROCESS_ERRORS = Object.values(CONSULTATION_PROCESS_ERROR_MESSAGES_CODE);

export const CONSULTATION_STEP = ["beneficiary", "situation", "motifs", "informations", "payment"];
