export interface PractitionerType {
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
  activationLoginCode: string | null;
  activationLoginDateCode: [number, number, number] | null;
  country: string;
  postalAddress: string | null;
  postalCode: string | null;
  city: {
    id: number;
    cityName: string;
    cityNameEn: string;
    cityZipCode: string;
    cityCommuneCode: string;
    cityLatitude: number;
    cityLongitude: number;
    country: {
      id: number;
      countryNum: string;
      countryName: string;
      countryNameEs: string;
      countryNameEn: string;
      countryCodeAlpha2: string;
      countryCodeAlpha3: string;
      createdAt: string | null;
      updatedAt: string | null;
    };
    region: any;
    department: any;
    createdAt: string | null;
    updatedAt: string | null;
  };
  department: string | null;
  region: string | null;
  nationality: string;
  status: string;
  patientBLocked: boolean;
  practitionerBLocked: boolean;
  adminBLocked: boolean;
  adminStatus: string | null;
  patientStatus: string | null;
  practitionerStatus: string;
  avatar: {
    id: number;
    name: string | null;
    extension: string | null;
    size: number;
    path: string | null;
    url: string;
    data: string | null;
    dataBytes: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
  acceptReceiveNewsletter: boolean;
  activationCode: string[];
  userPaymentInfo: string[];
  senderEmails: string[];
  receiverEmails: string[];
  createdAt: string;
  updatedAt: string;
  loginAdminDate: string | null;
  loginPatientDate: string | null;
  loginPractitionerDate: string | null;
  roleList: {
    id: number;
    roleCode: string;
    roleLabel: string;
    roleType: string;
    createdAt: string;
    updatedAt: string;
  }[];
  userListenedCourses: string[];
  userQuizzPlays: string[];
  inviteeQuizzInvitationUsers: string[];
  spokenLanguages: {
    id: number;
    code: string;
    name: string;
    description: string;
    nameEn: string;
    descriptionEn: string;
    users: string | null;
    createdAt: string;
    updatedAt: string | null;
  }[];
  advertisingList: string | null;
  advertisingSelectedList: string | null;
  articleList: string | null;
  practitionerData: {
    id: number; // added id
    cguVersion: string;
    noticeVersion: string;
    postalAddress: string | null;
    postalCode: string | null;
    tarifMin: number; // changed from string to number and added tarifMin
    tarifMax: number; // added tarifMax
    title: string; // added title
    city: {
      id: number;
      cityName: string;
      cityNameEn: string;
      cityZipCode: string;
      cityCommuneCode: string;
      cityLatitude: number;
      cityLongitude: number;
      country: {
        id: number;
        countryNum: string;
        countryName: string;
        countryNameEs: string;
        countryNameEn: string;
        countryCodeAlpha2: string;
        countryCodeAlpha3: string;
        createdAt: string | null;
        updatedAt: string | null;
      };
      region: any;
      department: any;
      createdAt: string | null;
      updatedAt: string | null;
    };
    department: string | null;
    region: string | null;
    durationTelecMin: number; // changed from string to number and added durationTelecMin
    durationTelecMax: number; // added durationTelecMax
    issuingDoc: string; // added issuingDoc
    deliveryDocument: any[]; // assuming any[] based on given data, modify as necessary
    rpps: string;
    amFiness: string;
    cdom: string;
    adeli: string;
    sector: {
      id: number;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string | null;
      createdAt: string;
      updatedAt: string | null;
    } | null;
    surSpecialization: {
      id: number;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string;
      createdAt: string;
      updatedAt: string | null;
    }[];
    speciality: {
      id: number;
      name: string;
      description: string;
      nameEn: string;
      descriptionEn: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    signature: {
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
    acceptAlreadySeenRdv: boolean;
    practitionerPatients: string | null;
    practitionerTimeSlots: {
      id: number;
      start: string;
      end: string;
      day: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      practitioner: string | null;
    }[];
    availableCurrentPractitionerTimeSlots:
      | {
          id: number | null;
          start: string;
          end: string;
          day: string;
          date: string;
          type: string;
        }[]
      | [];
    practitionerDbPractitionerEvaluations: string | null;
    practitionerTeleconsultations: string[];
    practitionerRdvs: string[];
    practitionerDocReports: string[];
    practitionerDocWorkStops: string[];
    practitionerDocMedicalCertificates: string[];
    practitionerDocPrescriptions: string[];
    practitionerCnis: {
      id: number;
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
      practitioner: string | null;
      createdAt: string;
      updatedAt: string | null;
    }[];
    practitionerDiplomas: {
      id: number;
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
      practitioner: string | null;
      createdAt: string;
      updatedAt: string | null;
    }[];
  };
  enabled: boolean;
  authorities: any[] | null;
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export type PractitionerState = {
  data: PractitionerType[];
};

export interface DiplomaType {
  id: number;
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
  practitioner: string | null;
  createdAt: string;
  updatedAt: string | null;
}
