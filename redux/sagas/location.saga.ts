/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import LocationApi from "@sera-libraries/api/location";
import MessageHandler from "@sera-libraries/message-handler";
import { locationActions } from "@sera-redux/slices/location.slice";
import { BaseType } from "@sera-types/base.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* flattenErrors(error: any) {
  const errors = error?.response?.data?.errors ?? error?.data?.errors;
  if (Array.isArray(errors))
    MessageHandler().error(
      errors
        .map((e: any) => `${e.field}: ${(e.message ?? []).join(", ")}`)
        .join("; "),
    );
}

function* getLocations(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().retrieveLocations, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(locationActions.getLocationsSuccess(result.data as any));
  } catch (error: any) {
    yield put(
      locationActions.getLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getLocationDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().retrieveLocationDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(locationActions.getLocationDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      locationActions.getLocationDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getDropdownLocations(
  params: PayloadAction<{
    customerCode?: string;
    warehouseCode?: string;
    zoneId?: string;
  }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().retrieveDropdownLocations, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(locationActions.getDropdownLocationsSuccess(result.data));
  } catch (error: any) {
    yield put(
      locationActions.getDropdownLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* createLocation(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().createLocation, {
      ...params.payload,
    });
    if (result?.status === 201 || result?.status === 200) {
      MessageHandler().success(`Location "${params.payload?.code}" created`);
      Router.push("/master-data/location");
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      locationActions.createLocationFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* updateLocation(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().updateLocation, {
      ...params.payload,
    });
    if (result?.status === 200) {
      MessageHandler().success(
        `Location "${params.payload?.items?.name}" updated`,
      );
      Router.push("/master-data/location");
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      locationActions.updateLocationFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* deleteLocation(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(LocationApi().deleteLocation, params.payload?.id);
    if (result?.status === 200) {
      MessageHandler().success(`Location "${params.payload?.name}" deleted`);
      yield put(locationActions.getLocationsFetch(params.payload?.options));
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      locationActions.deleteLocationFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

export default function* locationSaga() {
  yield all([
    takeEvery(locationActions.getLocationsFetch.type, getLocations),
    takeEvery(locationActions.getLocationDetailFetch.type, getLocationDetail),
    takeEvery(
      locationActions.getDropdownLocationsFetch.type,
      getDropdownLocations,
    ),
    takeEvery(locationActions.createLocationFetch.type, createLocation),
    takeEvery(locationActions.updateLocationFetch.type, updateLocation),
    takeEvery(locationActions.deleteLocationFetch.type, deleteLocation),
  ]);
}
