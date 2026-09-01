/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import JourneyHistoryApi from "@sera-libraries/api/journey-history";
import { journeyHistoryActions } from "@sera-redux/slices/journey-history.slice";
import { BaseType } from "@sera-types/base.type";
import {
  FilterParams,
  GetJourneyDetailResponse,
  GetJourneyListResponse,
  GetSummaryResponse,
  JourneyDetailParams,
  JourneyHistoryState,
  journeyHistoryType,
} from "@sera-types/journey-history.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<FilterParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & JourneyHistoryState
> {
  try {
    const response = yield call(JourneyHistoryApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(journeyHistoryActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(journeyHistoryActions.getSummaryFailure(error));
  }
}

function* getJourneyList(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneyListResponse> & JourneyHistoryState
> {
  try {
    const result = yield call(JourneyHistoryApi().getJourneyList, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(journeyHistoryActions.getJourneyListSuccess(result.data));
    }
  } catch (error: any) {
    yield put(journeyHistoryActions.getJourneyListFailure(error));
  }
}

function* getACJourneyList(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneyListResponse> & JourneyHistoryState
> {
  try {
    const result = yield call(JourneyHistoryApi().getJourneyList, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(journeyHistoryActions.getACJourneyListSuccess(result.data));
    }
  } catch (error: any) {
    yield put(journeyHistoryActions.getACJourneyListFailure(error));
  }
}

function* getJourneyDetail(
  params: PayloadAction<JourneyDetailParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneyDetailResponse> & JourneyHistoryState
> {
  try {
    const response = yield call(JourneyHistoryApi().getJourneyDetail, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(journeyHistoryActions.getJourneyDetailSuccess(response.data));
    }
  } catch (error: any) {
    yield put(journeyHistoryActions.getJourneyDetailFailure(error));
  }
}

function* watchJourneyHistoryRequest() {
  yield takeEvery(journeyHistoryType.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(journeyHistoryType.GET_JOURNEY_LIST_FETCH, getJourneyList);
  yield takeEvery(
    journeyHistoryType.GET_AC_JOURNEY_LIST_FETCH,
    getACJourneyList,
  );
  yield takeEvery(
    journeyHistoryType.GET_JOURNEY_DETAIL_FETCH,
    getJourneyDetail,
  );
}

export default function* journeyHistorySaga() {
  yield all([fork(watchJourneyHistoryRequest)]);
}
