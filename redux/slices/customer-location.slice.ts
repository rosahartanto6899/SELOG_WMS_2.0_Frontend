/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CustomerLocation,
  DropdownCustomerLocationPayload,
  GetCustomerLocationsResponse,
} from "@sera-types/customer-location.type";
import _ from "lodash";

import initialState from "../states/customer-location.state";

export const customerLocationState = createSlice({
  name: "customerLocations",
  initialState,
  reducers: {
    getCustomerLocationsFetch: (
      state,
      action: PayloadAction<BaseType & { customerId?: string }>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    getCustomerLocationsSuccess: (
      state,
      action: PayloadAction<GetCustomerLocationsResponse>,
    ) => {
      const { data, pagination } =
        action.payload as GetCustomerLocationsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: CustomerLocation, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getCustomerLocationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getCustomerLocationsClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getCustomerLocationsAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.isLoading = true;
      state.error = null;

      if (state?.autoComplete)
        state.autoComplete.options.searchBy = action.payload.searchBy;
    },
    getCustomerLocationsAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetCustomerLocationsResponse>,
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
    getCustomerLocationsAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getCustomerLocationsAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    createNewCustomerLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createNewCustomerLocationSuccess: (state, action) => {
      const { data } = action.payload;
      state.createNewCustomerLocation.data = data ?? [];
      state.isLoading = false;
      state.postCreateNewCustomerLocation = action.payload;
    },
    createNewCustomerLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postCreateNewCustomerLocationClear: (state) => {
      state.postCreateNewCustomerLocation =
        initialState.postCreateNewCustomerLocation;
    },

    getCustomerLocationDetailFetch: (state, action) => {
      state.customerLocationDetail.error = null;
      state.customerLocationDetail.isLoading = true;
    },
    getCustomerLocationDetailSuccess: (
      state,
      action: PayloadAction<GetCustomerLocationsResponse>,
    ) => {
      const { data } = action.payload as GetCustomerLocationsResponse;
      state.customerLocationDetail.data = {
        ...state.customerLocationDetail.data,
        ...data,
      };
      state.customerLocationDetail.isLoading = false;
    },
    getCustomerLocationDetailFailure: (state, action) => {
      state.customerLocationDetail.isLoading = false;
      state.customerLocationDetail.error = { ...action.payload };
    },

    getCustomerLocationDetailClear: (state) => {
      state.customerLocationDetail = initialState.customerLocationDetail;
    },

    updateCustomerLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCustomerLocationSuccess: (state, action) => {
      const { data } = action.payload;
      state.updaCustomerLocation.data = data ?? [];
      state.postUpdateCustomerLocation = action.payload;
    },
    updateCustomerLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postUpdateCustomerLocationClear: (state) => {
      state.postUpdateCustomerLocation =
        initialState.postUpdateCustomerLocation;
    },

    deleteCustomerLocationFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCustomerLocationSuccess: (
      state,
      action: PayloadAction<GetCustomerLocationsResponse>,
    ) => {
      state.isLoading = false;
    },
    deleteCustomerLocationFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postDeleteCustomerLocationNotification: (state, action) => {
      const {
        payload: { id, name },
      } = action;
      state.postDeleteCustomerLocation = { id, name };
    },
    postDeleteCustomerLocationClear: (state) => {
      state.postDeleteCustomerLocation =
        initialState.postDeleteCustomerLocation;
    },

    getDropdownCustomerLocationsFetch: (
      state,
      action: PayloadAction<DropdownCustomerLocationPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.dropdownCustomerLocations.payload = { ...action?.payload };
    },
    getDropdownCustomerLocationsSuccess: (
      state,
      action: PayloadAction<GetCustomerLocationsResponse>,
    ) => {
      state.dropdownCustomerLocations.data = action?.payload?.data ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerLocationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const customerLocationActions = customerLocationState.actions;
export const customerLocationReducers = customerLocationState.reducer;
export default customerLocationReducers;
