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
