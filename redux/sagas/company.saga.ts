/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CompanyApi from "@sera-libraries/api/company";
import { companyActions } from "@sera-redux/slices/company.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CompanyState,
  companyTypes,
  CreateNewCompanyPayload,
  DeleteCompanyPayload,
  GetCompaniesResponse,
  GetCompanyDropdownPayload,
  UpdateCompanyPayload,
} from "@sera-types/company.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getComapanies(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const result = yield call(CompanyApi().retrieveCompanies, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(companyActions.getCompaniesSuccess(result.data));
  } catch (error: any) {
    yield put(
      companyActions.getCompaniesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getCompaniesAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const result = yield call(CompanyApi().retrieveCompanies, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(companyActions.getCompaniesAutoCompleteSuccess(result.data));
  } catch (error: any) {
    yield put(
      companyActions.getCompaniesAutoCompleteFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data?.code,
      }),
    );
  }
}

function* getCompanyDetail(
  params: PayloadAction<{ id: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const result = yield call(CompanyApi().retrieveCompanyDetail, {
      ...params.payload,
    });
    if (result?.status === 200)
      yield put(companyActions.getCompanyDetailSuccess(result.data));
  } catch (error: any) {
    yield put(
      companyActions.getCompanyDetailFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* createNewCompany(
  params: PayloadAction<CreateNewCompanyPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const payload: CreateNewCompanyPayload = { ...params.payload };
    const res = yield call(CompanyApi().createCompany, payload);
    if (res?.status === 201) {
      yield call(Router.back);
      yield put(companyActions.createNewCompanySuccess({ ...params.payload }));
    }
  } catch (error) {
    yield put(companyActions.createNewCompanyFailure(error));
  }
}

function* updateCompany(
  params: PayloadAction<UpdateCompanyPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const payload: UpdateCompanyPayload = { ...params.payload };
    const { code } = payload;
    delete payload.code;

    const res = yield call(CompanyApi().updateCompany, {
      code: `${code}`,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.back);
      yield put(companyActions.updateCompanySuccess({ ...payload }));
    }
  } catch (error) {
    yield put(companyActions.updateCompanyFailure(error));
  }
}

function* deleteCompany(
  params: PayloadAction<DeleteCompanyPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const payload: DeleteCompanyPayload = { ...params.payload };
    const { id, options } = payload;
    delete payload.id;
    delete payload.options;

    const result = yield call(CompanyApi().deleteCompany, `${id}`);
    if (result.status === 200) {
      yield put(companyActions.deleteCompanySuccess({ ...payload }));
      yield put(
        companyActions.getCompaniesFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(companyActions.deleteCompanyFailure(error));
  }
}

function* getDropdownCompanies(
  params: PayloadAction<GetCompanyDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCompaniesResponse> & CompanyState
> {
  try {
    const result = yield call(
      CompanyApi().retrieveDropdownCompanies,
      params.payload,
    );

    if (result?.status === 200)
      yield put(companyActions.getDropdownCompaniesSuccess(result.data));
  } catch (error: any) {
    yield put(
      companyActions.getDropdownCompaniesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchCompaniesRequest() {
  yield takeEvery(companyTypes.GET_COMPANIES_FETCH, getComapanies);
  yield takeEvery(
    companyTypes.GET_COMPANIES_AUTOCOMPLETE_FETCH,
    getCompaniesAutoComplete,
  );
  yield takeEvery(companyTypes.GET_COMPANY_DETAIL_FETCH, getCompanyDetail);
  yield takeEvery(companyTypes.CREATE_COMPANY_FETCH, createNewCompany);
  yield takeEvery(companyTypes.UPDATE_COMPANY_FETCH, updateCompany);
  yield takeEvery(companyTypes.DELETE_COMPANY_FETCH, deleteCompany);
  yield takeEvery(
    companyTypes.GET_DROPDOWN_COMPANIES_FETCH,
    getDropdownCompanies,
  );
}

export default function* companySaga() {
  yield all([fork(watchCompaniesRequest)]);
}
