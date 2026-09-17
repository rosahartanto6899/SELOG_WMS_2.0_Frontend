/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/soh-all-sloc-report.state";
import { PaginationType } from "@sera-types/base.type";
import {
  GetSohAllSlocReportResponse,
  SohAllSlocReportListPayload,
  SohAllSlocReportRow,
} from "@sera-types/soh-all-sloc-report.type";

export const sohAllSlocReportSlice = createSlice({
  name: "sohAllSlocReport",
  initialState,
  reducers: {
    getSohAllSlocReportFetch: (
      state,
      action: PayloadAction<SohAllSlocReportListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getSohAllSlocReportSuccess: (
      state,
      action: PayloadAction<GetSohAllSlocReportResponse>,
    ) => {
      const { data, warehouses, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } = (pagination ??
        {}) as PaginationType;
      state.options = {
        ...state.options,
        page,
        limit,
        totalData,
        totalPage,
      };
      state.warehouses = warehouses ?? [];
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: SohAllSlocReportRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getSohAllSlocReportFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getSohAllSlocReportClear: (state) => {
      state.data = initialState.data;
      state.warehouses = initialState.warehouses;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: sohAllSlocReportActions } = sohAllSlocReportSlice;
export const sohAllSlocReportReducer = sohAllSlocReportSlice.reducer;
export default sohAllSlocReportReducer;
