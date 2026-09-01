/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CustomerRouteApi from "@sera-libraries/api/customer-route";
import { customerRouteActions } from "@sera-redux/slices/customer-route.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CreateCustomerRoutePayload,
  CustomerRouteState,
  customerRouteTypes,
  DeleteCustomerRoutePayload,
  DetailCustomerRoutePayload,
  DownloadQuotationPayload,
  GetCustomerRouteDropdownPayload,
  GetCustomerRouteDropdownResponse,
  GetCustomerRoutesResponse,
  GetDetailCustomerRoutesResponse,
  UpdateCustomerRoutePayload,
  UploadQuotationPayload,
  UploadQuotationResponse,
} from "@sera-types/customer-route.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getCustomerRoutes(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRoutesResponse> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().getCustomerRoutes, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerRouteActions.getCustomerRoutesSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerRouteActions.getCustomerRoutesFailure(error));
  }
}

function* getCustomerRoutesAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRoutesResponse> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().getCustomerRoutes, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        customerRouteActions.getCustomerRoutesAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(customerRouteActions.getCustomerRoutesAutoCompleteFailure(error));
  }
}

function* createCustomerRoute(
  params: PayloadAction<CreateCustomerRoutePayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerRouteState> {
  try {
    const result = yield call(
      CustomerRouteApi().createCustomerRoute,
      params?.payload,
    );

    if (result?.status === 201) {
      yield call(Router.back);
      yield put(
        customerRouteActions.createCustomerRouteSuccess({ ...params.payload }),
      );
    }
  } catch (error) {
    yield put(customerRouteActions.createCustomerRouteFailure(error));
  }
}

function* getDetailCustomerRoute(
  params: PayloadAction<DetailCustomerRoutePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailCustomerRoutesResponse> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().retrieveCustomerRouteDetail, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        customerRouteActions.getDetailCustomerRouteSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(customerRouteActions.getDetailCustomerRouteFailure(error));
  }
}

function* updateCustomerRoute(
  params: PayloadAction<UpdateCustomerRoutePayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRoutesResponse> & CustomerRouteState
> {
  try {
    const payload: UpdateCustomerRoutePayload = { ...params.payload };
    const { id } = payload;
    delete payload.id;

    const res = yield call(CustomerRouteApi().updateCustomerRoute, {
      id: `${id}`,
      items: { ...payload },
    });

    if (res?.status === 200) {
      yield call(Router.back);
      yield put(
        customerRouteActions.updateCustomerRouteSuccess({ ...payload }),
      );
    }
  } catch (error) {
    yield put(customerRouteActions.updateCustomerRouteFailure(error));
  }
}

function* deleteCustomerRoute(
  params: PayloadAction<DeleteCustomerRoutePayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerRouteState> {
  try {
    const payload: DeleteCustomerRoutePayload = { ...params.payload };
    const { id, options } = payload;

    const result = yield call(CustomerRouteApi().deleteCustomerRoute, `${id}`);

    if (result.status === 200) {
      yield put(
        customerRouteActions.deleteCustomerRouteSuccess({ ...payload }),
      );

      yield put(
        customerRouteActions.getCustomerRoutesFetch({
          ...options,
          page: Number(options?.page),
          limit: Number(options?.limit),
        }),
      );
    }
  } catch (error) {
    yield put(customerRouteActions.deleteCustomerRouteFailure(error));
  }
}

function* getDropdownTollUsages(): Generator<
  unknown,
  void,
  AxiosResponse<any> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().getDropdownTollUsages);

    if (result?.status === 200) {
      yield put(customerRouteActions.getDropdownTollUsagesSuccess(result.data));
    }
  } catch (error) {
    yield put(customerRouteActions.getDropdownTollUsagesFailure(error));
  }
}

