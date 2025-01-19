export interface GlobalArticleListType {
  id: number;
  type: string;
  title: string;
  content: string | null; // Adjusted to allow `null`
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    avatar: {
      id: number;
      name: string;
      extension: string;
      size: number;
      url: string;
      createdAt: string | null;
      updatedAt: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    loginAdminDate: string;
    roleList: {
      id: number;
      roleCode: string;
      roleLabel: string;
      roleType: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
  start: string;
  end: string;
  published: boolean;
  publishedDate: string;
  nbUserSelected: number;
  file: {
    id: number;
    name: string;
    extension: string;
    size: number;
    url: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
  informationTypeFile: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetailType {
  code: number;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      firstName: string;
      lastName: string;
      changePassword: string | null;
      nbFailedConnection: number;
      email: string;
      phone: string;
      birthdayDate: string | null;
      genre: string | null;
      securityCode: string | null;
      securityCodeDate: string | null;
      token: string | null;
      resetPwdCode: string | null;
      activationLoginCode: string | null;
      activationLoginDateCode: string | null;
      country: string | null;
      postalAddress: string | null;
      postalCode: string | null;
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
      nationality: string | null;
      status: string;
      patientBLocked: boolean;
      practitionerBLocked: boolean;
      adminBLocked: boolean;
      adminStatus: string;
      patientStatus: string | null;
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
      loginAdminDate: string;
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
      userListenedCourses: string | null;
      userQuizzPlays: string | null;
      quizzInvitations: string | null;
      spokenLanguages: string[];
      informationList: string | null;
      informationSelectedList: string | null;
      articleList: string | null;
      nearbyList: string | null;
      cguOk: boolean;
      noticeOk: boolean;
      enabled: boolean;
      authorities: string | null;
      username: string;
      accountNonExpired: boolean;
      accountNonLocked: boolean;
      credentialsNonExpired: boolean;
    };
    start: string;
    end: string;
    published: boolean;
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
    articleTypeFile: string;
    createdAt: string;
    updatedAt: string;
  };
}
