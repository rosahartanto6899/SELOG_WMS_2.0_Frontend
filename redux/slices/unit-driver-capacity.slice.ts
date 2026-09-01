import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/unit-driver-capacity.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DriverCapacityForecastPayload,
  GetCapacityStatusResponse,
  GetDriverCapacityDetailResponse,
  GetDriverCapacityForecastResponse,
  GetDriverCapacityResponse,
  GetDriverCapacitySummaryResponse,
  GetEmployeeStatusResponse,
  GetUnitCapacityDetailResponse,
  GetUnitCapacityForecastResponse,
  GetUnitCapacityResponse,
  GetUnitCapacitySummaryResponse,
  UnitCapacityForecastPayload,
  UnitDriverSummaryPayload,
} from "@sera-types/unit-driver-capacity.type";
import { uniqBy } from "lodash";

export const unitDriverCapacityState = createSlice({
  name: "unitDriverCapacity",
  initialState,
  reducers: {
    getUnitCapacityFetch: (state, action: PayloadAction<BaseType>) => {
      state.unitCapacity.isLoading = true;
      state.unitCapacity.error = null;
      state.unitCapacity.options = {
        ...state.unitCapacity.options,
        ...action.payload,
      };
    },
    getUnitCapacitySuccess: (
      state,
      action: PayloadAction<GetUnitCapacityResponse>,
    ) => {
      state.unitCapacity.isLoading = false;
      state.unitCapacity.error = null;
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.unitCapacity.options = {
        ...state.unitCapacity.options,
        page,
        limit,
        totalData,
        totalPage,
      };

      if (data) {
        state.unitCapacity.data = data.map((r, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
    },
    getUnitCapacityFailure: (state, action) => {
      state.unitCapacity.isLoading = false;
      state.unitCapacity.error = { ...action.payload };
    },
    getUnitCapacityClear: (state) => {
      state.unitCapacity.data = initialState.unitCapacity.data;
      state.unitCapacity.options = initialState.unitCapacity.options;
    },
    getUnitCapacityAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.unitCapacity.autoComplete.isLoading = true;
      state.unitCapacity.autoComplete.error = null;
      state.unitCapacity.autoComplete.data = [];
      state.unitCapacity.autoComplete.options = { ...action.payload };
    },
    getUnitCapacityAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetUnitCapacityResponse>,
    ) => {
      state.unitCapacity.autoComplete.isLoading = false;
      state.unitCapacity.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = (state?.unitCapacity?.autoComplete?.options?.searchBy ??
        "") as any;

      if (
        state?.unitCapacity?.autoComplete?.options &&
        state?.unitCapacity?.autoComplete?.data &&
        data
      ) {
        const _uniqueData = uniqBy(data, searchBy);

        state.unitCapacity.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.unitCapacity.autoComplete.options = {
          ...state.unitCapacity.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getUnitCapacityAutoCompleteFailure: (state, action) => {
      state.unitCapacity.autoComplete.isLoading = false;
      state.unitCapacity.autoComplete.error = { ...action.payload };
    },
    getUnitCapacityAutoCompleteClear: (state) => {
      state.unitCapacity.autoComplete = initialState.unitCapacity.autoComplete;
    },
    getDriverCapacityFetch: (state, action: PayloadAction<BaseType>) => {
      state.driverCapacity.isLoading = true;
      state.driverCapacity.error = null;
      state.driverCapacity.options = {
        ...state.driverCapacity.options,
        ...action.payload,
      };
    },
    getDriverCapacitySuccess: (
      state,
      action: PayloadAction<GetDriverCapacityResponse>,
    ) => {
      state.driverCapacity.isLoading = false;
      state.driverCapacity.error = null;
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.driverCapacity.options = {
        ...state.driverCapacity.options,
        page,
        limit,
        totalData,
        totalPage,
      };

      if (data) {
        state.driverCapacity.data = data.map((r, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
    },
    getDriverCapacityFailure: (state, action) => {
      state.driverCapacity.isLoading = false;
      state.driverCapacity.error = { ...action.payload };
    },
    getDriverCapacityClear: (state) => {
      state.driverCapacity.data = initialState.driverCapacity.data;
      state.driverCapacity.options = initialState.driverCapacity.options;
    },
    getDriverCapacityAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.driverCapacity.autoComplete.isLoading = true;
      state.driverCapacity.autoComplete.error = null;
      state.driverCapacity.autoComplete.data = [];
      state.driverCapacity.autoComplete.options = { ...action.payload };
    },
    getDriverCapacityAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetDriverCapacityResponse>,
    ) => {
      state.driverCapacity.autoComplete.isLoading = false;
      state.driverCapacity.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = (state?.driverCapacity?.autoComplete?.options
        ?.searchBy ?? "") as any;

      if (
        state?.driverCapacity?.autoComplete?.options &&
        state?.driverCapacity?.autoComplete?.data &&
        data
      ) {
        const _uniqueData = uniqBy(data, searchBy);

        state.driverCapacity.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.driverCapacity.autoComplete.options = {
          ...state.driverCapacity.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getDriverCapacityAutoCompleteFailure: (state, action) => {
      state.driverCapacity.autoComplete.isLoading = false;
      state.driverCapacity.autoComplete.error = { ...action.payload };
    },
    getDriverCapacityAutoCompleteClear: (state) => {
      state.driverCapacity.autoComplete =
        initialState.driverCapacity.autoComplete;
    },
    getUnitCapacitySummaryFetch: (
      state,
      action: PayloadAction<UnitDriverSummaryPayload>,
    ) => {
      state.unitCapacity.summary.isLoading = true;
      state.unitCapacity.summary.error = null;
      state.unitCapacity.summary.payload = action.payload;
    },
    getUnitCapacitySummarySuccess: (
      state,
      action: PayloadAction<GetUnitCapacitySummaryResponse>,
    ) => {
      state.unitCapacity.summary.isLoading = false;
      state.unitCapacity.summary.error = null;
      if (action.payload.data) {
        state.unitCapacity.summary.data = action.payload.data;
      }
    },
    getUnitCapacitySummaryFailure: (state, action) => {
      state.unitCapacity.summary.isLoading = false;
      state.unitCapacity.summary.error = { ...action.payload };
    },
    getUnitCapacitySummaryClear: (state) => {
      state.unitCapacity.summary = initialState.unitCapacity.summary;
    },
    getDriverCapacitySummaryFetch: (
      state,
      action: PayloadAction<UnitDriverSummaryPayload>,
    ) => {
      state.driverCapacity.summary.isLoading = true;
      state.driverCapacity.summary.error = null;
      state.driverCapacity.summary.payload = action.payload;
    },
    getDriverCapacitySummarySuccess: (
      state,
      action: PayloadAction<GetDriverCapacitySummaryResponse>,
    ) => {
      state.driverCapacity.summary.isLoading = false;
      state.driverCapacity.summary.error = null;
      if (action.payload.data) {
        state.driverCapacity.summary.data = action.payload.data;
      }
    },
    getDriverCapacitySummaryFailure: (state, action) => {
      state.driverCapacity.summary.isLoading = false;
      state.driverCapacity.summary.error = { ...action.payload };
    },
    getDriverCapacitySummaryClear: (state) => {
      state.driverCapacity.summary = initialState.driverCapacity.summary;
    },
    getUnitCapacityForecastFetch: (
      state,
      action: PayloadAction<UnitCapacityForecastPayload>,
    ) => {
      state.unitCapacity.forecast.isLoading = true;
      state.unitCapacity.forecast.error = null;
      state.unitCapacity.forecast.payload = action.payload;
    },
    getUnitCapacityForecastSuccess: (
      state,
      action: PayloadAction<GetUnitCapacityForecastResponse>,
    ) => {
      state.unitCapacity.forecast.isLoading = false;
      state.unitCapacity.forecast.error = null;
      if (action.payload.data) {
        state.unitCapacity.forecast.data = action.payload.data;
      }
    },
    getUnitCapacityForecastFailure: (state, action) => {
      state.unitCapacity.forecast.isLoading = false;
      state.unitCapacity.forecast.error = { ...action.payload };
    },
    getUnitCapacityForecastClear: (state) => {
      state.unitCapacity.forecast = initialState.unitCapacity.forecast;
    },
    getDriverCapacityForecastFetch: (
      state,
      action: PayloadAction<DriverCapacityForecastPayload>,
    ) => {
      state.driverCapacity.forecast.isLoading = true;
      state.driverCapacity.forecast.error = null;
      state.driverCapacity.forecast.payload = action.payload;
    },
    getDriverCapacityForecastSuccess: (
      state,
      action: PayloadAction<GetDriverCapacityForecastResponse>,
    ) => {
      state.driverCapacity.forecast.isLoading = false;
      state.driverCapacity.forecast.error = null;
      if (action.payload.data) {
        state.driverCapacity.forecast.data = action.payload.data;
      }
    },
    getDriverCapacityForecastFailure: (state, action) => {
      state.driverCapacity.forecast.isLoading = false;
      state.driverCapacity.forecast.error = { ...action.payload };
    },
    getDriverCapacityForecastClear: (state) => {
      state.driverCapacity.forecast = initialState.driverCapacity.forecast;
    },
    getUnitCapacityStatusesFetch: (state) => {
      state.unitCapacity.capacityStatuses.isLoading = true;
      state.unitCapacity.capacityStatuses.error = null;
    },
    getUnitCapacityStatusesSuccess: (
      state,
      action: PayloadAction<GetCapacityStatusResponse>,
    ) => {
      state.unitCapacity.capacityStatuses.isLoading = false;
      state.unitCapacity.capacityStatuses.error = null;
      if (action.payload.data) {
        state.unitCapacity.capacityStatuses.data = action.payload.data;
      }
    },
    getUnitCapacityStatusesFailure: (state, action) => {
      state.unitCapacity.capacityStatuses.isLoading = false;
      state.unitCapacity.capacityStatuses.error = { ...action.payload };
    },
    getUnitCapacityStatusesClear: (state) => {
      state.unitCapacity.capacityStatuses =
        initialState.unitCapacity.capacityStatuses;
    },
    getDriverCapacityStatusesFetch: (state) => {
      state.driverCapacity.capacityStatuses.isLoading = true;
      state.driverCapacity.capacityStatuses.error = null;
    },
    getDriverCapacityStatusesSuccess: (
      state,
      action: PayloadAction<GetCapacityStatusResponse>,
    ) => {
      state.driverCapacity.capacityStatuses.isLoading = false;
      state.driverCapacity.capacityStatuses.error = null;
      if (action.payload.data) {
        state.driverCapacity.capacityStatuses.data = action.payload.data;
      }
    },
    getDriverCapacityStatusesFailure: (state, action) => {
      state.driverCapacity.capacityStatuses.isLoading = false;
      state.driverCapacity.capacityStatuses.error = { ...action.payload };
    },
    getDriverCapacityStatusesClear: (state) => {
      state.driverCapacity.capacityStatuses =
        initialState.driverCapacity.capacityStatuses;
    },
    getUnitCapacityDetailFetch: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      state.unitCapacity.detail.isLoading = true;
      state.unitCapacity.detail.error = null;
      state.unitCapacity.detail.payload = action.payload;
    },
    getUnitCapacityDetailSuccess: (
      state,
      action: PayloadAction<GetUnitCapacityDetailResponse>,
    ) => {
      state.unitCapacity.detail.isLoading = false;
      state.unitCapacity.detail.error = null;
      if (action.payload.data) {
        state.unitCapacity.detail.data = action.payload.data;
      }
    },
    getUnitCapacityDetailFailure: (state, action) => {
      state.unitCapacity.detail.isLoading = false;
      state.unitCapacity.detail.error = { ...action.payload };
    },
    getUnitCapacityDetailClear: (state) => {
      state.unitCapacity.detail = initialState.unitCapacity.detail;
    },
    getDriverCapacityDetailFetch: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      state.driverCapacity.detail.isLoading = true;
      state.driverCapacity.detail.error = null;
      state.driverCapacity.detail.payload = action.payload;
    },
    getDriverCapacityDetailSuccess: (
      state,
      action: PayloadAction<GetDriverCapacityDetailResponse>,
    ) => {
      state.driverCapacity.detail.isLoading = false;
      state.driverCapacity.detail.error = null;
      if (action.payload.data) {
        state.driverCapacity.detail.data = action.payload.data;
      }
    },
    getDriverCapacityDetailFailure: (state, action) => {
      state.driverCapacity.detail.isLoading = false;
      state.driverCapacity.detail.error = { ...action.payload };
    },
    getDriverCapacityDetailClear: (state) => {
      state.driverCapacity.detail = initialState.driverCapacity.detail;
    },
    getEmployeeStatusesFetch: (state) => {
      state.driverCapacity.employeeStatuses.isLoading = true;
      state.driverCapacity.employeeStatuses.error = null;
    },
    getEmployeeStatusesSuccess: (
      state,
      action: PayloadAction<GetEmployeeStatusResponse>,
    ) => {
      state.driverCapacity.employeeStatuses.isLoading = false;
      state.driverCapacity.employeeStatuses.error = null;
      if (action.payload.data) {
        state.driverCapacity.employeeStatuses.data = action.payload.data;
      }
    },
    getEmployeeStatusesFailure: (state, action) => {
      state.driverCapacity.employeeStatuses.isLoading = false;
      state.driverCapacity.employeeStatuses.error = { ...action.payload };
    },
    getEmployeeStatusesClear: (state) => {
      state.driverCapacity.employeeStatuses =
        initialState.driverCapacity.employeeStatuses;
    },
  },
});

export const unitDriverCapacityActions = unitDriverCapacityState.actions;
export const unitDriverCapacityReducer = unitDriverCapacityState.reducer;
export default unitDriverCapacityReducer;
