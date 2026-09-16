/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import IncomingReportApi from "@sera-libraries/api/incoming-report";
import { incomingReportActions } from "@sera-redux/slices/incoming-report.slice";
import { IncomingReportListPayload } from "@sera-types/incoming-report.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getIncomingReport(
  params: PayloadAction<IncomingReportListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(IncomingReportApi().retrieveList, params.payload);
    const body = (result as any)?.data;
    // envelope backend: { page: {...}, data } — bukan `pagination`
    const pagination = body?.pagination ?? body?.page;
    yield put(
      incomingReportActions.getIncomingReportSuccess({
        data: body?.data ?? [],
        pagination,
        recordsTotal: pagination?.recordsTotal ?? pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      incomingReportActions.getIncomingReportFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* incomingReportSaga() {
  yield all([
    takeEvery(
      incomingReportActions.getIncomingReportFetch.type,
      getIncomingReport,
    ),
  ]);
}
