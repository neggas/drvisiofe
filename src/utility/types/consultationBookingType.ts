export interface PatientTeleconsultationsNearbyResponse {
  code: number;
  message: string;
  data: {
    results: {
      id: number;
      relationType: string;
      nearby: {
        id: number;
        firstName: string;
        lastName: string;
        changePassword: string | null;
        nbFailedConnection: number;
        email: string;
        phone: string;
        birthdayDate: string;
        genre: string;
        securityCode: string | null;
        securityCodeDate: string | null;
        token: string | null;
        resetPwdCode: string | null;
        activationLoginCode: string | null;
        activationLoginDateCode: string | null;
        country: string;
        postalAddress: string;
        postalCode: string;
        city: {
          id: number;
          cityName: string;
          cityNameEn: string | null;
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
          region: {
            id: number;
            regionName: string;
            regionNameEn: string;
            regionCode: string;
            regionCodeIso: string;
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
            createdAt: string | null;
            updatedAt: string | null;
          };
          department: {
            id: number;
            departmentName: string;
            departmentNameEn: string;
            departmentCode: string;
            region: {
              id: number;
              regionName: string;
              regionNameEn: string;
              regionCode: string;
              regionCodeIso: string;
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
              createdAt: string | null;
              updatedAt: string | null;
            };
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
            createdAt: string | null;
            updatedAt: string | null;
          };
          createdAt: string | null;
          updatedAt: string | null;
        };
        nationality: string;
        status: string;
        patientBLocked: boolean;
        practitionerBLocked: boolean;
        adminBLocked: boolean;
        adminStatus: string | null;
        patientStatus: string;
        practitionerStatus: string | null;
        avatar: {
          id: number;
          name: string;
          extension: string;
          size: number;
          path: string | null;
          url: string;
          data: string | null;
          dataBytes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        activationCode: any[];
        userPaymentInfo: any[];
        senderEmails: any[];
        receiverEmails: any[];
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
        userListenedCourses: any | null;
        userQuizzPlays: any | null;
        quizzInvitations: any | null;
        spokenLanguages: {
          id: number;
          code: string;
          name: string;
          description: string;
          nameEn: string;
          descriptionEn: string;
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
          createdAt: string;
          updatedAt: string | null;
        }[];
        informationList: any | null;
        informationSelectedList: any | null;
        articleList: any | null;
        nearbyList: any | null;
        cguOk: boolean;
        noticeOk: boolean;
        patientData: {
          weight: number;
          height: number;
          firstNameContactPerson: string;
          lastNameContactPerson: string;
          phoneContactPerson: string;
          countryContactPerson: string;
          cityContactPerson: string;
          postalCodeContactPerson: string;
          healthComplStartDate: string;
          healthComplEndDate: string;
          hasSocialSecurityNumber: boolean;
          socialSecurityNumber: string;
          hasFullCareAndSupport: boolean;
          alreadyHasPractioner: boolean;
          cguVersion: string;
          noticeVersion: string;
          antecedents: any[];
          allergies: any[];
          treatments: any[];
          patientDocPrescriptions: any[];
          patientDocTreatments: any[];
          patientDocMedicalAnalyses: any[];
          patientDocImageries: any[];
          patientDocAnapaths: any[];
          patientDocMedicalCertificates: any[];
          patientDocWorkStops: any[];
          patientDocMedical: any[];
          rank: {
            id: number;
            name: string;
            nameEn: string;
            level: number;
            nbStar: number;
            minPoint: number;
            maxPoint: number;
            createdAt: string;
            updatedAt: string;
          };
          createdAt: string;
          updatedAt: string;
        };
        enabled: boolean;
        authorities: any | null;
        username: string;
        accountNonExpired: boolean;
        accountNonLocked: boolean;
        credentialsNonExpired: boolean;
      };
      nearbyParent: any | null;
    }[];
    totalCount: number;
    totalPage: number;
  };
}
export interface HealthRight {
  id: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface HealthRightsResponse {
  code: number;
  message: string;
  data: HealthRight[];
}

export interface WhySituation {
  id: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface WhySituationsResponse {
  code: number;
  message: string;
  data: WhySituation[];
}

export interface DosierMedicalDocumentsType {
  id: number;
  name: string;
  category: {
    id: number;
    code: string;
    name: string;
    description: string;
    nameEn: string;
    descriptionEn: string;
    createdAt: string;
    updatedAt: string;
  };
  date: string;
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
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
