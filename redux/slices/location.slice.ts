/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { GetLocationsResponse, Location } from "@sera-types/location.type";

import initialState from "../states/location.state";

export const locationState = createSlice({
  name: "locations",
  initialState,
  reducers: {
    getLocationsFetch: (
      state,
      _action: PayloadAction<BaseType & { warehouseCode?: string }>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    getLocationsSuccess: (
      state,
      action: PayloadAction<GetLocationsResponse>,
    ) => {
      const { data, pagination } = action.payload as GetLocationsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((l: Location, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...l, no };
        });
      }
      state.isLoading = false;
    },
    getLocationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getLocationsClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getLocationDetailFetch: (state, _action) => {
      state.error = null;
      state.isLoading = true;
    },
    getLocationDetailSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.locationDetail.data = data ?? null;
      state.isLoading = false;
    },
    getLocationDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getLocationDetailClear: (state) => {
      state.locationDetail = initialState.locationDetail;
    },

    createLocationFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    createLocationSuccess: (state) => {
      state.isLoading = false;
    },
    createLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    updateLocationFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateLocationSuccess: (state) => {
      state.isLoading = false;
    },
    updateLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    deleteLocationFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteLocationSuccess: (state) => {
      state.isLoading = false;
    },
    deleteLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getDropdownLocationsFetch: (state, _action: PayloadAction) => {
      state.error = null;
    },
    getDropdownLocationsSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.dropdownLocations.data = data ?? [];
    },
    getDropdownLocationsFailure: (state, action) => {
      state.error = { ...action.payload };
    },
  },
});

export const { actions: locationActions, reducer: locationReducers } =
  locationState;
export default locationReducers;
