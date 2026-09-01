/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import UnitActivityApi from "@sera-libraries/api/unit-activity";
import { unitActivityActions } from "@sera-redux/slices/unit-activity.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetLastLocationResponse,
  GetMaintenanceLevelResponse,
  GetMaintenanceStatusResponse,
  GetMaintenanceTypeResponse,
  GetPMCheckDetailResponse,
  GetSummaryResponse,
  GetUnitDetailResponse,
  GetUnitResponse,
  LocationPayload,
  MaintenancePayload,
  MaintenanceUpdatePayload,
  PMCheckPayload,
  UnitActivityState,
  unitActivityTypes,
  UnitDetailPayload,
  UnitParams,
} from "@sera-types/unit-activity";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getUnit(
  params: PayloadAction<BaseType & UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getUnit, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(unitActivityActions.getUnitSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getUnitFailure(error));
  }
}

function* getUnitAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetUnitResponse> & UnitParams> {
  try {
    const result = yield call(UnitActivityApi().getUnit, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(unitActivityActions.getUnitAutoCompleteSuccess(result.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getUnitAutoCompleteFailure(error));
  }
}

function* getUnitDetail(
  params: PayloadAction<UnitDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitDetailResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getUnitDetail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(unitActivityActions.getUnitDetailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getUnitDetailFailure(error));
  }
}

function* getPMCheckDetail(
  params: PayloadAction<UnitDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetPMCheckDetailResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getPMCheckDetail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(unitActivityActions.getPMCheckDetailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getPMCheckDetailFailure(error));
  }
}

function* getSummary(
  params: PayloadAction<UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getSummary, params.payload);

    if (response?.status === 200) {
      yield put(unitActivityActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getSummaryFailure(error));
  }
}

function* createMaintenance(
  params: PayloadAction<MaintenancePayload>,
): Generator<unknown, void, AxiosResponse<any> & UnitActivityState> {
  try {
    const result = yield call(
      UnitActivityApi().createMaintenance,
      params?.payload,
    );

    if (result?.status === 201) {
      yield call(Router.back);
      yield put(
        unitActivityActions.createMaintenanceSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(unitActivityActions.createMaintenanceFailure(error));
  }
}

function* updateMaintenance(
  params: PayloadAction<MaintenanceUpdatePayload>,
): Generator<unknown, void, AxiosResponse<any> & UnitActivityState> {
  try {
    const result = yield call(
      UnitActivityApi().updateMaintenance,
      params?.payload,
    );

    if (result?.status === 200) {
      yield call(Router.back);
      yield put(
        unitActivityActions.updateMaintenanceSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(unitActivityActions.updateMaintenanceFailure(error));
  }
}

function* updatePMCheck(
  params: PayloadAction<PMCheckPayload>,
): Generator<unknown, void, AxiosResponse<any> & UnitActivityState> {
  try {
    const result = yield call(UnitActivityApi().updatePMCheck, params?.payload);

    if (result?.status === 201) {
      yield call(Router.back);
      yield put(
        unitActivityActions.updatePMCheckSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(unitActivityActions.updatePMCheckFailure(error));
  }
}

function* getLastLocation(
  params: PayloadAction<LocationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLastLocationResponse> & UnitActivityState
> {
  try {
    const result = yield call(UnitActivityApi().getLastLocation, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(unitActivityActions.getLastLocationSuccess(result.data));
    }
  } catch (error) {
    yield put(unitActivityActions.getLastLocationFailure(error));
  }
}

function* getMaintenanceStatus(): Generator<
  unknown,
  void,
  AxiosResponse<GetMaintenanceStatusResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getMaintenanceStatus);

    if (response?.status === 200) {
      yield put(unitActivityActions.getMaintenanceStatusSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getMaintenanceStatusFailure(error));
  }
}

function* getMaintenanceType(): Generator<
  unknown,
  void,
  AxiosResponse<GetMaintenanceTypeResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getMaintenanceType);

    if (response?.status === 200) {
      yield put(unitActivityActions.getMaintenanceTypeSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getMaintenanceTypeFailure(error));
  }
}

function* getMaintenanceLevel(): Generator<
  unknown,
  void,
  AxiosResponse<GetMaintenanceLevelResponse> & UnitActivityState
> {
  try {
    const response = yield call(UnitActivityApi().getMaintenanceLevel);

    if (response?.status === 200) {
      yield put(unitActivityActions.getMaintenanceLevelSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getMaintenanceLevelFailure(error));
  }
}

function* getLocationCount(
  params: PayloadAction<UnitDetailPayload>,
): Generator<unknown, void, AxiosResponse<any> & UnitActivityState> {
  try {
    const response = yield call(UnitActivityApi().getLocationCount, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(unitActivityActions.getLocationCountSuccess(response.data));
    }
  } catch (error: any) {
    yield put(unitActivityActions.getLocationCountFailure(error));
  }
}

function* watchUnitActivityRequest() {
  yield takeEvery(unitActivityTypes.GET_UNIT_FETCH, getUnit);
  yield takeEvery(
    unitActivityTypes.GET_UNIT_AUTOCOMPLETE_FETCH,
    getUnitAutoComplete,
  );
  yield takeEvery(unitActivityTypes.GET_UNIT_DETAIL_FETCH, getUnitDetail);
  yield takeEvery(
    unitActivityTypes.GET_PM_CHECK_DETAIL_FETCH,
    getPMCheckDetail,
  );
  yield takeEvery(unitActivityTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(
    unitActivityTypes.CREATE_MAINTENANCE_FETCH,
    createMaintenance,
  );
  yield takeEvery(
    unitActivityTypes.UPDATE_MAINTENANCE_FETCH,
    updateMaintenance,
  );
  yield takeEvery(unitActivityTypes.UPDATE_PM_CHECK_FETCH, updatePMCheck);
  yield takeEvery(unitActivityTypes.GET_LAST_LOCATION_FETCH, getLastLocation);
  yield takeEvery(
    unitActivityTypes.GET_MAINTENANCE_STATUS_FETCH,
    getMaintenanceStatus,
  );
  yield takeEvery(
    unitActivityTypes.GET_MAINTENANCE_TYPE_FETCH,
    getMaintenanceType,
  );
  yield takeEvery(
    unitActivityTypes.GET_MAINTENANCE_LEVEL_FETCH,
    getMaintenanceLevel,
  );
  yield takeEvery(unitActivityTypes.LOCATION_COUNT_FETCH, getLocationCount);
}

export default function* UnitActivitySaga() {
  yield all([fork(watchUnitActivityRequest)]);
}
