import { PayloadAction } from "@reduxjs/toolkit";
import DriverFatigueApi from "@sera-libraries/api/driver-fatigue";
import { fatigueActions } from "@sera-redux/slices/driver-fatigue.slice";
import { BaseType } from "@sera-types/base.type";
import {
  driverFatigueTypes,
  IDriverFatigueState,
  IDriverFilterResponse,
  IFatigueDetailsResponse,
  IFatigueListResponse,
  IFatiguePayloadHealthCheck,
  ISummaryPayload,
  ISummaryResponse,
} from "@sera-types/driver-fatigue.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getFatigueList(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<IFatigueListResponse> & IDriverFatigueState
> {
  try {
    const result = yield call(DriverFatigueApi().retrieveFatigueList, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(fatigueActions.getFatigueListFetchSuccess(result.data));
    }
  } catch (error: any) {
    yield put(fatigueActions.getFatigueListFailure(error));
  }
}

function* getSummary(
  params: PayloadAction<ISummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<ISummaryResponse> & IDriverFatigueState
> {
  try {
    const result = yield call(DriverFatigueApi().retrieveSummary, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(fatigueActions.getSummaryFetchSuccess(result.data));
    }
  } catch (error: unknown) {
    yield put(fatigueActions.getSummaryFailure(error));
  }
}

function* getFatigueFilter(): Generator<
  unknown,
  void,
  AxiosResponse<IDriverFilterResponse>[] & IDriverFatigueState
> {
  try {
    const result = yield call(DriverFatigueApi().retrieveFatigueFilter);

    const tempData: IDriverFilterResponse[] = [];

    result.forEach((e) => {
      if (e.status === 200) {
        tempData.push(e.data);
      }
    });

    yield put(fatigueActions.getFatigueFilterFetchSuccess(tempData));
  } catch (error: unknown) {
    yield put(fatigueActions.getFatigueFilterFailure(error));
  }
}

function* getFatigueDetails(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<IFatigueDetailsResponse> & IDriverFatigueState
> {
  try {
    const result = yield call(DriverFatigueApi().retrieveFatigueDetails, {
      id: params.payload.id,
    });

    yield put(fatigueActions.getFatigueDetailsSuccess(result.data.data));
  } catch (error: unknown) {
    yield put(fatigueActions.getFatigueDetailsFailure(error));
  }
}

function* postFatigueDetails(
  params: PayloadAction<{
    payload: IFatiguePayloadHealthCheck;
    callback?: () => void;
  }>,
): Generator<unknown, void, AxiosResponse<any> & IDriverFatigueState> {
  const { payload, callback } = params.payload;
  try {
    yield call(
      DriverFatigueApi().updateFatigueData,
      {
        ...payload,
      },
      callback,
    );

    yield put(fatigueActions.postFatigueDetailsSuccess());
  } catch (error: unknown) {
    yield put(fatigueActions.postFatigueDetailsFailure(error));
  }
}

function* watchDriverFatigueRequest() {
  yield takeEvery(driverFatigueTypes.GET_SUMMARY, getSummary);
  yield takeEvery(driverFatigueTypes.GET_FATIGUE_LIST_FETCH, getFatigueList);
  yield takeEvery(
    driverFatigueTypes.GET_FATIGUE_FILTER_FETCH,
    getFatigueFilter,
  );
  yield takeEvery(
    driverFatigueTypes.GET_FATIGUE_DETAIL_FETCH,
    getFatigueDetails,
  );
  yield takeEvery(
    driverFatigueTypes.POST_FATIGUE_DETAIL_FETCH,
    postFatigueDetails,
  );
}

export default function* customerSaga() {
  yield all([fork(watchDriverFatigueRequest)]);
}
