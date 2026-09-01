/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ShipmentCancellationsApi from "@sera-libraries/api/shipment-cancellations";
import { shipmentCancellationsActions } from "@sera-redux/slices/shipment-cancellations.slice";
import { BaseType } from "@sera-types/base.type";
import {
  GetApprovalHistoryResponse,
  GetShipmentCancellationsDetailResponse,
  GetShipmentCancellationsListResponse,
  GetShipmentCancellationsSummaryResponse,
  ShipmentCancellationsDetailPayload,
  ShipmentCancellationsState,
  ShipmentCancellationsSummaryPayload,
  shipmentCancellationsTypes,
  UpdateApprovalCancelPayload,
  UpdateApprovalReroutePayload,
  UpdateApprovalReschedulePayload,
} from "@sera-types/shipment-cancellations.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getShipmentCancellationsSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetShipmentCancellationsListResponse> &
    ShipmentCancellationsState
> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().getShipmentCancellationsList,
      {
        ...params.payload,
      },
    );
    if (result?.status === 200)
      yield put(
        shipmentCancellationsActions.getShipmentCancellationsSuccess(
          result.data,
        ),
      );
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.getShipmentCancellationsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getShipmentCancellationsAutoCompleteSaga(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetShipmentCancellationsListResponse> &
    ShipmentCancellationsState
> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().getShipmentCancellationsList,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.getShipmentCancellationsAutoCompleteSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.getShipmentCancellationsAutoCompleteFailure(
        error,
      ),
    );
  }
}

function* getShipmentCancellationsSummarySaga(
  params: PayloadAction<ShipmentCancellationsSummaryPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetShipmentCancellationsSummaryResponse> &
    ShipmentCancellationsState
> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().getShipmentCancellationsSummary,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.getShipmentCancellationsSummarySuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.getShipmentCancellationsSummaryFailure(
        error,
      ),
    );
  }
}

function* getShipmentCancellationsDetailSaga(
  params: PayloadAction<ShipmentCancellationsDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetShipmentCancellationsDetailResponse> &
    ShipmentCancellationsState
> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().getShipmentCancellationsDetail,
      {
        id: params.payload.id,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.getShipmentCancellationsDetailSuccess(
          result.data,
        ),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.getShipmentCancellationsDetailFailure(error),
    );
  }
}

function* updateApprovalRerouteShipmentSaga(
  params: PayloadAction<UpdateApprovalReroutePayload>,
): Generator<unknown, void, AxiosResponse<any> & ShipmentCancellationsState> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().updateApprovalRerouteShipment,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.updateApprovalRerouteShipmentSuccess(),
      );
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.updateApprovalRerouteShipmentFailure(error),
    );
  }
}

function* updateApprovalCancelShipmentSaga(
  params: PayloadAction<UpdateApprovalCancelPayload>,
): Generator<unknown, void, AxiosResponse<any> & ShipmentCancellationsState> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().updateApprovalCancelShipment,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.updateApprovalCancelShipmentSuccess(),
      );
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.updateApprovalCancelShipmentFailure(error),
    );
  }
}

function* updateApprovalRescheduleShipmentSaga(
  params: PayloadAction<UpdateApprovalReschedulePayload>,
): Generator<unknown, void, AxiosResponse<any> & ShipmentCancellationsState> {
  try {
    const result = yield call(
      ShipmentCancellationsApi().updateApprovalRescheduleShipment,
      {
        ...params.payload,
      },
    );

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.updateApprovalRescheduleShipmentSuccess(),
      );
      if (params.payload?.callback) {
        params.payload.callback();
      }
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(
      shipmentCancellationsActions.updateApprovalRescheduleShipmentFailure(
        error,
      ),
    );
  }
}

function* getApprovalHistorySaga(
  params: PayloadAction<ShipmentCancellationsDetailPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalHistoryResponse> & ShipmentCancellationsState
> {
  try {
    const result = yield call(ShipmentCancellationsApi().getApprovalHistory, {
      id: params.payload.id,
    });

    if (result?.status === 200) {
      yield put(
        shipmentCancellationsActions.getApprovalHistorySuccess(result.data),
      );
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(shipmentCancellationsActions.getApprovalHistoryFailure(error));
  }
}

function* watchShipmentCancellationsRequest() {
  yield takeEvery(
    shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS_FETCH,
    getShipmentCancellationsSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE_FETCH,
    getShipmentCancellationsAutoCompleteSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS_SUMMARY_FETCH,
    getShipmentCancellationsSummarySaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS_DETAIL_FETCH,
    getShipmentCancellationsDetailSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.UPDATE_APPROVAL_REROUTE_SHIPMENT_FETCH,
    updateApprovalRerouteShipmentSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.UPDATE_APPROVAL_CANCEL_SHIPMENT_FETCH,
    updateApprovalCancelShipmentSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.UPDATE_APPROVAL_RESCHEDULE_SHIPMENT_FETCH,
    updateApprovalRescheduleShipmentSaga,
  );
  yield takeEvery(
    shipmentCancellationsTypes.GET_APPROVAL_HISTORY_FETCH,
    getApprovalHistorySaga,
  );
}

export default function* shipmentCancellationsSaga() {
  yield all([fork(watchShipmentCancellationsRequest)]);
}
