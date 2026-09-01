import { PayloadAction } from "@reduxjs/toolkit";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import { wmsWarehouseActions } from "@sera-redux/slices/wms-warehouse.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetWmsWarehousesResponse,
  WmsWarehouseState,
} from "@sera-types/customer.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

function* getWarehouses(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetWmsWarehousesResponse> & WmsWarehouseState
> {
  try {
    const result = yield call(WmsWarehouseApi().retrieveWarehouses, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        wmsWarehouseActions.getWarehousesSuccess(
          result.data as GetWmsWarehousesResponse,
        ),
      );
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.getWarehousesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getWarehouseDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse<GetWmsWarehousesResponse>> {
  try {
    const result = yield call(WmsWarehouseApi().retrieveWarehouseDetail, {
      id: params.payload.id,
    });
    if (result?.status === 200)
      yield put(wmsWarehouseActions.getWarehouseDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.getWarehouseDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* createWarehouse(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(WmsWarehouseApi().createWarehouse, {
      ...params.payload,
    });
    if (result?.status === 201 || result?.status === 200) {
      yield put(
        wmsWarehouseActions.createWarehouseSuccess({ data: params.payload }),
      );
      Router.push("/user-management/warehouses");
    }
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.createWarehouseFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* updateWarehouse(
  params: PayloadAction<any>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(WmsWarehouseApi().updateWarehouse, {
      ...params.payload,
    });
    if (result?.status === 200) {
      yield put(
        wmsWarehouseActions.updateWarehouseSuccess({ data: params.payload }),
      );
      Router.push("/user-management/warehouses");
    }
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.updateWarehouseFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* deleteWarehouse(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse> {
  try {
    const result = yield call(
      WmsWarehouseApi().deleteWarehouse,
      params.payload.id,
    );
    if (result?.status === 200) {
      yield put(wmsWarehouseActions.deleteWarehouseSuccess({}));
      window.location.reload();
    }
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.deleteWarehouseFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getDropdownWarehouses(
  _params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetWmsWarehousesResponse>> {
  try {
    const result = yield call(WmsWarehouseApi().retrieveDropdownWarehouses);
    if (result?.status === 200)
      yield put(wmsWarehouseActions.getDropdownWarehousesSuccess(result.data));
  } catch (error: any) {
    yield put(
      wmsWarehouseActions.getDropdownWarehousesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* WarehouseSaga() {
  yield all([
    takeEvery(wmsWarehouseActions.getWarehousesFetch.type, getWarehouses),
    takeEvery(
      wmsWarehouseActions.getWarehouseDetailFetch.type,
      getWarehouseDetail,
    ),
    takeEvery(wmsWarehouseActions.createWarehouseFetch.type, createWarehouse),
    takeEvery(wmsWarehouseActions.updateWarehouseFetch.type, updateWarehouse),
    takeEvery(wmsWarehouseActions.deleteWarehouseFetch.type, deleteWarehouse),
    takeEvery(
      wmsWarehouseActions.getDropdownWarehousesFetch.type,
      getDropdownWarehouses,
    ),
  ]);
}

export default WarehouseSaga;
