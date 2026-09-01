/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/service-group.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateServiceGroupPayload,
  DeleteServiceGroupPayload,
  DetailServiceGroupPayload,
  GetServiceGroupDetailResponse,
  GetServiceGroupsResponse,
  ServiceGroup,
  ServiceGroupDetail,
  UpdateServiceGroupPayload,
} from "@sera-types/service-group.type";
import { uniqBy } from "lodash";

export const serviceGroupState = createSlice({
  name: "serviceGroups",
  initialState,
  reducers: {
    getServiceGroupFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getServiceGroupSuccess: (
      state,
      action: PayloadAction<GetServiceGroupsResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetServiceGroupsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      state.options = { ...state.options, page, limit, totalData, totalPage };

      if (data) {
        state.data = data.map((r: ServiceGroup, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
    },
    getServiceGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },
    getServiceGroupClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = [];
      state.options = initialState.options;
    },

    getServiceGroupAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getServiceGroupAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetServiceGroupsResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetServiceGroupsResponse;
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
    getServiceGroupAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getServiceGroupAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    createServiceGroupFetch: (
      state,
      action: PayloadAction<CreateServiceGroupPayload>,
    ) => {
      state.createServiceGroup.isLoading = true;
      state.createServiceGroup.error = null;
      state.createServiceGroup.payload = { ...action?.payload };
    },
    createServiceGroupSuccess: (
      state,
      action: PayloadAction<CreateServiceGroupPayload>,
    ) => {
      state.createServiceGroup.isLoading = false;
      state.createServiceGroup.error = null;
      state.createServiceGroup.data = action.payload;
    },
    createServiceGroupFailure: (state, action) => {
      state.createServiceGroup.isLoading = false;
      state.createServiceGroup.error = { ...action.payload };
      state.createServiceGroup.data = {};
    },
    createServiceGroupClear: (state) => {
      state.createServiceGroup = initialState.createServiceGroup;
    },

    detailServiceGroupFetch: (
      state,
      action: PayloadAction<DetailServiceGroupPayload>,
    ) => {
      state.detailServiceGroup.isLoading = true;
      state.detailServiceGroup.error = null;
      state.detailServiceGroup.payload = { ...action?.payload };
    },
    detailServiceGroupSuccess: (
      state,
      action: PayloadAction<GetServiceGroupDetailResponse>,
    ) => {
      const _data = action?.payload?.data as ServiceGroupDetail;

      state.detailServiceGroup.isLoading = false;
      state.detailServiceGroup.error = null;
      state.detailServiceGroup.data = _data;
    },
    detailServiceGroupFailure: (state, action) => {
      state.detailServiceGroup.isLoading = false;
      state.detailServiceGroup.error = { ...action.payload };
      state.detailServiceGroup.data = {};
    },
    detailServiceGroupClear: (state) => {
      state.detailServiceGroup = initialState.detailServiceGroup;
    },

    updateServiceGroupFetch: (
      state,
      action: PayloadAction<UpdateServiceGroupPayload>,
    ) => {
      state.updateServiceGroup.isLoading = true;
      state.updateServiceGroup.error = null;
      state.updateServiceGroup.payload = { ...action?.payload };
    },
    updateServiceGroupSuccess: (
      state,
      action: PayloadAction<UpdateServiceGroupPayload>,
    ) => {
      state.updateServiceGroup.isLoading = false;
      state.updateServiceGroup.error = null;
      state.updateServiceGroup.data = action.payload;
    },
    updateServiceGroupFailure: (state, action) => {
      state.updateServiceGroup.isLoading = false;
      state.updateServiceGroup.error = { ...action.payload };
      state.updateServiceGroup.data = {};
    },
    updateServiceGroupClear: (state) => {
      state.updateServiceGroup = initialState.updateServiceGroup;
    },

    deleteServiceGroupFetch: (
      state,
      action: PayloadAction<DeleteServiceGroupPayload>,
    ) => {
      state.deleteServiceGroup.isLoading = true;
      state.deleteServiceGroup.error = null;
      state.deleteServiceGroup.payload = { ...action?.payload };
    },
    deleteServiceGroupSuccess: (
      state,
      action: PayloadAction<DeleteServiceGroupPayload>,
    ) => {
      state.deleteServiceGroup.isLoading = false;
      state.deleteServiceGroup.error = null;
      state.deleteServiceGroup.data = action.payload;
    },
    deleteServiceGroupFailure: (state, action) => {
      state.deleteServiceGroup.isLoading = false;
      state.deleteServiceGroup.error = { ...action.payload };
      state.deleteServiceGroup.data = {};
    },
    deleteServiceGroupClear: (state) => {
      state.deleteServiceGroup = initialState.deleteServiceGroup;
    },

    getServiceGroupDropdownFetch: (state) => {
      state.dropdown.isLoading = true;
      state.dropdown.error = null;
      state.dropdown.data = [];
    },
    getServiceGroupDropdownSuccess: (
      state,
      action: PayloadAction<GetServiceGroupsResponse>,
    ) => {
      state.dropdown.isLoading = false;
      state.dropdown.error = null;

      const { data } = action.payload as GetServiceGroupsResponse;

      if (data) {
        state.dropdown.data = data;
      }
    },
    getServiceGroupDropdownFailure: (state, action) => {
      state.dropdown.isLoading = false;
      state.dropdown.error = { ...action.payload };
      state.dropdown.data = [];
    },
    getServiceGroupDropdownClear: (state) => {
      state.dropdown = initialState.dropdown;
    },
  },
});

export const serviceGroupActions = serviceGroupState.actions;
export const serviceGroupReducers = serviceGroupState.reducer;
export default serviceGroupReducers;
