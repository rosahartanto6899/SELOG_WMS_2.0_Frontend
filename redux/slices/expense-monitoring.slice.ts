/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/expense-monitoring.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  AdditionalExpenses,
  AdditionalExpensesPayload,
  AdditionalExpensesResponse,
  AuditTrailPayload,
  AuditTrailResponse,
  CreateAdditionalExpensesPayload,
  DetailExpensesPayload,
  DetailExpensesResponse,
  FilterParams,
  ShipmentExpenses,
  ShipmentExpensesResponse,
  SummaryExpensesResponse,
  SummaryResponse,
  UpdateDetailExpensePayload,
  UpdateTermin1DatePayload,
} from "@sera-types/expense-monitoring";
import { uniqBy } from "lodash";

export const DEFAULT_SEARCH = "expenseActivity";

export const expenseState = createSlice({
  name: "expenseMonitoring",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<FilterParams>) => {
      state.getSummary.isLoading = true;
      state.getSummary.error = null;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<SummaryResponse>) => {
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

    getSummaryExpensesFetch: (state, action: PayloadAction<FilterParams>) => {
      state.getSummaryExpenses.isLoading = true;
      state.getSummaryExpenses.error = null;
      state.getSummaryExpenses.data = [];
      state.getSummary.payload = { ...action.payload };
    },
    getSummaryExpensesSuccess: (
      state,
      action: PayloadAction<SummaryExpensesResponse>,
    ) => {
      state.getSummaryExpenses.isLoading = false;
      state.getSummaryExpenses.error = null;
      state.getSummaryExpenses.data = action?.payload?.data ?? [];
    },
    getSummaryExpensesFailure: (state, action) => {
      state.getSummaryExpenses.isLoading = false;
      state.getSummaryExpenses.error = { ...action.payload };
      state.getSummaryExpenses.data = [];
    },
    getSummaryExpensesClear: (state) => {
      state.getSummaryExpenses = initialState.getSummaryExpenses;
    },

    getShipmentExpensesFetch: (state, action: PayloadAction<BaseType>) => {
      state.getShipmentExpenses.isLoading = true;
      state.getShipmentExpenses.error = null;
      state.getShipmentExpenses.data = [];
      state.getShipmentExpenses.options = { ...action.payload };
    },
    getShipmentExpensesSuccess: (
      state,
      action: PayloadAction<ShipmentExpensesResponse>,
    ) => {
      state.getShipmentExpenses.isLoading = false;
      state.getShipmentExpenses.error = null;

      const { data, pagination } = action.payload as ShipmentExpensesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getShipmentExpenses.data = data?.map(
          (_record: ShipmentExpenses, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getShipmentExpenses.options = {
        ...state.getShipmentExpenses.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getShipmentExpensesFailure: (state, action) => {
      state.getShipmentExpenses.isLoading = false;
      state.getShipmentExpenses.error = { ...action.payload };
      state.getShipmentExpenses.data = [];
    },
    getShipmentExpensesClear: (state) => {
      state.getShipmentExpenses = initialState.getShipmentExpenses;
    },

    getACShipmentExpensesFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACShipmentExpenses.isLoading = true;
      state.getACShipmentExpenses.error = null;
      state.getACShipmentExpenses.data = [];
      state.getACShipmentExpenses.options = { ...action.payload };
    },
    getACShipmentExpensesSuccess: (
      state,
      action: PayloadAction<ShipmentExpensesResponse>,
    ) => {
      state.getACShipmentExpenses.isLoading = false;
      state.getACShipmentExpenses.error = null;

      const { data, pagination } = action.payload as ShipmentExpensesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        state?.getACShipmentExpenses?.options?.searchBy ?? DEFAULT_SEARCH;

      if (
        state?.getACShipmentExpenses?.options &&
        state?.getACShipmentExpenses?.data
      ) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACShipmentExpenses.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACShipmentExpenses.options = {
          ...state.getACShipmentExpenses.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACShipmentExpensesFailure: (state, action) => {
      state.getACShipmentExpenses.isLoading = false;
      state.getACShipmentExpenses.error = { ...action.payload };
      state.getACShipmentExpenses.data = [];
    },
    getACShipmentExpensesClear: (state) => {
      state.getACShipmentExpenses = initialState.getACShipmentExpenses;
    },

    updateTermin1DateFetch: (
      state,
      action: PayloadAction<UpdateTermin1DatePayload>,
    ) => {
      state.updateTermin1Date.isLoading = true;
      state.updateTermin1Date.error = null;
      state.updateTermin1Date.data = {};
      state.updateTermin1Date.payload = { ...action.payload };
    },
    updateTermin1DateSuccess: (
      state,
      action: PayloadAction<UpdateTermin1DatePayload>,
    ) => {
      state.updateTermin1Date.isLoading = false;
      state.updateTermin1Date.error = null;
      state.updateTermin1Date.data = { ...action?.payload };
    },
    updateTermin1DateFailure: (state, action) => {
      state.updateTermin1Date.isLoading = false;
      state.updateTermin1Date.error = { ...action.payload };
      state.updateTermin1Date.data = {};
    },
    updateTermin1DateClear: (state) => {
      state.updateTermin1Date = initialState.updateTermin1Date;
    },

    getDetailExpensesFetch: (
      state,
      action: PayloadAction<DetailExpensesPayload>,
    ) => {
      state.getDetailExpenses.isLoading = true;
      state.getDetailExpenses.error = null;
      state.getDetailExpenses.data = [];
      state.getDetailExpenses.payload = { ...action.payload };
    },
    getDetailExpensesSuccess: (
      state,
      action: PayloadAction<DetailExpensesResponse>,
    ) => {
      state.getDetailExpenses.isLoading = false;
      state.getDetailExpenses.error = null;
      state.getDetailExpenses.data = action?.payload?.data ?? [];
    },
    getDetailExpensesFailure: (state, action) => {
      state.getDetailExpenses.isLoading = false;
      state.getDetailExpenses.error = { ...action.payload };
      state.getDetailExpenses.data = [];
    },
    getDetailExpensesClear: (state) => {
      state.getDetailExpenses = initialState.getDetailExpenses;
    },

    updateDetailExpenseFetch: (
      state,
      action: PayloadAction<UpdateDetailExpensePayload>,
    ) => {
      state.updateDetailExpense.isLoading = true;
      state.updateDetailExpense.error = null;
      state.updateDetailExpense.data = {};
      state.updateDetailExpense.payload = { ...action.payload };
    },
    updateDetailExpenseSuccess: (
      state,
      action: PayloadAction<UpdateDetailExpensePayload>,
    ) => {
      state.updateDetailExpense.isLoading = false;
      state.updateDetailExpense.error = null;
      state.updateDetailExpense.data = { ...action?.payload };
    },
    updateDetailExpenseFailure: (state, action) => {
      state.updateDetailExpense.isLoading = false;
      state.updateDetailExpense.error = { ...action.payload };
      state.updateDetailExpense.data = {};
    },
    updateDetailExpenseClear: (state) => {
      state.updateDetailExpense = initialState.updateDetailExpense;
    },

    getAuditTrailFetch: (state, action: PayloadAction<AuditTrailPayload>) => {
      state.getAuditTrail.isLoading = true;
      state.getAuditTrail.error = null;
      state.getAuditTrail.data = [];
      state.getAuditTrail.payload = { ...action.payload };
    },
    getAuditTrailSuccess: (
      state,
      action: PayloadAction<AuditTrailResponse>,
    ) => {
      state.getAuditTrail.isLoading = false;
      state.getAuditTrail.error = null;
      state.getAuditTrail.data = action?.payload?.data ?? [];
    },
    getAuditTrailFailure: (state, action) => {
      state.getAuditTrail.isLoading = false;
      state.getAuditTrail.error = { ...action.payload };
      state.getAuditTrail.data = [];
    },
    getAuditTrailClear: (state) => {
      state.getAuditTrail = initialState.getAuditTrail;
    },

    getAddExpensesFetch: (
      state,
      action: PayloadAction<AdditionalExpensesPayload>,
    ) => {
      state.getAddExpenses.isLoading = true;
      state.getAddExpenses.error = null;
      state.getAddExpenses.data = [];
      state.getAddExpenses.options = { ...action.payload };
    },
    getAddExpensesSuccess: (
      state,
      action: PayloadAction<AdditionalExpensesResponse>,
    ) => {
      state.getAddExpenses.isLoading = false;
      state.getAddExpenses.error = null;

      const { data, pagination } = action.payload as AdditionalExpensesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getAddExpenses.data = data?.map(
          (_record: AdditionalExpenses, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getAddExpenses.options = {
        ...state.getAddExpenses.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getAddExpensesFailure: (state, action) => {
      state.getAddExpenses.isLoading = false;
      state.getAddExpenses.error = { ...action.payload };
      state.getAddExpenses.data = [];
    },
    getAddExpensesClear: (state) => {
      state.getAddExpenses = initialState.getAddExpenses;
    },

    createAddExpensesFetch: (
      state,
      action: PayloadAction<CreateAdditionalExpensesPayload>,
    ) => {
      state.createAddExpenses.isLoading = true;
      state.createAddExpenses.error = null;
      state.createAddExpenses.data = {};
      state.createAddExpenses.payload = { ...action.payload };
    },
    createAddExpensesSuccess: (
      state,
      action: PayloadAction<CreateAdditionalExpensesPayload>,
    ) => {
      state.createAddExpenses.isLoading = false;
      state.createAddExpenses.error = null;
      state.createAddExpenses.data = { ...action?.payload };
    },
    createAddExpensesFailure: (state, action) => {
      state.createAddExpenses.isLoading = false;
      state.createAddExpenses.error = { ...action.payload };
      state.createAddExpenses.data = {};
    },
    createAddExpensesClear: (state) => {
      state.createAddExpenses = initialState.createAddExpenses;
    },
  },
});

export const expenseActions = expenseState.actions;
export const expenseReducer = expenseState.reducer;
export default expenseReducer;
