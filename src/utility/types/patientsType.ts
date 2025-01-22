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

export interface HealthCompl {
  id: number;
  name: string;
  extension: string;
  size: number;
  url: string;
}

export interface MutelleType {
  healthCompl: HealthCompl;
  healthComplNumber: string;
  healthComplStartDate: string;
  healthComplEndDate: string;
}

export type PatientData = {
  weight: string;
  height: string;
  firstNameContactPerson: string | null;
  lastNameContactPerson: string | null;
  phoneContactPerson: string | null;
  healthCompl?: HealthCompl;
  hasSocialSecurityNumber: boolean;
  socialSecurityNumber: string | null;
  hasFullCareAndSupport: boolean;
  alreadyHasPractioner: boolean;
  practionerName: string | null;
  cguVersion: string;
  noticeVersion: string;
  practitioner: string | null;
  sponsorshipId: string | null;
  patientDocPrescriptions: string | null;
  patientDocTreatments: string | null;
  patientDbDocMedicalAnalyses: string[];
  patientDbDocImageries: string[];
  healthRightIds: string[];
  rdvWhyId: string;
  healthComplNumber: string;
  healthComplStartDate: string;
  healthComplEndDate: string;
  longTermTreatment: string;
  medicalHistory: string;
  medicationTakenPreviously: string;
};

export type PatientsType = {
  id: number;
  firstName: string;
  lastName: string;
  nbFailedConnection: number;
  email: string;
  phone: string;
  birthdayDate: string;
  genre: string;
  securityCode: string;
  resetPwdCode: string | null;
  country: string;
  nationality: string;
  noticeVersion: string;
  cguVersion: string;
  status: string;
  adminStatus: string | null;
  patientStatus: string;
  practitionerStatus: string | null;
  avatar: Avatar;
  acceptReceiveNewsletter: boolean;
  activationCode: string[];
  userPaymentInfo: string[];
  senderDtEmails: string | null;
  receiverDtEmails: string | null;
  loginPatientDate: [number, number, number, number, number, number, number];
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number] | null;
  roleList: {
    id: number;
    roleCode: string;
    roleLabel: string;
    roleType: string;
    createdAt: [number, number, number, number, number, number, number] | null;
    updatedAt: [number, number, number, number, number, number, number] | null;
  }[];
  userListenedCourses: string[] | null;
  userQuizzPlays: string[] | null;
  inviteeQuizzInvitationUsers: string[] | null;
  spokenLanguages: {
    id: number;
    code: string;
    name: string;
    description: string;
    nameEn: string;
    descriptionEn: string;
    users: string | null;
    createdAt: [number, number, number, number, number, number, number];
    updatedAt: [number, number, number, number, number, number, number] | null;
  }[];
  patientData: PatientData;
  enabled: boolean;
  authorities: {
    authority: string;
  }[];
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
};

export type PatientsState = {
  data: PatientsType[];
};

