/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ActualIncomingApi from "@sera-libraries/api/actual-incoming";
import { actualIncomingActions } from "@sera-redux/slices/actual-incoming.slice";
import { ActualIncomingListPayload } from "@sera-types/actual-incoming.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getActualIncoming(
  params: PayloadAction<ActualIncomingListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ActualIncomingApi().retrieveList, params.payload);
    const body = (result as any)?.data;
    yield put(
      actualIncomingActions.getActualIncomingSuccess({
        data: body?.data ?? [],
        pagination: body?.pagination,
        recordsTotal:
          body?.pagination?.recordsTotal ?? body?.pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      actualIncomingActions.getActualIncomingFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* actualIncomingSaga() {
  yield all([
    takeEvery(
      actualIncomingActions.getActualIncomingFetch.type,
      getActualIncoming,
    ),
  ]);
}