function* getDropdownCustomerRoutes(
  params: PayloadAction<GetCustomerRouteDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRouteDropdownResponse> & CustomerRouteState
> {
  try {
    const result = yield call(
      CustomerRouteApi().retrieveDropdownCustomerRoutes,
      params.payload,
    );

    if (result?.status === 200)
      yield put(
        customerRouteActions.getDropdownCustomerRoutesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerRouteActions.getDropdownCustomerRoutesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* getDropdownRouteActivityTypes(): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRouteDropdownResponse> & CustomerRouteState
> {
  try {
    const result = yield call(
      CustomerRouteApi().retrieveDropdownRouteActivityTypes,
    );

    if (result?.status === 200)
      yield put(
        customerRouteActions.getDropdownRouteActivityTypesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerRouteActions.getDropdownRouteActivityTypesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}
function* getDropdownLeadTimeTypes(): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerRouteDropdownResponse> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().retrieveDropdownLeadTimeTypes);

    if (result?.status === 200)
      yield put(
        customerRouteActions.getDropdownLeadTimeTypesSuccess(result.data),
      );
  } catch (error: any) {
    yield put(
      customerRouteActions.getDropdownLeadTimeTypesFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* uploadQuotation(
  params: PayloadAction<UploadQuotationPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<UploadQuotationResponse> & CustomerRouteState
> {
  try {
    const result = yield call(CustomerRouteApi().uploadQuotation, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerRouteActions.uploadQuotationSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerRouteActions.uploadQuotationFailure(error));
  }
}

function* downloadQuotation(
  params: PayloadAction<DownloadQuotationPayload>,
): Generator<unknown, void, AxiosResponse<any> & CustomerRouteState> {
  try {
    const result = yield call(CustomerRouteApi().downloadQuotation, {
      ...params.payload,
    });

    if (result?.status === 200) {
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${params?.payload?.fileName}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      yield put(customerRouteActions.downloadQuotationSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerRouteActions.downloadQuotationFailure(error));
  }
}

function* watchCustomerRoutesRequest() {
  yield takeEvery(
    customerRouteTypes.GET_CUSTOMER_ROUTES_FETCH,
    getCustomerRoutes,
  );
  yield takeEvery(
    customerRouteTypes.GET_CUSTOMER_ROUTES_AUTOCOMPLETE_FETCH,
    getCustomerRoutesAutoComplete,
  );
  yield takeEvery(
    customerRouteTypes.CREATE_CUSTOMER_ROUTE_FETCH,
    createCustomerRoute,
  );
  yield takeEvery(
    customerRouteTypes.GET_DETAIL_CUSTOMER_ROUTE_FETCH,
    getDetailCustomerRoute,
  );
  yield takeEvery(
    customerRouteTypes.UPDATE_CUSTOMER_ROUTE_FETCH,
    updateCustomerRoute,
  );
  yield takeEvery(
    customerRouteTypes.DELETE_CUSTOMER_ROUTE_FETCH,
    deleteCustomerRoute,
  );
  yield takeEvery(
    customerRouteTypes.GET_DROPDOWN_TOLL_USAGES_FETCH,
    getDropdownTollUsages,
  );
  yield takeEvery(
    customerRouteTypes.GET_DROPDOWN_CUSTOMER_ROUTES_FETCH,
    getDropdownCustomerRoutes,
  );
  yield takeEvery(
    customerRouteTypes.GET_DROPDOWN_ROUTE_ACTIVITY_TYPES_FETCH,
    getDropdownRouteActivityTypes,
  );
  yield takeEvery(
    customerRouteTypes.GET_DROPDOWN_LEAD_TIME_TYPES_FETCH,
    getDropdownLeadTimeTypes,
  );
  yield takeEvery(customerRouteTypes.UPLOAD_QUOTATION_FETCH, uploadQuotation);
  yield takeEvery(
    customerRouteTypes.DONWLOAD_QUOTATION_FETCH,
    downloadQuotation,
  );
}

export default function* customerRouteSaga() {
  yield all([fork(watchCustomerRoutesRequest)]);
}
