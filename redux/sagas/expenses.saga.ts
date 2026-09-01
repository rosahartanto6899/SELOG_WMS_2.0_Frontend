/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ExpensesApi from "@sera-libraries/api/expenses";
import { expensesActions } from "@sera-redux/slices/expenses.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateExpensesActionPayload,
  CreateExpensesResponse,
  ExpensesState,
  ExpensesTemplatePayload,
  expensesTypes,
  GetExpensesDetailResponse,
  GetExpensesListResponse,
  GetSummaryExpensesResponse,
  SummaryExpensesPayload,
  UpdateExpensesActionPayload,
  UpdateExpensesResponse,
} from "@sera-types/expenses.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getExpensesSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetExpensesListResponse> & ExpensesState
> {
  try {
    const result = yield call(ExpensesApi().retrieveExpenses, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(expensesActions.getExpensesSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      expensesActions.getExpensesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getExpensesAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetExpensesListResponse> & ExpensesState
> {
  try {
    const result = yield call(ExpensesApi().retrieveExpenses, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(expensesActions.getExpensesAutoCompleteSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expensesActions.getExpensesAutoCompleteFailure(error));
  }
}

function* getExpensesDetailSaga(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetExpensesDetailResponse> & ExpensesState
> {
  try {
    const result = yield call(ExpensesApi().getExpensesDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(expensesActions.getExpensesDetailSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expensesActions.getExpensesDetailFailure(error));
  }
}

function* updateExpensesSaga(
  params: PayloadAction<UpdateExpensesActionPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UpdateExpensesResponse> & ExpensesState
> {
  try {
    const result = yield call(ExpensesApi().updateExpenses, {
      id: params.payload.id,
      data: params.payload.payload,
    });
    if (result?.status >= 200 && result?.status < 300) {
      yield put(expensesActions.updateExpensesSuccess(result.data));
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expensesActions.updateExpensesFailure(error));
  }
}

function* createExpensesSaga(
  params: PayloadAction<CreateExpensesActionPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<CreateExpensesResponse> & ExpensesState
> {
  try {
    const result = yield call(
      ExpensesApi().createExpenses,
      params.payload.payload,
    );
    if (result?.status >= 200 && result?.status < 300) {
      yield put(expensesActions.createExpensesSuccess(result.data));
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    if (!params.payload?.isUpsert) {
      captureErrorAxios(error);
    }
    yield put(expensesActions.createExpensesFailure(error));
  }
}

function* getSummaryExpensesSaga(
  params: PayloadAction<SummaryExpensesPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryExpensesResponse> & ExpensesState
> {
  try {
    const result = yield call(ExpensesApi().getSummaryExpenses, params.payload);
    if (result?.status === 200) {
      yield put(expensesActions.getSummaryExpensesSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expensesActions.getSummaryExpensesFailure(error));
  }
}

function* downloadExpensesTemplateSaga(
  params: PayloadAction<ExpensesTemplatePayload>,
): Generator<unknown, void, AxiosResponse<any> & ExpensesState> {
  try {
    const res = yield call(
      ExpensesApi().downloadExpensesTemplate,
      params.payload,
    );
    if (res?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `LOGis_UploadExpensesTemplate.xlsx`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      yield put(expensesActions.downloadExpensesTemplateSuccess());
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(expensesActions.downloadExpensesTemplateFailure(error));
  }
}

function* watchExpensesRequest() {
  yield takeEvery(expensesTypes.GET_EXPENSES_FETCH, getExpensesSaga);
  yield takeEvery(
    expensesTypes.GET_EXPENSES_AUTOCOMPLETE_FETCH,
    getExpensesAutoCompleteSaga,
  );
  yield takeEvery(
    expensesTypes.GET_EXPENSES_DETAIL_FETCH,
    getExpensesDetailSaga,
  );
  yield takeEvery(expensesTypes.UPDATE_EXPENSES_FETCH, updateExpensesSaga);
  yield takeEvery(expensesTypes.CREATE_EXPENSES_FETCH, createExpensesSaga);
  yield takeEvery(
    expensesTypes.GET_SUMMARY_EXPENSES_FETCH,
    getSummaryExpensesSaga,
  );
  yield takeEvery(
    expensesTypes.DOWNLOAD_EXPENSES_TEMPLATE_FETCH,
    downloadExpensesTemplateSaga,
  );
}

export default function* expensesSaga() {
  yield all([fork(watchExpensesRequest)]);
}
