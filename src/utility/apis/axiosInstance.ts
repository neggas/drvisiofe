import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken, showSessionExpiredToast, getLocalStorageData, setLocalStorageData, checkUnauthenticatedApi } from "@/utility";
import store from "@/store/store";
import { logout } from "@/store/reducers/loginSlice";

// Create an axios instance with default settings
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base URL for all requests
  headers: { "Content-Type": "application/json" }, // Default headers
});

let isRefreshing = false; // Flag to check if token is being refreshed
let failedQueue: Array<{ resolve: (value: string | PromiseLike<string>) => void; reject: (reason?: any) => void }> = [];

// Function to process the queue of failed requests
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error); // If there's an error, reject the promise
    } else {
      prom.resolve(token!); // If successful, resolve the promise with new token
    }
  });

  failedQueue = []; // Clear the queue
};

// Interceptor for requests to add authorization header and handle token expiry
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getLocalStorageData("access-token", "");
    const refreshTokenURL = "/auth/refresh-token";

    if (accessToken && config.url !== refreshTokenURL) {
      const refreshTokenExpiry = getLocalStorageData("refresh-token-expiry", "");
      const now = new Date().getTime();

      // Check if refresh token is expired
      if (refreshTokenExpiry && now > Number(refreshTokenExpiry)) {
        // If expired, clear all token data and show session expired message
        setLocalStorageData("access-token", "");
        setLocalStorageData("refresh-token", "");
        setLocalStorageData("access-token-expiry", "");
        setLocalStorageData("refresh-token-expiry", "");
        // showSessionExpiredToast(); // Show session expired toast message
        store.dispatch(logout()); // Dispatch logout action to clear Redux state
        return Promise.reject(new AxiosError("Refresh token expired"));
      }

      // Send Auth header for only authenticated apis
      if (!checkUnauthenticatedApi(config.url)) {
        // Set authorization header with the access token
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor for responses to handle token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const accessToken = response.headers["access-token"];
    if (accessToken) {
      setLocalStorageData("access-token", accessToken); // Update access token in local storage
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If access token is expired and request is not a retry
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is already being refreshed, add request to failed queue
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`; // Set new token for the original request
            }
            return axiosInstance(originalRequest); // Retry the original request
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true; // Mark request as a retry
      isRefreshing = true; // Set refreshing flag

      try {
        const newAccessToken = await refreshToken(); // Try to get new access token
        if (newAccessToken) {
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Set new token for the original request
          }
          processQueue(null, newAccessToken); // Process the queue with new token
          return axiosInstance(originalRequest); // Retry the original request
        } else {
          // If token refresh fails, clear all token data and show session expired message
          const axiosError = new AxiosError("Failed to refresh token");
          processQueue(axiosError, null);
          setLocalStorageData("access-token", "");
          setLocalStorageData("refresh-token", "");
          setLocalStorageData("access-token-expiry", "");
          setLocalStorageData("refresh-token-expiry", "");
          //   showSessionExpiredToast();
          store.dispatch(logout()); // Dispatch logout action to clear Redux state
        }
      } catch (err) {
        // If error during token refresh, clear all token data and show session expired message
        processQueue(err as AxiosError, null);
        setLocalStorageData("access-token", "");
        setLocalStorageData("refresh-token", "");
        setLocalStorageData("access-token-expiry", "");
        setLocalStorageData("refresh-token-expiry", "");
        // showSessionExpiredToast();
        store.dispatch(logout()); // Dispatch logout action to clear Redux state
        return Promise.reject(err); // Reject the promise with error
      } finally {
        isRefreshing = false; // Reset refreshing flag
      }
    }

    return Promise.reject(error); // Handle other response errors
  }
);

export default axiosInstance;
