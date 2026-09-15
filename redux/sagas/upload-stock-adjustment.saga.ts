/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import UploadStockAdjustmentApi from "@sera-libraries/api/upload-stock-adjustment";
import { uploadStockAdjustmentActions } from "@sera-redux/slices/upload-stock-adjustment.slice";
import {
  DownloadTemplatePayload,
  UpsertRowPayload,
} from "@sera-types/upload-stock-adjustment.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* downloadTemplate(
  params: PayloadAction<DownloadTemplatePayload>,
): Generator<unknown, void, AxiosResponse<Blob>> {
  try {
    const result = yield call(UploadStockAdjustmentApi().downloadTemplate);
    if (result?.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download =
        params.payload?.fileName ?? "Template-UploadStockAdjustment.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      yield put(uploadStockAdjustmentActions.downloadTemplateSuccess());
    }
  } catch (error: any) {
    yield put(
      uploadStockAdjustmentActions.downloadTemplateFailure({
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
    const result = yield call(UploadStockAdjustmentApi().upsertRow, row);
    if (result?.status === 200 || result?.status === 201) {
      yield put(
        uploadStockAdjustmentActions.upsertRowSuccess({
          index,
          status: "success",
        }),
      );
    } else {
      yield put(
        uploadStockAdjustmentActions.upsertRowFailure({
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
      uploadStockAdjustmentActions.upsertRowFailure({
        index,
        status: "failed",
        reason,
      }),
    );
  }
}

export default function* uploadStockAdjustmentSaga() {
  yield all([
    takeEvery(
      uploadStockAdjustmentActions.downloadTemplateFetch.type,
      downloadTemplate,
    ),
    takeEvery(uploadStockAdjustmentActions.upsertRowFetch.type, upsertRow),
  ]);
}
