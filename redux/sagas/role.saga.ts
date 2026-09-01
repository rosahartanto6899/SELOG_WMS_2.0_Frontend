import { PayloadAction } from "@reduxjs/toolkit";
import RoleApi from "@sera-libraries/api/role";
import {
  getDropdownRolesFailure,
  getDropdownRolesSuccess,
  getRoleDetailFailure,
  getRoleDetailSuccess,
  getRolesAutoCompleteFailure,
  getRolesAutoCompleteSuccess,
  getRolesFailure,
  getRolesSuccess,
  roleActions,
} from "@sera-redux/slices/role.slice";
import { BaseType } from "@sera-types/base.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
  CreateNewRolePayload,
  DeleteRolePayload,
  GetRolesResponse,
  RoleState,
  roleTypes,
  UpdateRolePayload,
} from "../../types/role.type";

function* getRoles(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const result = yield call(RoleApi().retrieveRoles, { ...params.payload });
    if (result?.status === 200) yield put(getRolesSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRolesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data,
      }),
    );
  }
}

function* getRolesAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const result = yield call(RoleApi().retrieveRoles, { ...params.payload });
    if (result?.status === 200)
      yield put(getRolesAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRolesAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewRole(
  params: PayloadAction<CreateNewRolePayload>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const payload: CreateNewRolePayload = { ...params.payload };
    const res = yield call(RoleApi().createRole, payload);
    if (res?.status === 201) {
      const { data } = res.data;
      yield call(Router.push, "/user-management/roles");
      yield put(
        roleActions.createNewRoleSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(roleActions.createNewRoleFailure(error));
  }
}

function* getRoleDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const result = yield call(RoleApi().retrieveRoleDetail, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getRoleDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRoleDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* updateRole(
  params: PayloadAction<UpdateRolePayload>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const payload: UpdateRolePayload = { ...params.payload };
    const res = yield call(RoleApi().updateRole, {
      id: payload.id,
      items: { roleName: payload.roleName },
    });
    if (res?.status === 200) {
      const { data } = res.data;
      yield call(Router.push, "/user-management/roles");
      yield put(
        roleActions.updateRoleSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(roleActions.updateRoleFailure(error));
  }
}

function* deleteRole(
  params: PayloadAction<DeleteRolePayload>,
): Generator<unknown, void, AxiosResponse<GetRolesResponse> & RoleState> {
  try {
    const { id, roleName, options } = params.payload;
    const result = yield call(RoleApi().deleteRole, id);

    if (result.status === 200) {
      yield put(roleActions.deleteRoleSuccess(result.data));
      yield put(roleActions.postDeleteRoleNotification({ id, roleName }));
      yield put(
        roleActions.getRolesFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(roleActions.deleteRoleFailure(error));
  }
}

function* getDropdownRoles(): Generator<
  unknown,
  void,
  AxiosResponse<GetRolesResponse> & RoleState
> {
  try {
    const result = yield call(RoleApi().retrieveDropdownRoles);
    if (result?.status === 200) yield put(getDropdownRolesSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownRolesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchRolesRequest() {
  yield takeEvery(roleTypes.GET_ROLES_FETCH, getRoles);
  yield takeEvery(roleTypes.GET_ROLES_AUTOCOMPLETE_FETCH, getRolesAutoComplete);
  yield takeEvery(roleTypes.CREATE_ROLE_FETCH, createNewRole);
  yield takeEvery(roleTypes.GET_ROLE_DETAIL_FETCH, getRoleDetail);
  yield takeEvery(roleTypes.UPDATE_ROLE_FETCH, updateRole);
  yield takeEvery(roleTypes.DELETE_ROLE_FETCH, deleteRole);
  yield takeEvery(roleTypes.GET_DROPDOWN_ROLES_FETCH, getDropdownRoles);
}

export default function* roleSaga() {
  yield all([fork(watchRolesRequest)]);
}
