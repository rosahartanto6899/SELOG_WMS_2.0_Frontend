/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/outstanding-incoming.state";
import { PaginationType } from "@sera-types/base.type";
import {
  GetOutstandingIncomingResponse,
  OutstandingIncomingDetailPayload,
  OutstandingIncomingDetailResponse,
  OutstandingIncomingHistory,
  OutstandingIncomingListPayload,
  OutstandingIncomingRow,
  OutstandingIncomingSummaryResponse,
} from "@sera-types/outstanding-incoming.type";

export const outstandingIncomingSlice = createSlice({
  name: "outstandingIncoming",
  initialState,
  reducers: {
    getOutstandingIncomingFetch: (
      state,
      action: PayloadAction<OutstandingIncomingListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getOutstandingIncomingSuccess: (
      state,
      action: PayloadAction<GetOutstandingIncomingResponse>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: OutstandingIncomingRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getOutstandingIncomingFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getOutstandingIncomingClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },

    getOutstandingIncomingSummaryFetch: (
      state,
      action: PayloadAction<{ warehouseCodes?: string[] | null }>,
    ) => {
      state.summary = {
        ...state.summary,
        isLoading: true,
        error: null,
        payload: { ...action.payload },
      } as any;
    },
    getOutstandingIncomingSummarySuccess: (
      state,
      action: PayloadAction<OutstandingIncomingSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      if (action.payload.data) {
        state.summary.data = action.payload.data;
      }
    },
    getOutstandingIncomingSummaryFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = { ...action.payload };
    },
    getOutstandingIncomingSummaryClear: (state) => {
      state.summary = initialState.summary as any;
    },

    getOutstandingIncomingDetailFetch: (
      state,
      _action: PayloadAction<OutstandingIncomingDetailPayload>,
    ) => {
      state.detail = {
        ...state.detail,
        isLoading: true,
        error: null,
        data: null,
        history: [],
      } as any;
    },
    getOutstandingIncomingDetailSuccess: (
      state,
      action: PayloadAction<
        OutstandingIncomingDetailResponse & {
          history?: OutstandingIncomingHistory[];
        }
      >,
    ) => {
      state.detail.isLoading = false;
      state.detail.data = action.payload.data ?? null;
      state.detail.history = (action.payload as any).history ?? [];
    },
    getOutstandingIncomingDetailFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = { ...action.payload };
    },
    getOutstandingIncomingDetailClear: (state) => {
      state.detail = initialState.detail as any;
    },
  },
});

export const { actions: outstandingIncomingActions } = outstandingIncomingSlice;
export const outstandingIncomingReducer = outstandingIncomingSlice.reducer;
export default outstandingIncomingReducer;
