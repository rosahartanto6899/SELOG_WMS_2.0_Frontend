/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { outstandingOutgoingActions } from "@sera-redux/slices/outstanding-outgoing.slice";
import {
  InputOutgoingPayload,
  UpdateOutgoingPayload,
} from "@sera-types/outstanding-outgoing.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* submitOutgoing(
  params: PayloadAction<InputOutgoingPayload | UpdateOutgoingPayload>,
): Generator<unknown, void, AxiosResponse> {
  const payload = params.payload;
  const isUpdate = "id" in payload && !!payload.id;
  try {
    if (isUpdate) {
      const p = payload as UpdateOutgoingPayload;
      // urutan parity submit() input-incoming-form: header dulu, lalu detail
      const { id, updateDetails, details, ...header } = p;
      yield call(OutstandingOutgoingApi().updateOutgoingHeader, id, header);
      for (const row of updateDetails ?? []) {
        yield call(
          OutstandingOutgoingApi().updateOutgoingDetail,
          row.detailId,
          {
            qty: row.qty,
            additionalInformation: row.additionalInformation,
          },
        );
      }
      const newRows = (details ?? []).filter((d) => d.materialCode && d.qty);
      if (newRows.length) {
        yield call(OutstandingOutgoingApi().addDetails, id, newRows);
      }
    } else {
      yield call(
        OutstandingOutgoingApi().createOutgoing,
        payload as InputOutgoingPayload,
      );
    }
    yield put(outstandingOutgoingActions.submitOutgoingSuccess(null));
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.submitOutgoingFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

function* getOutgoingEdit(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      OutstandingOutgoingApi().retrieveEdit,
      params.payload.id,
    );
    const body = (result as any)?.data;
    yield put(
      outstandingOutgoingActions.getOutgoingEditSuccess({
        data: body?.data ?? null,
      }),
    );
  } catch (error: any) {
    yield put(
      outstandingOutgoingActions.getOutgoingEditFailure(
        error?.response?.data ?? { message: error?.message },
      ),
    );
  }
}

export default function* outstandingOutgoingSaga() {
  yield all([
    takeEvery(outstandingOutgoingActions.submitOutgoingFetch, submitOutgoing),
    takeEvery(outstandingOutgoingActions.getOutgoingEditFetch, getOutgoingEdit),
  ]);
}
