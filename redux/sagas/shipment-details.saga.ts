import { PayloadAction } from "@reduxjs/toolkit";
import shipmentDetailsApi from "@sera-libraries/api/shipment-details";
import { shipmentDetailsActions } from "@sera-redux/slices/shipment-details.slice";
import {
  GetDetailsResponse,
  InitialStateType,
  PayloadDetails,
  shipmentDetailsTypes,
} from "@sera-types/shipment-details.type";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getDetails(
  params: PayloadAction<PayloadDetails>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailsResponse> & InitialStateType
> {
  try {
    const result = yield call(shipmentDetailsApi().getDetails, {
      id: params.payload.id,
    });

    yield put(shipmentDetailsActions.getDetailsSuccess(result.data));
  } catch (error: unknown) {
    yield put(shipmentDetailsActions.getDetailsFailure(error));
  }
}

function* watchShipmentDetailsRequest() {
  yield takeEvery(shipmentDetailsTypes.GET_DETAILS_FETCH, getDetails);
}

export default function* ShipmentDetailsSaga() {
  yield all([fork(watchShipmentDetailsRequest)]);
}
