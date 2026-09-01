import { PayloadAction } from "@reduxjs/toolkit";
import podCollectionApi from "@sera-libraries/api/pod-collection";
import { podCollectionActions } from "@sera-redux/slices/pod-collection.slice";
import { BaseType } from "@sera-types/base.type";
import {
  ApprovalPodPayload,
  GetApprovalResponse,
  GetDeliveryResponse,
  GetDetailsResponse,
  GetHardcopyResponse,
  GetListResponse,
  GetLoadingResponse,
  GetSummaryResponse,
  GetTimestampResponse,
  GetUnloadingResponse,
  InitialStateType,
  PayloadDetails,
  podCollectionTypes,
  PodDeliveryPayload,
  PodHardcopyPayload,
  PodLoadingPayload,
  PodTimestampPayload,
  PodUnloadingPayload,
  UnitParams,
} from "@sera-types/pod-collection.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getSummary(
  params: PayloadAction<UnitParams>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetSummaryResponse> & InitialStateType
> {
  try {
    const response = yield call(podCollectionApi().getSummary, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.getSummarySuccess(response.data));
    }
  } catch (error: any) {
    yield put(podCollectionActions.getSummaryFailure(error));
  }
}

function* getList(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetListResponse> & InitialStateType> {
  try {
    const response = yield call(podCollectionApi().getList, {
      ...params.payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.getListSuccess(response.data));
    }
  } catch (error: any) {
    yield put(podCollectionActions.getListFailure(error));
  }
}

function* getDetails(
  params: PayloadAction<PayloadDetails>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailsResponse> & InitialStateType
> {
  try {
    const result = yield call(podCollectionApi().getDetails, {
      id: params.payload.id,
    });

    yield put(podCollectionActions.getDetailsSuccess(result.data));
  } catch (error: unknown) {
    yield put(podCollectionActions.getDetailsFailure(error));
  }
}

function* podLoading(
  params: PayloadAction<{
    payload: PodLoadingPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetLoadingResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podLoading, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.podLoadingSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(podCollectionActions.podLoadingFailure(error));
  }
}

function* podUnloading(
  params: PayloadAction<{
    payload: PodUnloadingPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetUnloadingResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podUnloading, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.podUnloadingSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(podCollectionActions.podUnloadingFailure(error));
  }
}

function* podDelivery(
  params: PayloadAction<{
    payload: PodDeliveryPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDeliveryResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podDelivery, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.podDeliverySuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(podCollectionActions.podDeliveryFailure(error));
  }
}

function* podTimestamp(
  params: PayloadAction<{
    payload: PodTimestampPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetTimestampResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podTimestamp, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.podTimestampSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(podCollectionActions.podTimestampFailure(error));
  }
}

function* podHardcopy(
  params: PayloadAction<{
    payload: PodHardcopyPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetHardcopyResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podHardcopy, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.podHardcopySuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    yield put(podCollectionActions.podHardcopyFailure(error));
  }
}

function* podApproval(
  params: PayloadAction<{
    payload: ApprovalPodPayload;
    callback?: () => void;
  }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetApprovalResponse> & InitialStateType
> {
  const { payload, callback } = params.payload;
  try {
    const response = yield call(podCollectionApi().podApproval, {
      ...payload,
    });

    if (response?.status === 200) {
      yield put(podCollectionActions.getApprovalSuccess(response.data));
      if (callback) callback();
    }
  } catch (error: any) {
    captureErrorAxios(error);
    yield put(podCollectionActions.getApprovalFailure(error));
  }
}

function* watchPodCollectionRequest() {
  yield takeEvery(podCollectionTypes.GET_SUMMARY_FETCH, getSummary);
  yield takeEvery(podCollectionTypes.GET_LIST_FETCH, getList);
  yield takeEvery(podCollectionTypes.GET_LOADING_FETCH, podLoading);
  yield takeEvery(podCollectionTypes.GET_UNLOADING_FETCH, podUnloading);
  yield takeEvery(podCollectionTypes.GET_DELIVERY_FETCH, podDelivery);
  yield takeEvery(podCollectionTypes.GET_DETAILS_FETCH, getDetails);
  yield takeEvery(podCollectionTypes.GET_APPROVAL_FETCH, podApproval);
  yield takeEvery(podCollectionTypes.GET_TIMESTAMP_FETCH, podTimestamp);
  yield takeEvery(podCollectionTypes.GET_HARDCOPY_FETCH, podHardcopy);
}

export default function* ExpenseRefundSaga() {
  yield all([fork(watchPodCollectionRequest)]);
}
