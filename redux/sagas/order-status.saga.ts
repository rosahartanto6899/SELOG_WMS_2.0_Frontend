/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import OrderStatusApi from "@sera-libraries/api/order-status";
import { orderStatusActions } from "@sera-redux/slices/order-status.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetOrderDetailResponse,
  GetOrderStatusResponse,
  GetOrderStatusSummaryResponse,
  OrderStatusCancelPayload,
  OrderStatusDetailPayload,
  OrderStatusReroutePayload,
  OrderStatusReschedulePayload,
  OrderStatusState,
  OrderStatusSummaryPayload,
  orderStatusTypes,
} from "@sera-types/order-status.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getOrderStatusSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetOrderStatusResponse> & OrderStatusState
> {
  try {
    const result = yield call(OrderStatusApi().retrieveOrderStatus, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(orderStatusActions.getOrderStatusSuccess(result.data));
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      orderStatusActions.getOrderStatusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getOrderStatusAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetOrderStatusResponse> & OrderStatusState
> {
  try {
    const result = yield call(OrderStatusApi().retrieveOrderStatus, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        orderStatusActions.getOrderStatusAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(orderStatusActions.getOrderStatusAutoCompleteFailure(error));
  }
}

function* getOrderStatusSummarySaga(
  params: PayloadAction<OrderStatusSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetOrderStatusSummaryResponse> & OrderStatusState
> {
  try {
    const result = yield call(OrderStatusApi().getSummaryOrderStatus, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        orderStatusActions.getOrderStatusSummaryInformationSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      orderStatusActions.getOrderStatusSummaryInformationFailure(error),
    );
  }
}

function* getOrderStatusDetailSaga(
  params: PayloadAction<OrderStatusDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetOrderDetailResponse> & OrderStatusState
> {
  try {
    const result = yield call(OrderStatusApi().getOrderStatusDetail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(orderStatusActions.getOrderStatusDetailSuccess(result.data));
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(orderStatusActions.getOrderStatusDetailFailure(error));
  }
}

function* updateRerouteOrderStatusSaga(
  params: PayloadAction<OrderStatusReroutePayload>,
): Generator<unknown, void, AxiosResponse<any> & OrderStatusState> {
  try {
    const result = yield call(OrderStatusApi().rerouteOrderStatus, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(orderStatusActions.updateRerouteOrderStatusSuccess());
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(orderStatusActions.updateRerouteOrderStatusFailure(error));
  }
}

function* updateCancelOrderStatusSaga(
  params: PayloadAction<OrderStatusCancelPayload>,
): Generator<unknown, void, AxiosResponse<any> & OrderStatusState> {
  try {
    const result = yield call(OrderStatusApi().cancelOrderStatus, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(orderStatusActions.updateCancelOrderStatusSuccess());
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(orderStatusActions.updateCancelOrderStatusFailure(error));
  }
}

function* updateRescheduleOrderStatusSaga(
  params: PayloadAction<OrderStatusReschedulePayload>,
): Generator<unknown, void, AxiosResponse<any> & OrderStatusState> {
  try {
    const result = yield call(OrderStatusApi().rescheduleOrderStatus, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(orderStatusActions.updateRescheduleOrderStatusSuccess());
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(orderStatusActions.updateRescheduleOrderStatusFailure(error));
  }
}

function* watchOrderStatusRequest() {
  yield takeEvery(orderStatusTypes.GET_ORDER_STATUS_FETCH, getOrderStatusSaga);
  yield takeEvery(
    orderStatusTypes.GET_ORDER_STATUS_AUTOCOMPLETE_FETCH,
    getOrderStatusAutoCompleteSaga,
  );
  yield takeEvery(
    orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION_FETCH,
    getOrderStatusSummarySaga,
  );
  yield takeEvery(
    orderStatusTypes.GET_ORDER_STATUS_DETAIL_FETCH,
    getOrderStatusDetailSaga,
  );
  yield takeEvery(
    orderStatusTypes.UPDATE_REROUTE_ORDER_STATUS_FETCH,
    updateRerouteOrderStatusSaga,
  );
  yield takeEvery(
    orderStatusTypes.UPDATE_CANCEL_ORDER_STATUS_FETCH,
    updateCancelOrderStatusSaga,
  );
  yield takeEvery(
    orderStatusTypes.UPDATE_RESCHEDULE_ORDER_STATUS_FETCH,
    updateRescheduleOrderStatusSaga,
  );
}

export default function* orderStatusSaga() {
  yield all([fork(watchOrderStatusRequest)]);
}
