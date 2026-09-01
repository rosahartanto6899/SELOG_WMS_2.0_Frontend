import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/expense-refund.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  ExpenseRefundProcessPayload,
  GetDetailsResponse,
  GetListResponse,
  GetSummaryResponse,
  List,
  PayloadDetails,
  RefundProcessResponse,
  UnitParams,
} from "@sera-types/expense-refund.type";

export const expenseRefundSlice = createSlice({
  name: "expenseRefund",
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
      if (action?.payload?.data) {
        state.getSummary.data = { ...action?.payload?.data };
      }
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = { ...initialState.getSummary.data };
    },
    getListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getList.isLoading = true;
      state.getList.error = null;
      state.getList.data = [];
      state.getList.options = { ...action.payload };
    },
    getListSuccess: (state, action: PayloadAction<GetListResponse>) => {
      state.getList.isLoading = false;
      state.getList.error = null;

      const { data, pagination } = action.payload as GetListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getList.data = data?.list?.map(
          (_record: List, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getList.options = {
        ...state.getList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getListFailure: (state, action) => {
      state.getList.isLoading = false;
      state.getList.error = { ...action.payload };
      state.getList.data = [];
    },
    refundExpenseFetch: (
      state,
      action: PayloadAction<{
        payload: ExpenseRefundProcessPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.refundProcess.isLoading = true;
      state.refundProcess.error = null;
      state.refundProcess.payload = { ...action.payload.payload };
    },
    refundExpenseSuccess: (
      state,
      action: PayloadAction<RefundProcessResponse>,
    ) => {
      state.refundProcess.isLoading = false;
      state.refundProcess.error = null;
      state.refundProcess.data = action?.payload?.data ?? {};
    },
    refundExpenseFailure: (state, action) => {
      state.refundProcess.isLoading = false;
      state.refundProcess.error = { ...action.payload };
      state.refundProcess.data = {};
    },
    getDetailsFetch: (state, action: PayloadAction<PayloadDetails>) => {
      state.getDetails.isLoading = true;
      state.getDetails.error = null;
      state.getDetails.payload = { ...action.payload };
    },
    getDetailsSuccess: (state, action: PayloadAction<GetDetailsResponse>) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = null;
      if (action?.payload?.data) {
        state.getDetails.data = { ...action?.payload?.data };
      }
    },
    getDetailsFailure: (state, action) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = { ...action.payload };
      state.getDetails.data = { ...initialState.getDetails.data };
    },
  },
});

export const expenseRefundActions = expenseRefundSlice.actions;
export const expenseRefundReducers = expenseRefundSlice.reducer;
export default expenseRefundReducers;
