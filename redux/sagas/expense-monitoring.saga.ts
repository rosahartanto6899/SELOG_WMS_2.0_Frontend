/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ExpenseAPI from "@sera-libraries/api/expense-monitoring";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import { BaseType } from "@sera-types/base.type";
import {
  AdditionalExpensesPayload,
  AdditionalExpensesResponse,
  AuditTrailPayload,
  AuditTrailResponse,
  CreateAdditionalExpensesPayload,
  ExpenseState,
  expenseTypes,
  FilterParams,
  ShipmentExpensesResponse,
  SummaryExpensesResponse,
  SummaryResponse,
  UpdateDetailExpensePayload,
  UpdateTermin1DatePayload,
} from "@sera-types/expense-monitoring";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<FilterParams>,
): Generator<unknown, void, AxiosResponse<SummaryResponse> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getSummaryFailure(error));
  }
}

function* getSummaryExpenses(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<SummaryExpensesResponse> & ExpenseState
> {
  try {
    const response = yield call(ExpenseAPI().getSummaryExpenses, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getSummaryExpensesSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getSummaryExpensesFailure(error));
  }
}

function* getShipmentExpenses(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<ShipmentExpensesResponse> & ExpenseState
> {
  try {
    const response = yield call(ExpenseAPI().getShipmentExpenses, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getShipmentExpensesSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getShipmentExpensesFailure(error));
  }
}

function* getACShipmentExpenses(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<ShipmentExpensesResponse> & ExpenseState
> {
  try {
    const response = yield call(ExpenseAPI().getShipmentExpenses, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getACShipmentExpensesSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getACShipmentExpensesFailure(error));
  }
}

function* updateTermin1Date(
  params: PayloadAction<UpdateTermin1DatePayload>,
): Generator<unknown, void, AxiosResponse<any> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().updateTermin1Date, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.updateTermin1DateSuccess({ ...params.payload }));
    }
  } catch (error: any) {
    yield put(expenseActions.updateTermin1DateFailure(error));
  }
}

function* getDetailExpenses(
  params: PayloadAction<AuditTrailPayload>,
): Generator<unknown, void, AxiosResponse<AuditTrailResponse> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().getDetailExpenses, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getDetailExpensesSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getDetailExpensesFailure(error));
  }
}

function* updateDetailExpense(
  params: PayloadAction<UpdateDetailExpensePayload>,
): Generator<unknown, void, AxiosResponse<any> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().updateDetailExpense, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(
        expenseActions.updateDetailExpenseSuccess({ ...params.payload }),
      );
    }
  } catch (error: any) {
    yield put(expenseActions.updateDetailExpenseFailure(error));
  }
}

function* getAuditTrail(
  params: PayloadAction<AuditTrailPayload>,
): Generator<unknown, void, AxiosResponse<AuditTrailResponse> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().getAuditTrail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getAuditTrailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getAuditTrailFailure(error));
  }
}

function* getAddExpenses(
  params: PayloadAction<AdditionalExpensesPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<AdditionalExpensesResponse> & ExpenseState
> {
  try {
    const response = yield call(ExpenseAPI().getAddExpenses, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(expenseActions.getAddExpensesSuccess(response.data));
    }
  } catch (error: any) {
    yield put(expenseActions.getAddExpensesFailure(error));
  }
}

function* createAddExpenses(
  params: PayloadAction<CreateAdditionalExpensesPayload>,
): Generator<unknown, void, AxiosResponse<any> & ExpenseState> {
  try {
    const response = yield call(ExpenseAPI().createAddExpenses, {
      ...params?.payload,
    });

    if (response?.status === 200) {
      yield call(
        Router.push,
        `/administration-management/expense-monitoring/${params.payload.shipmentId}?activeKey=additional-expense`,
      );
      yield put(expenseActions.createAddExpensesSuccess({ ...params.payload }));
    }
  } catch (error: any) {
    yield put(expenseActions.createAddExpensesFailure(error));
  }
}

function* watchExpenseRequest() {
  yield takeEvery(expenseTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(expenseTypes.GET_SUMMARY_EXPENSES_FETCH, getSummaryExpenses);
  yield takeEvery(
    expenseTypes.GET_SHIPMENT_EXPENSES_FETCH,
    getShipmentExpenses,
  );
  yield takeEvery(
    expenseTypes.GET_AC_SHIPMENT_EXPENSES_FETCH,
    getACShipmentExpenses,
  );
  yield takeEvery(expenseTypes.UPDATE_TERMIN1_DATE_FETCH, updateTermin1Date);
  yield takeEvery(expenseTypes.GET_DETAIL_EXPENSES_FETCH, getDetailExpenses);
  yield takeEvery(
    expenseTypes.UPDATE_DETAIL_EXPENSE_FETCH,
    updateDetailExpense,
  );
  yield takeEvery(expenseTypes.GET_AUDIT_TRAIL_FETCH, getAuditTrail);
  yield takeEvery(expenseTypes.GET_ADD_EXPENSES_FETCH, getAddExpenses);
  yield takeEvery(expenseTypes.CREATE_ADD_EXPENSES_FETCH, createAddExpenses);
}

export default function* expenseSaga() {
  yield all([fork(watchExpenseRequest)]);
}
