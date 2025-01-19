import { PractitionerType, PractitionerState } from "@/utility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const initialState: PractitionerState = {
  data: [],
};

const practitionerSlice = createSlice({
  name: "practitionerData",
  initialState,
  reducers: {
    setPractitionerData: (state, action: PayloadAction<PractitionerType[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setPractitionerData } = practitionerSlice.actions;

export const selectPractitionerData = (state: RootState) => state.practitionerData.data;

export default practitionerSlice.reducer;
