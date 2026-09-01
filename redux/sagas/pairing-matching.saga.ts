/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import PairingMatchingApi from "@sera-libraries/api/pairing-matching";
import { pairingMatchingActions } from "@sera-redux/slices/pairing-matching.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetCapacityPairedResponse,
  GetDemandsResponse,
  GetPairingHistoryResponse,
  GetSummaryResponse,
  GetUnitDetailResponse,
  GetUnitPositionResponse,
  GetUnpairedDriverResponse,
  GetUnpairedUnitResponse,
  PairingConfirmPayload,
  PairingConfirmResponse,
  PairingHistoryParams,
  PairingMatchingState,
  pairingMatchingTypes,
  PairingProcessPayload,
  PairingProcessResponse,
  UnitDetailParams,
  UnitParams,
} from "@sera-types/pairing-matching";
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
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedUnitResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getUnpairedUnit, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnpairedUnitSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnpairedUnitFailure(error));
  }
}

function* getACUnpairedUnit(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedUnitResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getUnpairedUnit, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getACUnpairedUnitSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACUnpairedUnitFailure(error));
  }
}

function* getUnpairedDriver(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedDriverResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().getUnpairedDriver, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.getUnpairedDriverSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getUnpairedDriverFailure(error));
  }
}

function* getACUnpairedDriver(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnpairedDriverResponse> & PairingMatchingState
> {
  try {
    const result = yield call(PairingMatchingApi().getUnpairedDriver, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(pairingMatchingActions.getACUnpairedDriverSuccess(result.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACUnpairedDriverFailure(error));
  }
}

function* pairingProcess(
  params: PayloadAction<PairingProcessPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<PairingProcessResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().pairingProcess, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.pairingProcessSuccess(response.data));
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

function* getACCapacityPaired(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCapacityPairedResponse> & PairingMatchingState
> {
  try {
    const result = yield call(PairingMatchingApi().getCapacityPaired, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(pairingMatchingActions.getACCapacityPairedSuccess(result.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.getACCapacityPairedFailure(error));
  }
}

function* pairingConfirm(
  params: PayloadAction<PairingConfirmPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<PairingConfirmResponse> & PairingMatchingState
> {
  try {
    const response = yield call(PairingMatchingApi().pairingConfirm, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(pairingMatchingActions.pairingConfirmSuccess(response.data));
    }
  } catch (error: any) {
    yield put(pairingMatchingActions.pairingConfirmFailure(error));
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

function* watchPairingMatchingRequest() {
  yield takeEvery(pairingMatchingTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(
    pairingMatchingTypes.GET_UNIT_POSITION_FETCH,
    getUnitPosition,
  );
  yield takeEvery(pairingMatchingTypes.GET_UNIT_DETAIL_FETCH, getUnitDetail);
  yield takeEvery(pairingMatchingTypes.GET_DEMANDS_FETCH, getDemands);
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
  yield takeEvery(
    pairingMatchingTypes.GET_AC_CAPACITY_PAIRED_FETCH,
    getACCapacityPaired,
  );
  yield takeEvery(pairingMatchingTypes.PAIRING_CONFIRM_FETCH, pairingConfirm);
  yield takeEvery(
    pairingMatchingTypes.GET_PAIRING_HISTORY_FETCH,
    getPairingHistory,
  );
}

export default function* PairingMatchingSaga() {
  yield all([fork(watchPairingMatchingRequest)]);
}
