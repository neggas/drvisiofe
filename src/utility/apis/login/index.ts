import { getLocalStorageData, setLocalStorageData } from "@/utility";
import axiosInstance from "../axiosInstance";

export const loginApi = async (data: any) => {
  try {
    const API_URL = "/auth/login";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const API_URL = "/auth/refresh-token";
    const storedRefreshToken = getLocalStorageData("refresh-token", "");

    // Make the API call to refresh the token
    const response = await axiosInstance.post(API_URL, { token: storedRefreshToken });

    // Check if the response is successful
    if (response.data && response.data.code === 1 && response.data.data) {
      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;

      const expiresIn = response.data.data.expiresIn * 1000; // Convert to milliseconds
      const refreshExpiresIn = response.data.data.refreshExpiresIn * 1000;

      const newAccessTokenExpiry = new Date().getTime() + expiresIn;
      const newRefreshTokenExpiry = new Date().getTime() + refreshExpiresIn;

      // Store the new tokens in local storage
      setLocalStorageData("access-token", newAccessToken);
      setLocalStorageData("refresh-token", newRefreshToken);
      setLocalStorageData("access-token-expiry", newAccessTokenExpiry.toString());
      setLocalStorageData("refresh-token-expiry", newRefreshTokenExpiry.toString());

      return newAccessToken;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const verifyLoginCodeApi = async (data: any) => {
  try {
    const API_URL = "/auth/login-with-security-code";
    const response = await axiosInstance.post(API_URL, data);

    // Extract tokens from headers
    const accessToken = response.headers["access-token"];
    const refreshToken = response.headers["refresh-token"];

    // Store the tokens in local storage
    setLocalStorageData("access-token", accessToken);
    setLocalStorageData("refresh-token", refreshToken);

    // Store login status in local storage
    if (response.status === 200) {
      setLocalStorageData("isLoggedIn", "true");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendLoginCodeApi = async (data: any) => {
  try {
    const API_URL = "/auth/send-security-code";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordApi = async (data: any) => {
  try {
    const API_URL = "/auth/password-forgot";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyForgotCodeApi = async (data: any) => {
  try {
    const API_URL = "/auth/password-forgot-check-security-code";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordApi = async (data: any) => {
  try {
    const API_URL = "/auth/password-forgot-reset-password";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyLoginUnblockCodeApi = async (data: any) => {
  try {
    const API_URL = "/auth/unblock-with-security-code";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateCguApi = async (data: any) => {
  try {
    const API_URL = "/auth/validate-cgu";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateNoticeApi = async (data: any) => {
  try {
    const API_URL = "/auth/validate-notice";
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerPatientApi = async (data: any) => {
  try {
    const API_URL = "/auth/register-patient";
    const response = await axiosInstance.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const recordablePatientStepOne = async (data: any) => {
  try {
    const API_URL = "/auth/is-recordable-patient";
    const response = await axiosInstance.post(API_URL, data, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const recordablePatientStepTwo = async (data: any) => {
  try {
    const API_URL = "/auth/is-recordable-medical-patient";
    const response = await axiosInstance.post(API_URL, data, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
