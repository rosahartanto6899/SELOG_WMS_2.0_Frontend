/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import DriverGanttChartApi from "@sera-libraries/api/driver-gantt-chart";
import {
  getDriverGanttChartFailure,
  getDriverGanttChartFetch,
  getDriverGanttChartSuccess,
  getDriverGanttChartSummaryFailure,
  getDriverGanttChartSummaryFetch,
  getDriverGanttChartSummarySuccess,
} from "@sera-redux/slices/driver-gantt-chart.slice";
import { BaseType } from "@sera-types/base.type";
import {
  IDriverGanttChartListResponse,
  IDriverGanttChartState,
  IDriverGanttChartSummaryResponse,
} from "@sera-types/driver-gantt-chart.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDriverGanttChart(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<IDriverGanttChartListResponse> & IDriverGanttChartState
> {
  try {
    const result = yield call(
      DriverGanttChartApi().retrieveDriverGanttChart,
      params.payload,
    );

    if (result?.status === 200) {
      yield put(getDriverGanttChartSuccess(result.data));
    }
  } catch (error: any) {
    yield put(
      getDriverGanttChartFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getDriverGanttChartSummary(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<IDriverGanttChartSummaryResponse> & IDriverGanttChartState
> {
  try {
    const result = yield call(
      DriverGanttChartApi().retrieveDriverGanttChartSummary,
      params.payload,
    );

    if (result?.status === 200) {
      yield put(getDriverGanttChartSummarySuccess(result.data));
    }
  } catch (error: any) {
    yield put(
      getDriverGanttChartSummaryFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* watchGetDriverGanttChart() {
  yield takeEvery(getDriverGanttChartFetch.type, getDriverGanttChart);
  yield takeEvery(
    getDriverGanttChartSummaryFetch.type,
    getDriverGanttChartSummary,
  );
}

export default function* driverGanttChartSaga() {
  yield all([fork(watchGetDriverGanttChart)]);
}
