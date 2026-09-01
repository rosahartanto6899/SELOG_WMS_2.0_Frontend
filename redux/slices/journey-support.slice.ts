import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/journey-support.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetJourneySupportDetailResponse,
  GetJourneySupportListResponse,
  GetJourneySupportSummaryResponse,
  GetUpdateActivitySkywardResponse,
  JourneySupportDetailPayload,
  JourneySupportRecord,
  JourneySupportSummaryPayload,
  UpdateJourneyActivitySkywardPayload,
  UpdateJourneySupportActivtyPayload,
} from "@sera-types/journey-support.type";
import { uniqBy } from "lodash";

export const journeySupportSlice = createSlice({
  name: "journeySupport",
  initialState,
  reducers: {
    getJourneySupportFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getJourneySupportSuccess: (
      state,
      action: PayloadAction<GetJourneySupportListResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: JourneySupportRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getJourneySupportFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getJourneySupportClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
    getJourneySupportAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getJourneySupportAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetJourneySupportListResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      let searchBy = (state?.autoComplete?.options?.searchBy ?? "") as any;

      if (searchBy === "shipmentNo") {
        searchBy = "shipmentNumber";
      }

      if (state?.autoComplete?.options && state?.autoComplete?.data && data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _uniqueData.map((item: any) => ({
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
    getJourneySupportAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getJourneySupportAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getSummaryJourneySupportFetch: (
      state,
      action: PayloadAction<JourneySupportSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = { ...action.payload };
    },
    getSummaryJourneySupportSuccess: (
      state,
      action: PayloadAction<GetJourneySupportSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      if (action.payload.data) {
        state.summary.data = action.payload.data;
      }
    },
    getSummaryJourneySupportFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = action.payload;
    },
    getSummaryJourneySupportClear: (state) => {
      state.summary = initialState.summary;
    },
    getDetailJourneySupportFetch: (
      state,
      action: PayloadAction<JourneySupportDetailPayload>,
    ) => {
      state.detail.isLoading = true;
      state.detail.error = null;
      state.detail.payload = { ...action.payload };
    },
    getDetailJourneySupportSuccess: (
      state,
      action: PayloadAction<GetJourneySupportDetailResponse>,
    ) => {
      state.detail.isLoading = false;
      if (action.payload.data) {
        state.detail.data = action.payload.data;
      }
    },
    getDetailJourneySupportFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = action.payload;
    },
    getDetailJourneySupportClear: (state) => {
      state.detail = initialState.detail;
    },
    updateActivityFetch: (
      state,
      action: PayloadAction<UpdateJourneySupportActivtyPayload>,
    ) => {
      state.updateActivity.isLoading = true;
      state.updateActivity.error = null;
      state.updateActivity.payload = { ...action.payload };
    },
    updateActivitySuccess: (
      state,
      action: PayloadAction<GetJourneySupportDetailResponse>,
    ) => {
      state.updateActivity.isLoading = false;
      if (action.payload.data) {
        state.updateActivity.data = action.payload.data;
      }
    },
    updateActivityFailure: (state, action) => {
      state.updateActivity.isLoading = false;
      state.updateActivity.error = action.payload;
    },
    updateActivityClear: (state) => {
      state.updateActivity = initialState.updateActivity;
    },
    updateActivitySkywardFetch: (
      state,
      action: PayloadAction<UpdateJourneyActivitySkywardPayload>,
    ) => {
      state.updateActivitySkyward.isLoading = true;
      state.updateActivitySkyward.error = null;
      state.updateActivitySkyward.payload = { ...action.payload };
    },
    updateActivitySkywardSuccess: (
      state,
      action: PayloadAction<GetUpdateActivitySkywardResponse>,
    ) => {
      state.updateActivitySkyward.isLoading = false;
      if (action.payload.data) {
        state.updateActivitySkyward.data = action.payload.data;
      }
    },
    updateActivitySkywardFailure: (state, action) => {
      state.updateActivitySkyward.isLoading = false;
      state.updateActivitySkyward.error = action.payload;
    },
    updateActivitySkywardClear: (state) => {
      state.updateActivitySkyward = initialState.updateActivitySkyward;
    },
  },
});

export const journeySupportReducer = journeySupportSlice.reducer;
export const journeySupportActions = journeySupportSlice.actions;
