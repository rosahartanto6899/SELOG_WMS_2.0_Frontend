/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import DistrictApi from "@sera-libraries/api/district";
import { districtActions } from "@sera-redux/slices/district.slice";
import {
  DistrictState,
  districtTypes,
  GetDistrictDropdownPayload,
  GetDistrictDropdownResponse,
} from "@sera-types/districts.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownDistricts(
  params: PayloadAction<GetDistrictDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDistrictDropdownResponse> & DistrictState
> {
  try {
    const result = yield call(DistrictApi().retrieveDropdownDistricts, {
      ...params?.payload,
    });
    if (result?.status === 200)
      yield put(districtActions.getDropdownDistrictsSuccess(result.data));
  } catch (error: any) {
    yield put(
      districtActions.getDropdownDistrictsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchDistrictsRequest() {
  yield takeEvery(
    districtTypes.GET_DROPDOWN_DISTRICTS_FETCH,
    getDropdownDistricts,
  );
}

export default function* districtSaga() {
  yield all([fork(watchDistrictsRequest)]);
}
