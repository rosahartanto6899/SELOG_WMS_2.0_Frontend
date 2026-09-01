/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import PairingMatchingApi from "@sera-libraries/api/pairing-matching-ops";
import { pairingMatchingOpsActions as pairingMatchingActions } from "@sera-redux/slices/pairing-matching-ops.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetCapacityPairedResponse,
  GetDemandsResponse,
  GetPairingHistoryResponse,
  GetShipmentDetailResponse,
  GetSummaryResponse,
  GetUnitDetailResponse,
  GetUnitPositionResponse,
  GetUnpairedDriverResponse,
  GetUnpairedUnitResponse,
  IFilterDemandResponse,
  PairingConfirmPayload,
  PairingConfirmResponse,
  PairingHistoryParams,
  PairingMatchingState,
  pairingMatchingTypes,
  PairingProcessPayload,
  PairingProcessResponse,
  UnitDetailParams,
  UnitParams,
} from "@sera-types/pairing-matching-ops";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getSummaryFailure(error));
  }
}

function* getUnitPosition(
  params: PayloadAction<any>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitPositionResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getUnitPosition, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnitPositionSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnitPositionFailure(error));
  }
}

function* getUnitDetail(
  params: PayloadAction<UnitDetailParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnitDetailResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getUnitDetail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnitDetailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnitDetailFailure(error));
  }
}

function* getDemands(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDemandsResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getDemands, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getDemandsSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getDemandsFailure(error));
  }
}

function* getDemandFilter(): Generator<
  unknown,
  void,
  AxiosResponse<IFilterDemandResponse>[] & PairingMatchingState
> {
  try {
    const result = yield call(PairingMatchingApi().getDemandFilter);

    const tempData: IFilterDemandResponse[] = [];

    result.forEach((e) => {
      if (e.status === 200) {
        tempData.push(e.data);
      }
    });

    yield put(pairingMatchingActions.getFilterDemandSuccess(tempData));
    yield put(
      shipmentTypesActions.getShipmentTypesSuccess(
        tempData.find((e) => e.code === "SHIPMENT_TYPES_RETRIEVED")?.data ?? [],
      ),
    );
  } catch (error: unknown) {
    yield put(pairingMatchingActions.getFilterDemandFailure(error));
  }
}

