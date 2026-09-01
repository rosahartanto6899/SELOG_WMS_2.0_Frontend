import { PayloadAction } from "@reduxjs/toolkit";
import ExportLogApi from "@sera-libraries/api/export-log";
import {
  getExportLogsFailure,
  getExportLogsSuccess,
} from "@sera-redux/slices/export-log.slice";
import {
  ExportLogPayload,
  ExportLogState,
  exportLogTypes,
  GetExportLogResponse,
} from "@sera-types/export-log.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getExportLogs(
  params: PayloadAction<ExportLogPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetExportLogResponse> & ExportLogState
> {
  try {
    const result = yield call(ExportLogApi().retrieveExportLog, params.payload);
    if (result?.status === 200) {
      yield put(getExportLogsSuccess(result.data));
    }
  } catch (error: any) {
    yield put(getExportLogsFailure(error));
  }
}

function* watchExportLogRequest() {
  yield takeEvery(exportLogTypes.GET_EXPORT_LOG_FETCH, getExportLogs);
}

export default function* exportLogSaga() {
  yield all([fork(watchExportLogRequest)]);
}
