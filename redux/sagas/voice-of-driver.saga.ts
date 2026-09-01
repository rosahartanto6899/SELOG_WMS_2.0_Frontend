/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import VoiceOfDriverApi from "@sera-libraries/api/voice-of-driver";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateVoDPayload,
  DetailVoDPayload,
  GetDetailVoDResponse,
  GetShipmentResponse,
  GetSummaryResponse,
  GetVoDListResponse,
  ListParams,
  UpdateVoDPayload,
  VoDState,
  vodTypes,
} from "@sera-types/voice-of-driver.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<ListParams>,
): Generator<unknown, void, AxiosResponse<GetSummaryResponse> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(vodActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.getSummaryFailure(error));
  }
}

function* getVoDList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetVoDListResponse> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().getVoDList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(vodActions.getVoDListSuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.getVoDListFailure(error));
  }
}

function* getACVoDList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetVoDListResponse> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().getVoDList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(vodActions.getACVoDListSuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.getACVoDListFailure(error));
  }
}

function* getShipment(
  params: PayloadAction<BaseType & { filter?: string }>,
): Generator<unknown, void, AxiosResponse<GetShipmentResponse> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().getShipment, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(vodActions.getShipmentSuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.getShipmentFailure(error));
  }
}

function* createVoD(
  params: PayloadAction<CreateVoDPayload>,
): Generator<unknown, void, AxiosResponse<any> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().createVoD, {
      ...params.payload,
    });

    if (response?.status === 201) {
      yield call(Router.back);
      yield put(vodActions.createVoDSuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.createVoDFailure(error));
  }
}

function* detailVoD(
  params: PayloadAction<DetailVoDPayload>,
): Generator<unknown, void, AxiosResponse<GetDetailVoDResponse> & VoDState> {
  try {
    const response = yield call(VoiceOfDriverApi().detailVoD, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(vodActions.detailVoDSuccess(response.data));
    }
  } catch (error: any) {
    yield put(vodActions.detailVoDFailure(error));
  }
}

function* updateVoD(
  params: PayloadAction<UpdateVoDPayload>,
): Generator<unknown, void, AxiosResponse<any> & VoDState> {
  try {
    const _payload = { ...params.payload };
    delete _payload?.ticketNumber;

    const response = yield call(VoiceOfDriverApi().updateVoD, _payload);

    if (response?.status === 200) {
      yield call(Router.back);
      yield put(vodActions.updateVoDSuccess());
    }
  } catch (error: any) {
    yield put(vodActions.updateVoDFailure(error));
  }
}

function* watchVoiceOfDriverRequest() {
  yield takeEvery(vodTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(vodTypes.GET_VOD_LIST_FETCH, getVoDList);
  yield takeEvery(vodTypes.GET_AC_VOD_LIST_FETCH, getACVoDList);
  yield takeEvery(vodTypes.GET_SHIPMENT_FETCH, getShipment);
  yield takeEvery(vodTypes.CREATE_VOD_FETCH, createVoD);
  yield takeEvery(vodTypes.DETAIL_VOD_FETCH, detailVoD);
  yield takeEvery(vodTypes.UPDATE_VOD_FETCH, updateVoD);
}

export default function* voiceOfDriverSaga() {
  yield all([fork(watchVoiceOfDriverRequest)]);
}
