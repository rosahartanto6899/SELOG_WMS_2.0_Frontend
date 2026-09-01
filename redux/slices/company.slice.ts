/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/company.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  Company,
  CompanyDropdown,
  GetCompaniesResponse,
  GetCompanyDropdownPayload,
} from "@sera-types/company.type";
import _ from "lodash";

export const companyState = createSlice({
  name: "companies",
  initialState,
  reducers: {
    getCompaniesFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getCompaniesSuccess: (
      state,
      action: PayloadAction<GetCompaniesResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: Company, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getCompaniesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getCompaniesClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },
    getCompaniesAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };

      if (state?.autoComplete)
        state.autoComplete.options.searchBy = action.payload.searchBy;
    },
    getCompaniesAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetCompaniesResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const uniqueData = _.uniqBy(data, searchBy);

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];
      }
      state.isLoading = false;
    },
    getCompaniesAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getCompaniesAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getCompanyDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getCompanyDetailSuccess: (
      state,
      action: PayloadAction<GetCompaniesResponse>,
    ) => {
      const { data } = action.payload;
      state.companyDetail.data = {
        ...state.companyDetail.data,
        ...data,
      };
      state.isLoading = false;
    },
    getCompanyDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getCompanyDetailClear: (state) => {
      state.companyDetail = initialState.companyDetail;
    },

    createNewCompanyFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewCompanySuccess: (state, action) => {
      state.createNewCompany = action.payload;
      state.isLoading = false;
    },
    createNewCompanyFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    createNewCompanyClear: (state) => {
      state.createNewCompany = initialState.createNewCompany;
    },

    updateCompanyFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateCompanySuccess: (state, action) => {
      state.updateCompany = action.payload;
      state.isLoading = false;
    },
    updateCompanyFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    updateCompanyClear: (state) => {
      state.updateCompany = initialState.updateCompany;
    },

    deleteCompanyFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    deleteCompanySuccess: (state, action) => {
      state.isLoading = false;
      state.deleteCompany = action.payload;
    },
    deleteCompanyFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    deleteCompanyClear: (state) => {
      state.deleteCompany = initialState.deleteCompany;
    },

    getDropdownCompaniesFetch: (
      state,
      action: PayloadAction<GetCompanyDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCompanies.options = action.payload;
    },
    getDropdownCompaniesSuccess: (
      state,
      action: PayloadAction<GetCompaniesResponse>,
    ) => {
      const data = action.payload.data as CompanyDropdown[];
      state.dropdownCompanies.data =
        data.map((item) => ({ ...item, id: item.id?.toUpperCase() })) ?? [];
      state.isLoading = false;
    },
    getDropdownCompaniesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCompaniesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCompanies.data = initialState.dropdownCompanies.data;
      state.dropdownCompanies.options = {};
    },
  },
});

export const {
  getCompaniesFetch,
  getCompaniesSuccess,
  getCompaniesFailure,
  getCompaniesClear,
  getCompaniesAutoCompleteFetch,
  getCompaniesAutoCompleteSuccess,
  getCompaniesAutoCompleteFailure,
  getCompaniesAutoCompleteClear,
  getCompanyDetailFetch,
  getCompanyDetailSuccess,
  getCompanyDetailFailure,
  getCompanyDetailClear,
  createNewCompanyFetch,
  createNewCompanySuccess,
  createNewCompanyFailure,
  createNewCompanyClear,
  getDropdownCompaniesFetch,
  getDropdownCompaniesSuccess,
  getDropdownCompaniesFailure,
  getDropdownCompaniesClear,
  updateCompanyFetch,
  updateCompanySuccess,
  updateCompanyFailure,
  updateCompanyClear,
  deleteCompanyFetch,
  deleteCompanySuccess,
  deleteCompanyFailure,
  deleteCompanyClear,
} = companyState.actions;

export const companyActions = companyState.actions;
export const companyReducer = companyState.reducer;
export default companyReducer;
