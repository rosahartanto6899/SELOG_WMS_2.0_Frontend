/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/stock-management.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DetailVehiclePayload,
  GetStockPayload,
  GetStockResponse,
  GetStockStatusResponse,
  GetSummaryResponse,
  GetVehicleDetailResponse,
  StockManagement,
  StockManagementState,
  UpdateVehiclePayload,
  VehiclePayload,
} from "@sera-types/stock-management.type";
import { LastLocation } from "@sera-types/unit-activity";
import { uniqBy } from "lodash";

export const stockManagementSlice = createSlice({
  name: "stockManagement",
  initialState,
  reducers: {
    getStockFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getStockSuccess: (
      state: StockManagementState,
      action: PayloadAction<GetStockResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetStockResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      state.options = { ...state.options, page, limit, totalData, totalPage };

      if (data) {
        state.data = data.map((r: StockManagement, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
    },
    getStockInlineSuccess: (
      state: StockManagementState,
      action: PayloadAction<LastLocation>,
    ) => {
      state.data = state.data?.map((_data) => {
        if (_data?.vin === action?.payload?.vin) {
          return { ..._data, ...action?.payload };
        }

        return _data;
      });
    },
    getStockFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },
    getStockClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = [];
      state.options = initialState.options;
    },

    getStockAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getStockAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetStockResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetStockResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
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
    getStockAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getStockAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getSummaryFetch: (state, action: PayloadAction<GetStockPayload>) => {
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

    createVehicleFetch: (state, action: PayloadAction<VehiclePayload>) => {
      state.createVehicle.isLoading = true;
      state.createVehicle.error = null;
      state.createVehicle.payload = { ...action?.payload };
    },
    createVehicleSuccess: (state, action: PayloadAction<VehiclePayload>) => {
      state.createVehicle.isLoading = false;
      state.createVehicle.error = null;
      state.createVehicle.data = action.payload;
    },
    createVehicleFailure: (state, action) => {
      state.createVehicle.isLoading = false;
      state.createVehicle.error = { ...action.payload };
      state.createVehicle.data = {};
    },
    createVehicleClear: (state) => {
      state.createVehicle = initialState.createVehicle;
    },

    detailVehicleFetch: (
      state,
      action: PayloadAction<DetailVehiclePayload>,
    ) => {
      state.detailVehicle.isLoading = true;
      state.detailVehicle.error = null;
      state.detailVehicle.payload = { ...action?.payload };
    },
    detailVehicleSuccess: (
      state,
      action: PayloadAction<GetVehicleDetailResponse>,
    ) => {
      state.detailVehicle.isLoading = false;
      state.detailVehicle.error = null;
      state.detailVehicle.data = { ...action?.payload?.data };
    },
    detailVehicleFailure: (state, action) => {
      state.detailVehicle.isLoading = false;
      state.detailVehicle.error = { ...action.payload };
      state.detailVehicle.data = {};
    },
    detailVehicleClear: (state) => {
      state.detailVehicle = initialState.detailVehicle;
    },

    updateVehicleFetch: (
      state,
      action: PayloadAction<UpdateVehiclePayload>,
    ) => {
      state.updateVehicle.isLoading = true;
      state.updateVehicle.error = null;
      state.updateVehicle.payload = { ...action?.payload };
    },
    updateVehicleSuccess: (
      state,
      action: PayloadAction<UpdateVehiclePayload>,
    ) => {
      state.updateVehicle.isLoading = false;
      state.updateVehicle.error = null;
      state.updateVehicle.data = action.payload;
    },
    updateVehicleFailure: (state, action) => {
      state.updateVehicle.isLoading = false;
      state.updateVehicle.error = { ...action.payload };
      state.updateVehicle.data = {};
    },
    updateVehicleClear: (state) => {
      state.updateVehicle = initialState.updateVehicle;
    },

    upsertVehicleFetch: (state, action: PayloadAction<VehiclePayload>) => {
      state.upsertVehicle.isLoading = true;
      state.upsertVehicle.error = null;
      state.upsertVehicle.payload = { ...action?.payload };
    },
    upsertVehicleSuccess: (state, action: PayloadAction<VehiclePayload>) => {
      state.upsertVehicle.isLoading = false;
      state.upsertVehicle.error = null;
      state.upsertVehicle.data = action.payload;
    },
    upsertVehicleFailure: (state, action) => {
      state.upsertVehicle.isLoading = false;
      state.upsertVehicle.error = { ...action.payload };
      state.upsertVehicle.data = {};
    },
    upsertVehicleClear: (state) => {
      state.upsertVehicle = initialState.upsertVehicle;
    },

    downloadTemplateFetch: (state) => {
      state.downloadTemplate.isLoading = true;
      state.downloadTemplate.error = null;
      state.downloadTemplate.payload = null;
    },
    downloadTemplateSuccess: (state) => {
      state.downloadTemplate.isLoading = false;
      state.downloadTemplate.error = null;
      state.downloadTemplate.payload = null;
    },
    downloadTemplateFailure: (state, action) => {
      state.downloadTemplate.isLoading = false;
      state.downloadTemplate.error = { ...action.payload };
      state.downloadTemplate.data = null;
    },
    downloadTemplateClear: (state) => {
      state.downloadTemplate = initialState.downloadTemplate;
    },

    stockStatusFetch: (state) => {
      state.stockStatus.isLoading = true;
      state.stockStatus.error = null;
    },
    stockStatusSuccess: (
      state,
      action: PayloadAction<GetStockStatusResponse>,
    ) => {
      state.stockStatus.isLoading = false;
      state.stockStatus.error = null;
      state.stockStatus.data = action?.payload?.data ?? [];
    },
    stockStatusFailure: (state, action) => {
      state.stockStatus.isLoading = false;
      state.stockStatus.error = { ...action.payload };
      state.stockStatus.data = [];
    },
    stockStatusClear: (state) => {
      state.stockStatus = initialState.stockStatus;
    },
  },
});

export const stockManagementActions = stockManagementSlice.actions;
export const stockManagementReducers = stockManagementSlice.reducer;
export default stockManagementReducers;
