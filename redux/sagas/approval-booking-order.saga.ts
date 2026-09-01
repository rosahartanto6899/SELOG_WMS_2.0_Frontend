/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ApprovalBookingOrderApi from "@sera-libraries/api/approval-booking-order";
import { approvalBookingOrderActions } from "@sera-redux/slices/approval-booking-order.slice";
import {
  ApprovalBookingOrderDetailPayload,
  ApprovalBookingOrderState,
  ApprovalBookingOrderSummaryPayload,
  approvalBookingOrderTypes,
  GetApprovalBookingOrderDetailResponse,
  GetApprovalBookingOrderResponse,
  GetApprovalBookingOrderSummaryResponse,
  GetConfirmationStatusResponse,
  UpdateApprovalBookingOrderPayload,
  UpdateApprovalBookingOrderResponse,
} from "@sera-types/approval-booking-order.type";
import { BaseType } from "@sera-types/base.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getApprovalBookingOrderSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalBookingOrderResponse> & ApprovalBookingOrderState
> {
  try {
    const result = yield call(
      ApprovalBookingOrderApi().retrieveApprovalBookingOrder,
      {
        ...params.payload,
      },
    );
    if (result?.status === 200)
      yield put(
        approvalBookingOrderActions.getApprovalBookingOrderSuccess(result.data),
      );
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      approvalBookingOrderActions.getApprovalBookingOrderFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}
function* getApprovalBookingOrderAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalBookingOrderResponse> & ApprovalBookingOrderState
> {
  try {
    const result = yield call(
      ApprovalBookingOrderApi().retrieveApprovalBookingOrder,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      approvalBookingOrderActions.getApprovalBookingOrderAutoCompleteFailure(
        error,
      ),
    );
  }
}

function* getApprovalBookingOrderSummarySaga(
  params: PayloadAction<ApprovalBookingOrderSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalBookingOrderSummaryResponse> &
    ApprovalBookingOrderState
> {
  try {
    const result = yield call(
      ApprovalBookingOrderApi().getApprovalBookingOrderSummary,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        approvalBookingOrderActions.getApprovalBookingOrderSummarySuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      approvalBookingOrderActions.getApprovalBookingOrderSummaryFailure(error),
    );
  }
}

function* getApprovalBookingOrderDetailSaga(
  params: PayloadAction<ApprovalBookingOrderDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalBookingOrderDetailResponse> &
    ApprovalBookingOrderState
> {
  try {
    const result = yield call(
      ApprovalBookingOrderApi().getApprovalBookingOrderById,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        approvalBookingOrderActions.getApprovalBookingOrderDetailSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      approvalBookingOrderActions.getApprovalBookingOrderDetailFailure(error),
    );
  }
}

function* updateApprovalBookingOrderSaga(
  params: PayloadAction<UpdateApprovalBookingOrderPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UpdateApprovalBookingOrderResponse> & ApprovalBookingOrderState
> {
  try {
    const result = yield call(
      ApprovalBookingOrderApi().updateApprovalBookingOrder,
      {
        ...params.payload,
      },
    );

    if (result?.status >= 200 && result?.status < 300) {
      yield put(
        approvalBookingOrderActions.updateApprovalBookingOrderSuccess(
          result.data,
        ),
      );
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      approvalBookingOrderActions.updateApprovalBookingOrderFailure(error),
    );
  }
}
function* getConfirmationStatusSaga(): Generator<
  unknown,
  void,
  AxiosResponse<GetConfirmationStatusResponse> & ApprovalBookingOrderState
> {
  try {
    const result = yield call(ApprovalBookingOrderApi().getConfirmationStatus);

    if (result?.status === 200) {
      yield put(
        approvalBookingOrderActions.getConfirmationStatusSuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(approvalBookingOrderActions.getConfirmationStatusFailure(error));
  }
}
function* watchApprovalBookingOrderRequest() {
  yield takeEvery(
    approvalBookingOrderTypes.GET_APPROVAL_BOOKING_ORDER_FETCH,
    getApprovalBookingOrderSaga,
  );

  yield takeEvery(
    approvalBookingOrderTypes.GET_APPROVAL_BOOKING_ORDER_AUTOCOMPLETE_FETCH,
    getApprovalBookingOrderAutoCompleteSaga,
  );

  yield takeEvery(
    approvalBookingOrderTypes.GET_APPROVAL_BOOKING_ORDER_SUMMARY_FETCH,
    getApprovalBookingOrderSummarySaga,
  );

  yield takeEvery(
    approvalBookingOrderTypes.GET_APPROVAL_BOOKING_ORDER_DETAIL_FETCH,
    getApprovalBookingOrderDetailSaga,
  );

  yield takeEvery(
    approvalBookingOrderTypes.UPDATE_APPROVAL_BOOKING_ORDER_FETCH,
    updateApprovalBookingOrderSaga,
  );

  yield takeEvery(
    approvalBookingOrderTypes.GET_CONFIRMATION_STATUS_FETCH,
    getConfirmationStatusSaga,
  );
}

export default function* approvalBookingOrderSaga() {
  yield all([fork(watchApprovalBookingOrderRequest)]);
}
