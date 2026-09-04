/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import MaterialApi from "@sera-libraries/api/material";
import MessageHandler from "@sera-libraries/message-handler";
import { materialActions } from "@sera-redux/slices/material.slice";
import { BaseType } from "@sera-types/base.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* flattenErrors(error: any) {
  const errors = error?.response?.data?.errors ?? error?.data?.errors;
  if (Array.isArray(errors))
    MessageHandler().error(
      errors
        .map((e: any) => `${e.field}: ${(e.message ?? []).join(", ")}`)
        .join("; "),
    );
}

function* getMaterials(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().retrieveMaterials, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(materialActions.getMaterialsSuccess(result.data as any));
  } catch (error: any) {
    yield put(
      materialActions.getMaterialsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getMaterialDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().retrieveMaterialDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(materialActions.getMaterialDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      materialActions.getMaterialDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getDropdownMaterials(
  params: PayloadAction<{ customerCode?: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().retrieveDropdownMaterials, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(materialActions.getDropdownMaterialsSuccess(result.data));
  } catch (error: any) {
    yield put(
      materialActions.getDropdownMaterialsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* createMaterial(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().createMaterial, {
      ...params.payload,
    });
    if (result?.status === 201 || result?.status === 200) {
      MessageHandler().success(`Material "${params.payload?.code}" created`);
      Router.push("/master-data/material");
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      materialActions.createMaterialFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* updateMaterial(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().updateMaterial, {
      ...params.payload,
    });
    if (result?.status === 200) {
      MessageHandler().success(
        `Material "${params.payload?.items?.name}" updated`,
      );
      Router.push("/master-data/material");
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      materialActions.updateMaterialFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* deleteMaterial(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(MaterialApi().deleteMaterial, params.payload?.id);
    if (result?.status === 200) {
      MessageHandler().success(`Material "${params.payload?.name}" deleted`);
      yield put(materialActions.getMaterialsFetch(params.payload?.options));
    }
  } catch (error: any) {
    yield flattenErrors(error);
    yield put(
      materialActions.deleteMaterialFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

export default function* materialSaga() {
  yield all([
    takeEvery(materialActions.getMaterialsFetch.type, getMaterials),
    takeEvery(materialActions.getMaterialDetailFetch.type, getMaterialDetail),
    takeEvery(
      materialActions.getDropdownMaterialsFetch.type,
      getDropdownMaterials,
    ),
    takeEvery(materialActions.createMaterialFetch.type, createMaterial),
    takeEvery(materialActions.updateMaterialFetch.type, updateMaterial),
    takeEvery(materialActions.deleteMaterialFetch.type, deleteMaterial),
  ]);
}
