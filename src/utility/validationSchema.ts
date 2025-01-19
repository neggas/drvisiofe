import moment from "moment";
import * as yup from "yup";

export const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

// Login Validation Schema
export const loginSchema = yup.object().shape({
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
  password: yup.string().required("Mot de passe requis"),
});

// Login OTP code Schema
export const loginOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Le code OTP est requis")
    .matches(/^\d{4}$/, "Le code OTP doit être un nombre à 4 chiffres"),
});

// Forgot Password Validation Schema
export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
  typeUser: yup.string().required("Le type d'utilisateur est requis"),
  currentLanguage: yup.string().required("La langue actuelle est requise"),
});

// Forgot Password OTP code Schema
export const forgotPasswordOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Le code OTP est requis")
    .matches(/^\d{4}$/, "Le code OTP doit être un nombre à 4 chiffres"),
});

// Reset Password Validation Schema
export const ResetPasswordSchema = yup.object().shape({
  password: yup.string().required("Mot de passe requis").min(6, "Le mot de passe doit contenir au minimum 6 caractères."),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Les mots de passe doivent correspondre"),
});

// Login Unblock OTP code Schema
export const loginUnblockOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Le code OTP est requis")
    .matches(/^\d{4}$/, "Le code OTP doit être un nombre à 4 chiffres"),
});
export const UpdateMedicalHistorySchema = yup.object().shape({
  antecedentMotif: yup
    .object({
      value: yup.string().required("Le champ est requis"),
      label: yup.string().required("Le champ est requis"),
    })
    .typeError("Le champ est requis") // Catch type mismatches
    .required("Le champ est requis"), // Require the object
  isSurgery: yup.string().required("Le champ est requis"),
  isFinished: yup.boolean().required("Le champ est requis").typeError("Le champ est requis"),
  startDate: yup
    .string()
    .required("Le champ est requis")
    .test("valid-date-format", "La date de début doit être valide.", value => {
      return moment(value, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true).isValid();
    }),
  endDate: yup
    .string()
    .nullable()
    .test("valid-date-format", "La date de fin doit être valide.", value => {
      return !value || moment(value, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true).isValid();
    })
    .when("isFinished", {
      is: true, // Only apply when isFinished is true
      then: schema =>
        schema
          .required("Le champ est requis")
          .test("endDate-after-startDate", "La date de fin doit être postérieure à la date de début.", function (endDate) {
            const { startDate } = this.parent;
            if (!endDate || !startDate) return true; // Skip if either date is missing

            // Parse dates in multiple formats and compare
            const start = moment(startDate, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true);
            const end = moment(endDate, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true);

            return start.isValid() && end.isValid() && end.isAfter(start);
          }),
      otherwise: schema => schema.nullable(),
    }),
});

export const AddMedicalHistorySchema = yup.object().shape({
  antecedentMotif: yup.string().required("Le champ est requis"),
  isSurgery: yup.string().required("Le champ est requis"),
  isFinished: yup.boolean().required("Le champ est requis").typeError("Le champ est requis"), // Ensure boolean validation
  startDate: yup
    .string()
    .required("Le champ est requis")
    .test("valid-date-format", "La date de début doit être valide .", value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)), // Optional: Validate date format
  endDate: yup
    .string()
    .nullable()
    .test("valid-date-format", "La date de fin doit être valide .", value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)) // Optional: Validate date format
    .when("isFinished", {
      is: true, // Apply this condition only when isFinished is true
      then: schema =>
        schema
          .required("Le champ est requis")
          .test("endDate-after-startDate", "La date de fin doit être postérieure à la date de début.", function (endDate) {
            const { startDate } = this.parent;
            if (!endDate || !startDate) return true; // Skip check if either date is missing
            return new Date(endDate) > new Date(startDate);
          }),
      otherwise: schema => schema.nullable(),
    }),
});

export const AddMedicalTreatmentSchema = yup.object().shape({
  treatmentMotif: yup.string().required("Le champ est requis"),
  frequence: yup.string().required("Le champ est requis"),
  startDate: yup
    .string()
    .required("Le champ est requis")
    .test("valid-date-format", "La date de début doit être valide.", value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)), // Optional: Validate date format
  endDate: yup
    .string()
    .nullable()
    .test("valid-date-format", "La date de fin doit être valide.", value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)) // Optional: Validate date format
    .when("isNoLongerTakeThisTreatment", {
      is: true, // Apply this condition only when isFinished is true
      then: schema =>
        schema
          .required("Le champ est requis")
          .test("endDate-after-startDate", "La date de fin doit être postérieure à la date de début.", function (endDate) {
            const { startDate } = this.parent;
            if (!endDate || !startDate) return true; // Skip check if either date is missing
            return new Date(endDate) > new Date(startDate);
          }),
      otherwise: schema => schema.nullable(),
    }),
  isNoLongerTakeThisTreatment: yup
    .boolean()
    .test("required-with-condition", "Ce champ est requis si aucun autre champ n'est sélectionné", function (value, context) {
      const { isRegular, isPunctual } = context.parent;
      return value || isRegular || isPunctual; // At least one must be true
    }),
});

