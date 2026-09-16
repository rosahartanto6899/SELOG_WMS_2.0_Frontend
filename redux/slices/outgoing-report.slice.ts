/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/outgoing-report.state";
import { PaginationType } from "@sera-types/base.type";
import {
  GetOutgoingReportResponse,
  OutgoingReportListPayload,
  OutgoingReportRow,
} from "@sera-types/outgoing-report.type";

export const outgoingReportSlice = createSlice({
  name: "outgoingReport",
  initialState,
  reducers: {
    getOutgoingReportFetch: (
      state,
      action: PayloadAction<OutgoingReportListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getOutgoingReportSuccess: (
      state,
      action: PayloadAction<GetOutgoingReportResponse>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } = (pagination ??
        {}) as PaginationType;
      state.options = {
        ...state.options,
        page,
        limit,
        totalData,
        totalPage,
      };
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: OutgoingReportRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getOutgoingReportFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getOutgoingReportClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: outgoingReportActions } = outgoingReportSlice;
export const outgoingReportReducer = outgoingReportSlice.reducer;
export default outgoingReportReducer;
