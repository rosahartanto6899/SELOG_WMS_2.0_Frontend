import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  IDetailsPayload,
  IDetailsResponseData,
  IFilterData,
  IFilterResponse,
  IListResponse,
  IListResponseData,
  ISummaryPayload,
  ISummaryResponse,
  ISummaryResponseData,
  IUpdateNotePayload,
} from "@sera-types/driver-stock.type";

import initialState from "../states/driver-stock.state";

export const driverStockState = createSlice({
  name: "driverStock",
  initialState,
  reducers: {
    getListFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getListFetchSuccess: (state, action: PayloadAction<IListResponse>) => {
      state.error = null;
      state.isLoading = false;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: IListResponseData, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
    },
    getListFailure: (state, action) => {
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

      const data: ISummaryResponseData = action.payload.data;

      state.getSummary.data = data;
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = initialState.getSummary.data;
    },
    getByIdFetch: (state, action: PayloadAction<IDetailsPayload>) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = true;
      state.getDetails.payload = { ...action.payload };
    },
    getByIdFetchSuccess: (
      state,
      action: PayloadAction<IDetailsResponseData>,
    ) => {
      state.getDetails.error = null;
      state.getDetails.isLoading = false;

      state.getDetails.data = { ...action.payload };
    },
    getByIdFetchFailure: (state, action) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = { ...action.payload };
      state.getDetails.data = initialState.getDetails.data;
    },
    getFilterFetch: (state) => {
      state.getFilterOption.error = null;
      state.getFilterOption.isLoading = true;
      // state.getFilterOption.payload = { ...action.payload };
    },
    getFilterSuccess: (state, action: PayloadAction<IFilterResponse[]>) => {
      state.getFilterOption.error = null;
      state.getFilterOption.isLoading = false;
      const tempData: IFilterData[] = [];
      tempData.push({
        label: "Driver Name",
        value: "employeeName",
        options: [],
      });
      action.payload.forEach((e) => {
        switch (e.code) {
          case "FATIGUE_STATUSES_RETRIEVED":
            tempData.push({
              label: "Fatigue Status",
              value: "fatigueStatus",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
          case "EMPLOYEE_STATUSES_RETRIEVED":
            tempData.push({
              label: "Employee Status",
              value: "employeeStatus",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
          case "CONTRACT_STATUSES_RETRIEVED":
            tempData.push({
              label: "Contract Status",
              value: "contractStatus",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
          case "DRIVER_CAPACITY_STATUS_RETRIEVED":
            tempData.push({
              label: "Driver Status",
              value: "driverStatus",
              options: e.data.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            });
            break;
        }
      });
      tempData.push({
        label: "License Status",
        value: "licenseStatus",
        options: [
          {
            label: "Attention",
            value: "Attention",
          },
          {
            label: "Active",
            value: "Active",
          },
        ],
      });
      state.getFilterOption.data = tempData;
    },
    getFilterFailure: (state, action) => {
      state.getFilterOption.isLoading = false;
      state.getFilterOption.error = { ...action.payload };
      state.getFilterOption.data = [];
    },
    updateNoteByIdFetch: (
      state,
      action: PayloadAction<{
        payload: IUpdateNotePayload;
        callback?: () => void;
      }>,
    ) => {
      state.updateNote.error = null;
      state.updateNote.isLoading = true;
      state.updateNote.payload = { ...action.payload.payload };
    },
    updateNoteByIdFetchSuccess: (state) => {
      state.updateNote.error = null;
      state.updateNote.isLoading = false;
    },
    updateNoteByIdFetchFailure: (state, action) => {
      state.updateNote.isLoading = false;
      state.updateNote.error = { ...action.payload };
    },
  },
});

export const driverStockActions = driverStockState.actions;
export const driverStockReducers = driverStockState.reducer;
export default driverStockReducers;
