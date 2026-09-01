/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DriverStatus, DriverStatusState } from "@sera-types/master-data.type";

const initialState: DriverStatusState = {
  data: [],
  isLoading: false,
  error: null,
};

export const driverStatusSlice = createSlice({
  name: "driverStatus",
  initialState,
  reducers: {
    getDriverStatusFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getDriverStatusSuccess: (state, action: PayloadAction<DriverStatus[]>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    getDriverStatusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
  },
});

export const driverStatusActions = driverStatusSlice.actions;
export const driverStatusReducers = driverStatusSlice.reducer;
export default driverStatusReducers;
