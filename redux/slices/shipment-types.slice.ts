/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShipmentType, ShipmentTypesState } from "@sera-types/master-data.type";

const initialState: ShipmentTypesState = {
  data: [],
  isLoading: false,
  error: null,
};

export const shipmentTypesSlice = createSlice({
  name: "shipmentTypes",
  initialState,
  reducers: {
    getShipmentTypesFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getShipmentTypesSuccess: (state, action: PayloadAction<ShipmentType[]>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    getShipmentTypesFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
  },
});

export const shipmentTypesActions = shipmentTypesSlice.actions;
export const shipmentTypesReducers = shipmentTypesSlice.reducer;
export default shipmentTypesReducers;
