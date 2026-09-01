/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CityApi from "@sera-libraries/api/city";
import { cityActions } from "@sera-redux/slices/city.slice";
import {
  CityState,
  cityTypes,
  GetCityDropdownPayload,
  GetCityDropdownResponse,
} from "@sera-types/cities.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownCities(
  params: PayloadAction<GetCityDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCityDropdownResponse> & CityState
> {
  try {
    const result = yield call(CityApi().retrieveDropdownCities, {
      ...params?.payload,
    });
    if (result?.status === 200)
      yield put(cityActions.getDropdownCitiesSuccess(result.data));
  } catch (error: any) {
    yield put(
      cityActions.getDropdownCitiesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchCitiesRequest() {
  yield takeEvery(cityTypes.GET_DROPDOWN_CITIES_FETCH, getDropdownCities);
}

export default function* citySaga() {
  yield all([fork(watchCitiesRequest)]);
}
