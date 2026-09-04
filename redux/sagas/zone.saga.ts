/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ZoneApi from "@sera-libraries/api/zone";
import MessageHandler from "@sera-libraries/message-handler";
import { zoneActions } from "@sera-redux/slices/zone.slice";
import { BaseType } from "@sera-types/base.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getZones(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().retrieveZones, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(zoneActions.getZonesSuccess(result.data as any));
  } catch (error: any) {
    yield put(
      zoneActions.getZonesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getZoneDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().retrieveZoneDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(zoneActions.getZoneDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      zoneActions.getZoneDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* getDropdownZones(
  params: PayloadAction<{ customerCode?: string; warehouseCode?: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().retrieveDropdownZones, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(zoneActions.getDropdownZonesSuccess(result.data));
  } catch (error: any) {
    yield put(
      zoneActions.getDropdownZonesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* createZone(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().createZone, { ...params.payload });
    if (result?.status === 201 || result?.status === 200) {
      MessageHandler().success(`Zone "${params.payload?.code}" created`);
      Router.push("/master-data/zone");
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors ?? error?.data?.errors;
    if (Array.isArray(errors))
      MessageHandler().error(
        errors
          .map((e: any) => `${e.field}: ${(e.message ?? []).join(", ")}`)
          .join("; "),
      );
    yield put(
      zoneActions.createZoneFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* updateZone(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().updateZone, { ...params.payload });
    if (result?.status === 200) {
      MessageHandler().success(`Zone "${params.payload?.items?.name}" updated`);
      Router.push("/master-data/zone");
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors ?? error?.data?.errors;
    if (Array.isArray(errors))
      MessageHandler().error(
        errors
          .map((e: any) => `${e.field}: ${(e.message ?? []).join(", ")}`)
          .join("; "),
      );
    yield put(
      zoneActions.updateZoneFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

function* deleteZone(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(ZoneApi().deleteZone, params.payload?.id);
    if (result?.status === 200) {
      MessageHandler().success(`Zone "${params.payload?.name}" deleted`);
      yield put(zoneActions.getZonesFetch(params.payload?.options));
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors ?? error?.data?.errors;
    if (Array.isArray(errors))
      MessageHandler().error(
        errors.map((e: any) => `${(e.message ?? []).join(", ")}`).join("; "),
      );
    yield put(
      zoneActions.deleteZoneFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error?.data,
      }),
    );
  }
}

export default function* zoneSaga() {
  yield all([
    takeEvery(zoneActions.getZonesFetch.type, getZones),
    takeEvery(zoneActions.getZoneDetailFetch.type, getZoneDetail),
    takeEvery(zoneActions.getDropdownZonesFetch.type, getDropdownZones),
    takeEvery(zoneActions.createZoneFetch.type, createZone),
    takeEvery(zoneActions.updateZoneFetch.type, updateZone),
    takeEvery(zoneActions.deleteZoneFetch.type, deleteZone),
  ]);
}
