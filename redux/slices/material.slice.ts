/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { GetMaterialsResponse, Material } from "@sera-types/material.type";

import initialState from "../states/material.state";

export const materialState = createSlice({
  name: "materials",
  initialState,
  reducers: {
    getMaterialsFetch: (state, _action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getMaterialsSuccess: (
      state,
      action: PayloadAction<GetMaterialsResponse>,
    ) => {
      const { data, pagination } = action.payload as GetMaterialsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((m: Material, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...m, no };
        });
      }
      state.isLoading = false;
    },
    getMaterialsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getMaterialsClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getMaterialDetailFetch: (state, _action) => {
      state.error = null;
      state.isLoading = true;
    },
    getMaterialDetailSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.materialDetail.data = data ?? null;
      state.isLoading = false;
    },
    getMaterialDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getMaterialDetailClear: (state) => {
      state.materialDetail = initialState.materialDetail;
    },

    createMaterialFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    createMaterialSuccess: (state) => {
      state.isLoading = false;
    },
    createMaterialFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    updateMaterialFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateMaterialSuccess: (state) => {
      state.isLoading = false;
    },
    updateMaterialFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    deleteMaterialFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteMaterialSuccess: (state) => {
      state.isLoading = false;
    },
    deleteMaterialFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getDropdownMaterialsFetch: (state, _action: PayloadAction) => {
      state.error = null;
    },
    getDropdownMaterialsSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.dropdownMaterials.data = data ?? [];
    },
    getDropdownMaterialsFailure: (state, action) => {
      state.error = { ...action.payload };
    },
  },
});

export const { actions: materialActions, reducer: materialReducers } =
  materialState;
export default materialReducers;
