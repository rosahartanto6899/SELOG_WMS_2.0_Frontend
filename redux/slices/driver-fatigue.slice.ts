import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  IDriverFilterData,
  IDriverFilterResponse,
  IFatigueDetailsResponseData,
  IFatigueListResponse,
  IFatigueListResponseData,
  IFatiguePayloadHealthCheck,
  ISummaryPayload,
  ISummaryResponse,
} from "@sera-types/driver-fatigue.type";

import initialState from "../states/driver-fatigue.state";

export const fatigueState = createSlice({
  name: "driverFatigue",
  initialState,
  reducers: {
    getFatigueListFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getFatigueListFetchSuccess: (
      state,
      action: PayloadAction<IFatigueListResponse>,
    ) => {
      state.error = null;
      state.isLoading = false;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data?.list) {
        state.data = data.list.map(
          (r: IFatigueListResponseData, index: number) => {
            const no = (page - 1) * limit + index + 1;
            return { ...r, no };
          },
        );
      }
    },
    getFatigueListFailure: (state, action) => {
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
      action: PayloadAction<ISummaryResponse>,
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
        fatigueSummary: {
          low: 0,
          medium: 0,
          high: 0,
        },
      };
    },
    getFatigueFilterFetch: (state) => {
      state.getFilterOption.error = null;
      state.getFilterOption.isLoading = true;
    },
    getFatigueFilterFetchSuccess: (
      state,
      action: PayloadAction<IDriverFilterResponse[]>,
    ) => {
      state.error = null;
      state.getFilterOption.isLoading = false;
      const tempData: IDriverFilterData[] = [];
      tempData.push({
        label: "Driver Name",
        value: "driverName",
        options: [],
      });
      action.payload.forEach((e) => {
        switch (e.code) {
          case "FATIGUE_STATUSES_RETRIEVED":
            tempData.push({
              label: "Fatigue Level",
              value: "fatigueLevel",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
          case "HEALTH_RESULTS_RETRIEVED":
            tempData.push({
              label: "Health Result",
              value: "healthResult",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
          case "DRIVER_RECOMMENDATIONS_RETRIEVED":
            tempData.push({
              label: "Recommendation",
              value: "recommendation",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
        }
      });
      state.getFilterOption.data = tempData;
    },
    getFatigueFilterFailure: (state, action) => {
      state.getFilterOption.isLoading = false;
      state.getFilterOption.error = { ...action.payload };
      state.getFilterOption.data = [];
    },
    getFatigueDetailsFetch: (state, action: PayloadAction<{ id: string }>) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = true;
      state.getDetails.payload = { ...action.payload };
    },
    getFatigueDetailsSuccess: (
      state,
      action: PayloadAction<IFatigueDetailsResponseData>,
    ) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = false;
      state.getDetails.data = { ...action.payload };
    },
    getFatigueDetailsClear: (state) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = false;
      state.getDetails.data = null;
    },
    getFatigueDetailsFailure: (state, action) => {
      state.getDetails.error = { ...action.payload };
      state.getDetails.isLoading = false;
      state.getDetails.data = null;
    },
    postFatigueDetailsFetch: (
      state,
      action: PayloadAction<{
        payload: IFatiguePayloadHealthCheck;
        callback?: () => void;
      }>,
    ) => {
      state.getDetails.error = null;
      state.isLoading = true;
      state.getDetails.payload = { ...action.payload };
    },
    postFatigueDetailsSuccess: (
      state,
      // action: PayloadAction<IFatiguePayloadHealthCheck>,
    ) => {
      state.getDetails.error = null;
      state.isLoading = false;
      // state.getDetails.payload = { ...action.payload };
    },
    postFatigueDetailsFailure: (state, action) => {
      state.getDetails.error = { ...action.payload };
      state.isLoading = false;
      // state.getDetails.payload = { ...action.payload };
    },
  },
});

export const fatigueActions = fatigueState.actions;
export const fatigueReducers = fatigueState.reducer;
export default fatigueReducers;
