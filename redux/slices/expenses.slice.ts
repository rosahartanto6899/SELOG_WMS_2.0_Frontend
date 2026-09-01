import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/expenses.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateExpensesActionPayload,
  CreateExpensesResponse,
  ExpensesRecord,
  ExpensesTemplatePayload,
  GetExpensesDetailResponse,
  GetExpensesListResponse,
  GetSummaryExpensesResponse,
  SummaryExpensesPayload,
  UpdateExpensesActionPayload,
  UpdateExpensesResponse,
} from "@sera-types/expenses.type";
import { uniqBy } from "lodash";

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    getExpensesFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getExpensesSuccess: (
      state,
      action: PayloadAction<GetExpensesListResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: ExpensesRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getExpensesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getExpensesClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
    },
    getExpensesAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getExpensesAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetExpensesListResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = (state?.autoComplete?.options?.searchBy ?? "") as any;

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
    getExpensesAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getExpensesAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getExpensesDetailFetch: (state, action: PayloadAction<{ id: string }>) => {
      state.detailExpenses.isLoading = true;
      state.detailExpenses.error = null;
      state.detailExpenses.payload = { ...action.payload };
    },
    getExpensesDetailSuccess: (
      state,
      action: PayloadAction<GetExpensesDetailResponse>,
    ) => {
      state.detailExpenses.isLoading = false;
      state.detailExpenses.error = null;
      state.detailExpenses.data = { ...action.payload?.data };
    },
    getExpensesDetailFailure: (state, action) => {
      state.detailExpenses.isLoading = false;
      state.detailExpenses.error = { ...action.payload };
    },
    getExpensesDetailClear: (state) => {
      state.detailExpenses = initialState.detailExpenses;
    },
    updateExpensesFetch: (
      state,
      action: PayloadAction<UpdateExpensesActionPayload>,
    ) => {
      state.updateExpenses.isLoading = true;
      state.updateExpenses.error = null;
      state.updateExpenses.payload = { ...action.payload };
    },
    updateExpensesSuccess: (
      state,
      action: PayloadAction<UpdateExpensesResponse>,
    ) => {
      state.updateExpenses.isLoading = false;
      state.updateExpenses.error = null;
      state.updateExpenses.data = { ...action.payload?.data };
    },
    updateExpensesFailure: (state, action) => {
      state.updateExpenses.isLoading = false;
      state.updateExpenses.error = { ...action.payload };
    },
    updateExpensesClear: (state) => {
      state.updateExpenses = initialState.updateExpenses;
    },
    createExpensesFetch: (
      state,
      action: PayloadAction<CreateExpensesActionPayload>,
    ) => {
      state.createExpenses.isLoading = true;
      state.createExpenses.error = null;
      state.createExpenses.payload = { ...action.payload };
    },
    createExpensesSuccess: (
      state,
      action: PayloadAction<CreateExpensesResponse>,
    ) => {
      state.createExpenses.isLoading = false;
      state.createExpenses.error = null;
      state.createExpenses.data = { ...action.payload?.data };
    },
    createExpensesFailure: (state, action) => {
      state.createExpenses.isLoading = false;
      state.createExpenses.error = { ...action.payload };
    },
    createExpensesClear: (state) => {
      state.createExpenses = initialState.createExpenses;
    },
    getSummaryExpensesFetch: (
      state,
      action: PayloadAction<SummaryExpensesPayload>,
    ) => {
      state.summaryExpenses.isLoading = true;
      state.summaryExpenses.error = null;
      state.summaryExpenses.payload = action.payload;
    },
    getSummaryExpensesSuccess: (
      state,
      action: PayloadAction<GetSummaryExpensesResponse>,
    ) => {
      state.summaryExpenses.isLoading = false;
      state.summaryExpenses.error = null;
      if (action.payload?.data) {
        state.summaryExpenses.data = action.payload.data;
      }
    },
    getSummaryExpensesFailure: (state, action) => {
      state.summaryExpenses.isLoading = false;
      state.summaryExpenses.error = { ...action.payload };
    },
    getSummaryExpensesClear: (state) => {
      state.summaryExpenses = initialState.summaryExpenses;
    },
    downloadExpensesTemplateFetch: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<ExpensesTemplatePayload>,
    ) => {
      state.downloadExpensesTemplate.isLoading = true;
      state.downloadExpensesTemplate.error = null;
      state.downloadExpensesTemplate.data = null;
    },
    downloadExpensesTemplateSuccess: (state) => {
      state.downloadExpensesTemplate.isLoading = false;
      state.downloadExpensesTemplate.error = null;
      state.downloadExpensesTemplate.data = null;
    },
    downloadExpensesTemplateFailure: (state, action) => {
      state.downloadExpensesTemplate.isLoading = false;
      state.downloadExpensesTemplate.error = { ...action.payload };
      state.downloadExpensesTemplate.data = null;
    },
    downloadExpensesTemplateClear: (state) => {
      state.downloadExpensesTemplate = initialState.downloadExpensesTemplate;
    },
  },
});

export const expensesReducer = expensesSlice.reducer;
export const expensesActions = expensesSlice.actions;
