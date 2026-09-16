/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/incoming-report.state";
import { PaginationType } from "@sera-types/base.type";
import {
  GetIncomingReportResponse,
  IncomingReportListPayload,
  IncomingReportRow,
} from "@sera-types/incoming-report.type";

export const incomingReportSlice = createSlice({
  name: "incomingReport",
  initialState,
  reducers: {
    getIncomingReportFetch: (
      state,
      action: PayloadAction<IncomingReportListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getIncomingReportSuccess: (
      state,
      action: PayloadAction<GetIncomingReportResponse>,
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
        state.data = data.map((r: IncomingReportRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getIncomingReportFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getIncomingReportClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: incomingReportActions } = incomingReportSlice;
export const incomingReportReducer = incomingReportSlice.reducer;
export default incomingReportReducer;
