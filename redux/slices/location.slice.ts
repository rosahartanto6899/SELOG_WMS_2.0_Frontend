/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DropdownLocationPayload,
  GetLocationsResponse,
  Location,
} from "@sera-types/location.type";
import _ from "lodash";

import initialState from "../states/location.state";

export const locationState = createSlice({
  name: "locations",
  initialState,
  reducers: {
    getLocationsFetch: (state, action: PayloadAction<BaseType>) => {
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
        state.data = data.map((r: Location, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
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

    getLocationsAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;

      if (state?.autoComplete)
        state.autoComplete.options.searchBy = action.payload.searchBy;
    },
    getLocationsAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetLocationsResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";
      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const uniqueData = _.uniqBy(data, searchBy);

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];
      }
      state.isLoading = false;
    },
    getLocationsAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getLocationsAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    createNewLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createNewLocationSuccess: (state, action) => {
      const { data } = action.payload;
      state.createNewLocation.data = data ?? [];
      state.isLoading = false;
      state.postCreateNewLocation = action.payload;
    },
    createNewLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postCreateNewLocationClear: (state) => {
      state.postCreateNewLocation = initialState.postCreateNewLocation;
    },

    getLocationDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
    },
    getLocationDetailSuccess: (
      state,
      action: PayloadAction<GetLocationsResponse>,
    ) => {
      const { data } = action.payload as GetLocationsResponse;
      state.locationDetail.data = { ...state.locationDetail.data, ...data };
      state.isLoading = false;
    },
    getLocationDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getLocationDetailClear: (state) => {
      state.locationDetail = initialState.locationDetail;
    },

    updateLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateLocationSuccess: (state, action) => {
      const { data } = action.payload;
      state.updateLocation.data = data ?? [];
      state.postUpdateLocation = action.payload;
    },
    updateLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postUpdateLocationClear: (state) => {
      state.postUpdateLocation = initialState.postUpdateLocation;
    },

    deleteLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteLocationSuccess: (
      state,
      action: PayloadAction<GetLocationsResponse>,
    ) => {
      state.isLoading = false;
    },
    deleteLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postDeleteLocationNotification: (state, action) => {
      const {
        payload: { id, name },
      } = action;
      state.postDeleteLocation = { id, name };
    },
    postDeleteLocationClear: (state) => {
      state.postDeleteLocation = initialState.postDeleteLocation;
    },

    getDropdownLocationsFetch: (
      state,
      action: PayloadAction<DropdownLocationPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.dropdownLocations.payload = { ...action?.payload };
    },
    getDropdownLocationsSuccess: (
      state,
      action: PayloadAction<GetLocationsResponse>,
    ) => {
      state.isLoading = false;
      state.dropdownLocations.isSuccess = true;
      state.dropdownLocations.data = action?.payload?.data ?? [];
    },
    getDropdownLocationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.dropdownLocations.isSuccess = false;
    },
    getDropdownLocationsClear: (state) => {
      state.dropdownLocations = initialState.dropdownLocations;
    },
  },
});

export const {
  getLocationsFetch,
  getLocationsSuccess,
  getLocationsFailure,
  getLocationsClear,
  getLocationsAutoCompleteFetch,
  getLocationsAutoCompleteSuccess,
  getLocationsAutoCompleteFailure,
  createNewLocationFetch,
  createNewLocationSuccess,
  createNewLocationFailure,
  postCreateNewLocationClear,
  getLocationDetailFetch,
  getLocationDetailSuccess,
  getLocationDetailFailure,
  updateLocationFetch,
  updateLocationSuccess,
  updateLocationFailure,
  postUpdateLocationClear,
  deleteLocationFetch,
  deleteLocationSuccess,
  deleteLocationFailure,
  postDeleteLocationNotification,
  postDeleteLocationClear,
  getDropdownLocationsFetch,
  getDropdownLocationsSuccess,
  getDropdownLocationsFailure,
} = locationState.actions;

export const locationActions = locationState.actions;
export const locationReducers = locationState.reducer;
export default locationReducers;
