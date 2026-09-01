/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import UserApi from "@sera-libraries/api/user";
import { userActions } from "@sera-redux/slices/user.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewUserPayload,
  DeleteUserPayload,
  GetUsersResponse,
  UpdateActiveVendorPayload,
  UpdateActiveVendorResponse,
  UpdateUserPayload,
  UserState,
  userTypes,
} from "@sera-types/user.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getUsers(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const result = yield call(UserApi().retrieveUsers, { ...params.payload });
    if (result?.status === 200)
      yield put(userActions.getUsersSuccess(result.data));
  } catch (error: any) {
    yield put(
      userActions.getUsersFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUsersAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const result = yield call(UserApi().retrieveUsers, { ...params.payload });
    if (result?.status === 200)
      yield put(userActions.getUsersAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      userActions.getUsersAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getUserDetail(
  params: PayloadAction<{ id: string }>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const result = yield call(UserApi().retrieveUserDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(userActions.getUserDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      userActions.getUserDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewUser(
  params: PayloadAction<CreateNewUserPayload>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const payload: CreateNewUserPayload = { ...params.payload };
    const res = yield call(UserApi().createUser, payload);
    if (res?.status === 201) {
      yield call(Router.push, "/user-management/users");
      yield put(userActions.createNewUserSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(userActions.createNewUserFailure(error));
  }
}

function* updateUser(
  params: PayloadAction<UpdateUserPayload>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const payload: UpdateUserPayload = { ...params.payload };
    const { id } = payload;
    delete payload.id;
    const res = yield call(UserApi().updateUser, {
      id: `${id}`,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.push, "/user-management/users");
      yield put(userActions.updateUserSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(userActions.updateUserFailure(error));
  }
}

function* deleteUser(
  params: PayloadAction<DeleteUserPayload>,
): Generator<unknown, void, AxiosResponse<GetUsersResponse> & UserState> {
  try {
    const payload: DeleteUserPayload = { ...params.payload };
    const { id, options } = payload;
    const res = yield call(UserApi().deleteUser, `${id}`);

    if (res?.status === 200) {
      yield put(userActions.deleteUserSuccess({ ...params.payload }));
      yield put(
        userActions.getUsersFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(userActions.deleteUserFailure(error));
  }
}

function* getUserGradeDropdown(): Generator<
  unknown,
  void,
  AxiosResponse<any> & UserState
> {
  try {
    const result = yield call(UserApi().retrieveUserGrade);
    if (result?.status === 200)
      yield put(userActions.getUserGradeSuccess(result.data));
  } catch (error) {
    yield put(userActions.getUserGradeFailure(error));
  }
}

function* updateActiveVendorSaga(
  params: PayloadAction<UpdateActiveVendorPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UpdateActiveVendorResponse> & UserState
> {
  try {
    const payload: UpdateActiveVendorPayload = { ...params.payload };
    const res = yield call(UserApi().updateActiveVendor, params.payload);

    if (res?.status === 200) {
      yield put(
        userActions.updateActiveVendorSuccess({
          success: true,
          error: false,
          data: {
            ...payload,
          },
        }),
      );
    }
  } catch (error) {
    yield put(userActions.updateActiveVendorFailure(error));
  }
}

function* watchUsersRequest() {
  yield takeEvery(userTypes.GET_USERS_FETCH, getUsers);
  yield takeEvery(userTypes.GET_USERS_AUTOCOMPLETE_FETCH, getUsersAutoComplete);
  yield takeEvery(userTypes.GET_USER_DETAIL_FETCH, getUserDetail);
  yield takeEvery(userTypes.GET_USER_GRADE_FETCH, getUserGradeDropdown);
  yield takeEvery(userTypes.CREATE_USER_FETCH, createNewUser);
  yield takeEvery(userTypes.UPDATE_USER_FETCH, updateUser);
  yield takeEvery(userTypes.DELETE_USER_FETCH, deleteUser);
  yield takeEvery(userTypes.UPDATE_ACTIVE_VENDOR_FETCH, updateActiveVendorSaga);
}

export default function* menuSaga() {
  yield all([fork(watchUsersRequest)]);
}
