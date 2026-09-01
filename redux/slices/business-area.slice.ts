/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/business-area.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  BusinessArea,
  BusinessAreaDropdown,
  GetBusinessAreaDropdownPayload,
  GetBusinessAreasResponse,
} from "@sera-types/business-area.type";
import _ from "lodash";

export const businessAreaState = createSlice({
  name: "businessAreas",
  initialState,
  reducers: {
    getBusinessAreasFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getBusinessAreasSuccess: (
      state,
      action: PayloadAction<GetBusinessAreasResponse>,
    ) => {
      const { data, pagination } = action.payload as GetBusinessAreasResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: BusinessArea, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getBusinessAreasFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getBusinessAreasClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getBusinessAreasAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };

      if (state?.autoComplete)
        state.autoComplete.options.searchBy = action.payload.searchBy;
    },
    getBusinessAreasAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetBusinessAreasResponse>,
    ) => {
      const { data, pagination } = action.payload as GetBusinessAreasResponse;
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
    getBusinessAreasAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getBusinessAreasAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getBusinessAreaDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getBusinessAreaDetailSuccess: (
      state,
      action: PayloadAction<GetBusinessAreasResponse>,
    ) => {
      const { data } = action.payload as GetBusinessAreasResponse;
      state.businessAreaDetail.data = {
        ...state.businessAreaDetail.data,
        ...data,
      };
      state.isLoading = false;
    },
    getBusinessAreaDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getBusinessAreaDetailClear: (state) => {
      state.businessAreaDetail = initialState.businessAreaDetail;
    },

    createNewBusinessAreaFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewBusinessAreaSuccess: (state, action) => {
      state.createNewBusinessArea = action.payload;
      state.isLoading = false;
    },
    createNewBusinessAreaFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    createNewBusinessAreaClear: (state) => {
      state.createNewBusinessArea = initialState.createNewBusinessArea;
    },

    updateBusinessAreaFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateBusinessAreaSuccess: (state, action) => {
      state.updateBusinessArea = action.payload;
      state.isLoading = false;
    },
    updateBusinessAreaFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    updateBusinessAreaClear: (state) => {
      state.updateBusinessArea = initialState.updateBusinessArea;
    },

    deleteBusinessAreaFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    deleteBusinessAreaSuccess: (state, action) => {
      state.isLoading = false;
      state.deleteBusinessArea = action.payload;
    },
    deleteBusinessAreaFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    deleteBusinessAreaClear: (state) => {
      state.deleteBusinessArea = initialState.deleteBusinessArea;
    },

    getDropdownBusinessAreasFetch: (
      state,
      action: PayloadAction<GetBusinessAreaDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownBusinessAreas.options = action.payload;
    },
    getDropdownBusinessAreasSuccess: (
      state,
      action: PayloadAction<GetBusinessAreasResponse>,
    ) => {
      const data = action.payload.data as BusinessAreaDropdown[];
      state.dropdownBusinessAreas.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownBusinessAreasFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownBusinessAreasClear: (state) => {
      state.options = initialState.options;
      state.dropdownBusinessAreas.data =
        initialState.dropdownBusinessAreas.data;
      state.dropdownBusinessAreas.options = {};
    },
  },
});

export const {
  getBusinessAreasFetch,
  getBusinessAreasSuccess,
  getBusinessAreasFailure,
  getBusinessAreasClear,
  getBusinessAreasAutoCompleteFetch,
  getBusinessAreasAutoCompleteSuccess,
  getBusinessAreasAutoCompleteFailure,
  getBusinessAreasAutoCompleteClear,
  createNewBusinessAreaFetch,
  createNewBusinessAreaSuccess,
  createNewBusinessAreaFailure,
  createNewBusinessAreaClear,
  getDropdownBusinessAreasFetch,
  getDropdownBusinessAreasSuccess,
  getDropdownBusinessAreasFailure,
  getDropdownBusinessAreasClear,
  updateBusinessAreaFetch,
  updateBusinessAreaSuccess,
  updateBusinessAreaFailure,
  updateBusinessAreaClear,
} = businessAreaState.actions;

export const businessAreaActions = businessAreaState.actions;
export const businessAreaReducers = businessAreaState.reducer;
export default businessAreaReducers;
