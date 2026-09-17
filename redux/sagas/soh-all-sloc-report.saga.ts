/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import SohAllSlocReportApi from "@sera-libraries/api/soh-all-sloc-report";
import { sohAllSlocReportActions } from "@sera-redux/slices/soh-all-sloc-report.slice";
import { SohAllSlocReportListPayload } from "@sera-types/soh-all-sloc-report.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getSohAllSlocReport(
  params: PayloadAction<SohAllSlocReportListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      SohAllSlocReportApi().retrieveList,
      params.payload,
    );
    const body = (result as any)?.data;
    // envelope backend: { data: { warehouses, rows }, pagination }
    // warehouses = kode warehouse user — sumber kolom dinamis tabel
    const pagination = body?.pagination ?? body?.page;
    yield put(
      sohAllSlocReportActions.getSohAllSlocReportSuccess({
        data: body?.data?.rows ?? [],
        warehouses: body?.data?.warehouses ?? [],
        pagination,
        recordsTotal: pagination?.recordsTotal ?? pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      sohAllSlocReportActions.getSohAllSlocReportFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* sohAllSlocReportSaga() {
  yield all([
    takeEvery(
      sohAllSlocReportActions.getSohAllSlocReportFetch.type,
      getSohAllSlocReport,
    ),
  ]);
}
