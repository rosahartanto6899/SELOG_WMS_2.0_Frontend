import { PayloadAction } from "@reduxjs/toolkit";
import RoleMenuApi from "@sera-libraries/api/role-menu";
import { BaseType } from "@sera-types/base.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
  CreateNewRoleMenuPayload,
  DeleteRoleMenuPayload,
  GetRoleMenusResponse,
  RoleMenuPayload,
  RoleMenuState,
  roleMenuTypes,
  UpdateRoleMenuPayload,
} from "../../types/role-menu.type";
import {
  getAllRoleMenusFailure,
  getAllRoleMenusSuccess,
  getDropdownRoleMenusFailure,
  getDropdownRoleMenusSuccess,
  getRoleMenuDetailFailure,
  getRoleMenuDetailSuccess,
  getRoleMenusAutoCompleteFailure,
  getRoleMenusAutoCompleteSuccess,
  getRoleMenusFailure,
  getRoleMenusSuccess,
  roleMenuActions,
} from "../slices/role-menu.slice";

function* getRoleMenus(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveRoleMenus, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getRoleMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRoleMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getRoleMenusAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveRoleMenus, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getRoleMenusAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRoleMenusAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewRoleMenu(
  params: PayloadAction<CreateNewRoleMenuPayload & FormData>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const { payload } = params;
    const res = yield call(RoleMenuApi().createRoleMenu, payload);
    if (res?.status === 201) {
      const { data } = res.data;
      yield call(Router.push, "/user-management/role-permissions");
      yield put(
        roleMenuActions.createNewRoleMenuSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(roleMenuActions.createNewRoleMenuFailure(error));
  }
}

function* getRoleMenuDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveRoleMenuDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getRoleMenuDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      getRoleMenuDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* updateRoleMenu(
  params: PayloadAction<UpdateRoleMenuPayload & FormData>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const { payload } = params;
    const { id, ...restPayload } = payload;
    const items: RoleMenuPayload = { ...restPayload };
    const res = yield call(RoleMenuApi().updateRoleMenu, {
      id,
      items,
    });
    if (res?.status === 200) {
      const { data } = res.data;
      yield call(Router.push, "/user-management/role-permissions");
      yield put(
        roleMenuActions.updateRoleMenuSuccess({
          isLoading: false,
          data,
          success: true,
        }),
      );
    }
  } catch (error) {
    yield put(roleMenuActions.updateRoleMenuFailure(error));
  }
}

function* deleteRoleMenu(
  params: PayloadAction<DeleteRoleMenuPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const { id, menuName, options } = params.payload;
    const result = yield call(RoleMenuApi().deleteRoleMenu, id);

    if (result.status === 200) {
      yield put(roleMenuActions.deleteRoleMenuSuccess(result.data));
      yield put(
        roleMenuActions.getRoleMenusFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
      yield put(roleMenuActions.setPostDeleteNewRoleMenu(menuName));
    }
  } catch (error) {
    yield put(roleMenuActions.deleteRoleMenuFailure(error));
  }
}

function* getDropdownRoleMenus(): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveDropdownRoleMenus);
    if (result?.status === 200)
      yield put(getDropdownRoleMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownRoleMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* loadmoreDropdownRoleMenus(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveRoleMenus, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(getDropdownRoleMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      getDropdownRoleMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getAllRoleMenus(
  params: PayloadAction<BaseType & { roleId: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetRoleMenusResponse> & RoleMenuState
> {
  try {
    const result = yield call(RoleMenuApi().retrieveRoleMenus, {
      ...params.payload,
    });
    if (result?.status === 200) yield put(getAllRoleMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      getAllRoleMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchRoleMenusRequest() {
  yield takeEvery(roleMenuTypes.GET_ROLE_MENUS_FETCH, getRoleMenus);
  yield takeEvery(
    roleMenuTypes.GET_ROLE_MENUS_AUTOCOMPLETE_FETCH,
    getRoleMenusAutoComplete,
  );
  yield takeEvery(roleMenuTypes.CREATE_ROLE_MENU_FETCH, createNewRoleMenu);
  yield takeEvery(roleMenuTypes.GET_ROLE_MENU_DETAIL_FETCH, getRoleMenuDetail);
  yield takeEvery(roleMenuTypes.UPDATE_ROLE_MENU_FETCH, updateRoleMenu);
  yield takeEvery(roleMenuTypes.DELETE_ROLE_MENU_FETCH, deleteRoleMenu);
  yield takeEvery(
    roleMenuTypes.GET_DROPDOWN_ROLE_MENUS_FETCH,
    getDropdownRoleMenus,
  );
  yield takeEvery(
    roleMenuTypes.LOADMORE_DROPDOWN_ROLE_MENUS_FETCH,
    loadmoreDropdownRoleMenus,
  );
  yield takeEvery(roleMenuTypes.GET_ALL_ROLE_MENUS_FETCH, getAllRoleMenus);
}

export default function* roleMenuSaga() {
  yield all([fork(watchRoleMenusRequest)]);
}
