/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OwnershipType,
  OwnershipTypesState,
} from "@sera-types/master-data.type";

const initialState: OwnershipTypesState = {
  data: [],
  isLoading: false,
  error: null,
};

export const ownershipTypesSlice = createSlice({
  name: "ownershipTypes",
  initialState,
  reducers: {
    getOwnershipTypesFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getOwnershipTypesSuccess: (
      state,
      action: PayloadAction<OwnershipType[]>,
    ) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    getOwnershipTypesFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
  },
});

export const {
  getOwnershipTypesFetch,
  getOwnershipTypesSuccess,
  getOwnershipTypesFailure,
} = ownershipTypesSlice.actions;

export const ownershipTypesActions = ownershipTypesSlice.actions;
export const ownershipTypesReducers = ownershipTypesSlice.reducer;
export default ownershipTypesReducers;
