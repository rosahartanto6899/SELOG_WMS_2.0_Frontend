import { PayloadAction } from "@reduxjs/toolkit";
import CustomerApi from "@sera-libraries/api/customer";
import { customerActions } from "@sera-redux/slices/customer.slice";
import { BaseType } from "@sera-types/base.type";
import { CustomerState, GetCustomersResponse } from "@sera-types/customer.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getCustomers(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomersResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().retrieveCustomers, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        customerActions.getCustomersSuccess(
          result.data as GetCustomersResponse,
        ),
      );
  } catch (error: any) {
    yield put(
      customerActions.getCustomersFailure({
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
    const result = yield call(CustomerApi().retrieveCustomerDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(customerActions.getCustomerDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      customerActions.getCustomerDetailFailure({
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
    const result = yield call(CustomerApi().createCustomer, {
      ...params.payload,
    });
    if (result?.status === 201 || result?.status === 200) {
      yield put(
        customerActions.createCustomerSuccess({ data: params.payload }),
      );
      Router.push("/user-management/customers");
    }
  } catch (error: any) {
    yield put(
      customerActions.createCustomerFailure({
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
    const result = yield call(CustomerApi().updateCustomer, {
      ...params.payload,
    });
    if (result?.status === 200) {
      yield put(
        customerActions.updateCustomerSuccess({ data: params.payload }),
      );
      Router.push("/user-management/customers");
    }
  } catch (error: any) {
    yield put(
      customerActions.updateCustomerFailure({
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
    const result = yield call(CustomerApi().deleteCustomer, params.payload.id);
    if (result?.status === 200) {
      yield put(customerActions.deleteCustomerSuccess({}));
      window.location.reload();
    }
  } catch (error: any) {
    yield put(
      customerActions.deleteCustomerFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* customerSaga() {
  yield all([
    takeEvery(customerActions.getCustomersFetch.type, getCustomers),
    takeEvery(customerActions.getCustomerDetailFetch.type, getCustomerDetail),
    takeEvery(customerActions.createCustomerFetch.type, createCustomer),
    takeEvery(customerActions.updateCustomerFetch.type, updateCustomer),
    takeEvery(customerActions.deleteCustomerFetch.type, deleteCustomer),
  ]);
}

export default customerSaga;
