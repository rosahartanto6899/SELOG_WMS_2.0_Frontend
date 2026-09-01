import { PayloadAction } from "@reduxjs/toolkit";
import DriverPerformanceApi from "@sera-libraries/api/driver-performance";
import { performanceActions } from "@sera-redux/slices/driver-performance.slice";
import { BaseType } from "@sera-types/base.type";
import {
  driverPerformanceTypes,
  IDriverPerformanceState,
  IPerformanceListResponse,
  IPerformanceSummaryResponse,
} from "@sera-types/driver-performance.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getPerformanceList(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<IPerformanceListResponse> & IDriverPerformanceState
> {
  try {
    const result = yield call(DriverPerformanceApi().retrievePerformanceList, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(performanceActions.getPerformanceListFetchSuccess(result.data));
    }
  } catch (error: any) {
    yield put(performanceActions.getPerformanceListFailure(error));
  }
}

function* getSummary(
  params: PayloadAction<any>,
): Generator<
  unknown,
  void,
  AxiosResponse<IPerformanceSummaryResponse> & IDriverPerformanceState
> {
  try {
    const result = yield call(DriverPerformanceApi().retrieveSummary, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(performanceActions.getSummaryFetchSuccess(result.data));
    }
  } catch (error: unknown) {
    yield put(performanceActions.getSummaryFailure(error));
  }
}

function* watchDriverFatigueRequest() {
  yield takeEvery(driverPerformanceTypes.GET_SUMMARY, getSummary);
  yield takeEvery(
    driverPerformanceTypes.GET_PERFORMANCE_LIST_FETCH,
    getPerformanceList,
  );
}

export default function* customerSaga() {
  yield all([fork(watchDriverFatigueRequest)]);
}
