/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/pairing-matching.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  Demands,
  GetCapacityPairedResponse,
  GetDemandsResponse,
  GetPairingHistoryResponse,
  GetSummaryResponse,
  GetUnitDetailResponse,
  GetUnitPositionResponse,
  GetUnpairedDriverResponse,
  GetUnpairedUnitResponse,
  PairingConfirmPayload,
  PairingConfirmResponse,
  PairingHistoryParams,
  PairingProcessPayload,
  PairingProcessResponse,
  UnitDetailParams,
  UnitParams,
  UnitPositionParams,
  UnpairedDriver,
  UnpairedUnit,
} from "@sera-types/pairing-matching";
import { uniqBy } from "lodash";

export const DEFAULT_SEARCH_DEMANDS = "bookingCode";
export const DEFAULT_SEARCH_UNITS = "licensePlate";
export const DEFAULT_SEARCH_DRIVERS = "vkvd";
export const DEFAULT_SEARCH_PAIRED = "shipmentNo";

export const pairingMatchingSlice = createSlice({
  name: "pairingMatching",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<UnitParams>) => {
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

    getUnitPositionFetch: (
      state,
      action: PayloadAction<UnitPositionParams>,
    ) => {
      state.getUnitPosition.isLoading = true;
      state.getUnitPosition.error = null;
      state.getUnitPosition.payload = { ...action.payload };
    },
    getUnitPositionSuccess: (
      state,
      action: PayloadAction<GetUnitPositionResponse>,
    ) => {
      state.getUnitPosition.isLoading = false;
      state.getUnitPosition.error = null;
      state.getUnitPosition.data = action?.payload?.data ?? [];
    },
    getUnitPositionFailure: (state, action) => {
      state.getUnitPosition.isLoading = false;
      state.getUnitPosition.error = { ...action.payload };
      state.getUnitPosition.data = [];
    },
    getUnitPositionClear: (state) => {
      state.getUnitPosition = initialState.getUnitPosition;
    },

    getUnitDetailFetch: (state, action: PayloadAction<UnitDetailParams>) => {
      state.getUnitDetail.isLoading = true;
      state.getUnitDetail.error = null;
      state.getUnitDetail.payload = { ...action.payload };
    },
    getUnitDetailSuccess: (
      state,
      action: PayloadAction<GetUnitDetailResponse>,
    ) => {
      state.getUnitDetail.isLoading = false;
      state.getUnitDetail.error = null;
      state.getUnitDetail.data = { ...action?.payload?.data };
    },
    getUnitDetailFailure: (state, action) => {
      state.getUnitDetail.isLoading = false;
      state.getUnitDetail.error = { ...action.payload };
      state.getUnitDetail.data = {};
    },
    getUnitDetailClear: (state) => {
      state.getUnitDetail = initialState.getUnitDetail;
    },

    getDemandsFetch: (state, action: PayloadAction<BaseType>) => {
      state.getDemands.isLoading = true;
      state.getDemands.error = null;
      state.getDemands.data = [];
      state.getDemands.options = { ...action.payload };
    },
    getDemandsSuccess: (state, action: PayloadAction<GetDemandsResponse>) => {
      state.getDemands.isLoading = false;
      state.getDemands.error = null;

      const { data, pagination } = action.payload as GetDemandsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getDemands.data = data?.map(
          (_record: Demands, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getDemands.options = {
        ...state.getDemands.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getDemandsFailure: (state, action) => {
      state.getDemands.isLoading = false;
      state.getDemands.error = { ...action.payload };
      state.getDemands.data = [];
    },
    getDemandsClear: (state) => {
      state.getDemands = initialState.getDemands;
    },

    getACDemandsFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACDemands.isLoading = true;
      state.getACDemands.error = null;
      state.getACDemands.data = [];
      state.getACDemands.options = { ...action.payload };
    },
    getACDemandsSuccess: (state, action: PayloadAction<GetDemandsResponse>) => {
      state.getACDemands.isLoading = false;
      state.getACDemands.error = null;

      const { data, pagination } = action.payload as GetDemandsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACDemands?.options?.searchBy ?? DEFAULT_SEARCH_DEMANDS;

      if (state?.getACDemands?.options && state?.getACDemands?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACDemands.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACDemands.options = {
          ...state.getACDemands.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACDemandsFailure: (state, action) => {
      state.getACDemands.isLoading = false;
      state.getACDemands.error = { ...action.payload };
      state.getACDemands.data = [];
    },
    getACDemandsClear: (state) => {
      state.getACDemands = initialState.getACDemands;
    },

    getUnpairedUnitFetch: (
      state,
      action: PayloadAction<BaseType & UnitParams>,
    ) => {
      state.getUnpairedUnit.isLoading = true;
      state.getUnpairedUnit.error = null;
      state.getUnpairedUnit.data = [];
      state.getUnpairedUnit.options = { ...action.payload };
    },
    getUnpairedUnitSuccess: (
      state,
      action: PayloadAction<GetUnpairedUnitResponse>,
    ) => {
      state.getUnpairedUnit.isLoading = false;
      state.getUnpairedUnit.error = null;

      const { data, pagination } = action.payload as GetUnpairedUnitResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getUnpairedUnit.data = data?.map(
          (_record: UnpairedUnit, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getUnpairedUnit.options = {
        ...state.getUnpairedUnit.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getUnpairedUnitFailure: (state, action) => {
      state.getUnpairedUnit.isLoading = false;
      state.getUnpairedUnit.error = { ...action.payload };
      state.getUnpairedUnit.data = [];
    },
    getUnpairedUnitClear: (state) => {
      state.getUnpairedUnit = initialState.getUnpairedUnit;
    },

    getACUnpairedUnitFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACUnpairedUnit.isLoading = true;
      state.getACUnpairedUnit.error = null;
      state.getACUnpairedUnit.data = [];
      state.getACUnpairedUnit.options = { ...action.payload };
    },
    getACUnpairedUnitSuccess: (
      state,
      action: PayloadAction<GetUnpairedUnitResponse>,
    ) => {
      state.getACUnpairedUnit.isLoading = false;
      state.getACUnpairedUnit.error = null;

      const { data, pagination } = action.payload as GetDemandsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACUnpairedUnit?.options?.searchBy ?? DEFAULT_SEARCH_UNITS;

      if (state?.getACUnpairedUnit?.options && state?.getACUnpairedUnit?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACUnpairedUnit.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACUnpairedUnit.options = {
          ...state.getACUnpairedUnit.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACUnpairedUnitFailure: (state, action) => {
      state.getACUnpairedUnit.isLoading = false;
      state.getACUnpairedUnit.error = { ...action.payload };
      state.getACUnpairedUnit.data = [];
    },
    getACUnpairedUnitClear: (state) => {
      state.getACUnpairedUnit = initialState.getACUnpairedUnit;
    },

    getUnpairedDriverFetch: (
      state,
      action: PayloadAction<BaseType & UnitParams>,
    ) => {
      state.getUnpairedDriver.isLoading = true;
      state.getUnpairedDriver.error = null;
      state.getUnpairedDriver.data = [];
      state.getUnpairedDriver.options = { ...action.payload };
    },
    getUnpairedDriverSuccess: (
      state,
      action: PayloadAction<GetUnpairedDriverResponse>,
    ) => {
      state.getUnpairedDriver.isLoading = false;
      state.getUnpairedDriver.error = null;

      const { data, pagination } = action.payload as GetUnpairedDriverResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getUnpairedDriver.data = data?.map(
          (_record: UnpairedDriver, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getUnpairedDriver.options = {
        ...state.getUnpairedDriver.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getUnpairedDriverFailure: (state, action) => {
      state.getUnpairedDriver.isLoading = false;
      state.getUnpairedDriver.error = { ...action.payload };
      state.getUnpairedDriver.data = [];
    },
    getUnpairedDriverClear: (state) => {
      state.getUnpairedDriver = initialState.getUnpairedDriver;
    },

    getACUnpairedDriverFetch: (
      state,
      action: PayloadAction<BaseType & UnitParams>,
    ) => {
      state.getACUnpairedDriver.isLoading = true;
      state.getACUnpairedDriver.error = null;
      state.getACUnpairedDriver.data = [];
      state.getACUnpairedDriver.options = { ...action.payload };
    },
    getACUnpairedDriverSuccess: (
      state,
      action: PayloadAction<GetUnpairedDriverResponse>,
    ) => {
      state.getACUnpairedDriver.isLoading = false;
      state.getACUnpairedDriver.error = null;

      const { data, pagination } = action.payload as GetUnpairedDriverResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACUnpairedDriver?.options?.searchBy ?? DEFAULT_SEARCH_DRIVERS;

      if (
        state?.getACUnpairedDriver?.options &&
        state?.getACUnpairedDriver?.data
      ) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACUnpairedDriver.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACUnpairedDriver.options = {
          ...state.getACUnpairedDriver.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACUnpairedDriverFailure: (state, action) => {
      state.getACUnpairedDriver.isLoading = false;
      state.getACUnpairedDriver.error = { ...action.payload };
      state.getACUnpairedDriver.data = [];
    },
    getACUnpairedDriverClear: (state) => {
      state.getACUnpairedDriver = initialState.getACUnpairedDriver;
    },

    pairingProcessFetch: (
      state,
      action: PayloadAction<PairingProcessPayload>,
    ) => {
      state.pairingProcess.isLoading = true;
      state.pairingProcess.error = null;
      state.pairingProcess.payload = { ...action.payload };
    },
    pairingProcessSuccess: (
      state,
      action: PayloadAction<PairingProcessResponse>,
    ) => {
      state.pairingProcess.isLoading = false;
      state.pairingProcess.error = null;
      state.pairingProcess.data = action?.payload?.data ?? {};
    },
    pairingProcessFailure: (state, action) => {
      state.pairingProcess.isLoading = false;
      state.pairingProcess.error = { ...action.payload };
      state.pairingProcess.data = {};
    },
    pairingProcessClear: (state) => {
      state.pairingProcess = initialState.pairingProcess;
    },

    getCapacityPairedFetch: (state, action: PayloadAction<BaseType>) => {
      state.getCapacityPaired.isLoading = true;
      state.getCapacityPaired.error = null;
      state.getCapacityPaired.data = [];
      state.getCapacityPaired.options = { ...action.payload };
    },
    getCapacityPairedSuccess: (
      state,
      action: PayloadAction<GetCapacityPairedResponse>,
    ) => {
      state.getCapacityPaired.isLoading = false;
      state.getCapacityPaired.error = null;

      const { data, pagination } = action.payload as GetCapacityPairedResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getCapacityPaired.data = data?.map(
          (_record: Demands, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getCapacityPaired.options = {
        ...state.getCapacityPaired.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getCapacityPairedFailure: (state, action) => {
      state.getCapacityPaired.isLoading = false;
      state.getCapacityPaired.error = { ...action.payload };
      state.getCapacityPaired.data = [];
    },
    getCapacityPairedClear: (state) => {
      state.getCapacityPaired = initialState.getCapacityPaired;
    },

    getACCapacityPairedFetch: (
      state,
      action: PayloadAction<BaseType & UnitParams>,
    ) => {
      state.getACCapacityPaired.isLoading = true;
      state.getACCapacityPaired.error = null;
      state.getACCapacityPaired.data = [];
      state.getACCapacityPaired.options = { ...action.payload };
    },
    getACCapacityPairedSuccess: (
      state,
      action: PayloadAction<GetCapacityPairedResponse>,
    ) => {
      state.getACCapacityPaired.isLoading = false;
      state.getACCapacityPaired.error = null;

      const { data, pagination } = action.payload as GetCapacityPairedResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACCapacityPaired?.options?.searchBy ?? DEFAULT_SEARCH_PAIRED;

      if (
        state?.getACCapacityPaired?.options &&
        state?.getACCapacityPaired?.data
      ) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACCapacityPaired.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACCapacityPaired.options = {
          ...state.getACCapacityPaired.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACCapacityPairedFailure: (state, action) => {
      state.getACCapacityPaired.isLoading = false;
      state.getACCapacityPaired.error = { ...action.payload };
      state.getACCapacityPaired.data = [];
    },
    getACCapacityPairedClear: (state) => {
      state.getACCapacityPaired = initialState.getACCapacityPaired;
    },

    pairingConfirmFetch: (
      state,
      action: PayloadAction<PairingConfirmPayload>,
    ) => {
      state.pairingConfirm.isLoading = true;
      state.pairingConfirm.error = null;
      state.pairingConfirm.payload = { ...action.payload };
    },
    pairingConfirmSuccess: (
      state,
      action: PayloadAction<PairingConfirmResponse>,
    ) => {
      state.pairingConfirm.isLoading = false;
      state.pairingConfirm.error = null;
      state.pairingConfirm.data = action?.payload?.data ?? {};
    },
    pairingConfirmFailure: (state, action) => {
      state.pairingConfirm.isLoading = false;
      state.pairingConfirm.error = { ...action.payload };
      state.pairingConfirm.data = {};
    },
    pairingConfirmClear: (state) => {
      state.pairingConfirm = initialState.pairingConfirm;
    },

    getPairingHistoryFetch: (
      state,
      action: PayloadAction<PairingHistoryParams>,
    ) => {
      state.getPairingHistory.isLoading = true;
      state.getPairingHistory.error = null;
      state.getPairingHistory.payload = { ...action.payload };
    },
    getPairingHistorySuccess: (
      state,
      action: PayloadAction<GetPairingHistoryResponse>,
    ) => {
      state.getPairingHistory.isLoading = false;
      state.getPairingHistory.error = null;
      state.getPairingHistory.data = { ...action?.payload?.data };
    },
    getPairingHistoryFailure: (state, action) => {
      state.getPairingHistory.isLoading = false;
      state.getPairingHistory.error = { ...action.payload };
      state.getPairingHistory.data = {};
    },
    getPairingHistoryClear: (state) => {
      state.getPairingHistory = initialState.getPairingHistory;
    },
  },
});

export const pairingMatchingActions = pairingMatchingSlice.actions;
export const pairingMatchingReducers = pairingMatchingSlice.reducer;
export default pairingMatchingReducers;
