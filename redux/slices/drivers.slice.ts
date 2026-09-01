/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { DriverRecord } from "@sera-types/booking-order.type";
import { GetDriversResponse } from "@sera-types/drivers.type";

import initialState from "../states/drivers.state";

export const driversState = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    getDriversFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getDriversSuccess: (state, action: PayloadAction<GetDriversResponse>) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getDriversFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getDriversClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = initialState.error;
    },
  },
});

export const driversActions = driversState.actions;
export const driversReducers = driversState.reducer;
export default driversReducers;
