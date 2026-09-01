import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/additional-expense.state";
import {
  AdditionalExpenseDetailPayload,
  AdditionalExpenseRecord,
  AdditionalExpenseSummaryPayload,
  GetAdditionalExpenseDetailResponse,
  GetAdditionalExpenseListResponse,
  GetAdditionalExpenseSummaryResponse,
  GetAuditTrailResponse,
  GetExpenseDetailResponse,
  UpdateApprovalAdditionalExpensePayload,
} from "@sera-types/additional-expense.type";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { uniqBy } from "lodash";

export const additionalExpenseSlice = createSlice({
  name: "additionalExpense",
  initialState,
  reducers: {
    getAdditionalExpenseFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getAdditionalExpenseSuccess: (
      state,
      action: PayloadAction<GetAdditionalExpenseListResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: AdditionalExpenseRecord, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no: no };
        });
      }
      state.isLoading = false;
    },
    getAdditionalExpenseFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getAdditionalExpenseClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
    getAdditionalExpenseAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getAdditionalExpenseAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetAdditionalExpenseListResponse>,
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
    getAdditionalExpenseAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getAdditionalExpenseAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getAdditionalExpenseSummaryFetch: (
      state,
      action: PayloadAction<AdditionalExpenseSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = { ...action.payload };
    },
    getAdditionalExpenseSummarySuccess: (
      state,
      action: PayloadAction<GetAdditionalExpenseSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      if (action.payload.data) {
        state.summary.data = action.payload.data.summary;
      }
    },
    getAdditionalExpenseSummaryFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = action.payload;
    },
    getAdditionalExpenseSummaryClear: (state) => {
      state.summary = initialState.summary;
    },
    getAdditionalExpenseDetailFetch: (
      state,
      action: PayloadAction<AdditionalExpenseDetailPayload>,
    ) => {
      state.detail.isLoading = true;
      state.detail.error = null;
      state.detail.payload = { ...action.payload };
    },
    getAdditionalExpenseDetailSuccess: (
      state,
      action: PayloadAction<GetAdditionalExpenseDetailResponse>,
    ) => {
      state.detail.isLoading = false;
      if (action.payload.data) {
        state.detail.data = action.payload.data;
      }
    },
    getAdditionalExpenseDetailFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = action.payload;
    },
    getAdditionalExpenseDetailClear: (state) => {
      state.detail = initialState.detail;
    },
    getExpenseDetailFetch: (
      state,
      action: PayloadAction<AdditionalExpenseDetailPayload>,
    ) => {
      state.expenseDetail.isLoading = true;
      state.expenseDetail.error = null;
      state.expenseDetail.payload = { ...action.payload };
    },
    getExpenseDetailSuccess: (
      state,
      action: PayloadAction<GetExpenseDetailResponse>,
    ) => {
      state.expenseDetail.isLoading = false;
      if (action.payload.data) {
        state.expenseDetail.data = action.payload.data;
      }
    },
    getExpenseDetailFailure: (state, action) => {
      state.expenseDetail.isLoading = false;
      state.expenseDetail.error = action.payload;
    },
    getExpenseDetailClear: (state) => {
      state.expenseDetail = initialState.expenseDetail;
    },
    getAuditTrailFetch: (
      state,
      action: PayloadAction<AdditionalExpenseDetailPayload>,
    ) => {
      state.auditTrail.isLoading = true;
      state.auditTrail.error = null;
      state.auditTrail.payload = { ...action.payload };
    },
    getAuditTrailSuccess: (
      state,
      action: PayloadAction<GetAuditTrailResponse>,
    ) => {
      state.auditTrail.isLoading = false;
      if (action.payload.data) {
        state.auditTrail.data = action.payload.data;
      }
    },
    getAuditTrailFailure: (state, action) => {
      state.auditTrail.isLoading = false;
      state.auditTrail.error = action.payload;
    },
    getAuditTrailClear: (state) => {
      state.auditTrail = initialState.auditTrail;
    },
    updateApprovalAdditionalExpenseFetch: (
      state,
      action: PayloadAction<UpdateApprovalAdditionalExpensePayload>,
    ) => {
      state.updateApproval.isLoading = true;
      state.updateApproval.error = null;
      state.updateApproval.data = { ...action.payload };
    },
    updateApprovalAdditionalExpenseSuccess: (state) => {
      state.updateApproval.isLoading = false;
      state.updateApproval.error = null;
    },
    updateApprovalAdditionalExpenseFailure: (state, action) => {
      state.updateApproval.isLoading = false;
      state.updateApproval.error = action.payload;
    },
    updateApprovalAdditionalExpenseClear: (state) => {
      state.updateApproval = initialState.updateApproval;
    },
  },
});

export const additionalExpenseReducer = additionalExpenseSlice.reducer;
export const additionalExpenseActions = additionalExpenseSlice.actions;