export const UpdateMedicalTreatmentSchema = yup.object().shape({
  treatmentMotif: yup
    .object({
      value: yup.string().required("Le champ est requis"),
      label: yup.string().required("Le champ est requis"),
    })
    .typeError("Le champ est requis")
    .required("Le champ est requis"),

  startDate: yup
    .string()
    .required("Le champ est requis")
    .test("valid-date-format", "La date de début doit être valide.", value => {
      return moment(value, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true).isValid();
    }),

  endDate: yup
    .string()
    .nullable()
    .test("valid-date-format", "La date de fin doit être valide.", value => {
      return !value || moment(value, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true).isValid();
    })
    .when("isNoLongerTakeThisTreatment", {
      is: true,
      then: schema =>
        schema
          .required("Le champ est requis")
          .test("endDate-after-startDate", "La date de fin doit être postérieure à la date de début.", function (endDate) {
            const { startDate } = this.parent;
            if (!endDate || !startDate) return true; // Skip if either date is missing
            const start = moment(startDate, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true);
            const end = moment(endDate, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true);
            return start.isValid() && end.isValid() && end.isAfter(start);
          }),
      otherwise: schema => schema.nullable(),
    }),

  frequence: yup.string().required("Le champ est requis"),

  isNoLongerTakeThisTreatment: yup
    .boolean()
    .test("required-with-condition", "Ce champ est requis si aucun autre champ n'est sélectionné", function (value, context) {
      const { isRegular, isPunctual } = context.parent;
      return value || isRegular || isPunctual; // At least one must be true
    }),
});

export const AddMedicalAllergySchema = yup.object().shape({
  allergyMotif: yup.string().required("Le champ est requis"),
  isMedicalProduct: yup.boolean().required("Le champ est requis").typeError("Le champ est requis"), // Ensure boolean validation
  startDate: yup.string().required("Le champ est requis"),
  howAllergyManifest: yup
    .string()
    .nullable() // Allow null when not required
    .when("isUnkownHowManifestAllergy", {
      is: false, // Apply this condition only when isFinished is true
      then: schema => schema.required("Le champ est requis"),
      otherwise: schema => schema.nullable(),
    }),
});
export const UpdateMedicalAllergySchema = yup.object().shape({
  allergyMotif: yup
    .object({
      value: yup.string().required("Le champ est requis"),
      label: yup.string().required("Le champ est requis"),
    })
    .typeError("Le champ est requis") // Catch type mismatches
    .required("Le champ est requis"), // Require the object
  isMedicalProduct: yup.boolean().required("Le champ est requis").typeError("Le champ est requis"), // Ensure boolean validation
  startDate: yup.string().required("Le champ est requis"),
  howAllergyManifest: yup
    .string()
    .nullable() // Allow null when not required
    .when("isUnkownHowManifestAllergy", {
      is: false, // Apply this condition only when isFinished is true
      then: schema => schema.required("Le champ est requis"),
      otherwise: schema => schema.nullable(),
    }),
});
//mdeical Document
export const AddMedicalDocumentSchema = yup.object().shape({
  category: yup
    .object({
      value: yup.string().required("Le champ est requis"),
      label: yup.string().required("Le champ est requis"),
      code: yup.string().required("Le champ est requis"),
    })
    .typeError("Le champ est requis") // Catch type mismatches
    .required("Le champ est requis"), // Require the object
  date: yup.string().required("Le champ est requis"),
  name: yup.string().required("Le champ est requis"),
  // file: yup.string().required("Le champ est requis"),
  partExamined: yup.string().when("category.code", {
    is: "RESI", // Access 'category.code' here for condition
    then: schema => schema.required("Le champ est requis"),
    otherwise: schema => schema.nullable(),
  }),
  typeId: yup.string().when("category.code", {
    is: (code: string) => ["RESI", "CORE", "ORDO", "CEME", "PIAD", "REBI", "PIDE"].includes(code), // Check if code is one of these values
    then: schema => schema.required("Le champ est requis"),
    otherwise: schema => schema.nullable(),
  }),
  laterality: yup.string().when("category.code", {
    is: "RESI", // Access 'category.code' here for condition
    then: schema => schema.required("Le champ est requis"),
    otherwise: schema => schema.nullable(),
  }),
  consultationTypeId: yup.string().when("category.code", {
    is: "CORE", // Access 'category.code' here for condition
    then: schema => schema.required("Le champ est requis"),
    otherwise: schema => schema.nullable(),
  }),
});
export const MedicalDocumentUploadFileSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("L'image est requise") // Error message for file requirement
    .test("fileSize", "La taille du fichier dois être inférieure à 5Mo.", value => value && (value as File).size <= 1024 * 1024 * 5)
    .test(
      "fileType",
      "Seuls les formats de fichiers png, jpg, jpeg, pdf et doc sont autorisés",
      value =>
        value &&
        [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes((value as File).type)
    ),
});

