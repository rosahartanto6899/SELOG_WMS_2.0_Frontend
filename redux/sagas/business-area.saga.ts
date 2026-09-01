/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import BusinessAreaApi from "@sera-libraries/api/business-area";
import { businessAreaActions } from "@sera-redux/slices/business-area.slice";
import { BaseType } from "@sera-types/base.type";
import {
  BusinessAreaState,
  businessAreaTypes,
  CreateNewBusinessAreaPayload,
  DeleteBusinessAreaPayload,
  GetBusinessAreaDropdownPayload,
  GetBusinessAreasResponse,
  UpdateBusinessAreaPayload,
} from "@sera-types/business-area.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getBusinessArea(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const result = yield call(BusinessAreaApi().retrieveBusinessAreas, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(businessAreaActions.getBusinessAreasSuccess(result.data));
  } catch (error: any) {
    yield put(
      businessAreaActions.getBusinessAreasFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getBusinessAreaAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const result = yield call(BusinessAreaApi().retrieveBusinessAreas, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(
        businessAreaActions.getBusinessAreasAutoCompleteSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      businessAreaActions.getBusinessAreasAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getBusinessAreaDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const result = yield call(BusinessAreaApi().retrieveBusinessAreaDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(businessAreaActions.getBusinessAreaDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      businessAreaActions.getBusinessAreaDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewBusinessArea(
  params: PayloadAction<CreateNewBusinessAreaPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const payload: CreateNewBusinessAreaPayload = { ...params.payload };
    const res = yield call(BusinessAreaApi().createBusinessArea, payload);
    if (res?.status === 201) {
      yield call(Router.back);
      yield put(
        businessAreaActions.createNewBusinessAreaSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(businessAreaActions.createNewBusinessAreaFailure(error));
  }
}

function* updateBusinessArea(
  params: PayloadAction<UpdateBusinessAreaPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const payload: UpdateBusinessAreaPayload = { ...params.payload };
    const { id } = payload;
    delete payload.id;

    const res = yield call(BusinessAreaApi().updateBusinessArea, {
      id: `${id}`,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.back);
      yield put(businessAreaActions.updateBusinessAreaSuccess({ ...payload }));
    }
  } catch (error) {
    yield put(businessAreaActions.updateBusinessAreaFailure(error));
  }
}

function* deleteBusinessArea(
  params: PayloadAction<DeleteBusinessAreaPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const payload: DeleteBusinessAreaPayload = { ...params.payload };
    const { id, options } = payload;
    delete payload.id;
    delete payload.options;

    const result = yield call(BusinessAreaApi().deleteBusinessArea, `${id}`);
    if (result.status === 200) {
      yield put(businessAreaActions.deleteBusinessAreaSuccess({ ...payload }));
      yield put(
        businessAreaActions.getBusinessAreasFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(businessAreaActions.deleteBusinessAreaFailure(error));
  }
}

function* getDropdownBusinessAreas(
  params: PayloadAction<GetBusinessAreaDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetBusinessAreasResponse> & BusinessAreaState
> {
  try {
    const result = yield call(
      BusinessAreaApi().retrieveDropdownBusinessAreas,
      params.payload,
    );

    if (result?.status === 200)
      yield put(
        businessAreaActions.getDropdownBusinessAreasSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      businessAreaActions.getDropdownBusinessAreasFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchBusinessAreasRequest() {
  yield takeEvery(businessAreaTypes.GET_BUSINESS_AREAS_FETCH, getBusinessArea);
  yield takeEvery(
    businessAreaTypes.GET_BUSINESS_AREAS_AUTOCOMPLETE_FETCH,
    getBusinessAreaAutoComplete,
  );
  yield takeEvery(
    businessAreaTypes.GET_BUSINESS_AREA_DETAIL_FETCH,
    getBusinessAreaDetail,
  );
  yield takeEvery(
    businessAreaTypes.CREATE_BUSINESS_AREA_FETCH,
    createNewBusinessArea,
  );
  yield takeEvery(
    businessAreaTypes.UPDATE_BUSINESS_AREA_FETCH,
    updateBusinessArea,
  );
  yield takeEvery(
    businessAreaTypes.DELETE_BUSINESS_AREA_FETCH,
    deleteBusinessArea,
  );
  yield takeEvery(
    businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS_FETCH,
    getDropdownBusinessAreas,
  );
}

export default function* businessAreaSaga() {
  yield all([fork(watchBusinessAreasRequest)]);
}
