/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { GetZonesResponse, Zone } from "@sera-types/zone.type";

import initialState from "../states/zone.state";

export const zoneState = createSlice({
  name: "zones",
  initialState,
  reducers: {
    getZonesFetch: (
      state,
      _action: PayloadAction<BaseType & { warehouseCode?: string }>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    getZonesSuccess: (state, action: PayloadAction<GetZonesResponse>) => {
      const { data, pagination } = action.payload as GetZonesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((z: Zone, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...z, no };
        });
      }
      state.isLoading = false;
    },
    getZonesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getZonesClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getZoneDetailFetch: (state, _action) => {
      state.error = null;
      state.isLoading = true;
    },
    getZoneDetailSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.zoneDetail.data = data ?? null;
      state.isLoading = false;
    },
    getZoneDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getZoneDetailClear: (state) => {
      state.zoneDetail = initialState.zoneDetail;
    },

    createZoneFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    createZoneSuccess: (state) => {
      state.isLoading = false;
    },
    createZoneFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    updateZoneFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateZoneSuccess: (state) => {
      state.isLoading = false;
    },
    updateZoneFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    deleteZoneFetch: (state, _action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteZoneSuccess: (state) => {
      state.isLoading = false;
    },
    deleteZoneFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getDropdownZonesFetch: (state, _action: PayloadAction) => {
      state.error = null;
    },
    getDropdownZonesSuccess: (state, action) => {
      const { data } = action.payload as any;
      state.dropdownZones.data = data ?? [];
    },
    getDropdownZonesFailure: (state, action) => {
      state.error = { ...action.payload };
    },
  },
});

export const { actions: zoneActions, reducer: zoneReducers } = zoneState;
export default zoneReducers;
