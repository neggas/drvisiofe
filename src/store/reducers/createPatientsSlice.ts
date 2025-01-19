import { PatientsType, PatientsState } from "@/utility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const initialState: any = {
  data: null,
};

const createPatientsSlice = createSlice({
  name: "createPatientData",
  initialState,
  reducers: {
    setCreatePatientData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setCreatePatientData } = createPatientsSlice.actions;

export const selectCreatePatientData = (state: RootState) => state.createPatientData.data;

export default createPatientsSlice.reducer;
