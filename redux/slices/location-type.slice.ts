/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetLocationTypesResponse } from "@sera-types/location-type.type";

import initialState from "../states/location-type.state";

export const locationTypeState = createSlice({
  name: "locationTypes",
  initialState,
  reducers: {
    getDropdownLocationTypesFetch: (state, action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownLocationTypesSuccess: (
      state,
      action: PayloadAction<GetLocationTypesResponse>,
    ) => {
      const { data } = action.payload as GetLocationTypesResponse;
      state.dropdownLocationTypes.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownLocationTypesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getDropdownLocationTypesFetch,
  getDropdownLocationTypesSuccess,
  getDropdownLocationTypesFailure,
} = locationTypeState.actions;

export const locationTypeActions = locationTypeState.actions;
export const locationTypeReducers = locationTypeState.reducer;
export default locationTypeReducers;
