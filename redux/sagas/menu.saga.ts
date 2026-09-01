/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import MenuApi from "@sera-libraries/api/menu/index";
import { menuActions } from "@sera-redux/slices/menu.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewMenuPayload,
  DeleteMenuPayload,
  GetMenusResponse,
  MenuState,
  menuTypes,
  UpdateMenuPayload,
} from "@sera-types/menu.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getMenus(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const result = yield call(MenuApi().retrieveMenus, { ...params.payload });

    if (result?.status === 200)
      yield put(menuActions.getMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      menuActions.getMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getMenusAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const result = yield call(MenuApi().retrieveMenus, { ...params.payload });
    if (result?.status === 200)
      yield put(menuActions.getMenusAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      menuActions.getMenusAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownParentMenusFetch(): Generator<
  unknown,
  void,
  AxiosResponse<GetMenusResponse> & MenuState
> {
  try {
    const result = yield call(MenuApi().retrieveParentDropdownMenus);
    if (result?.status === 200)
      yield put(menuActions.getDropdownParentMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      menuActions.getDropdownParentMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownMenusFetch(): Generator<
  unknown,
  void,
  AxiosResponse<GetMenusResponse> & MenuState
> {
  try {
    const result = yield call(MenuApi().retrieveDropdownMenus);
    if (result?.status === 200)
      yield put(menuActions.getDropdownMenusSuccess(result.data));
  } catch (error: any) {
    yield put(
      menuActions.getDropdownParentMenusFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewMenu(
  params: PayloadAction<CreateNewMenuPayload>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const payload: CreateNewMenuPayload = { ...params.payload };
    const res = yield call(MenuApi().createMenu, payload);
    if (res?.status === 201) {
      yield call(Router.push, "/user-management/menu-configuration");
      yield put(menuActions.createNewMenuSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(menuActions.createNewMenuFailure(error));
  }
}

function* getMenuDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const result = yield call(MenuApi().retrieveMenuDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(menuActions.getMenuDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      menuActions.getMenuDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* updateMenu(
  params: PayloadAction<UpdateMenuPayload>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const payload: UpdateMenuPayload = { ...params.payload };
    const res = yield call(MenuApi().updateMenu, {
      id: payload.id,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.push, "/user-management/menu-configuration");
      yield put(menuActions.updateMenuSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(menuActions.updateMenuFailure(error));
  }
}

function* deleteMenu(
  params: PayloadAction<DeleteMenuPayload>,
): Generator<unknown, void, AxiosResponse<GetMenusResponse> & MenuState> {
  try {
    const { id, options } = params.payload;
    const result = yield call(MenuApi().deleteMenu, id);

    if (result.status === 200) {
      yield put(menuActions.deleteMenuSuccess({ ...params.payload }));
      yield put(
        menuActions.getMenusFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(menuActions.deleteMenuFailure(error));
  }
}

function* watchMenusRequest() {
  yield takeEvery(menuTypes.GET_MENUS_FETCH, getMenus);
  yield takeEvery(menuTypes.GET_MENUS_AUTOCOMPLETE_FETCH, getMenusAutoComplete);
  yield takeEvery(
    menuTypes.GET_DROPDOWN_PARENT_MENUS_FETCH,
    getDropdownParentMenusFetch,
  );
  yield takeEvery(menuTypes.CREATE_MENU_FETCH, createNewMenu);
  yield takeEvery(menuTypes.GET_MENU_DETAIL_FETCH, getMenuDetail);
  yield takeEvery(menuTypes.UPDATE_MENU_FETCH, updateMenu);
  yield takeEvery(menuTypes.DELETE_MENU_FETCH, deleteMenu);
  yield takeEvery(menuTypes.GET_DROPDOWN_MENUS_FETCH, getDropdownMenusFetch);
}

export default function* menuSaga() {
  yield all([fork(watchMenusRequest)]);
}
