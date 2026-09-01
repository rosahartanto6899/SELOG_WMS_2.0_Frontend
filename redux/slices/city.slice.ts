/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType } from "@sera-types/base.type";
import { GetCitiesResponse } from "@sera-types/cities.type";

import initialState from "../states/city.state";

export const cityState = createSlice({
  name: "cities",
  initialState,
  reducers: {
    getDropdownCitiesFetch: (
      state,
      action: PayloadAction<BaseType & { provinceId?: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getDropdownCitiesSuccess: (
      state,
      action: PayloadAction<GetCitiesResponse>,
    ) => {
      const { data } = action.payload as GetCitiesResponse;
      state.dropdownCities.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownCitiesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCitiesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCities.data = initialState.dropdownCities.data;
    },
  },
});

export const {
  getDropdownCitiesFetch,
  getDropdownCitiesSuccess,
  getDropdownCitiesFailure,
  getDropdownCitiesClear,
} = cityState.actions;

export const cityActions = cityState.actions;
export const cityReducers = cityState.reducer;
export default cityReducers;
