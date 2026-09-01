/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetVehicleGroupsResponse } from "@sera-types/vehicle-group.type";

import initialState from "../states/vehicle-group.state";

export const vehicleGroupState = createSlice({
  name: "vehicleGroups",
  initialState,
  reducers: {
    getDropdownVehicleGroupsFetch: (state, action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownVehicleGroupsSuccess: (
      state,
      action: PayloadAction<GetVehicleGroupsResponse>,
    ) => {
      const { data } = action.payload as GetVehicleGroupsResponse;
      state.dropdownVehicleGroups.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownVehicleGroupsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getDropdownVehicleGroupsFetch,
  getDropdownVehicleGroupsSuccess,
  getDropdownVehicleGroupsFailure,
} = vehicleGroupState.actions;

export const vehicleGroupActions = vehicleGroupState.actions;
export const vehicleGroupReducers = vehicleGroupState.reducer;
export default vehicleGroupReducers;
