/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/tracing-tracking.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DetailParams,
  GetDetailsResponseData,
  GetListResponse,
  Summary,
  UnitList,
  UnitParams,
} from "@sera-types/tracking-tracking.type";

export const tracingTrackingSlice = createSlice({
  name: "tracingTracking",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<UnitParams>) => {
      state.getSummary.error = null;
      state.getSummary.isLoading = true;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<Summary>) => {
      state.getSummary.isLoading = false;
      state.getSummary.data = action.payload;
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.error = { ...action.payload };
      state.getSummary.isLoading = false;
    },

    getListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getList.error = null;
      state.getList.isLoading = true;
      state.getList.data = [];
      state.getList.options = { ...action.payload };
    },
    getListSuccess: (state, action: PayloadAction<GetListResponse>) => {
      state.getList.isLoading = false;
      const { data, pagination } = action.payload as GetListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getList.data = data?.map((_record: UnitList, _index: number) => {
          const no = (page - 1) * limit + _index + 1;
          return { ..._record, no };
        });
      }

      state.getList.options = {
        ...state.getList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getListFailure: (state, action) => {
      state.getList.error = { ...action.payload };
      state.getList.isLoading = false;
    },

    getDetailsFetch: (state, action: PayloadAction<DetailParams>) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = true;
      state.getDetails.payload = { ...action.payload };
    },
    getDetailsSuccess: (
      state,
      action: PayloadAction<GetDetailsResponseData>,
    ) => {
      state.getDetails.isLoading = false;
      state.getDetails.data =
        action.payload.data ?? initialState.getDetails.data;
    },
    getDetailsFailure: (state, action) => {
      state.getDetails.error = { ...action.payload };
      state.getDetails.isLoading = false;
      state.getDetails.data = initialState.getDetails.data;
    },
    clearDetailsData: (state) => {
      state.getDetails.data = initialState.getDetails.data;
    },
  },
});

export const tracingTrackingActions = tracingTrackingSlice.actions;
export const shipmentTypesReducers = tracingTrackingSlice.reducer;
export default shipmentTypesReducers;
