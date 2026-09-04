/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DownloadTemplatePayload,
  GetMappingsResponse,
  MaterialLocationMapping,
  UpsertRowPayload,
  UpsertRowResultPayload,
} from "@sera-types/material-location-mapping.type";

import initialState from "../states/material-location-mapping.state";

export const materialLocationMappingState = createSlice({
  name: "materialLocationMapping",
  initialState,
  reducers: {
    // === Upload ===
    downloadTemplateFetch: (
      state,
      _action: PayloadAction<DownloadTemplatePayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    downloadTemplateSuccess: (state) => {
      state.isLoading = false;
    },
    downloadTemplateFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    downloadTemplateClear: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    upsertRowFetch: (state, action: PayloadAction<UpsertRowPayload>) => {
      state.error = null;
      state.activeUpsert = action.payload.index;
    },
    upsertRowSuccess: (
      state,
      action: PayloadAction<UpsertRowResultPayload>,
    ) => {
      state.activeUpsert = -1;
      state.lastResult = action.payload;
      if (!state.summary) state.summary = { success: 0, failed: 0 };
      if (action.payload.status === "success") state.summary.success += 1;
      else state.summary.failed += 1;
    },
    upsertRowFailure: (
      state,
      action: PayloadAction<UpsertRowResultPayload>,
    ) => {
      state.activeUpsert = -1;
      state.lastResult = action.payload;
      if (!state.summary) state.summary = { success: 0, failed: 0 };
      state.summary.failed += 1;
      state.error = action.payload.reason ?? null;
    },
    upsertSummaryClear: (state) => {
      state.summary = null;
      state.lastResult = null;
      state.activeUpsert = -1;
    },

    // === List final ===
    getMappingsFetch: (
      state,
      _action: PayloadAction<BaseType & { warehouseCode?: string }>,
    ) => {
      state.error = null;
      state.isLoading = true;
    },
    getMappingsSuccess: (state, action: PayloadAction<GetMappingsResponse>) => {
      const { data, pagination } = action.payload as GetMappingsResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((m: MaterialLocationMapping, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...m, no };
        });
      }
      state.isLoading = false;
    },
    getMappingsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const materialLocationMappingActions =
  materialLocationMappingState.actions;
export const materialLocationMappingReducer =
  materialLocationMappingState.reducer;
export default materialLocationMappingReducer;
