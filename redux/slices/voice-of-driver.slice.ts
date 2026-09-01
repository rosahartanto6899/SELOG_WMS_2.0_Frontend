/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/voice-of-driver.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateVoDPayload,
  CreateVoDResponse,
  DetailVoDPayload,
  GetDetailVoDResponse,
  GetShipmentResponse,
  GetSummaryResponse,
  GetVoDListResponse,
  ListParams,
  ShipmentList,
  UpdateVoDPayload,
  VoDList,
} from "@sera-types/voice-of-driver.type";
import { uniqBy } from "lodash";

export const DEFAULT_SEARCH = "ticketNumber";

export const vodState = createSlice({
  name: "vod",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<ListParams>) => {
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

    getVoDListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getVoDList.isLoading = true;
      state.getVoDList.error = null;
      state.getVoDList.data = [];
      state.getVoDList.options = { ...action.payload };
    },
    getVoDListSuccess: (state, action: PayloadAction<GetVoDListResponse>) => {
      state.getVoDList.isLoading = false;
      state.getVoDList.error = null;

      const { data, pagination } = action.payload as GetVoDListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getVoDList.data = data?.map(
          (_record: VoDList, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getVoDList.options = {
        ...state.getVoDList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getVoDListFailure: (state, action) => {
      state.getVoDList.isLoading = false;
      state.getVoDList.error = { ...action.payload };
      state.getVoDList.data = [];
    },
    getVoDListClear: (state) => {
      state.getVoDList = initialState.getVoDList;
    },

    getACVoDListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACVoDList.isLoading = true;
      state.getACVoDList.error = null;
      state.getACVoDList.data = [];
      state.getACVoDList.options = { ...action.payload };
    },
    getACVoDListSuccess: (state, action: PayloadAction<GetVoDListResponse>) => {
      state.getACVoDList.isLoading = false;
      state.getACVoDList.error = null;

      const { data, pagination } = action.payload as GetVoDListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.getACVoDList?.options?.searchBy ?? DEFAULT_SEARCH;

      if (state?.getACVoDList?.options && state?.getACVoDList?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACVoDList.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACVoDList.options = {
          ...state.getACVoDList.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACVoDListFailure: (state, action) => {
      state.getACVoDList.isLoading = false;
      state.getACVoDList.error = { ...action.payload };
      state.getACVoDList.data = [];
    },
    getACVoDListClear: (state) => {
      state.getACVoDList = initialState.getACVoDList;
    },

    getShipmentFetch: (
      state,
      action: PayloadAction<BaseType & { filter?: string }>,
    ) => {
      state.getShipment.isLoading = true;
      state.getShipment.error = null;
      state.getShipment.data = [];
      state.getShipment.options = { ...action.payload };
    },
    getShipmentSuccess: (state, action: PayloadAction<GetShipmentResponse>) => {
      state.getShipment.isLoading = false;
      state.getShipment.error = null;

      const { data, pagination } = action.payload as GetShipmentResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getShipment.data = data?.map(
          (_record: ShipmentList, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getShipment.options = {
        ...state.getShipment.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getShipmentFailure: (state, action) => {
      state.getShipment.isLoading = false;
      state.getShipment.error = { ...action.payload };
      state.getShipment.data = [];
    },
    getShipmentClear: (state) => {
      state.getShipment = initialState.getShipment;
    },

    createVoDFetch: (state, action: PayloadAction<CreateVoDPayload>) => {
      state.createVoD.isLoading = true;
      state.createVoD.error = null;
      state.createVoD.payload = { ...action.payload };
    },
    createVoDSuccess: (state, action: PayloadAction<CreateVoDResponse>) => {
      state.createVoD.isLoading = false;
      state.createVoD.error = null;

      if (action.payload.data) {
        state.createVoD.data = action.payload.data;
      }
    },
    createVoDFailure: (state, action) => {
      state.createVoD.isLoading = false;
      state.createVoD.error = { ...action.payload };
      state.createVoD.data = {};
    },
    createVoDClear: (state) => {
      state.createVoD = initialState.createVoD;
    },

    detailVoDFetch: (state, action: PayloadAction<DetailVoDPayload>) => {
      state.detailVoD.isLoading = true;
      state.detailVoD.error = null;
      state.detailVoD.payload = { ...action.payload };
    },
    detailVoDSuccess: (state, action: PayloadAction<GetDetailVoDResponse>) => {
      state.detailVoD.isLoading = false;
      state.detailVoD.error = null;

      if (action.payload.data) {
        state.detailVoD.data = action.payload.data;
      }
    },
    detailVoDFailure: (state, action) => {
      state.detailVoD.isLoading = false;
      state.detailVoD.error = { ...action.payload };
      state.detailVoD.data = {};
    },
    detailVoDClear: (state) => {
      state.detailVoD = initialState.detailVoD;
    },

    updateVoDFetch: (state, action: PayloadAction<UpdateVoDPayload>) => {
      state.updateVoD.isLoading = true;
      state.updateVoD.error = null;
      state.updateVoD.payload = { ...action.payload };
    },
    updateVoDSuccess: (state) => {
      state.updateVoD.isLoading = false;
      state.updateVoD.error = null;
      state.updateVoD.data = { isSuccess: true };
    },
    updateVoDFailure: (state, action) => {
      state.updateVoD.isLoading = false;
      state.updateVoD.error = { ...action.payload };
      state.updateVoD.data = {};
    },
    updateVoDClear: (state) => {
      state.updateVoD = initialState.updateVoD;
    },
  },
});

export const vodActions = vodState.actions;
export const vodReducer = vodState.reducer;
export default vodReducer;
