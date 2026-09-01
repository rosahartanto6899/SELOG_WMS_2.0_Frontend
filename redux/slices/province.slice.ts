/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetProvincesResponse } from "@sera-types/provinces.type";

import initialState from "../states/province.state";

export const provinceState = createSlice({
  name: "provinces",
  initialState,
  reducers: {
    getDropdownProvincesFetch: (state, action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownProvincesSuccess: (
      state,
      action: PayloadAction<GetProvincesResponse>,
    ) => {
      const { data } = action.payload as GetProvincesResponse;
      state.dropdownProvinces.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownProvincesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getDropdownProvincesClear: (state) => {
      state.options = initialState.options;
      state.dropdownProvinces.data = initialState.dropdownProvinces.data;
    },
  },
});

export const {
  getDropdownProvincesFetch,
  getDropdownProvincesSuccess,
  getDropdownProvincesFailure,
  getDropdownProvincesClear,
} = provinceState.actions;

export const provinceActions = provinceState.actions;
export const provinceReducers = provinceState.reducer;
export default provinceReducers;
