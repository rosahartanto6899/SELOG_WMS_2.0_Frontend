/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import OutgoingReportApi from "@sera-libraries/api/outgoing-report";
import { outgoingReportActions } from "@sera-redux/slices/outgoing-report.slice";
import { OutgoingReportListPayload } from "@sera-types/outgoing-report.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getOutgoingReport(
  params: PayloadAction<OutgoingReportListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(OutgoingReportApi().retrieveList, params.payload);
    const body = (result as any)?.data;
    // envelope backend: { page: {...}, data } — bukan `pagination`
    const pagination = body?.pagination ?? body?.page;
    yield put(
      outgoingReportActions.getOutgoingReportSuccess({
        data: body?.data ?? [],
        pagination,
        recordsTotal: pagination?.recordsTotal ?? pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      outgoingReportActions.getOutgoingReportFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* outgoingReportSaga() {
  yield all([
    takeEvery(
      outgoingReportActions.getOutgoingReportFetch.type,
      getOutgoingReport,
    ),
  ]);
}
