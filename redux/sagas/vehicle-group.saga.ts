/* eslint-disable @typescript-eslint/no-explicit-any */
import VehicleGroupApi from "@sera-libraries/api/vehicle-group";
import {
  getDropdownVehicleGroupsFailure,
  getDropdownVehicleGroupsSuccess,
} from "@sera-redux/slices/vehicle-group.slice";
import {
  GetVehicleGroupsResponse,
  VehicleGroupState,
  vehicleGroupTypes,
} from "@sera-types/vehicle-group.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDropdownVehicleGroups(): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleGroupsResponse> & VehicleGroupState
> {
  try {
    const result = yield call(VehicleGroupApi().retrieveDropdownVehicleGroup);
    if (result?.status === 200)
      yield put(getDropdownVehicleGroupsSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownVehicleGroupsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchVehicleGroupsRequest() {
  yield takeEvery(
    vehicleGroupTypes.GET_DROPDOWN_VEHICLE_GROUPS_FETCH,
    getDropdownVehicleGroups,
  );
}

export default function* vehicleGroupSaga() {
  yield all([fork(watchVehicleGroupsRequest)]);
}
