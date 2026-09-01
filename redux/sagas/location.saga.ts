/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import LocationApi from "@sera-libraries/api/location";
import {
  getDropdownLocationsFailure,
  getDropdownLocationsSuccess,
  getLocationDetailFailure,
  getLocationDetailSuccess,
  getLocationsAutoCompleteFailure,
  getLocationsAutoCompleteSuccess,
  getLocationsFailure,
  getLocationsSuccess,
  locationActions,
} from "@sera-redux/slices/location.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewLocationPayload,
  DeleteLocationPayload,
  DropdownLocationPayload,
  GetLocationsResponse,
  LocationState,
  locationTypes,
  UpdateLocationPayload,
} from "@sera-types/location.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getLocations(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const result = yield call(LocationApi().retrieveLocations, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getLocationsSuccess(result.data));
  } catch (error: any) {
    yield put(
      getLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getLocationsAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const result = yield call(LocationApi().retrieveLocations, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getLocationsAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      getLocationsAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewLocation(
  params: PayloadAction<CreateNewLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const payload: CreateNewLocationPayload = { ...params.payload };
    const res = yield call(LocationApi().createLocation, payload);
    if (res?.status === 201) {
      const { data } = res.data;
      yield call(Router.push, "/master-data/locations");
      yield put(
        locationActions.createNewLocationSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(locationActions.createNewLocationFailure(error));
  }
}

function* getLocationDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const result = yield call(LocationApi().retrieveLocationDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getLocationDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      getLocationDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* updateLocation(
  params: PayloadAction<UpdateLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const payload: UpdateLocationPayload = { ...params.payload };
    const res = yield call(LocationApi().updateLocation, payload);
    if (res?.status === 200) {
      const { data } = res.data;
      yield call(Router.push, "/master-data/locations");
      yield put(
        locationActions.updateLocationSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(locationActions.updateLocationFailure(error));
  }
}

function* deleteLocation(
  params: PayloadAction<DeleteLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const { id, name, options } = params.payload;
    const result = yield call(LocationApi().deleteLocation, id);

    if (result.status === 200) {
      yield put(locationActions.deleteLocationSuccess(result.data));
      yield put(locationActions.postDeleteLocationNotification({ id, name }));
      yield put(
        locationActions.getLocationsFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(locationActions.deleteLocationFailure(error));
  }
}

function* getDropdownLocations(
  params: PayloadAction<DropdownLocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationsResponse> & LocationState
> {
  try {
    const result = yield call(LocationApi().retrieveDropdownLocations, {
      ...params?.payload,
    });
    if (result?.status === 200)
      yield put(getDropdownLocationsSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownLocationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchRolesRequest() {
  yield takeEvery(locationTypes.GET_LOCATIONS_FETCH, getLocations);
  yield takeEvery(
    locationTypes.GET_LOCATIONS_AUTOCOMPLETE_FETCH,
    getLocationsAutoComplete,
  );
  yield takeEvery(locationTypes.CREATE_LOCATION_FETCH, createNewLocation);
  yield takeEvery(locationTypes.GET_LOCATION_DETAIL_FETCH, getLocationDetail);
  yield takeEvery(locationTypes.UPDATE_LOCATION_FETCH, updateLocation);
  yield takeEvery(locationTypes.DELETE_LOCATION_FETCH, deleteLocation);
  yield takeEvery(
    locationTypes.GET_DROPDOWN_LOCATIONS_FETCH,
    getDropdownLocations,
  );
}

export default function* locationSaga() {
  yield all([fork(watchRolesRequest)]);
}
