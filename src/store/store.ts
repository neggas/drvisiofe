"use client";

import { configureStore, combineReducers, Middleware, Action } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { persistStore, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import logger from "redux-logger";
import {
  modalReducer,
  createPatientReducer,
  practitionerReducer,
  specialityReducer,
  loginReducer,
  guestDetailsReducer,
  quizReducer,
  loaderReducer,
  patientDetailsReducer,
  consultationBookingReducer,
  consultationProcessReducer,
} from "@/store";
import { logout } from "./reducers/loginSlice";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// Combine all the reducers into one root reducer
const appReducer = combineReducers({
  login: loginReducer,
  modal: modalReducer,
  loader: loaderReducer,
  guestDetails: guestDetailsReducer,
  createPatientData: createPatientReducer,
  patientDetails: patientDetailsReducer,
  practitionerData: practitionerReducer,
  specialityData: specialityReducer,
  quiz: quizReducer,
  consultationBooking: consultationBookingReducer,
  consultationProcess: consultationProcessReducer,
});

// Root reducer to handle logout action by resetting the state
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
  if (action.type === logout().type) {
    state = undefined;
  }
  return appReducer(state, action);
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// redux-persist to enable state persistence
const persistConfig = {
  key: "root", // Key for the persisted state in storage
  version: 1,
  storage, // Storage method (localStorage in this case)
  // whitelist: ["login", "guestDetails"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Check if the current environment is localhost
const isLocalhost =
  typeof window !== "undefined" && (window.location.hostname === "localhost" || process.env.NEXT_PUBLIC_API_BASE_URL?.includes("localhost"));

// Add logger middleware only in localhost environment
let middleware: Middleware[] = [];
if (isLocalhost) {
  middleware.push(logger);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: true,
    }).concat(middleware), // Custom Middleware (logger)
  devTools: isLocalhost, // Enable DevTools only on localhost
});

let _persistor: any;

export function getPersistor() {
  if (!_persistor) _persistor = persistStore(store);
  return _persistor;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
