import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
moment.locale("fr");
import { toast } from "react-toastify";
import { clearLocalStorageData, getLocalStorageData, openApis, setLocalStorageData } from "@/utility";

/**
 * @name getCurrentDateTime
 * @version 1.0.0
 * @description Function to get the current date Time
 * @returns {string} - current date time in YYYY-MM-DD H:mm:ss format
 */
export const getCurrentDateTime = (date?: string) => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

/**
 * @name getCurrentDate
 * @version 1.0.0
 * @description Function to get the current date
 * @returns {string} - current date time in YYYY-MM-DD format
 */
export const getCurrentDate = (format: string = "YYYY-MM-DD") => {
  return moment().format(format);
};
//graf date convert
export const getGrafDate = (date: string | number, format: string = "DD.MM.YYYY") => {
  // If the date format is not recognized by moment, you can specify the input format explicitly
  return moment(date, "DD/MM/YYYY").isValid() ? moment(date, "DD/MM/YYYY").format(format) : "Invalid date";
};

/**
 * @name getFormateDate
 * @version 1.0.0
 * @description Function to get date in the specified format
 * @param {string} [date] - date in YYYY/MM/DD format
 * @param {string} [format] - date in any format
 * @returns {string} - formatted date in the specified format
 */
export const getFormateDate = (date: string, format: string = "YYYY-MM-DD", capitalizeFirstLetter: boolean = false): string => {
  const formattedDate = moment(date, "YYYY/MM/DD").format(format);
  if (capitalizeFirstLetter) {
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

export const getFormateDatetwoDateformate = (date: string, format: string = "YYYY-MM-DD") => {
  const formattedDate = moment(date, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], true); // 'true' for strict parsing
  if (formattedDate.isValid()) {
    return formattedDate.format(format);
  } else {
    return ""; // or handle invalid date as needed
  }
};
/**
 * @name getFormateTime
 * @version 1.0.0
 * @description Function to get date in the specified format
 * @param {string} [date] - date in YYYY/MM/DD format
 * @param {string} [format] - date in any format
 * @returns {string} - formatted date in the specified format
 */
export const getFormateTime = (time: string, format: string = "HH:mm") => {
  let formattedTime = moment(time, "HH:mm:ss").format(format);
  return formattedTime.replace("|", "h");
};

/**
 * @name arrayToDate
 * @version 1.0.0
 * @description Function to convert an array of date components to  Date object
 * @param {Array<number>} dateArray - An array of date components [year, month, day, hour, minute, second, millisecond]
 * @returns {Date} - Date object
 */
export const arrayToDate = (dateArray: [number, number, number, number, number, number, number]): Date => {
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]);
};

/**
 * @name getCurrentDateOrFormateDate
 * @version 1.0.0
 * @description Function to get the current date in DD/MM/YYYY format or format a given date
 * @param {string} [date] - date in DD/MM/YYYY format
 * @returns {string} - current date or formatted date in YYYY-MM-DD format
 */
export const getCurrentDateOrFormateDate = (date?: string) => {
  if (date) {
    const formattedDate = moment(date, "DD/MM/YYYY");
    if (formattedDate.isValid()) {
      return formattedDate.format("YYYY-MM-DD");
    }
  }
  return moment().format("YYYY-MM-DD");
};

/**
 * @name formatDateForApi
 * @version 1.0.0
 * @description Function to format a date for API consumption
 * @param {Date|string|null} [date] - The date to format
 * @returns {string} - The formatted date in YYYY-MM-DD format
 */
export const formatDateForApi = (date?: Date | string | null): string => {
  if (date) {
    return moment(date).format("YYYY-MM-DD");
  }
  return "";
};

/**
 * @name generateDates
 * @version 1.0.0
 * @description Function to generate the current date and the date 7 days prior in YYYY-MM-DD format
 * @returns {Object} - An object containing the start date (7 days prior) and end date (current date)
 * @property {string} startDate - The date 7 days prior to the current date in YYYY-MM-DD format
 * @property {string} endDate - The current date in YYYY-MM-DD format
 */
export const generateDates = (): { startDate: string; endDate: string } => {
  const endDate = moment();
  const startDate = moment().subtract(7, "days");
  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
};

/**
 * @name getCurrentYear
 * @version 1.0.0
 * @description Function to get the current year
 * @returns {number} - The current year
 */
export const getCurrentYear = (): number => {
  return moment().year();
};

export const generateDateRange = (startDate: string, days: number): { startDate: string; endDate: string } => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return {
    startDate: moment(startDate).format("YYYY-MM-DD"),
    endDate: moment(endDate).format("YYYY-MM-DD"),
  };
};

let toastId: any = null;

