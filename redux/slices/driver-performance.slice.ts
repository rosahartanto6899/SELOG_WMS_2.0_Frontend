import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  IPerformanceListResponse,
  IPerformanceListResponseData,
  IPerformanceSummaryResponse,
  ISummaryPayload,
} from "@sera-types/driver-performance.type";

import initialState from "../states/driver-performance.state";

export const performanceState = createSlice({
  name: "driverPerformance",
  initialState,
  reducers: {
    getPerformanceListFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getPerformanceListFetchSuccess: (
      state,
      action: PayloadAction<IPerformanceListResponse>,
    ) => {
      state.error = null;
      state.isLoading = false;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map(
          (r: IPerformanceListResponseData, index: number) => {
            const no = (page - 1) * limit + index + 1;
            return { ...r, no };
          },
        );
      }
    },
    getPerformanceListFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },
    getSummaryFetch: (state, action: PayloadAction<ISummaryPayload>) => {
      state.getSummary.error = null;
      state.getSummary.isLoading = true;
      state.getSummary.payload = { ...action.payload };
    },
    getSummaryFetchSuccess: (
      state,
      action: PayloadAction<IPerformanceSummaryResponse>,
    ) => {
      state.getSummary.error = null;
      state.getSummary.isLoading = false;
      state.getSummary.data = { ...action.payload.data };
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = {
        totalDrivers: 0,
        performanceSummary: {
          A: 0,
          B: 0,
          C: 0,
        },
      };
    },
    getPerformanceFilterFetch: (state) => {
      state.getFilterOption.error = null;
      state.getFilterOption.isLoading = true;
    },
    getPerformanceFilterFetchSuccess: (
      state,
      // action: PayloadAction<IDriverFilterResponse[]>,
    ) => {
      state.error = null;
      state.getFilterOption.isLoading = false;
      // state.getFilterOption.data = tempData;
    },
    getPerformanceFilterFailure: (state, action) => {
      state.getFilterOption.isLoading = false;
      state.getFilterOption.error = { ...action.payload };
      state.getFilterOption.data = [];
    },
  },
});

export const performanceActions = performanceState.actions;
export const performanceReducers = performanceState.reducer;
export default performanceReducers;
