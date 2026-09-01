import { PayloadAction } from "@reduxjs/toolkit";
import WmsCustomerApi from "@sera-libraries/api/wms-customer";
import { wmsCustomerActions } from "@sera-redux/slices/wms-customer.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetWmsCustomersResponse,
  WmsCustomerState,
} from "@sera-types/wms-customer.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getCustomers(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetWmsCustomersResponse> & WmsCustomerState
> {
  try {
    const result = yield call(WmsCustomerApi().retrieveCustomers, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        wmsCustomerActions.getCustomersSuccess(
          result.data as GetWmsCustomersResponse,
        ),
      );
  } catch (error: any) {
    yield put(
      wmsCustomerActions.getCustomersFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getCustomerDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(WmsCustomerApi().retrieveCustomerDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(wmsCustomerActions.getCustomerDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      wmsCustomerActions.getCustomerDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* createCustomer(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(WmsCustomerApi().createCustomer, {
      ...params.payload,
    });
    if (result?.status === 201 || result?.status === 200) {
      yield put(
        wmsCustomerActions.createCustomerSuccess({ data: params.payload }),
      );
      Router.push("/user-management/customers");
    }
  } catch (error: any) {
    yield put(
      wmsCustomerActions.createCustomerFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* updateCustomer(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(WmsCustomerApi().updateCustomer, {
      ...params.payload,
    });
    if (result?.status === 200) {
      yield put(
        wmsCustomerActions.updateCustomerSuccess({ data: params.payload }),
      );
      Router.push("/user-management/customers");
    }
  } catch (error: any) {
    yield put(
      wmsCustomerActions.updateCustomerFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* deleteCustomer(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      WmsCustomerApi().deleteCustomer,
      params.payload.id,
    );
    if (result?.status === 200) {
      yield put(wmsCustomerActions.deleteCustomerSuccess({}));
      window.location.reload();
    }
  } catch (error: any) {
    yield put(
      wmsCustomerActions.deleteCustomerFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* WmsCustomerSaga() {
  yield all([
    takeEvery(wmsCustomerActions.getCustomersFetch.type, getCustomers),
    takeEvery(
      wmsCustomerActions.getCustomerDetailFetch.type,
      getCustomerDetail,
    ),
    takeEvery(wmsCustomerActions.createCustomerFetch.type, createCustomer),
    takeEvery(wmsCustomerActions.updateCustomerFetch.type, updateCustomer),
    takeEvery(wmsCustomerActions.deleteCustomerFetch.type, deleteCustomer),
  ]);
}

export default WmsCustomerSaga;
