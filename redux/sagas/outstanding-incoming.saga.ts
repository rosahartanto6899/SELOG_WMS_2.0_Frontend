/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { outstandingIncomingActions } from "@sera-redux/slices/outstanding-incoming.slice";
import {
  OutstandingIncomingDetailPayload,
  OutstandingIncomingListPayload,
} from "@sera-types/outstanding-incoming.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getOutstandingIncoming(
  params: PayloadAction<OutstandingIncomingListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      OutstandingIncomingApi().retrieveList,
      params.payload,
    );
    const body = (result as any)?.data;
    yield put(
      outstandingIncomingActions.getOutstandingIncomingSuccess({
        data: body?.data ?? [],
        pagination: body?.pagination,
        recordsTotal:
          body?.pagination?.recordsTotal ?? body?.pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingIncomingActions.getOutstandingIncomingFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

function* getOutstandingIncomingSummary(
  params: PayloadAction<{ warehouseCodes?: string[] | null }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const warehouseCodes = params.payload?.warehouseCodes ?? [];
    const buckets = (yield call(
      OutstandingIncomingApi().retrieveSummaryBucketsTyped,
      { warehouseCodes },
    )) as unknown as any;
    yield put(
      outstandingIncomingActions.getOutstandingIncomingSummarySuccess({
        data: buckets,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingIncomingActions.getOutstandingIncomingSummaryFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

function* getOutstandingIncomingDetail(
  params: PayloadAction<OutstandingIncomingDetailPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const [header, history] = (yield all([
      call(OutstandingIncomingApi().retrieveDetailTyped, params.payload.id),
      call(OutstandingIncomingApi().retrieveHistoryTyped, params.payload.id),
    ])) as unknown as any[];
    yield put(
      outstandingIncomingActions.getOutstandingIncomingDetailSuccess({
        data: header,
        history,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingIncomingActions.getOutstandingIncomingDetailFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* outstandingIncomingSaga() {
  yield all([
    takeEvery(
      outstandingIncomingActions.getOutstandingIncomingFetch.type,
      getOutstandingIncoming,
    ),
    takeEvery(
      outstandingIncomingActions.getOutstandingIncomingSummaryFetch.type,
      getOutstandingIncomingSummary,
    ),
    takeEvery(
      outstandingIncomingActions.getOutstandingIncomingDetailFetch.type,
      getOutstandingIncomingDetail,
    ),
  ]);
}
