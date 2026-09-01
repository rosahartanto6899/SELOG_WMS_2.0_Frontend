/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/journey-history.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  FilterParams,
  GetJourneyDetailResponse,
  GetJourneyListResponse,
  GetSummaryResponse,
  JourneyDetailParams,
  JourneyList,
} from "@sera-types/journey-history.type";
import { uniqBy } from "lodash";

export const DEFAULT_SEARCH = "shipmentNo";

export const journeyHistoryState = createSlice({
  name: "journeyHistory",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<FilterParams>) => {
      state.getSummary.isLoading = true;
      state.getSummary.error = null;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<GetSummaryResponse>) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = null;
      state.getSummary.data = { ...action?.payload?.data };
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = {};
    },
    getSummaryClear: (state) => {
      state.getSummary = initialState.getSummary;
    },

    getJourneyListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getJourneyList.isLoading = true;
      state.getJourneyList.error = null;
      state.getJourneyList.data = [];
      state.getJourneyList.options = { ...action.payload };
    },
    getJourneyListSuccess: (
      state,
      action: PayloadAction<GetJourneyListResponse>,
    ) => {
      state.getJourneyList.isLoading = false;
      state.getJourneyList.error = null;

      const { data, pagination } = action.payload as GetJourneyListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getJourneyList.data = data?.map(
          (_record: JourneyList, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getJourneyList.options = {
        ...state.getJourneyList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getJourneyListFailure: (state, action) => {
      state.getJourneyList.isLoading = false;
      state.getJourneyList.error = { ...action.payload };
      state.getJourneyList.data = [];
    },
    getJourneyListClear: (state) => {
      state.getJourneyList = initialState.getJourneyList;
    },

    getACJourneyListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACJourneyList.isLoading = true;
      state.getACJourneyList.error = null;
      state.getACJourneyList.data = [];
      state.getACJourneyList.options = { ...action.payload };
    },
    getACJourneyListSuccess: (
      state,
      action: PayloadAction<GetJourneyListResponse>,
    ) => {
      state.getACJourneyList.isLoading = false;
      state.getACJourneyList.error = null;

      const { data, pagination } = action.payload as GetJourneyListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACJourneyList?.options?.searchBy ?? DEFAULT_SEARCH;

      if (state?.getACJourneyList?.options && state?.getACJourneyList?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACJourneyList.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACJourneyList.options = {
          ...state.getACJourneyList.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACJourneyListFailure: (state, action) => {
      state.getACJourneyList.isLoading = false;
      state.getACJourneyList.error = { ...action.payload };
      state.getACJourneyList.data = [];
    },
    getACJourneyListClear: (state) => {
      state.getACJourneyList = initialState.getACJourneyList;
    },

    getJourneyDetailFetch: (
      state,
      action: PayloadAction<JourneyDetailParams>,
    ) => {
      state.getJourneyDetail.isLoading = true;
      state.getJourneyDetail.error = null;
      state.getJourneyDetail.payload = { ...action.payload };
    },
    getJourneyDetailSuccess: (
      state,
      action: PayloadAction<GetJourneyDetailResponse>,
    ) => {
      state.getJourneyDetail.isLoading = false;
      state.getJourneyDetail.error = null;
      state.getJourneyDetail.data = { ...action?.payload?.data };
    },
    getJourneyDetailFailure: (state, action) => {
      state.getJourneyDetail.isLoading = false;
      state.getJourneyDetail.error = { ...action.payload };
      state.getJourneyDetail.data = {};
    },
    getJourneyDetailClear: (state) => {
      state.getJourneyDetail = initialState.getJourneyDetail;
    },
  },
});

export const journeyHistoryActions = journeyHistoryState.actions;
export const journeyHistoryReducer = journeyHistoryState.reducer;
export default journeyHistoryReducer;
