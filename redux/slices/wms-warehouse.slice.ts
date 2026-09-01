/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetWmsWarehousesResponse,
  WmsWarehouse,
} from "@sera-types/wms-customer.type";

import initialState from "../states/wms-warehouse.state";

export const wmsWarehouseState = createSlice({
  name: "wmsWarehouses",
  initialState,
  reducers: {
    getWarehousesFetch: (state, _action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getWarehousesSuccess: (
      state,
      action: PayloadAction<GetWmsWarehousesResponse>,
    ) => {
      const { data, pagination } = action.payload as GetWmsWarehousesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((w: WmsWarehouse, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...w, no };
        });
      }
      state.isLoading = false;
    },
    getWarehousesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getWarehousesClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getWarehouseDetailFetch: (state, _action) => {
      state.error = null;
      state.isLoading = true;
    },
    getWarehouseDetailSuccess: (
      state,
      action: PayloadAction<GetWmsWarehousesResponse>,
    ) => {
      const { data } = action.payload as any;
      state.warehouseDetail.data = { ...state.warehouseDetail.data, ...data };
      state.isLoading = false;
    },
    getWarehouseDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    createWarehouseFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    createWarehouseSuccess: (state, action) => {
      const { data } = action.payload;
      state.createWarehouse.data = data ?? [];
      state.postCreateWarehouse = {
        code: data?.code,
        name: data?.name,
      };
      state.isLoading = false;
    },
    createWarehouseFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postCreateWarehouseClear: (state) => {
      state.postCreateWarehouse = initialState.postCreateWarehouse;
    },

    updateWarehouseFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateWarehouseSuccess: (state, action) => {
      const { data } = action.payload;
      state.updateWarehouse.data = data ?? [];
      state.postUpdateWarehouse = {
        id: data?.id,
        name: data?.name,
      };
      state.isLoading = false;
    },
    updateWarehouseFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postUpdateWarehouseClear: (state) => {
      state.postUpdateWarehouse = initialState.postUpdateWarehouse;
    },

    deleteWarehouseFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteWarehouseSuccess: (state, _action) => {
      state.isLoading = false;
    },
    deleteWarehouseFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postDeleteWarehouseNotification: (state, action) => {
      const {
        payload: { id, name },
      } = action;
      state.postDeleteWarehouse = { id, name };
    },
    postDeleteWarehouseClear: (state) => {
      state.postDeleteWarehouse = initialState.postDeleteWarehouse;
    },

    getDropdownWarehousesFetch: (state, _action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownWarehousesSuccess: (
      state,
      action: PayloadAction<GetWmsWarehousesResponse>,
    ) => {
      const { data } = action.payload as GetWmsWarehousesResponse;
      state.dropdownWarehouses.data = (data as WmsWarehouse[]) ?? [];
      state.isLoading = false;
    },
    getDropdownWarehousesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const { actions: wmsWarehouseActions, reducer: wmsWarehouseReducers } =
  wmsWarehouseState;
export default wmsWarehouseReducers;
