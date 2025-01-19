import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "@/utility";
import { RootState } from "@/store";

interface LoginState {
  response: LoginResponse | null;
}

const initialState: LoginState = {
  response: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      state.response = action.payload;
    },
    logout: state => {
      state.response = null;
    },
  },
});

export const { setLoginResponse, logout } = loginSlice.actions;

export const selectLoginResponse = (state: RootState) => state.login.response;

export default loginSlice.reducer;
