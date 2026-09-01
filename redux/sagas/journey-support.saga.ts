/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import JourneySupportApi from "@sera-libraries/api/journey-support";
import { journeySupportActions } from "@sera-redux/slices/journey-support.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetJourneySupportDetailResponse,
  GetJourneySupportListResponse,
  GetJourneySupportSummaryResponse,
  JourneySupportDetailPayload,
  JourneySupportState,
  JourneySupportSummaryPayload,
  journeySupportTypes,
  UpdateJourneyActivitySkywardPayload,
  UpdateJourneySupportActivtyPayload,
} from "@sera-types/journey-support.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getJourneySupportSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneySupportListResponse> & JourneySupportState
> {
  try {
    const result = yield call(JourneySupportApi().retrieveJourneySupport, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(journeySupportActions.getJourneySupportSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      journeySupportActions.getJourneySupportFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getJourneySupportAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneySupportListResponse> & JourneySupportState
> {
  try {
    const result = yield call(JourneySupportApi().retrieveJourneySupport, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        journeySupportActions.getJourneySupportAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      journeySupportActions.getJourneySupportAutoCompleteFailure(error),
    );
  }
}

function* getSummaryJourneySupportSaga(
  params: PayloadAction<JourneySupportSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneySupportSummaryResponse> & JourneySupportState
> {
  try {
    const result = yield call(JourneySupportApi().getSummaryJourneySupport, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        journeySupportActions.getSummaryJourneySupportSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(journeySupportActions.getSummaryJourneySupportFailure(error));
  }
}

function* getDetailJourneySupportSaga(
  params: PayloadAction<JourneySupportDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetJourneySupportDetailResponse> & JourneySupportState
> {
  try {
    const result = yield call(JourneySupportApi().getDetailJourneySupport, {
      id: params.payload.id,
    });

    if (result?.status === 200) {
      yield put(
        journeySupportActions.getDetailJourneySupportSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(journeySupportActions.getDetailJourneySupportFailure(error));
  }
}

function* updateActivitySaga(
  params: PayloadAction<UpdateJourneySupportActivtyPayload>,
): Generator<unknown, void, AxiosResponse<any> & JourneySupportState> {
  try {
    const result = yield call(JourneySupportApi().updateActivity, {
      ...params.payload,
    });

    if (result?.status === 200) {
      if (params.payload.callback) {
        params.payload.callback();
      }
      yield put(journeySupportActions.updateActivitySuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(journeySupportActions.updateActivityFailure(error));
  }
}

function* updateActivitySkywardSaga(
  params: PayloadAction<UpdateJourneyActivitySkywardPayload>,
): Generator<unknown, void, AxiosResponse<any>> {
  try {
    const result = yield call(JourneySupportApi().updateActivitySkyward, {
      id: params.payload.id,
    });

    if (result?.status === 200) {
      if (params.payload.callback) {
        params.payload.callback(result.data.data);
      }
      yield put(
        journeySupportActions.updateActivitySkywardSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(journeySupportActions.updateActivitySkywardFailure(error));
  }
}

function* watchJourneySupportRequest() {
  yield takeEvery(
    journeySupportTypes.GET_JOURNEY_SUPPORT_FETCH,
    getJourneySupportSaga,
  );
  yield takeEvery(
    journeySupportTypes.GET_JOURNEY_SUPPORT_AUTOCOMPLETE_FETCH,
    getJourneySupportAutoCompleteSaga,
  );
  yield takeEvery(
    journeySupportTypes.GET_SUMMARY_JOURNEY_SUPPORT_FETCH,
    getSummaryJourneySupportSaga,
  );
  yield takeEvery(
    journeySupportTypes.GET_DETAIL_JOURNEY_SUPPORT_FETCH,
    getDetailJourneySupportSaga,
  );
  yield takeEvery(
    journeySupportTypes.UPDATE_ACTIVITY_FETCH,
    updateActivitySaga,
  );
  yield takeEvery(
    journeySupportTypes.UPDATE_ACTIVITY_SKYWARD_FETCH,
    updateActivitySkywardSaga,
  );
}

export default function* journeySupportSaga() {
  yield all([fork(watchJourneySupportRequest)]);
}
