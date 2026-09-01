/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetWmsCustomersResponse,
  WmsCustomer,
} from "@sera-types/wms-customer.type";

import initialState from "../states/wms-customer.state";

export const wmsCustomerState = createSlice({
  name: "wmsCustomers",
  initialState,
  reducers: {
    getCustomersFetch: (state, _action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getCustomersSuccess: (
      state,
      action: PayloadAction<GetWmsCustomersResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((c: WmsCustomer, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...c, no };
        });
      }
      state.isLoading = false;
    },
    getCustomersFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getCustomerDetailFetch: (state, _action) => {
      state.error = null;
      state.isLoading = true;
    },
    getCustomerDetailSuccess: (state, action) => {
      const { data } = action.payload;
      state.customerDetail.data = { ...state.customerDetail.data, ...data };
      state.isLoading = false;
    },
    getCustomerDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    createCustomerFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    createCustomerSuccess: (state, action) => {
      const { data } = action.payload;
      state.createCustomer.data = data ?? [];
      state.postCreateCustomer = { code: data?.code, name: data?.name };
      state.isLoading = false;
    },
    createCustomerFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postCreateCustomerClear: (state) => {
      state.postCreateCustomer = initialState.postCreateCustomer;
    },

    updateCustomerFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCustomerSuccess: (state, action) => {
      const { data } = action.payload;
      state.updateCustomer.data = data ?? [];
      state.postUpdateCustomer = { id: data?.id, name: data?.name };
      state.isLoading = false;
    },
    updateCustomerFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postUpdateCustomerClear: (state) => {
      state.postUpdateCustomer = initialState.postUpdateCustomer;
    },

    deleteCustomerFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCustomerSuccess: (state, _action) => {
      state.isLoading = false;
    },
    deleteCustomerFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postDeleteCustomerNotification: (state, action) => {
      const {
        payload: { id, name },
      } = action;
      state.postDeleteCustomer = { id, name };
    },
    postDeleteCustomerClear: (state) => {
      state.postDeleteCustomer = initialState.postDeleteCustomer;
    },
  },
});

export const { actions: wmsCustomerActions, reducer: wmsCustomerReducers } =
  wmsCustomerState;
export default wmsCustomerReducers;
