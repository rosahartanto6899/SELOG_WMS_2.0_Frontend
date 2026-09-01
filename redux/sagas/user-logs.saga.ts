import { PayloadAction } from "@reduxjs/toolkit";
import UserLogApi from "@sera-libraries/api/user-logs";
import MessageHandler from "@sera-libraries/message-handler";
import {
  getUserLogDetailFailure,
  getUserLogDetailSuccess,
  getUserLogsAutoCompleteFailure,
  getUserLogsAutoCompleteSuccess,
  getUserLogsFailure,
  getUserLogsSuccess,
  userLogActions,
} from "@sera-redux/slices/user-logs.slice";
import { BaseType } from "@sera-types/base.type";
import {
  ExportUserLogsPayload,
  GetUserLogsResponse,
  UserLogState,
  userLogTypes,
} from "@sera-types/user-logs.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getUserLogs(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetUserLogsResponse> & UserLogState> {
  try {
    const result = yield call(UserLogApi().retrieveUserLogs, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getUserLogsSuccess(result.data));
  } catch (error: any) {
    yield put(
      getUserLogsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getUserLogsAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetUserLogsResponse> & UserLogState> {
  try {
    const result = yield call(UserLogApi().retrieveUserLogs, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getUserLogsAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      getUserLogsAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getUserLogDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse<GetUserLogsResponse> & UserLogState> {
  try {
    const result = yield call(UserLogApi().retrieveUserLogDetail, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getUserLogDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      getUserLogDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* exportUserLogs(
  params: PayloadAction<ExportUserLogsPayload>,
): Generator<unknown, void, AxiosResponse<GetUserLogsResponse> & UserLogState> {
  try {
    const result = yield call(UserLogApi().exportUserLogs, params.payload);
    if (result.status === 200) {
      yield put(userLogActions.exportUserLogsSuccess(result.data));
      yield call(MessageHandler().success, {
        content:
          result.data.message ??
          "User Log export was successful. Please check your email periodically.",
      });
    }
  } catch (error) {
    yield put(userLogActions.exportUserLogsFailure(error));
  }
}

function* watchUserLogsRequest() {
  yield takeEvery(userLogTypes.GET_USER_LOGS_FETCH, getUserLogs);
  yield takeEvery(
    userLogTypes.GET_USER_LOGS_AUTOCOMPLETE_FETCH,
    getUserLogsAutoComplete,
  );
  yield takeEvery(userLogTypes.GET_USER_LOG_DETAIL_FETCH, getUserLogDetail);
  yield takeEvery(userLogTypes.EXPORT_USER_LOG_FETCH, exportUserLogs);
}

export default function* userLogSaga() {
  yield all([fork(watchUserLogsRequest)]);
}
