/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/customer-contract.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  AllCustomerContractDropdown,
  Contract,
  DetailContractPayload,
  GetContractsResponse,
  GetCustomerContractDropdownPayload,
  GetCustomerContractDropdownResponse,
  GetDetailContractsResponse,
} from "@sera-types/customer-contract.type";
import { uniqBy } from "lodash";

export const customerContractState = createSlice({
  name: "customerContracts",
  initialState,
  reducers: {
    getContractsFetch: (
      state,
      action: PayloadAction<BaseType & { customerId?: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getContractsSuccess: (
      state,
      action: PayloadAction<GetContractsResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetContractsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.data = data?.map((r: Contract, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }

      state.options = { ...state.options, page, limit, totalData, totalPage };
    },
    getContractsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },
    getContractsClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = [];
      state.options = initialState.options;
    },

    getContractsAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getContractsAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetContractsResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetContractsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getContractsAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getContractsAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getDetailContractFetch: (
      state,
      action: PayloadAction<DetailContractPayload>,
    ) => {
      state.detailContract.isLoading = true;
      state.detailContract.error = null;
      state.detailContract.data = {};
      state.detailContract.payload = { ...action?.payload };
    },
    getDetailContractSuccess: (
      state,
      action: PayloadAction<GetDetailContractsResponse>,
    ) => {
      state.detailContract.isLoading = false;
      state.detailContract.error = null;
      state.detailContract.data = { ...action?.payload?.data };
    },
    getDetailContractFailure: (state, action) => {
      state.detailContract.isLoading = false;
      state.detailContract.error = { ...action.payload };
      state.detailContract.data = {};
    },
    getDetailContractClear: (state) => {
      state.detailContract = initialState.detailContract;
    },

    updateCustomerContractFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateCustomerContractSuccess: (state, action) => {
      state.updateCustomerContract = action.payload;
      state.isLoading = false;
    },
    updateCustomerContractFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    updateCustomerContractClear: (state) => {
      state.updateCustomerContract = initialState.updateCustomerContract;
    },

    getDropdownCustomerContractsFetch: (
      state,
      action: PayloadAction<GetCustomerContractDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomerContracts.options = action.payload;
    },
    getDropdownCustomerContractsSuccess: (
      state,
      action: PayloadAction<GetCustomerContractDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerContractDropdown[];
      state.dropdownCustomerContracts.data =
        data.map((item) => ({ ...item, id: item.id?.toUpperCase() })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerContractsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomerContractsClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomerContracts.data =
        initialState.dropdownCustomerContracts.data;
      state.dropdownCustomerContracts.options = {};
    },
  },
});

export const customerContractActions = customerContractState.actions;
export const customerContractReducer = customerContractState.reducer;
export default customerContractReducer;
