/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import StockManagementApi from "@sera-libraries/api/stock-management/index";
import { stockManagementActions } from "@sera-redux/slices/stock-management.slice";
import { BaseType } from "@sera-types/base.type";
import {
  DetailVehiclePayload,
  GetStockPayload,
  GetStockResponse,
  GetStockStatusResponse,
  GetVehicleDetailResponse,
  StockManagementState,
  stockManagementTypes,
  UpdateVehiclePayload,
  VehiclePayload,
} from "@sera-types/stock-management.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getStock(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetStockResponse> & StockManagementState
> {
  try {
    const result = yield call(StockManagementApi().retrieveStock, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(stockManagementActions.getStockSuccess(result.data));
    } else {
    }
  } catch (error: any) {
    yield put(stockManagementActions.getStockFailure(error));
  }
}

function* getStockAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetStockResponse> & StockManagementState
> {
  try {
    const result = yield call(StockManagementApi().retrieveStock, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        stockManagementActions.getStockAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(stockManagementActions.getStockAutoCompleteFailure(error));
  }
}

function* getStockSummary(
  params: PayloadAction<GetStockPayload>,
): Generator<unknown, void, AxiosResponse<any> & StockManagementState> {
  try {
    const res = yield call(StockManagementApi().getSummary, params.payload);

    if (res?.status === 200) {
      yield put(stockManagementActions.getSummarySuccess(res.data));
    }
  } catch (error: any) {
    yield put(stockManagementActions.getSummaryFailure(error));
  }
}

function* createVehicle(
  params: PayloadAction<VehiclePayload>,
): Generator<unknown, void, AxiosResponse<any> & StockManagementState> {
  try {
    const result = yield call(
      StockManagementApi().createVehicle,
      params?.payload,
    );

    if (result?.status === 201) {
      yield call(Router.back);
      yield put(
        stockManagementActions.createVehicleSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(stockManagementActions.createVehicleFailure(error));
  }
}

function* detailVehicle(
  params: PayloadAction<DetailVehiclePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetVehicleDetailResponse> & StockManagementState
> {
  try {
    const res = yield call(StockManagementApi().detailVehicle, {
      ...params.payload,
    });

    if (res?.status === 200) {
      yield put(stockManagementActions.detailVehicleSuccess(res?.data));
    }
  } catch (error) {
    yield put(stockManagementActions.detailVehicleFailure(error));
  }
}

function* updateVehicle(
  params: PayloadAction<UpdateVehiclePayload>,
): Generator<unknown, void, AxiosResponse<any> & StockManagementState> {
  try {
    const result = yield call(
      StockManagementApi().updateVehicle,
      params.payload,
    );

    if (result?.status === 200) {
      yield call(Router.back);
      yield put(
        stockManagementActions.updateVehicleSuccess({ ...params.payload }),
      );
    }
  } catch (error: any) {
    yield put(stockManagementActions.updateVehicleFailure(error));
  }
}

function* upsertVehicle(
  params: PayloadAction<VehiclePayload>,
): Generator<unknown, void, AxiosResponse<any> & StockManagementState> {
  try {
    const result = yield call(
      StockManagementApi().upsertVehicle,
      params?.payload,
    );

    if (result?.status === 200 || result?.status === 201) {
      yield put(
        stockManagementActions.upsertVehicleSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(stockManagementActions.upsertVehicleFailure(error));
  }
}

function* downloadTemplate(): Generator<
  unknown,
  void,
  AxiosResponse<any> & StockManagementState
> {
  try {
    const res = yield call(StockManagementApi().downloadTemplate);
    if (res?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `LOGis_FM_UploadMasterVehicleTemplate.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      yield put(stockManagementActions.downloadTemplateSuccess(res?.data));
    }
  } catch (error) {
    yield put(stockManagementActions.downloadTemplateFailure(error));
  }
}

function* stockStatus(): Generator<
  unknown,
  void,
  AxiosResponse<GetStockStatusResponse> & StockManagementState
> {
  try {
    const res = yield call(StockManagementApi().stockStatus);

    if (res?.status === 200) {
      yield put(stockManagementActions.stockStatusSuccess(res?.data));
    }
  } catch (error) {
    yield put(stockManagementActions.stockStatusFailure(error));
  }
}

function* watchStockManagementRequest() {
  yield takeEvery(stockManagementTypes.GET_STOCK_FETCH, getStock);
  yield takeEvery(
    stockManagementTypes.GET_STOCK_AUTOCOMPLETE_FETCH,
    getStockAutoComplete,
  );
  yield takeEvery(stockManagementTypes.GET_SUMMARY_FETCH, getStockSummary);
  yield takeEvery(stockManagementTypes.CREATE_VEHICLE_FETCH, createVehicle);
  yield takeEvery(stockManagementTypes.DETAIL_VEHICLE_FETCH, detailVehicle);
  yield takeEvery(stockManagementTypes.UPDATE_VEHICLE_FETCH, updateVehicle);
  yield takeEvery(stockManagementTypes.UPSERT_VEHICLE_FETCH, upsertVehicle);

  yield takeEvery(
    stockManagementTypes.DOWNLOAD_TEMPLATE_FETCH,
    downloadTemplate,
  );
  yield takeEvery(stockManagementTypes.STOCK_STATUS_FETCH, stockStatus);
}

export default function* stockManagementSaga() {
  yield all([fork(watchStockManagementRequest)]);
}
