/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/approval-booking-order.state";
import {
  ApprovalBookingOrderDetailPayload,
  ApprovalBookingOrderSummaryPayload,
  ApprovalBookingRecord,
  GetApprovalBookingOrderDetailResponse,
  GetApprovalBookingOrderResponse,
  GetApprovalBookingOrderSummaryResponse,
  GetConfirmationStatusResponse,
  UpdateApprovalBookingOrderPayload,
  UpdateApprovalBookingOrderResponse,
} from "@sera-types/approval-booking-order.type";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { uniqBy } from "lodash";

export const approvalBookingOrderState = createSlice({
  name: "approvalBookingOrder",
  initialState,
  reducers: {
    getApprovalBookingOrderFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getApprovalBookingOrderSuccess: (
      state,
      action: PayloadAction<GetApprovalBookingOrderResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: ApprovalBookingRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getApprovalBookingOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getApprovalBookingOrderClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
    },
    getApprovalBookingOrderAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getApprovalBookingOrderAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetApprovalBookingOrderResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      let searchBy = (state?.autoComplete?.options?.searchBy ?? "") as any;

      if (state?.autoComplete?.options && state?.autoComplete?.data && data) {
        if (searchBy) {
          searchBy = searchBy === "bookingOrderNo" ? "bookingCode" : searchBy;
        }
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
    getApprovalBookingOrderAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getApprovalBookingOrderAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getApprovalBookingOrderSummaryFetch: (
      state,
      action: PayloadAction<ApprovalBookingOrderSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = action.payload;
    },
    getApprovalBookingOrderSummarySuccess: (
      state,
      action: PayloadAction<GetApprovalBookingOrderSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      state.summary.error = null;
      if (action.payload.data) {
        state.summary.data = action.payload.data;
      }
    },
    getApprovalBookingOrderSummaryFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = { ...action.payload };
      state.summary.data = initialState.summary.data;
    },
    getApprovalBookingOrderSummaryClear: (state) => {
      state.summary = initialState.summary;
    },
    getApprovalBookingOrderDetailFetch: (
      state,
      action: PayloadAction<ApprovalBookingOrderDetailPayload>,
    ) => {
      state.detailApprovalBooking.isLoading = true;
      state.detailApprovalBooking.error = null;
      state.detailApprovalBooking.payload = { ...action.payload };
    },
    getApprovalBookingOrderDetailSuccess: (
      state,
      action: PayloadAction<GetApprovalBookingOrderDetailResponse>,
    ) => {
      state.detailApprovalBooking.isLoading = false;
      state.detailApprovalBooking.error = null;
      state.detailApprovalBooking.data = { ...action?.payload?.data };
    },
    getApprovalBookingOrderDetailFailure: (state, action) => {
      state.detailApprovalBooking.isLoading = false;
      state.detailApprovalBooking.error = { ...action.payload };
      state.detailApprovalBooking.data = {};
    },
    getApprovalBookingOrderDetailClear: (state) => {
      state.detailApprovalBooking = initialState.detailApprovalBooking;
    },
    updateApprovalBookingOrderFetch: (
      state,
      action: PayloadAction<UpdateApprovalBookingOrderPayload>,
    ) => {
      state.updateApprovalBooking.isLoading = true;
      state.updateApprovalBooking.error = null;
      state.updateApprovalBooking.payload = { ...action.payload };
    },
    updateApprovalBookingOrderSuccess: (
      state,
      action: PayloadAction<UpdateApprovalBookingOrderResponse>,
    ) => {
      state.updateApprovalBooking.isLoading = false;
      state.updateApprovalBooking.error = null;
      state.updateApprovalBooking.data = { ...action.payload?.data };
    },
    updateApprovalBookingOrderFailure: (state, action) => {
      state.updateApprovalBooking.isLoading = false;
      state.updateApprovalBooking.error = { ...action.payload };
      state.updateApprovalBooking.data = {};
    },
    updateApprovalBookingOrderClear: (state) => {
      state.updateApprovalBooking = initialState.updateApprovalBooking;
    },
    getConfirmationStatusFetch: (state) => {
      state.confirmationStatus.isLoading = true;
      state.confirmationStatus.error = null;
    },
    getConfirmationStatusSuccess: (
      state,
      action: PayloadAction<GetConfirmationStatusResponse>,
    ) => {
      state.confirmationStatus.isLoading = false;
      state.confirmationStatus.error = null;
      if (action.payload.data) {
        state.confirmationStatus.data = action.payload.data;
      }
    },
    getConfirmationStatusFailure: (state, action) => {
      state.confirmationStatus.isLoading = false;
      state.confirmationStatus.error = { ...action.payload };
    },
    getConfirmationStatusClear: (state) => {
      state.confirmationStatus = initialState.confirmationStatus;
    },
  },
});

export const approvalBookingOrderActions = approvalBookingOrderState.actions;
export const approvalBookingOrderReducer = approvalBookingOrderState.reducer;
export default approvalBookingOrderReducer;
