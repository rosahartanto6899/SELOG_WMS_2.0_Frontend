/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import MasterDataApi from "@sera-libraries/api/master-data/index";
import { driverStatusActions } from "@sera-redux/slices/driver-status.slice";
import { employeeStatusActions } from "@sera-redux/slices/employee-status.slice";
import { masterDataActions } from "@sera-redux/slices/master-data.slice";
import { ownershipTypesActions } from "@sera-redux/slices/ownership-types.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import {
  LocationReversePayload,
  LocationReverseResponse,
  MasterDataResponse,
  MasterDataState,
  masterDataTypes,
} from "@sera-types/master-data.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getShipmentTypes(): Generator<unknown, void, AxiosResponse<any>> {
  try {
    const result = yield call(MasterDataApi().getShipmentTypes);

    if (result?.status === 200) {
      yield put(shipmentTypesActions.getShipmentTypesSuccess(result.data.data));
    }
  } catch (error: any) {
    yield put(
      shipmentTypesActions.getShipmentTypesFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* getOwnershipTypes(): Generator<unknown, void, AxiosResponse<any>> {
  try {
    const result = yield call(MasterDataApi().getOwnershipTypes);

    if (result?.status === 200) {
      yield put(
        ownershipTypesActions.getOwnershipTypesSuccess(result.data.data),
      );
    }
  } catch (error: any) {
    yield put(
      ownershipTypesActions.getOwnershipTypesFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* getEmployeeStatus(): Generator<unknown, void, AxiosResponse<any>> {
  try {
    const result = yield call(MasterDataApi().getEmployeeStatus);

    if (result?.status === 200) {
      yield put(
        employeeStatusActions.getEmployeeStatusSuccess(result.data.data),
      );
    }
  } catch (error: any) {
    yield put(
      employeeStatusActions.getEmployeeStatusFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* getDriverStatus(): Generator<unknown, void, AxiosResponse<any>> {
  try {
    const result = yield call(MasterDataApi().getDriverStatus);

    if (result?.status === 200) {
      yield put(driverStatusActions.getDriverStatusSuccess(result.data.data));
    }
  } catch (error: any) {
    yield put(
      driverStatusActions.getDriverStatusFailure({
        status: error?.status,
        statusText: error?.statusText,
        statusCode: error?.data?.code || error?.response?.data?.code,
      }),
    );
  }
}

function* getAreas(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getAreas);

    if (result?.status === 200) {
      yield put(masterDataActions.getAreasSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getAreasFailure(error));
  }
}

function* getOrderPriorities(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getOrderPriorities);

    if (result?.status === 200) {
      yield put(masterDataActions.getOrderPrioritiesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getOrderPrioritiesFailure(error));
  }
}

function* getUnitCapacityStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getUnitCapacityStatuses);

    if (result?.status === 200) {
      yield put(masterDataActions.getUnitCapacityStatusesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getUnitCapacityStatusesFailure(error));
  }
}

function* getDriverCapacityStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getDriverCapacityStatuses);

    if (result?.status === 200) {
      yield put(
        masterDataActions.getDriverCapacityStatusesSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(masterDataActions.getDriverCapacityStatusesFailure(error));
  }
}

function* getEmployeeStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getEmployeeStatuses);

    if (result?.status === 200) {
      yield put(masterDataActions.getEmployeeStatusesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getEmployeeStatusesFailure(error));
  }
}

function* getTierLevels(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getTierLevels);

    if (result?.status === 200) {
      yield put(masterDataActions.getTierLevelsSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getTierLevelsFailure(error));
  }
}

function* getShipmentConfirmationStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getShipmentConfirmationStatuses);

    if (result?.status === 200) {
      yield put(
        masterDataActions.getShipmentConfirmationStatusesSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(masterDataActions.getShipmentConfirmationStatusesFailure(error));
  }
}

function* getVoDCategories(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getVoDCategories);

    if (result?.status === 200) {
      yield put(masterDataActions.getVoDCategoriesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getVoDCategoriesFailure(error));
  }
}

function* getVoDStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getVoDStatuses);

    if (result?.status === 200) {
      yield put(masterDataActions.getVoDStatusesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getVoDStatusesFailure(error));
  }
}

function* getVoDTypes(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getVoDTypes);

    if (result?.status === 200) {
      yield put(masterDataActions.getVoDTypesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getVoDTypesFailure(error));
  }
}

function* getShipmentCancellationReasons(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getShipmentCancellationReasons);

    if (result?.status === 200) {
      yield put(
        masterDataActions.getShipmentCancellationReasonsSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(masterDataActions.getShipmentCancellationReasonsFailure(error));
  }
}

function* getLocationReverse(
  params: PayloadAction<LocationReversePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<LocationReverseResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getLocationReverse, {
      ...params?.payload,
    });

    if (result?.status === 200) {
      yield put(masterDataActions.getLocationReverseSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getLocationReverseFailure(error));
  }
}

function* getJourneyStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<MasterDataResponse> & MasterDataState
> {
  try {
    const result = yield call(MasterDataApi().getJourneyStatuses);

    if (result?.status === 200) {
      yield put(masterDataActions.getJourneyStatusesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(masterDataActions.getJourneyStatusesFailure(error));
  }
}

function* watchMasterDataRequest() {
  yield takeEvery(masterDataTypes.GET_SHIPMENT_TYPES_FETCH, getShipmentTypes);
  yield takeEvery(masterDataTypes.GET_OWNERSHIP_TYPES_FETCH, getOwnershipTypes);
  yield takeEvery(
    masterDataTypes.GET_EMPLOYEE_STATUS_TYPES_FETCH,
    getEmployeeStatus,
  );
  yield takeEvery(masterDataTypes.GET_DRIVER_STATUS_FETCH, getDriverStatus);
  yield takeEvery(masterDataTypes.GET_AREAS_FETCH, getAreas);
  yield takeEvery(
    masterDataTypes.GET_ORDER_PRIORITIES_FETCH,
    getOrderPriorities,
  );
  yield takeEvery(
    masterDataTypes.GET_UNIT_CAPACITY_STATUSES_FETCH,
    getUnitCapacityStatuses,
  );
  yield takeEvery(
    masterDataTypes.GET_DRIVER_CAPACITY_STATUSES_FETCH,
    getDriverCapacityStatuses,
  );
  yield takeEvery(
    masterDataTypes.GET_EMPLOYEE_STATUSES_FETCH,
    getEmployeeStatuses,
  );
  yield takeEvery(masterDataTypes.GET_TIER_LEVELS_FETCH, getTierLevels);
  yield takeEvery(
    masterDataTypes.GET_SHIPMENT_CONFIRMATION_STATUSES_FETCH,
    getShipmentConfirmationStatuses,
  );
  yield takeEvery(masterDataTypes.GET_VOD_CATEGORIES_FETCH, getVoDCategories);
  yield takeEvery(masterDataTypes.GET_VOD_STATUSES_FETCH, getVoDStatuses);
  yield takeEvery(masterDataTypes.GET_VOD_TYPES_FETCH, getVoDTypes);
  yield takeEvery(
    masterDataTypes.GET_SHIPMENT_CANCELLATION_REASONS_FETCH,
    getShipmentCancellationReasons,
  );
  yield takeEvery(
    masterDataTypes.GET_LOCATION_REVERSE_FETCH,
    getLocationReverse,
  );
  yield takeEvery(
    masterDataTypes.GET_JOURNEY_STATUSES_FETCH,
    getJourneyStatuses,
  );
}

export default function* masterDataSaga() {
  yield all([fork(watchMasterDataRequest)]);
}