export type GenderApiResponse = {
  code: number;
  message: string;
  data: {
    id: string;
    code: string;
    name: string;
    nameEn: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type ListOption = {
  value: string;
  label: string;
};

export type antecedentMotifOption = {
  value: number;
  label: string;
};

export type treatmentMotifOption = {
  value: number;
  label: string;
};
export type allergyMotifOption = {
  value: number;
  label: string;
};
export type antecedentMotifApiResponse = {
  code: number;
  message: string;
  data: {
    id: string;
    code: string;
    name: string;
    nameEn: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
export type CityPostListOption = {
  value: string;
  label: string;
  postalCode?: string;
  cityName?: string;
};

export interface PatientIdentityError {
  firstName?: string;
  lastName?: string;
  birthdayDate?: string;
  genre?: string;
  weight?: string;
  height?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  postalAddress?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  password?: string;
  confirmPassword?: string;
  spokenLanguages?: string;
}
export interface MedicalProfileBackground {
  antecedentMotif: any;
  isSurgery: boolean | string;
  startDate?: string;
  endDate?: string;
  isFinished?: boolean | string;
}
export interface MedicalProfileTreatment {
  treatmentMotif: any;
  isRegular: boolean; // Only store boolean values here
  isPunctual: boolean;
  isNoLongerTakeThisTreatment: boolean;
  frequence: string;
  startDate?: string;
  endDate?: string;
}
export interface MedicalProfileMesure {
  startDate: String;
  weight: any;
  height: any;
}
export interface MedicalProfileAllergy {
  allergyMotif: any;
  isMedicalProduct?: boolean | string; // Only store boolean values here
  isUnkownHowManifestAllergy: boolean;
  startDate?: string;
  howAllergyManifest: String;
}
export interface CreateIdentityRequest {
  firstName: string;
  lastName: string;
  birthdayDate: string;
  genre: string;
  weight?: string;
  height?: string;
  nationality?: string;
  phone: string;
  email: string;
  postalAddress?: string;
  country?: ListOption | undefined | null;
  city?: ListOption | undefined | null;
  postalCode?: ListOption | undefined | null;
  spokenLanguages?: any[];
  password: string;
  confirmPassword?: string;
}

export interface CreateMedicalDataRequest {
  personalPractitioner?: any;
  personalPractitionerCity?: string;
  personalPractitionerPostcode?: string;
  firstNameContactPerson?: string;
  lastNameContactPerson?: string;
  emailContactPerson?: string;
  phoneContactPerson?: string;
  postalAddressContactPerson?: string;
  countryContactPerson?: any;
  cityContactPerson?: any;
  postalCodeContactPerson?: any;
  healthComplNumber?: string;
  healthComplStartDate?: string;
  healthComplEndDate?: string;
  healthCompl?: any;
  hasSocialSecurityNumber?: boolean;
  socialSecurityNumber: string;
}

export interface PatientMedicalDataError {
  personalPractitioner?: string;
  personalPractitionerCity?: string;
  personalPractitionerPostcode?: string;
  firstNameContactPerson?: string;
  lastNameContactPerson?: string;
  emailContactPerson?: string;
  phoneContactPerson?: string;
  postalAddressContactPerson?: string;
  countryContactPerson?: string;
  cityContactPerson?: string;
  healthComplNumber?: string;
  healthComplStartDate?: string;
  healthComplEndDate?: string;
  healthCompl?: string;
  socialSecurityNumber?: string;
  file?: string;
}

export type PractitionerListOption = {
  value: string;
  label: string;
  city?: string;
  postCode?: string;
};
export type GenderOption = {
  value: string;
  label: string;
};
export type antecedentOption = {
  value: string;
  label: string;
};
export type LanguageOption = {
  value: string;
  label: string;
};

export type OptionType = {
  label: string;
  value: string;
};
export type FetchPatientData = {
  id?: number;
};

// Define the selectedCountries type
export type SelectedCountries = {
  [key: number]: { value: number; label: string } | null; // or adjust as needed
};

export type CityOption = {
  id?: number;
  value: string;
  label: string;
  postalCode?: string;
};

export type CountryType = {
  id: number;
  countryName: string;
};

export type PatientPractitionerType = {
  id: number;
  country: CountryType | string; // country can be either an object or a string
  // other fields...
};
export type PostalCodeOption = {
  value: string;
  label: string;
  cityName?: string;
};
export interface addChildType {
  id: any;
  city: any;
  firstName: string;
  lastName: string;
  birthdayDate: string;
  genre: string;
  weight?: any;
  height?: any;
}

export type NearbyListApiResponse = {
  code: number;
  message: string;
  data: {
    id: string;
    code: string;
    name: string;
    nameEn: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
export interface UpdateDocument {
  healthComplNumber: any;
  healthComplStartDate: string;
  healthComplEndDate: string;
  file: any;
}

export type AddDocument = {
  healthComplNumber?: string;
  healthComplStartDate?: string;
  healthComplEndDate?: string;
  healthCompl?: any;
};
export type ChildListOption = {
  value: string;
  label: string;
};
export interface AntecedentMotifType {
  id: number;
  antecedentMotif: {
    id: number;
    name: string;
    description: string;
    nameEn: string;
    file: {
      id: number;
      name: string;
      extension: string;
      size: number;
      path: string | null;
      url: string;
      data: string | null;
      dataBytes: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
    descriptionEn: string;
    createdAt: string;
    updatedAt: string | null;
  };
  startDate: string;
  endDate: string;
  patient: any | null; // Replace 'any' with a more specific type for the patient if needed
  createdAt: string;
  updatedAt: string;
  surgery: boolean;
  finished: boolean;
}
export interface AllergyMotifType {
  id: number;
  allergyMotif: {
    id: number;
    name: string;
    description: string;
    nameEn: string;
    file: {
      id: number;
      name: string;
      extension: string;
      size: number;
      path: string | null;
      url: string;
      data: string | null;
      dataBytes: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
    descriptionEn: string;
    createdAt: string;
    updatedAt: string | null;
  };
  howAllergyManifest: string | null;
  startDate: string;
  endDate: string;
  patient: any | null; // Replace 'any' with a more specific type for the patient if needed
  createdAt: string;
  updatedAt: string;
  medicalProduct: boolean;
  unkownHowManifestAllergy: boolean;
}

export interface TreatmentMotifType {
  id: number;
  treatmentMotif: {
    id: number;
    name: string;
    description: string;
    nameEn: string;
    file: {
      id: number;
      name: string;
      extension: string;
      size: number;
      path: string | null;
      url: string;
      data: string | null;
      dataBytes: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
    descriptionEn: string;
    createdAt: string;
    updatedAt: string | null;
  };
  startDate: string;
  endDate: string;
  frequence: string;
  createdAt: string;
  updatedAt: string;
  regular: boolean;
  punctual: boolean;
  noLongerTakeThisTreatment: boolean;
  patient?: any | null; // Replace `any` with the appropriate patient type when known
  surgery?: boolean; // Optional field
  finished?: boolean; // Optional field
}
export interface MesureWeightType {
  id: number;
  createdAt: string;
  startDate: string;
  updatedAt: string;
  weight: String;
}

export interface MesureHeightType {
  id: number;
  createdAt: string;
  startDate: string;
  updatedAt: string;
  height: String;
}
export interface MesureIMCType {
  id: number;
  createdAt: string;
  startDate: string; // X-axis data for charts
  updatedAt: string;
  height: number; // Changed from String to number for numerical operations
  weight: number; // Optional, only if applicable
  imc: number; // Optional, calculated BMI
  idealWeigh: number; // Optional, ideal weight
}

export type DocumentOption = {
  value: number;
  label: string;
  code: string;
};

export type DocumentOptionAny = {
  value: number;
  label: string;
};
export interface MedicalDocument {
  category: any;
  name: any;
  partExamined: any;
  date: any;
  laterality: any;
  file: any;
  typeId: any;
  consultationTypeId: any;
}

export interface DocumentDetails {
  id: number;
  name: string;
  category: {
    id: number;
    code: string;
    name: string;
    description: string;
    nameEn: string;
    descriptionEn: string;
    createdAt: string; // Use Date if you want strict date handling
    updatedAt: string; // Use Date if you want strict date handling
  };
  type: {
    id: number;
    code: string;
    name: string;
    description: string;
    nameEn: string;
    descriptionEn: string;
    createdAt: string; // Use Date if you want strict date handling
    updatedAt: string; // Use Date if you want strict date handling
  };
  details: {
    id: number;
    createdAt: string; // Use Date if you want strict date handling
    laterality: {
      id: number;
      code: string;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string;
      createdAt: string; // Use Date if you want strict date handling
      updatedAt: string; // Use Date if you want strict date handling
    };
    partExamined: {
      id: number;
      code: string;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string;
      createdAt: string; // Use Date if you want strict date handling
      updatedAt: string; // Use Date if you want strict date handling
    };
    consultationType: {
      id: number;
      code: string;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string;
      createdAt: string; // Use Date if you want strict date handling
      updatedAt: string; // Use Date if you want strict date handling
    };
  };
  date: string; // Use Date if you want strict date handling
  file: {
    id: number;
    name: string;
    extension: string;
    size: number;
    path: string | null;
    url: string;
    data: unknown | null;
    dataBytes: unknown | null;
    createdAt: string; // Use Date if you want strict date handling
    updatedAt: string; // Use Date if you want strict date handling
  };
  createdAt: string; // Use Date if you want strict date handling
  updatedAt: string; // Use Date if you want strict date handling
}
