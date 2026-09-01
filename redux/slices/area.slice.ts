/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetAreasResponse } from "@sera-types/area.type";

import initialState from "../states/area.state";

export const areaState = createSlice({
  name: "areas",
  initialState,
  reducers: {
    getDropdownAreasFetch: (state, action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownAreasSuccess: (
      state,
      action: PayloadAction<GetAreasResponse>,
    ) => {
      const { data } = action.payload as GetAreasResponse;
      state.dropdownAreas.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownAreasFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getDropdownAreasFetch,
  getDropdownAreasSuccess,
  getDropdownAreasFailure,
} = areaState.actions;

export const areaActions = areaState.actions;
export const areaReducers = areaState.reducer;
export default areaReducers;
