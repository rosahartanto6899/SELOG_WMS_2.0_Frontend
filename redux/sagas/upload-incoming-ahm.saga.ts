/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import UploadIncomingAhmApi from "@sera-libraries/api/upload-incoming-ahm";
import { uploadIncomingAhmActions } from "@sera-redux/slices/upload-incoming-ahm.slice";
import {
  DownloadTemplatePayload,
  UpsertRowPayload,
} from "@sera-types/upload-incoming-ahm.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* downloadTemplate(
  params: PayloadAction<DownloadTemplatePayload>,
): Generator<unknown, void, AxiosResponse<Blob>> {
  try {
    const result = yield call(UploadIncomingAhmApi().downloadTemplate);
    if (result?.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download =
        params.payload?.fileName ?? "Template-UploadIncomingAHM.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      yield put(uploadIncomingAhmActions.downloadTemplateSuccess());
    }
  } catch (error: any) {
    yield put(
      uploadIncomingAhmActions.downloadTemplateFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data?.code,
      }),
    );
  }
}

function* upsertRow(
  params: PayloadAction<UpsertRowPayload>,
): Generator<unknown, void, AxiosResponse> {
  const { index, row } = params.payload;
  try {
    const result = yield call(UploadIncomingAhmApi().upsertRow, row);
    if (result?.status === 200 || result?.status === 201) {
      yield put(
        uploadIncomingAhmActions.upsertRowSuccess({
          index,
          status: "success",
        }),
      );
    } else {
      yield put(
        uploadIncomingAhmActions.upsertRowFailure({
          index,
          status: "failed",
          reason: `HTTP ${result?.status}`,
        }),
      );
    }
  } catch (error: any) {
    // 422 → body.errors = [{field, message[]}]; flatten jadi satu string per baris
    const body = error?.response?.data ?? error?.data;
    const errors = body?.errors;
    const reason = Array.isArray(errors)
      ? errors
          .map((e: any) => {
            const msg = (e?.message ?? []).join(", ");
            // pesan backend sudah diawali nama field — jangan dobel
            return msg.startsWith(`${e?.field} `) ? msg : `${e?.field}: ${msg}`;
          })
          .join("; ")
      : String(body?.message ?? error?.statusText ?? "Failed to process row");
    yield put(
      uploadIncomingAhmActions.upsertRowFailure({
        index,
        status: "failed",
        reason,
      }),
    );
  }
}

export default function* uploadIncomingAhmSaga() {
  yield all([
    takeEvery(
      uploadIncomingAhmActions.downloadTemplateFetch.type,
      downloadTemplate,
    ),
    takeEvery(uploadIncomingAhmActions.upsertRowFetch.type, upsertRow),
  ]);
}
