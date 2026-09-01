import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/order-status.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetOrderDetailResponse,
  GetOrderStatusResponse,
  GetOrderStatusSummaryResponse,
  OrderStatusCancelPayload,
  OrderStatusDetailPayload,
  OrderStatusRecord,
  OrderStatusReroutePayload,
  OrderStatusReschedulePayload,
  OrderStatusSummaryPayload,
} from "@sera-types/order-status.type";
import { uniqBy } from "lodash";

export const orderStatusState = createSlice({
  name: "orderStatus",
  initialState,
  reducers: {
    getOrderStatusFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getOrderStatusSuccess: (
      state,
      action: PayloadAction<GetOrderStatusResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: OrderStatusRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getOrderStatusFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getOrderStatusClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = initialState.error;
    },
    getOrderStatusAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getOrderStatusAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetOrderStatusResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = (state?.autoComplete?.options?.searchBy ?? "") as any;

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getOrderStatusAutoCompleteFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    getOrderStatusAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getOrderStatusSummaryInformationFetch: (
      state,
      action: PayloadAction<OrderStatusSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = { ...action.payload };
    },
    getOrderStatusSummaryInformationSuccess: (
      state,
      action: PayloadAction<GetOrderStatusSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      state.summary.error = null;
      if (action.payload.data) {
        state.summary.data = action.payload.data;
      }
    },
    getOrderStatusSummaryInformationFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = action.payload;
      state.summary.data = initialState.summary.data;
    },
    getOrderStatusSummaryInformationClear: (state) => {
      state.summary = initialState.summary;
    },
    getOrderStatusDetailFetch: (
      state,
      action: PayloadAction<OrderStatusDetailPayload>,
    ) => {
      state.detail.isLoading = true;
      state.detail.error = null;
      state.detail.payload = { ...action.payload };
    },
    getOrderStatusDetailSuccess: (
      state,
      action: PayloadAction<GetOrderDetailResponse>,
    ) => {
      state.detail.isLoading = false;
      state.detail.error = null;
      state.detail.data = { ...action?.payload?.data };
    },
    getOrderStatusDetailFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = action.payload;
      state.detail.data = {};
    },
    getOrderStatusDetailClear: (state) => {
      state.detail = initialState.detail;
    },
    updateRerouteOrderStatusFetch: (
      state,
      action: PayloadAction<OrderStatusReroutePayload>,
    ) => {
      state.updateReroute.isLoading = true;
      state.updateReroute.error = null;
      state.updateReroute.data = { ...action.payload };
    },
    updateRerouteOrderStatusSuccess: (state) => {
      state.updateReroute.isLoading = false;
      state.updateReroute.error = null;
    },
    updateRerouteOrderStatusFailure: (state, action) => {
      state.updateReroute.isLoading = false;
      state.updateReroute.error = action.payload;
    },
    updateRerouteOrderStatusClear: (state) => {
      state.updateReroute = initialState.updateReroute;
    },
    updateCancelOrderStatusFetch: (
      state,
      action: PayloadAction<OrderStatusCancelPayload>,
    ) => {
      state.updateCancel.isLoading = true;
      state.updateCancel.error = null;
      state.updateCancel.data = { ...action.payload };
    },
    updateCancelOrderStatusSuccess: (state) => {
      state.updateCancel.isLoading = false;
      state.updateCancel.error = null;
    },
    updateCancelOrderStatusFailure: (state, action) => {
      state.updateCancel.isLoading = false;
      state.updateCancel.error = action.payload;
    },
    updateCancelOrderStatusClear: (state) => {
      state.updateCancel = initialState.updateCancel;
    },
    updateRescheduleOrderStatusFetch: (
      state,
      action: PayloadAction<OrderStatusReschedulePayload>,
    ) => {
      state.updateReschedule.isLoading = true;
      state.updateReschedule.error = null;
      state.updateReschedule.data = { ...action.payload };
    },
    updateRescheduleOrderStatusSuccess: (state) => {
      state.updateReschedule.isLoading = false;
      state.updateReschedule.error = null;
    },
    updateRescheduleOrderStatusFailure: (state, action) => {
      state.updateReschedule.isLoading = false;
      state.updateReschedule.error = action.payload;
    },
    updateRescheduleOrderStatusClear: (state) => {
      state.updateReschedule = initialState.updateReschedule;
    },
  },
});

export const {
  getOrderStatusFetch,
  getOrderStatusSuccess,
  getOrderStatusFailure,
  getOrderStatusClear,
  getOrderStatusAutoCompleteFetch,
  getOrderStatusAutoCompleteSuccess,
  getOrderStatusAutoCompleteFailure,
  getOrderStatusAutoCompleteClear,
  getOrderStatusDetailFetch,
  getOrderStatusDetailSuccess,
  getOrderStatusDetailFailure,
  getOrderStatusDetailClear,
  getOrderStatusSummaryInformationFetch,
  getOrderStatusSummaryInformationSuccess,
  getOrderStatusSummaryInformationFailure,
  getOrderStatusSummaryInformationClear,
  updateRerouteOrderStatusFetch,
  updateRerouteOrderStatusSuccess,
  updateRerouteOrderStatusFailure,
  updateRerouteOrderStatusClear,
  updateCancelOrderStatusFetch,
  updateCancelOrderStatusSuccess,
  updateCancelOrderStatusFailure,
  updateCancelOrderStatusClear,
  updateRescheduleOrderStatusFetch,
  updateRescheduleOrderStatusSuccess,
  updateRescheduleOrderStatusFailure,
  updateRescheduleOrderStatusClear,
} = orderStatusState.actions;

export const orderStatusActions = orderStatusState.actions;
export const orderStatusReducer = orderStatusState.reducer;
export default orderStatusReducer;
