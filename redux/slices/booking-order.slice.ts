/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/booking-order.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  BookingOrderAdditionalRequestResposne,
  BookingOrderDetailPayload,
  BookingOrderDetailResponse,
  BookingOrderRecord,
  BookingOrderSummaryPayload,
  BookingOrderSummaryResponse,
  CreateBookingOrderPayload,
  CreateBookingOrderResponse,
  GetBookingOrderResponse,
  UpdateBookingOrderPayload,
  UpdateBookingOrderResponse,
  UpdateStatusBookingOrderPayload,
} from "@sera-types/booking-order.type";
import { uniqBy } from "lodash";

export const bookingOrderState = createSlice({
  name: "bookingOrder",
  initialState,
  reducers: {
    getBookingOrderFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getBookingOrderSuccess: (
      state,
      action: PayloadAction<GetBookingOrderResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.list.map((r: BookingOrderRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getBookingOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getBookingOrderClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
    },
    getBookingOrderAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getBookingOrderAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetBookingOrderResponse>,
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
        const _uniqueData = uniqBy(data.list, searchBy);

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
    getBookingOrderAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getBookingOrderAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getBookingOrderSummaryFetch: (
      state,
      action: PayloadAction<BookingOrderSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = action.payload;
    },
    getBookingOrderSummarySuccess: (
      state,
      action: PayloadAction<BookingOrderSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      state.summary.error = null;
      if (action.payload.data) {
        state.summary.data = action.payload.data;
      }
    },
    getBookingOrderSummaryFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = { ...action.payload };
      state.summary.data = initialState.summary.data;
    },
    getBookingOrderSummaryClear: (state) => {
      state.summary = initialState.summary;
    },
    getBookingOrderDetailFetch: (
      state,
      action: PayloadAction<BookingOrderDetailPayload>,
    ) => {
      state.detailBooking.isLoading = true;
      state.detailBooking.error = null;
      state.detailBooking.payload = { ...action.payload };
    },
    getBookingOrderDetailSuccess: (
      state,
      action: PayloadAction<BookingOrderDetailResponse>,
    ) => {
      state.detailBooking.isLoading = false;
      state.detailBooking.error = null;
      state.detailBooking.data = { ...action?.payload?.data };
    },
    getBookingOrderDetailFailure: (state, action) => {
      state.detailBooking.isLoading = false;
      state.detailBooking.error = { ...action.payload };
      state.detailBooking.data = {};
    },
    getBookingOrderDetailClear: (state) => {
      state.detailBooking = initialState.detailBooking;
    },
    createBookingOrderFetch: (
      state,
      action: PayloadAction<CreateBookingOrderPayload>,
    ) => {
      state.createBooking.isLoading = true;
      state.createBooking.error = null;
      state.createBooking.payload = { ...action.payload };
    },
    createBookingOrderSuccess: (
      state,
      action: PayloadAction<CreateBookingOrderResponse>,
    ) => {
      state.createBooking.isLoading = false;
      state.createBooking.error = null;
      state.createBooking.data = { ...action.payload };
    },
    createBookingOrderFailure: (state, action) => {
      state.createBooking.isLoading = false;
      state.createBooking.error = { ...action.payload };
      state.createBooking.data = {};
    },
    createBookingOrderClear: (state) => {
      state.createBooking = initialState.createBooking;
    },
    updateBookingOrderFetch: (
      state,
      action: PayloadAction<UpdateBookingOrderPayload>,
    ) => {
      state.updateBooking.isLoading = true;
      state.updateBooking.error = null;
      state.updateBooking.payload = { ...action.payload };
    },
    updateBookingOrderSuccess: (
      state,
      action: PayloadAction<UpdateBookingOrderResponse>,
    ) => {
      state.updateBooking.isLoading = false;
      state.updateBooking.error = null;
      state.updateBooking.data = { ...action?.payload };
    },
    updateBookingOrderFailure: (state, action) => {
      state.updateBooking.isLoading = false;
      state.updateBooking.error = { ...action.payload };
      state.updateBooking.data = {};
    },
    updateBookingOrderClear: (state) => {
      state.updateBooking = initialState.updateBooking;
    },
    updateBookingOrderStatusFetch: (
      state,
      action: PayloadAction<UpdateStatusBookingOrderPayload>,
    ) => {
      state.updateStatusBooking.isLoading = true;
      state.updateStatusBooking.error = null;
      state.updateStatusBooking.payload = { ...action.payload };
    },
    updateBookingOrderStatusSuccess: (
      state,
      action: PayloadAction<UpdateStatusBookingOrderPayload>,
    ) => {
      state.updateStatusBooking.isLoading = false;
      state.updateStatusBooking.error = null;
      state.updateStatusBooking.data = { ...action?.payload };
    },
    updateBookingOrderStatusFailure: (state, action) => {
      state.updateStatusBooking.isLoading = false;
      state.updateStatusBooking.error = { ...action.payload };
      state.updateStatusBooking.data = {};
    },
    updateBookingOrderStatusClear: (state) => {
      state.updateStatusBooking = initialState.updateStatusBooking;
    },
    getDropdownAdditionalRequestItemsFetch: (state) => {
      state.dropdownAdditionalRequestItems.isLoading = true;
      state.dropdownAdditionalRequestItems.error = null;
    },
    getDropdownAdditionalRequestItemsSuccess: (
      state,
      action: PayloadAction<BookingOrderAdditionalRequestResposne>,
    ) => {
      state.dropdownAdditionalRequestItems.isLoading = false;
      state.dropdownAdditionalRequestItems.error = null;
      state.dropdownAdditionalRequestItems.data = action.payload.data!;
    },
    getDropdownAdditionalRequestItemsFailure: (state, action) => {
      state.dropdownAdditionalRequestItems.isLoading = false;
      state.dropdownAdditionalRequestItems.error = { ...action.payload };
      state.dropdownAdditionalRequestItems.data = [];
    },
    getDropdownAdditionalRequestItemsClear: (state) => {
      state.dropdownAdditionalRequestItems =
        initialState.dropdownAdditionalRequestItems;
    },
  },
});

export const {
  getBookingOrderFetch,
  getBookingOrderSuccess,
  getBookingOrderFailure,
  getBookingOrderClear,
  getBookingOrderAutoCompleteFetch,
  getBookingOrderAutoCompleteSuccess,
  getBookingOrderAutoCompleteFailure,
  getBookingOrderAutoCompleteClear,
  getBookingOrderSummaryFetch,
  getBookingOrderSummarySuccess,
  getBookingOrderSummaryFailure,
  getBookingOrderSummaryClear,
  getBookingOrderDetailFetch,
  getBookingOrderDetailSuccess,
  getBookingOrderDetailFailure,
  getBookingOrderDetailClear,
  createBookingOrderFetch,
  createBookingOrderSuccess,
  createBookingOrderFailure,
  createBookingOrderClear,
  updateBookingOrderFetch,
  updateBookingOrderSuccess,
  updateBookingOrderFailure,
  updateBookingOrderClear,
  updateBookingOrderStatusFetch,
  updateBookingOrderStatusSuccess,
  updateBookingOrderStatusFailure,
  updateBookingOrderStatusClear,
  getDropdownAdditionalRequestItemsFetch,
  getDropdownAdditionalRequestItemsClear,
  getDropdownAdditionalRequestItemsFailure,
  getDropdownAdditionalRequestItemsSuccess,
} = bookingOrderState.actions;

export const bookingOrderActions = bookingOrderState.actions;
export const bookingOrderReducer = bookingOrderState.reducer;
export default bookingOrderReducer;