//update patient

export const UpdateIdentityPatientSchema = yup.object().shape({
  firstName: yup.string().required("Le champ est requis"),
  lastName: yup.string().required("Le champ est requis"),
  birthdayDate: yup.string().required("Le champs est requis"),
  genre: yup.string().required("Le champ est requis"),
  patientData: yup.object().shape({
    weight: yup.number().required("Le champ est requis").typeError("Le champs est requis"), // Changed to .number() for number validation
    height: yup.number().required("Le champ est requis").typeError("Le champs est requis"), // Changed to .number() for number validation
  }),
  nationality: yup.string().required("Le champ est requis"),
  postalAddress: yup.string().required("Le champ est requis"),
  country: yup.string().required("Le champs est requis"),
  city: yup
    .string()
    .transform(value => {
      // Check if value is an object and extract cityName if present
      if (value && typeof value === "object" && value.cityName) {
        return value.cityName;
      }
      return value; // Return the value as-is if it's already a string
    })
    .required("Le champ est requis"),

  postalCode: yup.string().required("Le champs est requis"),
  spokenLanguages: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("L'ID de la langue est requis").matches(/^\d+$/, "L'ID doit être un nombre valide"),
        name: yup.string().required("Le nom de la langue est requis"),
      })
    )
    .min(1, "Le champ des langues parlées est requis"),
  phone: yup.string().required("Le champ est requis"),
  email: yup.string().required("Le champs est requis").matches(emailRegex, "L'e-mail doit être valide"),
});

export const AddWeightSchema = yup.object().shape({
  startDate: yup.string().required("Le champs est requis"),
  weight: yup.string().required("Le champs est requis"),
});
export const AddHeightSchema = yup.object().shape({
  startDate: yup.string().required("Le champs est requis"),
  height: yup.string().required("Le champs est requis"),
});
// Create Patient (Identity) Validation Schema
export const createIdentityPatientSchema = yup.object().shape({
  firstName: yup.string().required("Le champs est requis"),
  lastName: yup.string().required("Le champs est requis"),
  birthdayDate: yup.string().required("Le champs est requis"),
  genre: yup.string().required("Le champs est requis"),
  weight: yup.string().required("Le champs est requis"),
  height: yup.string().required("Le champs est requis"),
  nationality: yup.string().required("Le champs est requis"),
  postalAddress: yup.string().required("Le champs est requis"),
  country: yup.string().required("Le champs est requis"),
  city: yup.string().required("Le champs est requis"),
  postalCode: yup.string().required("Le champs est requis"),
  spokenLanguages: yup.string().required("Le champs est requis"),
  phone: yup.string().required("Le champs est requis"),
  email: yup.string().required("Le champs est requis").matches(emailRegex, "L'e-mail doit être valide"),
  password: yup.string().required("Mot de passe requis").min(6, "Le mot de passe doit contenir au minimum 6 caractères."),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Les mots de passe doivent correspondre"),
});
// Create Patient (Identity) Validation Schema
export const addChildSchema = yup.object().shape({
  firstName: yup.string().required("Le champs est requis"),
  lastName: yup.string().required("Le champs est requis"),
  birthdayDate: yup.string().required("Le champs est requis"),
  genre: yup.string().required("Le champs est requis"),
  weight: yup.string().required("Le champs est requis"),
  height: yup.string().required("Le champs est requis"),
});

export const createPatientAvatarSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("L'image est requise")
    .test("fileSize", "L'image doit faire moins de 5 Mo", value => value && (value as File).size <= 1024 * 1024 * 5)
    .test(
      "fileType",
      "Seuls les formats d'image png, jpg et jpeg sont autorisés",
      value => value && ["image/jpeg", "image/png", "image/jpg"].includes((value as File).type)
    ),
});

export const createPatientFileSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("L'image est requise")
    .test("fileSize", "Le fichier doit faire moins de 5 Mo", value => value && (value as File).size <= 1024 * 1024 * 5)
    .test(
      "fileType",
      "Seuls les formats de fichiers png, jpg, jpeg, pdf et doc sont autorisés",
      value =>
        value &&
        [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "",
        ].includes((value as File).type)
    ),
});

