/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/upload-stock-adjustment.state";
import {
  DownloadTemplatePayload,
  UploadStockAdjustmentRowResultPayload,
  UpsertRowPayload,
} from "@sera-types/upload-stock-adjustment.type";

export const uploadStockAdjustmentState = createSlice({
  name: "uploadStockAdjustment",
  initialState,
  reducers: {
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
      action: PayloadAction<UploadStockAdjustmentRowResultPayload>,
    ) => {
      state.activeUpsert = -1;
      state.lastResult = action.payload;
      if (!state.summary) state.summary = { success: 0, failed: 0 };
      if (action.payload.status === "success") state.summary.success += 1;
      else state.summary.failed += 1;
    },
    upsertRowFailure: (
      state,
      action: PayloadAction<UploadStockAdjustmentRowResultPayload>,
    ) => {
      state.activeUpsert = -1;
      state.lastResult = action.payload;
      if (!state.summary) state.summary = { success: 0, failed: 0 };
      state.summary.failed += 1;
      // error per-baris TIDAK ditaruh di state.error — itu domain popup
      // global (download template); alasan baris hidup di lastResult →
      // kolom upsertReason. Nge-patch state.error bikin popup duplikat.
    },
    upsertSummaryClear: (state) => {
      state.summary = null;
      state.lastResult = null;
      state.activeUpsert = -1;
    },
  },
});

export const uploadStockAdjustmentActions = uploadStockAdjustmentState.actions;
export const uploadStockAdjustmentReducer = uploadStockAdjustmentState.reducer;
export default uploadStockAdjustmentReducer;
