import { PayloadAction } from "@reduxjs/toolkit";
import DriverStockApi from "@sera-libraries/api/driver-stock";
import { driverStockActions } from "@sera-redux/slices/driver-stock.slice";
import { BaseType } from "@sera-types/base.type";
import {
  driverStockTypes,
  IDetailsPayload,
  IDetailsResponse,
  IDriverStockState,
  IFilterResponse,
  IListResponse,
  ISummaryPayload,
  ISummaryResponse,
  IUpdateNotePayload,
} from "@sera-types/driver-stock.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<IListResponse> & IDriverStockState> {
  try {
    const result = yield call(DriverStockApi().retrieveList, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(driverStockActions.getListFetchSuccess(result.data));
    }
  } catch (error: any) {
    yield put(driverStockActions.getListFailure(error));
  }
}

function* getSummary(
  params: PayloadAction<ISummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<ISummaryResponse> & IDriverStockState
> {
  try {
    const result = yield call(DriverStockApi().retrieveSummary, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(driverStockActions.getSummaryFetchSuccess(result.data));
    }
  } catch (error: unknown) {
    yield put(driverStockActions.getSummaryFailure(error));
  }
}

function* getById(
  params: PayloadAction<IDetailsPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<IDetailsResponse> & IDriverStockState
> {
  try {
    const result = yield call(DriverStockApi().retrieveById, {
      id: params.payload.id,
    });

    if (result?.status === 200) {
      yield put(driverStockActions.getByIdFetchSuccess(result.data.data));
    }
  } catch (error: unknown) {
    yield put(driverStockActions.getByIdFetchFailure(error));
  }
}

function* getFilters(): Generator<
  unknown,
  void,
  AxiosResponse<IFilterResponse>[] & IDriverStockState
> {
  try {
    const result = yield call(DriverStockApi().retrieveFilters);

    const tempData: IFilterResponse[] = [];

    result.forEach((e) => {
      if (e.status === 200) {
        tempData.push(e.data);
      }
    });

    yield put(driverStockActions.getFilterSuccess(tempData));
  } catch (error: unknown) {
    yield put(driverStockActions.getFilterFailure(error));
  }
}

function* updateNote(
  params: PayloadAction<{
    payload: IUpdateNotePayload;
    callback?: () => void;
  }>,
): Generator<unknown, void, AxiosResponse<any> & IDriverStockState> {
  const { payload, callback } = params.payload;
  try {
    const result = yield call(
      DriverStockApi().updateNoteById,
      {
        ...payload,
      },
      callback,
    );

    yield put(driverStockActions.updateNoteByIdFetchSuccess(result?.data));
  } catch (error: unknown) {
    yield put(driverStockActions.updateNoteByIdFetchFailure(error));
  }
}

function* watchDriverFatigueRequest() {
  yield takeEvery(driverStockTypes.GET_SUMMARY, getSummary);
  yield takeEvery(driverStockTypes.GET_LIST_FETCH, getList);
  yield takeEvery(driverStockTypes.GET_BY_ID_FETCH, getById);
  yield takeEvery(driverStockTypes.GET_FILTERS_FETCH, getFilters);
  yield takeEvery(driverStockTypes.UPDATE_NOTE_FETCH, updateNote);
}

export default function* customerSaga() {
  yield all([fork(watchDriverFatigueRequest)]);
}
