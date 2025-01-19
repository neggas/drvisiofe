import { SpecialityType, SpecialityState } from "@/utility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const initialState: SpecialityState = {
  data: [],
};

const specialitySlice = createSlice({
  name: "specialityData",
  initialState,
  reducers: {
    setSpecialityData: (state, action: PayloadAction<SpecialityType[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setSpecialityData } = specialitySlice.actions;

export const selectSpecialityData = (state: RootState) => state.specialityData.data;

export default specialitySlice.reducer;
