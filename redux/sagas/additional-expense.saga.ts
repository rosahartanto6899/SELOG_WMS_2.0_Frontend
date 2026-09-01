/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import AdditionalExpenseApi from "@sera-libraries/api/additional-expense";
import { additionalExpenseActions } from "@sera-redux/slices/additional-expense.slice";
import {
  AdditionalExpenseDetailPayload,
  AdditionalExpenseState,
  AdditionalExpenseSummaryPayload,
  additionalExpenseTypes,
  GetAdditionalExpenseDetailResponse,
  GetAdditionalExpenseListResponse,
  GetAdditionalExpenseSummaryResponse,
  GetAuditTrailResponse,
  GetExpenseDetailResponse,
  UpdateApprovalAdditionalExpensePayload,
} from "@sera-types/additional-expense.type";
import { BaseType } from "@sera-types/base.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getAdditionalExpenseSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetAdditionalExpenseListResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(
      AdditionalExpenseApi().retrieveAdditionalExpense,
      {
        ...params.payload,
      },
    );
    if (result?.status === 200)
      yield put(
        additionalExpenseActions.getAdditionalExpenseSuccess(result.data),
      );
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      additionalExpenseActions.getAdditionalExpenseFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getAdditionalExpenseAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetAdditionalExpenseListResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(
      AdditionalExpenseApi().retrieveAdditionalExpense,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        additionalExpenseActions.getAdditionalExpenseAutoCompleteSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      additionalExpenseActions.getAdditionalExpenseAutoCompleteFailure(error),
    );
  }
}

function* getAdditionalExpenseSummarySaga(
  params: PayloadAction<AdditionalExpenseSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetAdditionalExpenseSummaryResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(
      AdditionalExpenseApi().getAdditionalExpenseSummary,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        additionalExpenseActions.getAdditionalExpenseSummarySuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      additionalExpenseActions.getAdditionalExpenseSummaryFailure(error),
    );
  }
}

function* getAdditionalExpenseDetailSaga(
  params: PayloadAction<AdditionalExpenseDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetAdditionalExpenseDetailResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(
      AdditionalExpenseApi().getAdditionalExpenseDetail,
      {
        id: params.payload.id,
      },
    );

    if (result?.status === 200) {
      yield put(
        additionalExpenseActions.getAdditionalExpenseDetailSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      additionalExpenseActions.getAdditionalExpenseDetailFailure(error),
    );
  }
}

function* getExpenseDetailSaga(
  params: PayloadAction<AdditionalExpenseDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetExpenseDetailResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(AdditionalExpenseApi().getExpenseDetail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(additionalExpenseActions.getExpenseDetailSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(additionalExpenseActions.getExpenseDetailFailure(error));
  }
}

function* getAuditTrailSaga(
  params: PayloadAction<AdditionalExpenseDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetAuditTrailResponse> & AdditionalExpenseState
> {
  try {
    const result = yield call(AdditionalExpenseApi().getAuditTrail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(additionalExpenseActions.getAuditTrailSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(additionalExpenseActions.getAuditTrailFailure(error));
  }
}

function* updateApprovalAdditionalExpenseSaga(
  params: PayloadAction<UpdateApprovalAdditionalExpensePayload>,
): Generator<unknown, void, AxiosResponse<any> & AdditionalExpenseState> {
  try {
    const result = yield call(
      AdditionalExpenseApi().updateApprovalAdditionalExpense,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        additionalExpenseActions.updateApprovalAdditionalExpenseSuccess(),
      );
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      additionalExpenseActions.updateApprovalAdditionalExpenseFailure(error),
    );
  }
}

function* watchAdditionalExpenseRequest() {
  yield takeEvery(
    additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_FETCH,
    getAdditionalExpenseSaga,
  );
  yield takeEvery(
    additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE_FETCH,
    getAdditionalExpenseAutoCompleteSaga,
  );
  yield takeEvery(
    additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_SUMMARY_FETCH,
    getAdditionalExpenseSummarySaga,
  );
  yield takeEvery(
    additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_DETAIL_FETCH,
    getAdditionalExpenseDetailSaga,
  );
  yield takeEvery(
    additionalExpenseTypes.GET_EXPENSE_DETAIL_FETCH,
    getExpenseDetailSaga,
  );
  yield takeEvery(
    additionalExpenseTypes.GET_AUDIT_TRAIL_FETCH,
    getAuditTrailSaga,
  );
  yield takeEvery(
    additionalExpenseTypes.UPDATE_APPROVAL_ADDITIONAL_EXPENSE_FETCH,
    updateApprovalAdditionalExpenseSaga,
  );
}

export default function* additionalExpenseSaga() {
  yield all([fork(watchAdditionalExpenseRequest)]);
}
