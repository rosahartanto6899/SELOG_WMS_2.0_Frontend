/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/driver-gantt-chart.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  IDriverGanttChartData,
  IDriverGanttChartListResponse,
  IDriverGanttChartSummaryResponse,
} from "@sera-types/driver-gantt-chart.type";

export const driverGanttChartState = createSlice({
  name: "driverGanttChart",
  initialState,
  reducers: {
    getDriverGanttChartFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getDriverGanttChartSuccess: (
      state,
      action: PayloadAction<IDriverGanttChartListResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = {
        ...state.options,
        page,
        limit,
        totalData: totalData ?? undefined,
        totalPage: totalPage ?? undefined,
      };
      if (data) {
        state.data = data.map((r: IDriverGanttChartData, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getDriverGanttChartFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },

    getDriverGanttChartSummaryFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    getDriverGanttChartSummarySuccess: (
      state,
      action: PayloadAction<IDriverGanttChartSummaryResponse>,
    ) => {
      const { data } = action.payload;
      if (data) {
        state.summary = data.summary;
      }
      state.isLoading = false;
    },
    getDriverGanttChartSummaryFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.summary = {};
    },
    resetDriverGanttChartState: () => initialState,
  },
});

export const {
  getDriverGanttChartFetch,
  getDriverGanttChartSuccess,
  getDriverGanttChartFailure,
  getDriverGanttChartSummaryFetch,
  getDriverGanttChartSummarySuccess,
  getDriverGanttChartSummaryFailure,
  resetDriverGanttChartState,
} = driverGanttChartState.actions;

export const driverGanttChartActions = driverGanttChartState.actions;
export const driverGanttChartReducer = driverGanttChartState.reducer;
export default driverGanttChartReducer;
