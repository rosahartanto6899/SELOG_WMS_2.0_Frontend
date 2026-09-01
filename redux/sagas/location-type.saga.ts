/* eslint-disable @typescript-eslint/no-explicit-any */
import LocationTypeApi from "@sera-libraries/api/location-type";
import {
  getDropdownLocationTypesFailure,
  getDropdownLocationTypesSuccess,
} from "@sera-redux/slices/location-type.slice";
import {
  GetLocationTypesResponse,
  LocationTypeState,
  locationTypeTypes,
} from "@sera-types/location-type.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownLocationTypes(): Generator<
  unknown,
  void,
  AxiosResponse<GetLocationTypesResponse> & LocationTypeState
> {
  try {
    const result = yield call(LocationTypeApi().retrieveDropdownLocationTypes);
    if (result?.status === 200)
      yield put(getDropdownLocationTypesSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownLocationTypesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchLocationTypesRequest() {
  yield takeEvery(
    locationTypeTypes.GET_DROPDOWN_LOCATION_TYPES_FETCH,
    getDropdownLocationTypes,
  );
}

export default function* locationTypeSaga() {
  yield all([fork(watchLocationTypesRequest)]);
}
