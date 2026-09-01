import { PayloadAction } from "@reduxjs/toolkit";
import expenseRefundApi from "@sera-libraries/api/expense-refund";
import { expenseRefundActions } from "@sera-redux/slices/expense-refund.slice";
import { BaseType } from "@sera-types/base.type";
import {
  ExpenseRefundProcessPayload,
  ExpenseRefundState,
  expenseRefundTypes,
  GetDetailsResponse,
  GetListResponse,
  GetSummaryResponse,
  PayloadDetails,
  RefundProcessResponse,
  UnitParams,
} from "@sera-types/expense-refund.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & ExpenseRefundState
> {
  try {
    const response = yield call(expenseRefundApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseRefundActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expenseRefundActions.getSummaryFailure(error));
  }
}

function* getList(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetListResponse> & ExpenseRefundState
> {
  try {
    const response = yield call(expenseRefundApi().getList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseRefundActions.getListSuccess(response.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expenseRefundActions.getListFailure(error));
  }
}

function* refundProcess(
  params: PayloadAction<{
    payload: ExpenseRefundProcessPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<RefundProcessResponse> & ExpenseRefundState
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(expenseRefundApi().refundProcess, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(expenseRefundActions.refundExpenseSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expenseRefundActions.refundExpenseFailure(error));
  }
}

function* getDetails(
  params: PayloadAction<PayloadDetails>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailsResponse> & ExpenseRefundState
> {
  try {
    const result = yield call(expenseRefundApi().getDetails, {
      id: params.payload.id,
    });

    yield put(expenseRefundActions.getDetailsSuccess(result.data));
  } catch (error: unknown) {
    captureErrorAxios(error);
    yield put(expenseRefundActions.getDetailsFailure(error));
  }
}

function* watchExpenseRefundRequest() {
  yield takeEvery(expenseRefundTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(expenseRefundTypes.GET_LIST_FETCH, getList);
  yield takeEvery(expenseRefundTypes.REFUND_PROCESS_FETCH, refundProcess);
  yield takeEvery(expenseRefundTypes.GET_DETAILS_FETCH, getDetails);
}

export default function* ExpenseRefundSaga() {
  yield all([fork(watchExpenseRefundRequest)]);
}
