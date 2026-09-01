/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import JMPApi from "@sera-libraries/api/jmp";
import { jmpActions } from "@sera-redux/slices/jmp.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateJMPPayload,
  DetailJMPPayload,
  FilterParams,
  GetDetailJMPResponse,
  GetJMPListResponse,
  GetSummaryResponse,
  JMPState,
  jmpTypes,
  UpdateJMPPayload,
} from "@sera-types/jmp.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<FilterParams>,
): Generator<unknown, void, AxiosResponse<GetSummaryResponse> & JMPState> {
  try {
    const response = yield call(JMPApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(jmpActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(jmpActions.getSummaryFailure(error));
  }
}

function* getJMPList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetJMPListResponse> & JMPState> {
  try {
    const response = yield call(JMPApi().getJMPList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(jmpActions.getJMPListSuccess(response.data));
    }
  } catch (error: any) {
    yield put(jmpActions.getJMPListFailure(error));
  }
}

function* getACJMPList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetJMPListResponse> & JMPState> {
  try {
    const response = yield call(JMPApi().getJMPList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(jmpActions.getACJMPListSuccess(response.data));
    }
  } catch (error: any) {
    yield put(jmpActions.getACJMPListFailure(error));
  }
}

function* createJMP(
  params: PayloadAction<CreateJMPPayload>,
): Generator<unknown, void, AxiosResponse<any> & JMPState> {
  try {
    const response = yield call(JMPApi().createJMP, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield call(Router.back);
      yield put(jmpActions.createJMPSuccess({ ...params.payload }));
    }
  } catch (error: any) {
    yield put(jmpActions.createJMPFailure(error));
  }
}

function* detailJMP(
  params: PayloadAction<DetailJMPPayload>,
): Generator<unknown, void, AxiosResponse<GetDetailJMPResponse> & JMPState> {
  try {
    const response = yield call(JMPApi().detailJMP, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(jmpActions.detailJMPSuccess(response.data));
    }
  } catch (error: any) {
    yield put(jmpActions.detailJMPFailure(error));
  }
}

function* updateJMP(
  params: PayloadAction<UpdateJMPPayload>,
): Generator<unknown, void, AxiosResponse<any> & JMPState> {
  try {
    const response = yield call(JMPApi().updateJMP, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield call(Router.back);
      yield put(jmpActions.updateJMPSuccess({ ...params.payload }));
    }
  } catch (error: any) {
    yield put(jmpActions.updateJMPFailure(error));
  }
}

function* watchJMPRequest() {
  yield takeEvery(jmpTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(jmpTypes.GET_JMP_LIST_FETCH, getJMPList);
  yield takeEvery(jmpTypes.GET_AC_JMP_LIST_FETCH, getACJMPList);
  yield takeEvery(jmpTypes.CREATE_JMP_FETCH, createJMP);
  yield takeEvery(jmpTypes.DETAIL_JMP_FETCH, detailJMP);
  yield takeEvery(jmpTypes.UPDATE_JMP_FETCH, updateJMP);
}

export default function* jmpSaga() {
  yield all([fork(watchJMPRequest)]);
}
