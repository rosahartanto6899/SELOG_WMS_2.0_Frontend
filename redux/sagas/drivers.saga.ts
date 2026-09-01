/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import DriversApi from "@sera-libraries/api/drivers";
import { driversActions } from "@sera-redux/slices/drivers.slice";
import { BaseType } from "@sera-types/base.type";
import {
  DriversState,
  driversTypes,
  GetDriversResponse,
} from "@sera-types/drivers.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDriversSaga(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetDriversResponse> & DriversState> {
  try {
    const result = yield call(DriversApi().retrieveDrivers, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(driversActions.getDriversSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      driversActions.getDriversFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* watchDriversRequest() {
  yield takeEvery(driversTypes.GET_DRIVERS_FETCH, getDriversSaga);
}

export default function* driversSaga() {
  yield all([fork(watchDriversRequest)]);
}
