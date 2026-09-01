/* eslint-disable @typescript-eslint/no-explicit-any */
import AreaApi from "@sera-libraries/api/area";
import {
  getDropdownAreasFailure,
  getDropdownAreasSuccess,
} from "@sera-redux/slices/area.slice";
import { AreaState, areaTypes, GetAreasResponse } from "@sera-types/area.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownAreas(): Generator<
  unknown,
  void,
  AxiosResponse<GetAreasResponse> & AreaState
> {
  try {
    const result = yield call(AreaApi().retrieveDropdownAreas);
    if (result?.status === 200) yield put(getDropdownAreasSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownAreasFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchAreasRequest() {
  yield takeEvery(areaTypes.GET_DROPDOWN_AREAS_FETCH, getDropdownAreas);
}

export default function* areaSaga() {
  yield all([fork(watchAreasRequest)]);
}
