/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/customer-route.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  AllCustomerRouteDropdown,
  CreateCustomerRoutePayload,
  CustomerRoute,
  DeleteCustomerRoutePayload,
  DetailCustomerRoutePayload,
  DownloadQuotationPayload,
  GetAllCustomerRouteDropdownPayload,
  GetCustomerRouteDropdownPayload,
  GetCustomerRouteDropdownResponse,
  GetCustomerRoutesResponse,
  GetDetailCustomerRoutesResponse,
  GetDropdownTollUsagesResponse,
  UpdateCustomerRoutePayload,
  UploadQuotationPayload,
  UploadQuotationResponse,
} from "@sera-types/customer-route.type";
import { uniqBy } from "lodash";

export const customerRouteState = createSlice({
  name: "customerRoutes",
  initialState,
  reducers: {
    getCustomerRoutesFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.data = {};
      state.options = { ...action.payload };
    },
    getCustomerRoutesSuccess: (
      state,
      action: PayloadAction<GetCustomerRoutesResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetCustomerRoutesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      state.options = { ...state.options, page, limit, totalData, totalPage };

      if (data) {
        state.data = {
          list: data?.list?.map((r: CustomerRoute, index: number) => {
            const no = (page - 1) * limit + index + 1;
            return { ...r, no };
          }),
          summary: data?.summary,
        };
      }
    },
    getCustomerRoutesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = {};
    },
    getCustomerRoutesClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = {};
      state.options = initialState.options;
    },

    getCustomerRoutesAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getCustomerRoutesAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetCustomerRoutesResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetCustomerRoutesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "routeCode";

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
    getCustomerRoutesAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.autoComplete.data = [];
    },
    getCustomerRoutesAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    createCustomerRouteFetch: (
      state,
      action: PayloadAction<CreateCustomerRoutePayload>,
    ) => {
      state.createCustomerRoute.isLoading = true;
      state.createCustomerRoute.error = null;
      state.createCustomerRoute.payload = { ...action.payload };
    },
    createCustomerRouteSuccess: (
      state,
      action: PayloadAction<CreateCustomerRoutePayload>,
    ) => {
      state.createCustomerRoute.isLoading = false;
      state.createCustomerRoute.error = null;
      state.createCustomerRoute.data = { ...action?.payload };
    },
    createCustomerRouteFailure: (state, action) => {
      state.createCustomerRoute.isLoading = false;
      state.createCustomerRoute.error = { ...action.payload };
      state.createCustomerRoute.data = {};
    },
    createCustomerRouteClear: (state) => {
      state.createCustomerRoute = initialState.createCustomerRoute;
    },

    getDetailCustomerRouteFetch: (
      state,
      action: PayloadAction<DetailCustomerRoutePayload>,
    ) => {
      state.detailCustomerRoute.isLoading = true;
      state.detailCustomerRoute.error = null;
      state.detailCustomerRoute.data = {};
      state.detailCustomerRoute.payload = { ...action?.payload };
    },
    getDetailCustomerRouteSuccess: (
      state,
      action: PayloadAction<GetDetailCustomerRoutesResponse>,
    ) => {
      state.detailCustomerRoute.isLoading = false;
      state.detailCustomerRoute.error = null;
      state.detailCustomerRoute.data = { ...action?.payload?.data };
    },
    getDetailCustomerRouteFailure: (state, action) => {
      state.detailCustomerRoute.isLoading = false;
      state.detailCustomerRoute.error = { ...action.payload };
      state.detailCustomerRoute.data = {};
    },
    getDetailCustomerRouteClear: (state) => {
      state.detailCustomerRoute = initialState.detailCustomerRoute;
    },

    updateCustomerRouteFetch: (
      state,
      action: PayloadAction<UpdateCustomerRoutePayload>,
    ) => {
      state.updateCustomerRoute.isLoading = true;
      state.updateCustomerRoute.error = null;
      state.updateCustomerRoute.payload = { ...action.payload };
    },
    updateCustomerRouteSuccess: (
      state,
      action: PayloadAction<UpdateCustomerRoutePayload>,
    ) => {
      state.updateCustomerRoute.isLoading = false;
      state.updateCustomerRoute.error = null;
      state.updateCustomerRoute.data = { ...action?.payload };
    },
    updateCustomerRouteFailure: (state, action) => {
      state.updateCustomerRoute.isLoading = false;
      state.updateCustomerRoute.error = { ...action.payload };
      state.updateCustomerRoute.data = {};
    },
    updateCustomerRouteClear: (state) => {
      state.updateCustomerRoute = initialState.updateCustomerRoute;
    },

    deleteCustomerRouteFetch: (
      state,
      action: PayloadAction<DeleteCustomerRoutePayload>,
    ) => {
      state.deleteCustomerRoute.isLoading = true;
      state.deleteCustomerRoute.error = null;
      state.deleteCustomerRoute.payload = { ...action.payload };
    },
    deleteCustomerRouteSuccess: (
      state,
      action: PayloadAction<DeleteCustomerRoutePayload>,
    ) => {
      state.deleteCustomerRoute.isLoading = false;
      state.deleteCustomerRoute.error = null;
      state.deleteCustomerRoute.data = { ...action?.payload };
    },
    deleteCustomerRouteFailure: (state, action) => {
      state.deleteCustomerRoute.isLoading = false;
      state.deleteCustomerRoute.error = { ...action.payload };
      state.deleteCustomerRoute.data = {};
    },
    deleteCustomerRouteClear: (state) => {
      state.deleteCustomerRoute = initialState.deleteCustomerRoute;
    },

    getDropdownTollUsagesFetch: (state) => {
      state.dropdownTollUsages.isLoading = true;
      state.dropdownTollUsages.error = null;
      state.dropdownTollUsages.data = [];
    },
    getDropdownTollUsagesSuccess: (
      state,
      action: PayloadAction<GetDropdownTollUsagesResponse>,
    ) => {
      state.dropdownTollUsages.isLoading = false;
      state.dropdownTollUsages.error = null;
      state.dropdownTollUsages.data = action?.payload?.data ?? [];
    },
    getDropdownTollUsagesFailure: (state, action) => {
      state.dropdownTollUsages.isLoading = false;
      state.dropdownTollUsages.error = { ...action.payload };
      state.dropdownTollUsages.data = [];
    },
    getDropdownTollUsagesClear: (state) => {
      state.dropdownTollUsages = initialState.dropdownTollUsages;
    },

    getDropdownCustomerRoutesFetch: (
      state,
      action: PayloadAction<GetCustomerRouteDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownCustomerRoutes.options = action.payload;
    },
    getDropdownCustomerRoutesSuccess: (
      state,
      action: PayloadAction<GetCustomerRouteDropdownResponse>,
    ) => {
      const data = action.payload.data?.list || [];
      state.dropdownCustomerRoutes.data =
        data.map((item) => ({
          ...item,
          id: item.customerRouteId?.toUpperCase(),
          name: item.customerName,
        })) ?? [];
      state.isLoading = false;
    },
    getDropdownCustomerRoutesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownCustomerRoutesClear: (state) => {
      state.options = initialState.options;
      state.dropdownCustomerRoutes.data =
        initialState.dropdownCustomerRoutes.data;
      state.dropdownCustomerRoutes.options =
        initialState.dropdownCustomerRoutes.options;
    },

    getDropdownRouteActivityTypesFetch: (
      state,
      action: PayloadAction<GetAllCustomerRouteDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownRouteActivityTypes.options = action.payload;
    },
    getDropdownRouteActivityTypesSuccess: (
      state,
      action: PayloadAction<GetCustomerRouteDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerRouteDropdown[];
      state.dropdownRouteActivityTypes.data =
        data.map((item) => ({ ...item })) ?? [];
      state.isLoading = false;
    },
    getDropdownRouteActivityTypesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownRouteActivityTypesClear: (state) => {
      state.options = initialState.options;
      state.dropdownRouteActivityTypes.data =
        initialState.dropdownRouteActivityTypes.data;
      state.dropdownRouteActivityTypes.options = {};
    },

    getDropdownLeadTimeTypesFetch: (
      state,
      action: PayloadAction<GetAllCustomerRouteDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownLeadTimeTypes.options = action.payload;
    },
    getDropdownLeadTimeTypesSuccess: (
      state,
      action: PayloadAction<GetCustomerRouteDropdownResponse>,
    ) => {
      const data = action.payload.data as AllCustomerRouteDropdown[];
      state.dropdownLeadTimeTypes.data =
        data.map((item) => ({ ...item })) ?? [];
      state.isLoading = false;
    },
    getDropdownLeadTimeTypesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownLeadTimeTypesClear: (state) => {
      state.options = initialState.options;
      state.dropdownLeadTimeTypes.data =
        initialState.dropdownLeadTimeTypes.data;
      state.dropdownLeadTimeTypes.options = {};
    },

    uploadQuotationFetch: (
      state,
      action: PayloadAction<UploadQuotationPayload>,
    ) => {
      state.uploadQuotation.isLoading = true;
      state.uploadQuotation.error = null;
      state.uploadQuotation.data = {};
      state.uploadQuotation.payload = { ...action?.payload };
    },
    uploadQuotationSuccess: (
      state,
      action: PayloadAction<UploadQuotationResponse>,
    ) => {
      state.uploadQuotation.isLoading = false;
      state.uploadQuotation.error = null;
      state.uploadQuotation.data = { ...action?.payload?.data };
    },
    uploadQuotationFailure: (state, action) => {
      state.uploadQuotation.isLoading = false;
      state.uploadQuotation.error = { ...action.payload };
      state.uploadQuotation.data = {};
    },
    uploadQuotationClear: (state) => {
      state.uploadQuotation = initialState.uploadQuotation;
    },

    downloadQuotationFetch: (
      state,
      action: PayloadAction<DownloadQuotationPayload>,
    ) => {
      state.downloadQuotation.isLoading = true;
      state.downloadQuotation.error = null;
      state.downloadQuotation.data = {};
      state.downloadQuotation.payload = { ...action?.payload };
    },
    downloadQuotationSuccess: (
      state,
      action: PayloadAction<DownloadQuotationPayload>,
    ) => {
      state.downloadQuotation.isLoading = false;
      state.downloadQuotation.error = null;
      state.downloadQuotation.data = { ...action?.payload };
    },
    downloadQuotationFailure: (state, action) => {
      state.downloadQuotation.isLoading = false;
      state.downloadQuotation.error = { ...action.payload };
      state.downloadQuotation.data = {};
    },
    downloadQuotationClear: (state) => {
      state.downloadQuotation = initialState.downloadQuotation;
    },
  },
});

export const customerRouteActions = customerRouteState.actions;
export const customerRouteReducer = customerRouteState.reducer;
export default customerRouteReducer;
