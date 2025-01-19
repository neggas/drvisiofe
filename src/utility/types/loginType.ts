// data sent in the login request
export interface LoginRequest {
  email: string; // email or email of the user
  password: string; // User's password
  typeUser: string; // User's type PATIENT or PRACTITIONER
  expiresInMins?: number; // Optional property
}

export interface LoginError {
  email?: string;
  password?: string;
}

export interface VerifyOTPError {
  otp?: string;
  loginToken?: string;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdayDate: string | null;
  genre: string | null;
  securityCode: string | null;
  resetPwdCode: string | null;
  country: string | null;
  nationality: string | null;
  noticeVersion: string | null;
  cguVersion: string | null;
  status: string;
  avatar: any | null;
  acceptReceiveNewsletter: boolean;
  activationCode: any[];
  userPaymentInfo: any[];
  senderDtEmails: any | null;
  receiverDtEmails: any | null;
  createdAt: string[];
  updatedAt: string | null;
  roleList: {
    id: number;
    roleCode: string;
    roleLabel: string;
  }[];
  userListenedCourses: any[];
  userQuizzPlays: any[];
  inviteeQuizzInvitationUsers: any[];
  spokenLanguages: any[];
  enabled: boolean;
  authorities: {
    authority: string;
  }[];
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  cguOk: boolean;
  noticeOk: boolean;
  patientStatus: string;
}

// Updated LoginResponse interface
export interface LoginResponse {
  code: number;
  message: string;
  data: UserData;
}

export interface ForgotPasswordPayload {
  email: string;
  typeUser: string;
  currentLanguage: string;
}

export interface ResetPasswordError {
  password?: string;
  confirmPassword?: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  typeUser: string;
  currentLanguage: string;
}

export interface CguProps {
  id: number;
  title: string;
  version: string;
  active: string;
  type: string;
  cguDataByLanguage: {
    id: number;
    language: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface NoticeProps {
  id: number;
  title: string;
  version: string;
  active: string;
  type: string;
  noticeDataByLanguage: {
    id: number;
    language: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface ValidateCguPayload {
  email: string;
  typeUser: string;
  cguId: number | null;
}

export interface ValidateNoticePayload {
  email: string;
  typeUser: string;
  noticeId: number | null;
}
