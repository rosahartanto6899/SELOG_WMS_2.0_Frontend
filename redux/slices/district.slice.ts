/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType } from "@sera-types/base.type";
import { GetDistrictsResponse } from "@sera-types/districts.type";

import initialState from "../states/district.state";

export const districtState = createSlice({
  name: "districts",
  initialState,
  reducers: {
    getDropdownDistrictsFetch: (
      state,
      action: PayloadAction<BaseType & { cityId?: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getDropdownDistrictsSuccess: (
      state,
      action: PayloadAction<GetDistrictsResponse>,
    ) => {
      const { data } = action.payload as GetDistrictsResponse;
      state.dropdownDistricts.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownDistrictsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownDistrictsClear: (state) => {
      state.options = initialState.options;
      state.dropdownDistricts.data = initialState.dropdownDistricts.data;
    },
  },
});

export const {
  getDropdownDistrictsFetch,
  getDropdownDistrictsSuccess,
  getDropdownDistrictsFailure,
  getDropdownDistrictsClear,
} = districtState.actions;

export const districtActions = districtState.actions;
export const districtReducers = districtState.reducer;
export default districtReducers;
