/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from "@reduxjs/toolkit";
import CustomerContractApi from "@sera-libraries/api/customer-contract";
import { customerContractActions } from "@sera-redux/slices/customer-contract.slice";
import { BaseType } from "@sera-types/base.type";
import {
  CustomerContractState,
  customerContractTypes,
  DetailContractPayload,
  GetContractsResponse,
  GetCustomerContractDropdownPayload,
  GetCustomerContractDropdownResponse,
  GetDetailContractsResponse,
  UpdateCustomerContractPayload,
} from "@sera-types/customer-contract.type";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

function* getContracts(
  params: PayloadAction<BaseType & { customerId?: string }>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetContractsResponse> & CustomerContractState
> {
  try {
    const result = yield call(CustomerContractApi().getContracts, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerContractActions.getContractsSuccess(result?.data));
    }
  } catch (error: any) {
    yield put(customerContractActions.getContractsFailure(error));
  }
}

function* getContractsAutoComplete(
  params: PayloadAction<BaseType>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetContractsResponse> & CustomerContractState
> {
  try {
    const result = yield call(CustomerContractApi().getContracts, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(
        customerContractActions.getContractsAutoCompleteSuccess(result.data),
      );
    }
  } catch (error: any) {
    yield put(customerContractActions.getContractsAutoCompleteFailure(error));
  }
}

function* getDetailContract(
  params: PayloadAction<DetailContractPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetDetailContractsResponse> & CustomerContractState
> {
  try {
    const result = yield call(CustomerContractApi().getDetailContract, {
      ...params.payload,
    });

    if (result?.status === 200) {
      yield put(customerContractActions.getDetailContractSuccess(result.data));
    }
  } catch (error: any) {
    yield put(customerContractActions.getDetailContractFailure(error));
  }
}

function* updateCustomerContract(
  params: PayloadAction<UpdateCustomerContractPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetContractsResponse> & CustomerContractState
> {
  try {
    const payload: UpdateCustomerContractPayload = { ...params.payload };
    const { id } = payload;
    delete payload.id;

    const res = yield call(CustomerContractApi().updateCustomerContract, {
      id: `${id}`,
      items: { ...payload },
    });
    if (res?.status === 200) {
      yield call(Router.back);
      yield put(
        customerContractActions.updateCustomerContractSuccess({ ...payload }),
      );
    }
  } catch (error) {
    yield put(customerContractActions.updateCustomerContractFailure(error));
  }
}

function* getDropdownCustomerContracts(
  params: PayloadAction<GetCustomerContractDropdownPayload>,
): Generator<
  unknown,
  void,
  AxiosResponse<GetCustomerContractDropdownResponse> & CustomerContractState
> {
  try {
    const result = yield call(
      CustomerContractApi().retrieveDropdownCustomerContracts,
      params.payload,
    );

    if (result?.status === 200)
      yield put(
        customerContractActions.getDropdownCustomerContractsSuccess(
          result.data,
        ),
      );
  } catch (error: any) {
    yield put(
      customerContractActions.getDropdownCustomerContractsFailure({
        status: error.status,
        statusText: error.statusText,
        statusCode: error.data.code,
      }),
    );
  }
}

function* watchCustomerContractsRequest() {
  yield takeEvery(customerContractTypes.GET_CONTRACTS_FETCH, getContracts);
  yield takeEvery(
    customerContractTypes.GET_CONTRACTS_AUTOCOMPLETE_FETCH,
    getContractsAutoComplete,
  );
  yield takeEvery(
    customerContractTypes.GET_DETAIL_CONTRACT_FETCH,
    getDetailContract,
  );
  yield takeEvery(
    customerContractTypes.UPDATE_CUSTOMER_CONTRACT_FETCH,
    updateCustomerContract,
  );
  yield takeEvery(
    customerContractTypes.GET_DROPDOWN_CUSTOMER_CONTRACTS_FETCH,
    getDropdownCustomerContracts,
  );
}

export default function* customerRouteSaga() {
  yield all([fork(watchCustomerContractsRequest)]);
}
