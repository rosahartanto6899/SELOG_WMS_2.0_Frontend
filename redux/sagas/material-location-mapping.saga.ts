/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import MaterialLocationMappingApi from "@sera-libraries/api/material-location-mapping";
import { materialLocationMappingActions } from "@sera-redux/slices/material-location-mapping.slice";
import { BaseType } from "@sera-types/base.type";
import {
  DownloadTemplatePayload,
  UpsertRowPayload,
} from "@sera-types/material-location-mapping.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* downloadTemplate(
  params: PayloadAction<DownloadTemplatePayload>,
): Generator<unknown, void, AxiosResponse<Blob>> {
  try {
    const result = yield call(
      MaterialLocationMappingApi().downloadTemplate,
      params.payload.warehouseCode,
    );
    if (result?.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([result.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download =
        params.payload?.fileName ??
        "Template-UploadMaterialLocationMapping.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      yield put(materialLocationMappingActions.downloadTemplateSuccess());
    }
  } catch (error: any) {
    yield put(
      materialLocationMappingActions.downloadTemplateFailure({
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
  // send DTO fields only — no/upsertStatus/upsertReason are UI state, backend is forbidNonWhitelisted
  const payload = (({
    materialCode,
    materialName,
    materialBrand,
    locationName,
    warehouseCode,
    warehouseName,
  }) => ({
    materialCode,
    materialName,
    materialBrand,
    locationName,
    warehouseCode,
    warehouseName,
  }))(row as any);
  try {
    const result = yield call(MaterialLocationMappingApi().upsertRow, payload);
    if (result?.status === 200 || result?.status === 201) {
      yield put(
        materialLocationMappingActions.upsertRowSuccess({
          index,
          status: "success",
        }),
      );
    } else {
      yield put(
        materialLocationMappingActions.upsertRowFailure({
          index,
          status: "failed",
          reason: `HTTP ${result?.status}`,
        }),
      );
    }
  } catch (error: any) {
    // 422 → body.errors = no prefix to avoid duplication
    const body = error?.response?.data ?? error?.data;
    const errors = body?.errors;
    const reason = Array.isArray(errors)
      ? errors.map((e: any) => (e?.message ?? []).join(", ")).join("; ")
      : String(body?.message ?? error?.statusText ?? "Failed to process row");
    yield put(
      materialLocationMappingActions.upsertRowFailure({
        index,
        status: "failed",
        reason,
      }),
    );
  }
}

function* getMappings(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialLocationMappingApi().retrieveMappings, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        materialLocationMappingActions.getMappingsSuccess(result.data as any),
      );
  } catch (error: any) {
    yield put(
      materialLocationMappingActions.getMappingsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

export default function* materialLocationMappingSaga() {
  yield all([
    takeEvery(
      materialLocationMappingActions.downloadTemplateFetch.type,
      downloadTemplate,
    ),
    takeEvery(materialLocationMappingActions.upsertRowFetch.type, upsertRow),
    takeEvery(
      materialLocationMappingActions.getMappingsFetch.type,
      getMappings,
    ),
  ]);
}
