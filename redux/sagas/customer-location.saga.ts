/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CustomerLocation from "@sera-libraries/api/customer-location";
import { customerLocationActions } from "@sera-redux/slices/customer-location.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewCustomerLocationPayload,
  CustomerLocationState,
  customerLocationTypes,
  DeleteCustomerLocationPayload,
  DropdownCustomerLocationPayload,
  GetCustomerLocationsResponse,
  UpdateCustomerLocationPayload,
} from "@sera-types/customer-location.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getCustomerLocations(
  params: PayloadAction<BaseType & { customerId?: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const result = yield call(CustomerLocation().retrieveCustomerLocations, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        customerLocationActions.getCustomerLocationsSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerLocationActions.getCustomerLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getCustomerLocationsAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const result = yield call(CustomerLocation().retrieveCustomerLocations, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        customerLocationActions.getCustomerLocationsAutoCompleteSuccess(
          result.data,
        ),
      );
  } catch (error: any) {
    yield put(
      customerLocationActions.getCustomerLocationsAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewCustomerLocation(
  params: PayloadAction<CreateNewCustomerLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const payload: CreateNewCustomerLocationPayload = { ...params.payload };
    const res = yield call(CustomerLocation().createCustomerLocation, payload);
    if (res?.status === 201) {
      yield call(Router.push, "/sales-management/customer-location");
      yield put(
        customerLocationActions.createNewCustomerLocationSuccess({
          ...payload,
        }),
      );
    }
  } catch (error) {
    yield put(customerLocationActions.createNewCustomerLocationFailure(error));
  }
}

function* getCustomerLocationDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const result = yield call(
      CustomerLocation().retrieveCustomerLocationDetail,
      {
        ...params.payload,
      },
    );
    if (result?.status === 200)
      yield put(
        customerLocationActions.getCustomerLocationDetailSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerLocationActions.getCustomerLocationDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* updateLocation(
  params: PayloadAction<UpdateCustomerLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const payload: UpdateCustomerLocationPayload = { ...params.payload };
    const res = yield call(CustomerLocation().updateCustomerLocation, payload);
    if (res?.status === 200) {
      yield call(Router.push, "/sales-management/customer-location");
      yield put(
        customerLocationActions.updateCustomerLocationSuccess({ ...payload }),
      );
    }
  } catch (error) {
    yield put(customerLocationActions.updateCustomerLocationFailure(error));
  }
}

function* deleteCustomerLocation(
  params: PayloadAction<DeleteCustomerLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const { id, name, options } = params.payload;
    const result = yield call(CustomerLocation().deleteCustomerLocation, id);

    if (result.status === 200) {
      yield put(
        customerLocationActions.deleteCustomerLocationSuccess(result.data),
      );
      yield put(
        customerLocationActions.postDeleteCustomerLocationNotification({
          id,
          name,
        }),
      );
      yield put(
        customerLocationActions.getCustomerLocationsFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(customerLocationActions.deleteCustomerLocationFailure(error));
  }
}

function* getDropdownCustomerLocations(
  params: PayloadAction<DropdownCustomerLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerLocationsResponse> & CustomerLocationState
> {
  try {
    const result = yield call(
      CustomerLocation().retrieveDropdownCustomerLocations,
      {
        ...params?.payload,
      },
    );
    if (result?.status === 200)
      yield put(
        customerLocationActions.getDropdownCustomerLocationsSuccess(
          result.data,
        ),
      );
  } catch (error: any) {
    yield put(
      customerLocationActions.getDropdownCustomerLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchCustomerLocationsRequest() {
  yield takeEvery(
    customerLocationTypes.GET_CUSTOMER_LOCATIONS_FETCH,
    getCustomerLocations,
  );
  yield takeEvery(
    customerLocationTypes.GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE_FETCH,
    getCustomerLocationsAutoComplete,
  );
  yield takeEvery(
    customerLocationTypes.CREATE_CUSTOMER_LOCATION_FETCH,
    createNewCustomerLocation,
  );
  yield takeEvery(
    customerLocationTypes.GET_CUSTOMER_LOCATION_DETAIL_FETCH,
    getCustomerLocationDetail,
  );
  yield takeEvery(
    customerLocationTypes.UPDATE_CUSTOMER_LOCATION_FETCH,
    updateLocation,
  );
  yield takeEvery(
    customerLocationTypes.DELETE_CUSTOMER_LOCATION_FETCH,
    deleteCustomerLocation,
  );
  yield takeEvery(
    customerLocationTypes.GET_DROPDOWN_CUSTOMER_LOCATIONS_FETCH,
    getDropdownCustomerLocations,
  );
}

export default function* customerLocationSaga() {
  yield all([fork(watchCustomerLocationsRequest)]);
}
