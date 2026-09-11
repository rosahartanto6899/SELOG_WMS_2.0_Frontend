/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ActualOutgoingApi from "@sera-libraries/api/actual-outgoing";
import { actualOutgoingActions } from "@sera-redux/slices/actual-outgoing.slice";
import { ActualOutgoingListPayload } from "@sera-types/actual-outgoing.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getActualOutgoing(
  params: PayloadAction<ActualOutgoingListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ActualOutgoingApi().retrieveList, params.payload);
    const body = (result as any)?.data;
    yield put(
      actualOutgoingActions.getActualOutgoingSuccess({
        data: body?.data ?? [],
        pagination: body?.pagination,
        recordsTotal:
          body?.pagination?.recordsTotal ?? body?.pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      actualOutgoingActions.getActualOutgoingFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* actualOutgoingSaga() {
  yield all([
    takeEvery(
      actualOutgoingActions.getActualOutgoingFetch.type,
      getActualOutgoing,
    ),
  ]);
}
