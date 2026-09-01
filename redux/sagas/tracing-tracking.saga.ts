import { PayloadAction } from "@reduxjs/toolkit";
import TracingTracking from "@sera-libraries/api/tracing-tracking";
import { tracingTrackingActions } from "@sera-redux/slices/tracing-tracking-slice";
import initialState from "@sera-redux/states/tracing-tracking.state";
import { BaseType } from "@sera-types/base.type";
import {
  DetailParams,
  GetDetailsResponseData,
  GetListResponse,
  GetSummaryResponse,
  ITracingTrackingState,
  tracingTrackingTypes,
  UnitParams,
} from "@sera-types/tracking-tracking.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummarySaga(
  params: PayloadAction<UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & ITracingTrackingState
> {
  try {
    const response = yield call(TracingTracking().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(
        tracingTrackingActions.getSummarySuccess(
          response.data?.data ?? initialState.getSummary.data,
        ),
      );
    }
  } catch (error: any) {
    yield put(tracingTrackingActions.getSummaryFailure(error));
  }
}

function* getListSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetListResponse> & ITracingTrackingState
> {
  try {
    const result = yield call(TracingTracking().getList, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(tracingTrackingActions.getListSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      tracingTrackingActions.getListFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getDetailsSaga(
  params: PayloadAction<DetailParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailsResponseData> & ITracingTrackingState
> {
  try {
    const result = yield call(TracingTracking().getDetails, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        tracingTrackingActions.getDetailsSuccess(
          result.data ?? initialState?.getDetails,
        ),
      );
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      tracingTrackingActions.getDetailsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* watchDriversRequest() {
  yield takeEvery(tracingTrackingTypes.GET_LIST, getListSaga);
  yield takeEvery(tracingTrackingTypes.GET_SUMMARY, getSummarySaga);
  yield takeEvery(tracingTrackingTypes.GET_DETAILS, getDetailsSaga);
}

export default function* driversSaga() {
  yield all([fork(watchDriversRequest)]);
}
