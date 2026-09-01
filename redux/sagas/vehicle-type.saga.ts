/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import VehicleTypeApi from "@sera-libraries/api/vehicle-type/index";
import { vehicleTypeActions } from "@sera-redux/slices/vehicle-type.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewVehicleTypePayload,
  DeleteVehicleTypePayload,
  GetVehicleTypeDropdownPayload,
  GetVehicleTypesResponse,
  UpdateVehicleTypePayload,
  VehicleTypeState,
  vehicleTypeTypes,
} from "@sera-types/vehicle-type.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getVehicleTypes(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const result = yield call(VehicleTypeApi().retrieveVehicleTypes, {
      ...params.payload,
    });

    if (result?.status === 200)
      yield put(vehicleTypeActions.getVehicleTypesSuccess(result.data));
  } catch (error: any) {
    yield put(
      vehicleTypeActions.getVehicleTypesFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* getVehicleTypesAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const result = yield call(
      VehicleTypeApi().retrieveVehicleTypesAutoComplete,
      { ...params.payload },
    );
    if (result?.status === 200)
      yield put(
        vehicleTypeActions.getVehicleTypesAutoCompleteSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      vehicleTypeActions.getVehicleTypesAutoCompleteFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* createNewVehicleType(
  params: PayloadAction<CreateNewVehicleTypePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const payload: CreateNewVehicleTypePayload = { ...params.payload };
    const res = yield call(VehicleTypeApi().createVehicleType, payload);
    if (res?.status === 201) {
      yield call(Router.push, "/master-data/vehicle-type");
      yield put(vehicleTypeActions.createNewVehicleTypeSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(vehicleTypeActions.createNewVehicleTypeFailure(error));
  }
}

function* getVehicleTypeDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const result = yield call(VehicleTypeApi().retrieveVehicleTypeDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(vehicleTypeActions.getVehicleTypeDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      vehicleTypeActions.getVehicleTypeDetailFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* updateVehicleType(
  params: PayloadAction<UpdateVehicleTypePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const payload: UpdateVehicleTypePayload = { ...params.payload };
    const res = yield call(VehicleTypeApi().updateVehicleType, {
      id: payload.id as string,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.push, "/master-data/vehicle-type");
      yield put(vehicleTypeActions.updateVehicleTypeSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(vehicleTypeActions.updateVehicleTypeFailure(error));
  }
}

function* deleteVehicleType(
  params: PayloadAction<DeleteVehicleTypePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const { id, options } = params.payload;
    const result = yield call(VehicleTypeApi().deleteVehicleType, id as string);

    if (result.status === 200) {
      yield put(
        vehicleTypeActions.deleteVehicleTypeSuccess({ ...params.payload }),
      );
      yield put(
        vehicleTypeActions.getVehicleTypesFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(vehicleTypeActions.deleteVehicleTypeFailure(error));
  }
}

function* getDropdownBusinessAreas(
  params: PayloadAction<GetVehicleTypeDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleTypesResponse> & VehicleTypeState
> {
  try {
    const result = yield call(
      VehicleTypeApi().retrieveDropdownVehicleTypes,
      params.payload,
    );

    if (result?.status === 200) {
      yield put(vehicleTypeActions.getDropdownVehicleTypesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(
      vehicleTypeActions.getDropdownVehicleTypesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchVehicleTypesRequest() {
  yield takeEvery(vehicleTypeTypes.GET_VEHICLE_TYPES_FETCH, getVehicleTypes);
  yield takeEvery(
    vehicleTypeTypes.GET_VEHICLE_TYPES_AUTOCOMPLETE_FETCH,
    getVehicleTypesAutoComplete,
  );
  yield takeEvery(
    vehicleTypeTypes.CREATE_VEHICLE_TYPE_FETCH,
    createNewVehicleType,
  );
  yield takeEvery(
    vehicleTypeTypes.GET_VEHICLE_TYPE_DETAIL_FETCH,
    getVehicleTypeDetail,
  );
  yield takeEvery(
    vehicleTypeTypes.UPDATE_VEHICLE_TYPE_FETCH,
    updateVehicleType,
  );
  yield takeEvery(
    vehicleTypeTypes.DELETE_VEHICLE_TYPE_FETCH,
    deleteVehicleType,
  );
  yield takeEvery(
    vehicleTypeTypes.GET_DROPDOWN_VEHICLE_TYPES_FETCH,
    getDropdownBusinessAreas,
  );
}

export default function* vehicleTypeSaga() {
  yield all([fork(watchVehicleTypesRequest)]);
}
