/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import ServiceGroupApi from "@sera-libraries/api/service-group";
import { serviceGroupActions } from "@sera-redux/slices/service-group.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateServiceGroupPayload,
  DeleteServiceGroupPayload,
  DetailServiceGroupPayload,
  GetServiceGroupsResponse,
  ServiceGroupState,
  serviceGroupTypes,
  UpdateServiceGroupPayload,
} from "@sera-types/service-group.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getServiceGroups(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const result = yield call(ServiceGroupApi().retrieveServiceGroups, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(serviceGroupActions.getServiceGroupSuccess(result.data));
    }
  } catch (error: any) {
    yield put(serviceGroupActions.getServiceGroupFailure(error));
  }
}

function* getServiceGroupAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const result = yield call(ServiceGroupApi().retrieveServiceGroups, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        serviceGroupActions.getServiceGroupAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(serviceGroupActions.getServiceGroupAutoCompleteFailure(error));
  }
}

function* createServiceGroup(
  params: PayloadAction<CreateServiceGroupPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const payload: CreateServiceGroupPayload = { ...params.payload };
    const res = yield call(ServiceGroupApi().createServiceGroup, payload);

    if (res?.status === 201) {
      yield call(Router.back);
      yield put(
        serviceGroupActions.createServiceGroupSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(serviceGroupActions.createServiceGroupFailure(error));
  }
}

function* detailServiceGroup(
  params: PayloadAction<DetailServiceGroupPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const res = yield call(ServiceGroupApi().detailServiceGroup, {
      ...params.payload,
    });

    if (res?.status === 200) {
      yield put(serviceGroupActions.detailServiceGroupSuccess(res?.data));
    }
  } catch (error) {
    yield put(serviceGroupActions.detailServiceGroupFailure(error));
  }
}

function* updateServiceGroup(
  params: PayloadAction<CreateServiceGroupPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const payload: UpdateServiceGroupPayload = { ...params.payload };
    const res = yield call(ServiceGroupApi().updateServiceGroup, payload);

    if (res?.status === 200) {
      yield call(Router.back);
      yield put(
        serviceGroupActions.updateServiceGroupSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(serviceGroupActions.updateServiceGroupFailure(error));
  }
}

function* deleteServiceGroup(
  params: PayloadAction<CreateServiceGroupPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const payload: DeleteServiceGroupPayload = { ...params.payload };
    const { id, options } = payload;
    delete payload.id;
    delete payload.options;

    const res = yield call(ServiceGroupApi().deletelServiceGroup, `${id}`);

    if (res?.status === 200) {
      yield put(
        serviceGroupActions.deleteServiceGroupSuccess({ ...params.payload }),
      );

      yield put(
        serviceGroupActions.getServiceGroupFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(serviceGroupActions.deleteServiceGroupFailure(error));
  }
}

function* getServiceGroupDropdown(): Generator<
  unknown,
  void,
  AxiosResponse<GetServiceGroupsResponse> & ServiceGroupState
> {
  try {
    const result = yield call(ServiceGroupApi().retrieveServiceGroupsDropdown);

    if (result?.status === 200) {
      yield put(
        serviceGroupActions.getServiceGroupDropdownSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(serviceGroupActions.getServiceGroupDropdownFailure(error));
  }
}

function* watchServiceGroupsRequest() {
  yield takeEvery(serviceGroupTypes.GET_SERVICE_GROUPS_FETCH, getServiceGroups);
  yield takeEvery(
    serviceGroupTypes.GET_SERVICE_GROUPS_AUTOCOMPLETE_FETCH,
    getServiceGroupAutoComplete,
  );
  yield takeEvery(
    serviceGroupTypes.CREATE_SERVICE_GROUP_FETCH,
    createServiceGroup,
  );
  yield takeEvery(
    serviceGroupTypes.DETAIL_SERVICE_GROUP_FETCH,
    detailServiceGroup,
  );
  yield takeEvery(
    serviceGroupTypes.UPDATE_SERVICE_GROUP_FETCH,
    updateServiceGroup,
  );
  yield takeEvery(
    serviceGroupTypes.DELETE_SERVICE_GROUP_FETCH,
    deleteServiceGroup,
  );
  yield takeEvery(
    serviceGroupTypes.GET_SERVICE_GROUPS_DROPDOWN_FETCH,
    getServiceGroupDropdown,
  );
}

export default function* serviceGroupSaga() {
  yield all([fork(watchServiceGroupsRequest)]);
}
