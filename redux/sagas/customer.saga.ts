/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CustomerApi from "@sera-libraries/api/customer";
import { customerActions } from "@sera-redux/slices/customer.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateSalesPayload,
  CustomerContactsPayload,
  CustomerSalesPayload,
  CustomerState,
  customerTypes,
  DeleteSalesPayload,
  DetailCustomerPayload,
  GetAllCustomerDropdownPayload,
  GetCustomerContactsResponse,
  GetCustomerDropdownPayload,
  GetCustomerDropdownResponse,
  GetCustomerSalesResponse,
  GetCustomersResponse,
  GetDetailCustomerResponse,
  UpdateCustomerPayload,
} from "@sera-types/customer.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getCustomers(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomersResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getCustomers, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerActions.getCustomersSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerActions.getCustomersFailure(error));
  }
}

function* getCustomersAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomersResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getCustomers, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerActions.getCustomersAutoCompleteSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerActions.getCustomersAutoCompleteFailure(error));
  }
}

function* getDetailCustomer(
  params: PayloadAction<DetailCustomerPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailCustomerResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getDetailCustomer, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerActions.getDetailCustomerSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerActions.getDetailCustomerFailure(error));
  }
}

function* updateCustomer(
  params: PayloadAction<UpdateCustomerPayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerState> {
  try {
    const result = yield call(CustomerApi().updateCustomer, params?.payload);

    if (result?.status === 200) {
      yield call(Router.back);
      yield put(customerActions.updateCustomerSuccess({ ...params.payload }));
    }
  } catch (error) {
    yield put(customerActions.updateCustomerFailure(error));
  }
}

function* createSales(
  params: PayloadAction<CreateSalesPayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerState> {
  try {
    const result = yield call(CustomerApi().createSales, params?.payload);

    if (result?.status === 201) {
      yield put(customerActions.createSalesSuccess({ ...params.payload }));
    }
  } catch (error) {
    yield put(customerActions.createSalesFailure(error));
  }
}

function* deleteSales(
  params: PayloadAction<DeleteSalesPayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerState> {
  try {
    const result = yield call(CustomerApi().deleteSales, params?.payload);

    if (result?.status === 200) {
      yield put(customerActions.deleteSalesSuccess({ ...params.payload }));
    }
  } catch (error) {
    yield put(customerActions.deleteSalesFailure(error));
  }
}

function* getCustomerSales(
  params: PayloadAction<CustomerSalesPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerSalesResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getCustomerSales, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerActions.getCustomerSalesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerActions.getCustomerSalesFailure(error));
  }
}

function* getCustomerContacts(
  params: PayloadAction<CustomerContactsPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerContactsResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getCustomerContacts, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerActions.getCustomerContactsSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerActions.getCustomerContactsFailure(error));
  }
}

function* getDropdownCustomers(
  params: PayloadAction<GetCustomerDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerDropdownResponse> & CustomerState
> {
  try {
    const result = yield call(
      CustomerApi().retrieveDropdownCustomers,
      params.payload,
    );

    if (result?.status === 200)
      yield put(customerActions.getDropdownCustomersSuccess(result.data));
  } catch (error: any) {
    yield put(
      customerActions.getDropdownCustomersFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownSales(): Generator<
  unknown,
  void,
  AxiosResponse<any> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getDropdownSales);

    if (result?.status === 200) {
      yield put(customerActions.getDropdownSalesSuccess(result.data));
    }
  } catch (error) {
    yield put(customerActions.getDropdownSalesFailure(error));
  }
}

function* getDropdownAddReq(): Generator<
  unknown,
  void,
  AxiosResponse<any> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getDropdownAddReq);

    if (result?.status === 200) {
      yield put(customerActions.getDropdownAddReqSuccess(result.data));
    }
  } catch (error) {
    yield put(customerActions.getDropdownAddReqFailure(error));
  }
}

function* getDropdownPOD(): Generator<
  unknown,
  void,
  AxiosResponse<any> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().getDropdownPOD);

    if (result?.status === 200) {
      yield put(customerActions.getDropdownPODSuccess(result.data));
    }
  } catch (error) {
    yield put(customerActions.getDropdownPODFailure(error));
  }
}

function* getDropdownCustomerIndustries(
  params: PayloadAction<GetAllCustomerDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerDropdownResponse> & CustomerState
> {
  try {
    const result = yield call(
      CustomerApi().retrieveDropdownIndustries,
      params.payload,
    );

    if (result?.status === 200)
      yield put(
        customerActions.getDropdownCustomerIndustriesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerActions.getDropdownCustomerIndustriesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownCustomerCategories(): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerDropdownResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().retrieveDropdownCustomerCategories);

    if (result?.status === 200)
      yield put(
        customerActions.getDropdownCustomerCategoriesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerActions.getDropdownCustomerCategoriesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownCustomerStatuses(): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerDropdownResponse> & CustomerState
> {
  try {
    const result = yield call(CustomerApi().retrieveDropdownCustomerStatuses);

    if (result?.status === 200)
      yield put(
        customerActions.getDropdownCustomerStatusesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerActions.getDropdownCustomerStatusesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchCustomersRequest() {
  yield takeEvery(customerTypes.GET_CUSTOMERS_FETCH, getCustomers);
  yield takeEvery(
    customerTypes.GET_CUSTOMERS_AUTOCOMPLETE_FETCH,
    getCustomersAutoComplete,
  );
  yield takeEvery(customerTypes.GET_DETAIL_CUSTOMER_FETCH, getDetailCustomer);
  yield takeEvery(customerTypes.UPDATE_CUSTOMER_FETCH, updateCustomer);
  yield takeEvery(customerTypes.GET_CUSTOMER_SALES_FETCH, getCustomerSales);
  yield takeEvery(
    customerTypes.GET_CUSTOMER_CONTACTS_FETCH,
    getCustomerContacts,
  );
  yield takeEvery(customerTypes.CREATE_SALES_FETCH, createSales);
  yield takeEvery(customerTypes.DELETE_SALES_FETCH, deleteSales);
  yield takeEvery(
    customerTypes.GET_DROPDOWN_CUSTOMERS_FETCH,
    getDropdownCustomers,
  );
  yield takeEvery(customerTypes.GET_DROPDOWN_SALES_FETCH, getDropdownSales);
  yield takeEvery(customerTypes.GET_DROPDOWN_ADD_REQ_FETCH, getDropdownAddReq);
  yield takeEvery(customerTypes.GET_DROPDOWN_POD_FETCH, getDropdownPOD);
  yield takeEvery(
    customerTypes.GET_DROPDOWN_CUSTOMER_INDUSTRIES_FETCH,
    getDropdownCustomerIndustries,
  );
  yield takeEvery(
    customerTypes.GET_DROPDOWN_CUSTOMER_CATEGORIES_FETCH,
    getDropdownCustomerCategories,
  );
  yield takeEvery(
    customerTypes.GET_DROPDOWN_CUSTOMER_STATUSES_FETCH,
    getDropdownCustomerStatuses,
  );
}

export default function* customerSaga() {
  yield all([fork(watchCustomersRequest)]);
}
