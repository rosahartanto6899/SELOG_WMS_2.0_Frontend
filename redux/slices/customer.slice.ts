/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/customer.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  AllCustomerDropdown,
  CreateSalesPayload,
  Customer,
  CustomerContact,
  CustomerContactsPayload,
  CustomerSales,
  CustomerSalesPayload,
  DeleteSalesPayload,
  DetailCustomerPayload,
  GetAllCustomerDropdownPayload,
  GetCustomerContactsResponse,
  GetCustomerDropdownPayload,
  GetCustomerDropdownResponse,
  GetCustomerSalesResponse,
  GetCustomersResponse,
  GetDetailCustomerResponse,
  GetDropdownAddReqResponse,
  GetDropdownPODResponse,
  GetDropdownSalesResponse,
  UpdateCustomerPayload,
} from "@sera-types/customer.type";
import { uniqBy } from "lodash";

export const customerState = createSlice({
  name: "customers",
  initialState,
  reducers: {
    getCustomersFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.data = {};
      state.options = { ...action.payload };
    },
    getCustomersSuccess: (
      state,
      action: PayloadAction<GetCustomersResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetCustomersResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      state.options = { ...state.options, page, limit, totalData, totalPage };

      if (data) {
        state.data = {
          list: data?.list?.map((r: Customer, index: number) => {
            const no = (page - 1) * limit + index + 1;
            return { ...r, no };
          }),
          summary: data?.summary,
        };
      }
    },
    getCustomersFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = {};
    },
    getCustomersClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = {};
      state.options = initialState.options;
    },

    getCustomersAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getCustomersAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetCustomersResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetCustomersResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "cmd";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        const _uniqueData = uniqBy(data?.list, searchBy);

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
    getCustomersAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.autoComplete.data = [];
    },
    getCustomersAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getDetailCustomerFetch: (
      state,
      action: PayloadAction<DetailCustomerPayload>,
    ) => {
      state.detailCustomer.isLoading = true;
      state.detailCustomer.error = null;
      state.detailCustomer.data = {};
      state.detailCustomer.payload = { ...action?.payload };
    },
    getDetailCustomerSuccess: (
      state,
      action: PayloadAction<GetDetailCustomerResponse>,
    ) => {
      state.detailCustomer.isLoading = false;
      state.detailCustomer.error = null;
      state.detailCustomer.data = { ...action?.payload?.data };
    },
    getDetailCustomerFailure: (state, action) => {
      state.detailCustomer.isLoading = false;
      state.detailCustomer.error = { ...action.payload };
      state.detailCustomer.data = {};
    },
    getDetailCustomerClear: (state) => {
      state.detailCustomer = initialState.detailCustomer;
    },

    updateCustomerFetch: (
      state,
      action: PayloadAction<UpdateCustomerPayload>,
    ) => {
      state.updateCustomer.isLoading = true;
      state.updateCustomer.error = null;
      state.updateCustomer.payload = { ...action?.payload };
    },
    updateCustomerSuccess: (
      state,
      action: PayloadAction<UpdateCustomerPayload>,
    ) => {
      state.updateCustomer.isLoading = false;
      state.updateCustomer.error = null;
      state.updateCustomer.data = action.payload;
    },
    updateCustomerFailure: (state, action) => {
      state.updateCustomer.isLoading = false;
      state.updateCustomer.error = { ...action.payload };
      state.updateCustomer.data = {};
    },
    updateCustomerClear: (state) => {
      state.updateCustomer = initialState.updateCustomer;
    },

    createSalesFetch: (state, action: PayloadAction<CreateSalesPayload>) => {
      state.createSales.isLoading = true;
      state.createSales.error = null;
      state.createSales.payload = { ...action?.payload };
    },
    createSalesSuccess: (state, action: PayloadAction<CreateSalesPayload>) => {
      state.createSales.isLoading = false;
      state.createSales.error = null;
      state.createSales.data = action.payload;
    },
    createSalesFailure: (state, action) => {
      state.createSales.isLoading = false;
      state.createSales.error = { ...action.payload };
      state.createSales.data = {};
    },
    createSalesClear: (state) => {
      state.createSales = initialState.createSales;
    },

    deleteSalesFetch: (state, action: PayloadAction<DeleteSalesPayload>) => {
      state.deleteSales.isLoading = true;
      state.deleteSales.error = null;
      state.deleteSales.payload = { ...action?.payload };
    },
    deleteSalesSuccess: (state, action: PayloadAction<DeleteSalesPayload>) => {
      state.deleteSales.isLoading = false;
      state.deleteSales.error = null;
      state.deleteSales.data = action.payload;
    },
    deleteSalesFailure: (state, action) => {
      state.deleteSales.isLoading = false;
      state.deleteSales.error = { ...action.payload };
      state.deleteSales.data = {};
    },
    deleteSalesClear: (state) => {
      state.deleteSales = initialState.deleteSales;
    },

    getCustomerSalesFetch: (
      state,
      action: PayloadAction<CustomerSalesPayload>,
    ) => {
      state.customerSales.isLoading = true;
      state.customerSales.error = null;
      state.customerSales.data = [];
      state.customerSales.payload = { ...action.payload };
    },
    getCustomerSalesSuccess: (
      state,
      action: PayloadAction<GetCustomerSalesResponse>,
    ) => {
      state.customerSales.isLoading = false;
      state.customerSales.error = null;

      const { data } = action.payload as GetCustomerSalesResponse;

      if (data) {
        state.customerSales.data = data?.map(
          (r: CustomerSales, index: number) => {
            const no = index + 1;
            return { ...r, no };
          },
        );
      }
    },
    getCustomerSalesFailure: (state, action) => {
      state.customerSales.isLoading = false;
      state.customerSales.error = { ...action.payload };
      state.customerSales.data = [];
    },
    getCustomerSalesClear: (state) => {
      state.customerSales = initialState.customerSales;
    },

    getCustomerContactsFetch: (
      state,
      action: PayloadAction<CustomerContactsPayload>,
    ) => {
      state.customerContacts.isLoading = true;
      state.customerContacts.error = null;
      state.customerContacts.data = [];
      state.customerContacts.payload = { ...action.payload };
    },
    getCustomerContactsSuccess: (
      state,
      action: PayloadAction<GetCustomerContactsResponse>,
    ) => {
      state.customerContacts.isLoading = false;
      state.customerContacts.error = null;

      const { data } = action.payload as GetCustomerContactsResponse;

      if (data) {
        state.customerContacts.data = data?.map(
          (r: CustomerContact, index: number) => {
            const no = index + 1;
            return { ...r, no };
          },
        );
      }
    },
    getCustomerContactsFailure: (state, action) => {
      state.customerContacts.isLoading = false;
      state.customerContacts.error = { ...action.payload };
      state.customerContacts.data = [];
    },
    getCustomerContactsClear: (state) => {
      state.customerContacts = initialState.customerContacts;
    },

    getDropdownCustomersFetch: (
      state,
      action: PayloadAction<GetCustomerDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomers.options = action.payload;
    },
    getDropdownCustomersSuccess: (
      state,
      action: PayloadAction<GetCustomerDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerDropdown[];
      state.dropdownCustomers.data =
        data.map((item) => ({ ...item, id: item.id?.toUpperCase() })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomersFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomersClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomers.data = initialState.dropdownCustomers.data;
      state.dropdownCustomers.options = {};
    },

    getDropdownSalesFetch: (state) => {
      state.dropdownSales.isLoading = true;
      state.dropdownSales.error = null;
      state.dropdownSales.data = [];
    },
    getDropdownSalesSuccess: (
      state,
      action: PayloadAction<GetDropdownSalesResponse>,
    ) => {
      state.dropdownSales.isLoading = false;
      state.dropdownSales.error = null;
      state.dropdownSales.data = action?.payload?.data ?? [];
    },
    getDropdownSalesFailure: (state, action) => {
      state.dropdownSales.isLoading = false;
      state.dropdownSales.error = { ...action.payload };
      state.dropdownSales.data = [];
    },
    getDropdownSalesClear: (state) => {
      state.dropdownSales = initialState.dropdownSales;
    },

    getDropdownAddReqFetch: (state) => {
      state.dropdownAddReq.isLoading = true;
      state.dropdownAddReq.error = null;
      state.dropdownAddReq.data = [];
    },
    getDropdownAddReqSuccess: (
      state,
      action: PayloadAction<GetDropdownAddReqResponse>,
    ) => {
      state.dropdownAddReq.isLoading = false;
      state.dropdownAddReq.error = null;
      state.dropdownAddReq.data = action?.payload?.data ?? [];
    },
    getDropdownAddReqFailure: (state, action) => {
      state.dropdownAddReq.isLoading = false;
      state.dropdownAddReq.error = { ...action.payload };
      state.dropdownAddReq.data = [];
    },
    getDropdownAddReqClear: (state) => {
      state.dropdownAddReq = initialState.dropdownAddReq;
    },

    getDropdownPODFetch: (state) => {
      state.dropdownPOD.isLoading = true;
      state.dropdownPOD.error = null;
      state.dropdownPOD.data = [];
    },
    getDropdownPODSuccess: (
      state,
      action: PayloadAction<GetDropdownPODResponse>,
    ) => {
      state.dropdownPOD.isLoading = false;
      state.dropdownPOD.error = null;
      state.dropdownPOD.data = action?.payload?.data ?? [];
    },
    getDropdownPODFailure: (state, action) => {
      state.dropdownPOD.isLoading = false;
      state.dropdownPOD.error = { ...action.payload };
      state.dropdownPOD.data = [];
    },
    getDropdownPODClear: (state) => {
      state.dropdownPOD = initialState.dropdownPOD;
    },

    getDropdownCustomerIndustriesFetch: (
      state,
      action: PayloadAction<GetAllCustomerDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomerIndustries.options = action.payload;
    },
    getDropdownCustomerIndustriesSuccess: (
      state,
      action: PayloadAction<GetCustomerDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerDropdown[];
      state.dropdownCustomerIndustries.data =
        data.map((item) => ({ ...item })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerIndustriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomerIndustriesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomerIndustries.data =
        initialState.dropdownCustomerIndustries.data;
      state.dropdownCustomerIndustries.options = {};
    },

    getDropdownCustomerCategoriesFetch: (
      state,
      action: PayloadAction<GetAllCustomerDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomerCategories.options = action.payload;
    },
    getDropdownCustomerCategoriesSuccess: (
      state,
      action: PayloadAction<GetCustomerDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerDropdown[];
      state.dropdownCustomerCategories.data =
        data.map((item) => ({ ...item })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerCategoriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomerCategoriesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomerCategories.data =
        initialState.dropdownCustomerCategories.data;
      state.dropdownCustomerCategories.options = {};
    },

    getDropdownCustomerStatusesFetch: (
      state,
      action: PayloadAction<GetAllCustomerDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomerStatuses.options = action.payload;
    },
    getDropdownCustomerStatusesSuccess: (
      state,
      action: PayloadAction<GetCustomerDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerDropdown[];
      state.dropdownCustomerStatuses.data =
        data.map((item) => ({ ...item })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerStatusesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomerStatusesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomerStatuses.data =
        initialState.dropdownCustomerStatuses.data;
      state.dropdownCustomerStatuses.options = {};
    },
  },
});

export const customerActions = customerState.actions;
export const customerReducer = customerState.reducer;
export default customerReducer;