function* getACDemands(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDemandsResponse> & PairingMatchingState
> {
  try {
    const result = yield call(PairingMatchingApi().getDemands, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(pairingMatchingActions.getACDemandsSuccess(result.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACDemandsFailure(error));
  }
}

function* getUnpairedUnit(
  params: PayloadAction<{
    payload: BaseType;
    customerId: string;
    originId: string;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedUnitResponse> & PairingMatchingState
> {
  try {
    const response = yield call(
      PairingMatchingApi().getUnpairedUnit,
      {
        ...params.payload.payload,
      },
      params.payload.customerId,
      params.payload.originId,
    );

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnpairedUnitSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnpairedUnitFailure(error));
  }
}

function* getACUnpairedUnit(
  params: PayloadAction<{
    payload: BaseType;
    customerId: string;
    originId: string;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedUnitResponse> & PairingMatchingState
> {
  try {
    const response = yield call(
      PairingMatchingApi().getUnpairedUnit,
      {
        ...params.payload.payload,
      },
      params.payload.customerId,
      params.payload.originId,
    );

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getACUnpairedUnitSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACUnpairedUnitFailure(error));
  }
}

function* getUnpairedDriver(
  params: PayloadAction<{
    payload: BaseType;
    customerId: string;
    originId: string;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedDriverResponse> & PairingMatchingState
> {
  try {
    const response = yield call(
      PairingMatchingApi().getUnpairedDriver,
      {
        ...params.payload.payload,
      },
      params.payload.customerId,
      params.payload.originId,
    );

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnpairedDriverSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnpairedDriverFailure(error));
  }
}

function* getACUnpairedDriver(
  params: PayloadAction<{
    payload: BaseType;
    customerId: string;
    originId: string;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedDriverResponse> & PairingMatchingState
> {
  try {
    const result = yield call(
      PairingMatchingApi().getUnpairedDriver,
      {
        ...params.payload.payload,
      },
      params.payload.customerId,
      params.payload.originId,
    );

    if (result?.status === 200) {
      yield put(pairingMatchingActions.getACUnpairedDriverSuccess(result.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACUnpairedDriverFailure(error));
  }
}

function* pairingProcess(
  params: PayloadAction<{
    payload: PairingProcessPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<PairingProcessResponse> & PairingMatchingState
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(PairingMatchingApi().pairingProcess, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.pairingProcessSuccess(response.data));
      if (callback) return callback();
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.pairingProcessFailure(error));
  }
}

function* getCapacityPaired(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCapacityPairedResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getCapacityPaired, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getCapacityPairedSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getCapacityPairedFailure(error));
  }
}

function* pairingConfirm(
  params: PayloadAction<{
    payload: PairingConfirmPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<PairingConfirmResponse> & PairingMatchingState
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(PairingMatchingApi().pairingConfirm, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.pairingConfirmSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.pairingConfirmFailure(error));
  }
}

function* pairingRepair(
  params: PayloadAction<{
    payload: PairingConfirmPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<PairingConfirmResponse> & PairingMatchingState
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(PairingMatchingApi().pairingRepair, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.pairingRepairSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.pairingRepairFailure(error));
  }
}

function* getPairingHistory(
  params: PayloadAction<PairingHistoryParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetPairingHistoryResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getPairingHistory, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getPairingHistorySuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getPairingHistoryFailure(error));
  }
}

function* getShipmentDetail(
  params: PayloadAction<PairingHistoryParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetShipmentDetailResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getShipmentDetail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getShipmentDetailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getShipmentDetailFailure(error));
  }
}

function* watchPairingMatchingRequest() {
  yield takeEvery(pairingMatchingTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(
    pairingMatchingTypes.GET_UNIT_POSITION_FETCH,
    getUnitPosition,
  );
  yield takeEvery(pairingMatchingTypes.GET_UNIT_DETAIL_FETCH, getUnitDetail);
  yield takeEvery(pairingMatchingTypes.GET_DEMANDS_FETCH, getDemands);
  yield takeEvery(
    pairingMatchingTypes.GET_DEMANDS_FILTER_FETCH,
    getDemandFilter,
  );
  yield takeEvery(pairingMatchingTypes.GET_AC_DEMANDS_FETCH, getACDemands);
  yield takeEvery(
    pairingMatchingTypes.GET_UNPAIRED_UNIT_FETCH,
    getUnpairedUnit,
  );
  yield takeEvery(
    pairingMatchingTypes.GET_AC_UNPAIRED_UNIT_FETCH,
    getACUnpairedUnit,
  );
  yield takeEvery(pairingMatchingTypes.PAIRING_PROCESS_FETCH, pairingProcess);
  yield takeEvery(
    pairingMatchingTypes.GET_UNPAIRED_DRIVER_FETCH,
    getUnpairedDriver,
  );
  yield takeEvery(
    pairingMatchingTypes.GET_AC_UNPAIRED_DRIVER_FETCH,
    getACUnpairedDriver,
  );
  yield takeEvery(
    pairingMatchingTypes.GET_CAPACITY_PAIRED_FETCH,
    getCapacityPaired,
  );
  yield takeEvery(pairingMatchingTypes.PAIRING_CONFIRM_FETCH, pairingConfirm);
  yield takeEvery(pairingMatchingTypes.PAIRING_REPAIR_FETCH, pairingRepair);
  yield takeEvery(
    pairingMatchingTypes.GET_PAIRING_HISTORY_FETCH,
    getPairingHistory,
  );
  yield takeEvery(
    pairingMatchingTypes.GET_SHIPMENT_DETAIL_FETCH,
    getShipmentDetail,
  );
}

export default function* PairingMatchingSaga() {
  yield all([fork(watchPairingMatchingRequest)]);
}