// Create Patient (Medical Data) Validation Schema
export const createMedicalDataPatientSchema = yup.object().shape({
  emailContactPerson: yup
    .string()
    .nullable()
    .transform((curr: string, orig: string) => (orig === "" ? null : curr))
    .matches(emailRegex, "L'e-mail doit être valide"),
});

// Add User Validation Schema in Membres du site page
export const addUserSchema = yup.object().shape({
  firstName: yup.string().required("Le prénom est requis"),
  lastName: yup.string().required("Le nom est requis"),
  password: yup.string().required("Mot de passe requis"),
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
  phone: yup.string().required("Le téléphone est requis"),
  roleId: yup.string().required("La fonction est requise"),
});

// Send Reset Password Email Code Schema
export const resetPasswordCodeSchema = yup.object().shape({
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
});

// New Password Schema
export const newPasswordSchema = yup.object().shape({
  password: yup.string().required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Les mots de passe ne correspondent pas")
    .required("Confirmation du mot de passe requise"),
});

// OTP code Schema
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Le code OTP est requis")
    .matches(/^\d{8}$/, "Le code OTP doit être un nombre à 8 chiffres"),
});

// Update User Schema in Mon Profil Page and Edit Member Profile Page
export const updateUserSchema = yup.object().shape({
  firstName: yup.string().required("Le prénom est requis"),
  lastName: yup.string().required("Le nom est requis"),
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
  phone: yup.string().required("Le téléphone est requis"),
  roleId: yup.number().required("La fonction est requise"),
});

// Update Patient Data Schema in Patients Page
export const updatePatientDataSchema = yup.object().shape({
  lastName: yup.string().required("Le nom est requis"),
  firstName: yup.string().required("Le prénom est requis"),
  birthdayDate: yup.date().required("La date de naissance est requise"),
  genre: yup.string().required("Le genre est requis"),
  weight: yup.number().typeError("Le poids doit être un nombre").required("Le poids est requis"),
  height: yup.number().typeError("La taille doit être un nombre").required("La taille est requise"),
  nationality: yup.string().required("La Pays est requise"),
  phone: yup.string().required("Le téléphone est requis"),
  email: yup.string().required("L'e-mail est requis").matches(emailRegex, "L'e-mail doit être valide"),
});

export const avatarSchema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  genre: yup.string().required("Le genre est requis"),
  file: yup
    .mixed()
    .required("L'image est requise")
    .test("fileSize", "L'image est trop volumineuse", value => value && (value as File).size <= 2000000)
    .test(
      "fileType",
      "Le format de l'image est incorrect",
      value => value && ["image/jpeg", "image/png", "image/gif"].includes((value as File).type)
    ),
});

export const passwordSettingsSchema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  symbols: yup.string().required("Les symboles sont requis"),
  regex: yup.string().required("L'expression rationnelle est requise"),
  message: yup.string().required("Le message est requis"),
  messageEn: yup.string().required("Le message est requis"),
});

export const addCguSchema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  roleCode: yup.string().required("Le type de CGU est requis"),
  frContent: yup.string().required("Le contenu en français est requis"),
  enContent: yup.string().required("Le contenu en anglais est requis"),
});

export const addNoticeSchema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  roleCode: yup.string().required("Le type de notice est requis"),
  frContent: yup.string().required("Le contenu en français est requis"),
  enContent: yup.string().required("Le contenu en anglais est requis"),
});

// For Quiz Dashboard Course Page
export const quizzCourseSchema = yup.object().shape({
  selectedMode: yup.number().required("Le mode de quizz est requis").typeError("Le mode de quizz est invalide"),
  selectedTheme: yup.number().required("La thématique est requise").typeError("La thématique est invalide"),
});

export const quizzCourseSpecialitySchema = yup.object().shape({
  selectedSpeciality: yup.number().required("Une spécialité est requise, choisissez-en une").typeError("La spécialité est invalide"),
});

export const quizzCourseValiditySchema = yup.object().shape({
  selectedCourse: yup.number().required("Le cours est requis").typeError("Le cours est invalide"),
});

export const newQuizzSpecialitySchema = yup.object().shape({
  selectedSpeciality: yup.number().required("Une spécialité est requise, choisissez-en une").typeError("La spécialité est invalide"),
});

export const newQuizzCourseSchema = yup.object().shape({
  selectedCourses: yup.number().required("Une course est requise, choisissez-en une").typeError("La course est invalide"),
});

export const addBeneficiaryChildSchema = yup.object().shape({
  firstName: yup.string().required("Le prénom est obligatoire"),
  lastName: yup.string().required("Le nom est obligatoire"),
  birthdayDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("La date de naissance est obligatoire"),
  weight: yup.string().required("Le poids est obligatoire"),
  height: yup.string().required("La taille est obligatoire"),
  genre: yup.string().required("Le genre est obligatoire"),
});