/**
 * @name showSessionExpiredToast
 * @version 1.0.0
 * @description Show a toast notification when the session has expired and redirect to the login page after a countdown, with a blurred background and non-clickable backdrop.
 * @author Himanshu
 */
export const showSessionExpiredToast = () => {
  if (toastId || getLocalStorageData("session-expired-toast-shown", "false") === "true") {
    return;
  }

  // Set a flag to indicate that the toast has been shown
  setLocalStorageData("session-expired-toast-shown", "true");

  // Create a container for the toast
  const toastContainer = document.createElement("div");

  // Background layer with blur applied
  toastContainer.className = "fixed inset-0 flex flex-col items-center justify-center bg-gray-600 bg-opacity-75 backdrop-blur-sm z-[99999999]";
  document.body.appendChild(toastContainer);

  let countdown = 3;

  // Custom toast content in the center
  toastContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center">
        <img src="/images/logos/logoWhite.svg" alt="Logo" class="w-35 h-32 mb-4" />
        <p class="text-white text-lg mb-4">Votre session a expiré. Redirection vers la page de connexion dans ${countdown} secondes...</p>
        <div class="loader border-t-4 border-b-4 border-white h-12 w-12 rounded-full animate-spin"></div>
      </div>
    `;

  // Start countdown and update the toast message
  const intervalId = setInterval(() => {
    countdown -= 1;
    const countdownMessage = toastContainer.querySelector("p");
    if (countdownMessage) {
      countdownMessage.textContent = `Votre session a expiré. Redirection vers la page de connexion dans ${countdown} secondes...`;
    }

    // Redirect after the countdown finishes
    if (countdown === 0) {
      clearInterval(intervalId);
      document.body.removeChild(toastContainer);
      window.location.href = "/";

      // Clear the flag after the redirection
      clearLocalStorageData("session-expired-toast-shown");
      toastId = null;
    }
  }, 1000);
};

/**
 * @name check api is without auth
 * @version 1.0.0
 * @description Show a toast notification when the session has expired and redirect to the login page after a countdown
 */
export const checkUnauthenticatedApi = (str: any) => {
  return openApis.some(v => str.includes(v));
};

// Function to parse the date from "DD/MM/YYYY" format
export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day); // Month is zero-based
};

// Function to parse the date from "DD/MM/YYYY" format

export const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export const parseDateidentify = (dateString: string) => {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  const parts = dateString.split("/");
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
};

export const formatDateidentify = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * @name getAlphabetLabel
 * @version 1.0.0
 * @description Function to get an alphabetic label (e.g., A, B, C, D) for a given index
 * @param {number} index - The index to convert to an alphabetic label
 * @returns {string} - The alphabetic label (e.g., "A", "B", "C", "D")
 * @author Himanshu
 */
export const getAlphabetLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

export const generateGraphRanges = (data: Array<{ value: number }>): { ticks: number[]; domain: [number, number] } => {
  if (!data || data.length === 0) {
    return { ticks: [], domain: [0, 100000] };
  }

  const values = data.map(item => item.value);
  const minValue = 0;
  const maxValue = Math.max(...values);

  // Round the maximum value up to a reasonable step, based on its magnitude
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const roundedMax = Math.ceil(maxValue / magnitude) * magnitude;

  // Calculate an appropriate step size to limit the number of ticks to 6
  const step = Math.ceil(roundedMax / 5); // Divide the range into 5 intervals for 6 ticks

  // Generate the ticks array
  const ticks: number[] = [];
  for (let i = minValue; i <= roundedMax; i += step) {
    ticks.push(i);
  }

  // Return the generated ticks and the domain
  return { ticks, domain: [minValue, roundedMax] };
};

/**
 * @name formatToTwoDecimalPlaces
 * @version 1.0.0
 * @description Function to format a number to two decimal places
 * @param {number} value - The number to format
 * @returns {string} - The formatted number as a string with two decimal places
 * @author Himanshu
 */
export const formatToTwoDecimalPlaces = (value: any) => {
  return parseFloat(value).toFixed(2);
};

/**
 * @name extractMinMaxValues
 * @version 1.0.0
 * @description Extracts the minimum and maximum values from a tarif string in the format "15€ à 50€".
 * @param {string} tarif - tarif string
 * @returns {Object} - object containing `min` and `max` values.
 */
export const extractMinMaxValues = (tarif: string): { min: string; max: string } => {
  if (!tarif || typeof tarif !== "string") {
    return { min: "", max: "" };
  }

  const rangeRegex = /(\d+)\s?€\s?à\s?(\d+)\s?€/;
  const match = tarif.match(rangeRegex);

  if (match && match.length === 3) {
    return {
      min: match[1],
      max: match[2],
    };
  }

  return { min: "", max: "" };
};
