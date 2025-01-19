import CryptoJS from "crypto-js";

// // setting localStorage data without encryption
// export const setLocalStorageData = (key: string, value: any) => {
//   try {
//     const localStorageValue = JSON.stringify(value);
//     localStorage.setItem(key, localStorageValue);
//   } catch (error) {}
// };

// // getting localStorage data without encryption
// export const getLocalStorageData = (key: string, fallback: any) => {
//   try {
//     const localStorageValue = localStorage.getItem(key);
//     return localStorageValue ? JSON.parse(localStorageValue) : fallback;
//   } catch (error) {
//     return fallback;
//   }
// };

// setting localStorage data with encryption
export const setLocalStorageData = (key: string, value: any) => {
  // Check if 'window' is defined to ensure this runs only in the browser
  if (typeof window !== "undefined") {
    try {
      const stringValue = JSON.stringify(value);
      const secretKey = process.env.REACT_APP_LOCALSTORAGE_ENCRYPTION_SECRET_KEY || "";
      const encryptedValue = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {}
  }
};

// getting localStorage data with decryption
export const getLocalStorageData = (key: string, fallback: any) => {
  // Check if 'window' is defined to ensure this runs only in the browser
  if (typeof window !== "undefined") {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return fallback;
      const secretKey = process.env.REACT_APP_LOCALSTORAGE_ENCRYPTION_SECRET_KEY || "";
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue ? JSON.parse(decryptedValue) : fallback;
    } catch (error) {
      return fallback;
    }
  } else {
    // If 'window' is not defined, return the fallback value directly
    return fallback;
  }
};

// clearing localStorage data
export const clearLocalStorageData = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    /* empty */
  }
};
