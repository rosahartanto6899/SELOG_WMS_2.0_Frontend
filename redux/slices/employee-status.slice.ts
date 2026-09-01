/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IEmployeeStatus,
  IEmployeeStatusState,
} from "@sera-types/master-data.type";

const initialState: IEmployeeStatusState = {
  data: [],
  isLoading: false,
  error: null,
};

export const employeeStatusSlice = createSlice({
  name: "employeeStatus",
  initialState,
  reducers: {
    getEmployeeStatusFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getEmployeeStatusSuccess: (
      state,
      action: PayloadAction<IEmployeeStatus[]>,
    ) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    getEmployeeStatusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
  },
});

export const employeeStatusActions = employeeStatusSlice.actions;
export const employeeStatusReducers = employeeStatusSlice.reducer;
export default employeeStatusReducers;
