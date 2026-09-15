/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import StockAvailabilityApi from "@sera-libraries/api/stock-availability";
import { stockAvailabilityActions } from "@sera-redux/slices/stock-availability.slice";
import { StockAvailabilityListPayload } from "@sera-types/stock-availability.type";
import { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getStockAvailability(
  params: PayloadAction<StockAvailabilityListPayload>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      StockAvailabilityApi().retrieveList,
      params.payload,
    );
    const body = (result as any)?.data;
    // envelope backend: { page: {...}, data } — bukan `pagination`
    const pagination = body?.pagination ?? body?.page;
    yield put(
      stockAvailabilityActions.getStockAvailabilitySuccess({
        data: body?.data ?? [],
        pagination,
        recordsTotal: pagination?.recordsTotal ?? pagination?.totalData ?? 0,
      }),
    );
  } catch (error: any) {
    yield put(
      stockAvailabilityActions.getStockAvailabilityFailure({
        status: error?.status,
        statusText: error?.statusText,
      }),
    );
  }
}

export default function* stockAvailabilitySaga() {
  yield all([
    takeEvery(
      stockAvailabilityActions.getStockAvailabilityFetch.type,
      getStockAvailability,
    ),
  ]);
}
