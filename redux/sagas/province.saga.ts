/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ProvinceApi from "@sera-libraries/api/province";
import { provinceActions } from "@sera-redux/slices/province.slice";
import {
  GetProvinceDropdownPayload,
  GetProvinceDropdownResponse,
  ProvinceState,
  provinceTypes,
} from "@sera-types/provinces.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownProvinces(
  params: PayloadAction<GetProvinceDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetProvinceDropdownResponse> & ProvinceState
> {
  try {
    const result = yield call(ProvinceApi().retrieveDropdownProvinces, {
      ...params?.payload,
    });
    if (result?.status === 200)
      yield put(provinceActions.getDropdownProvincesSuccess(result.data));
  } catch (error: any) {
    yield put(
      provinceActions.getDropdownProvincesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchProvincesRequest() {
  yield takeEvery(
    provinceTypes.GET_DROPDOWN_PROVINCES_FETCH,
    getDropdownProvinces,
  );
}

export default function* areaSaga() {
  yield all([fork(watchProvincesRequest)]);
}
