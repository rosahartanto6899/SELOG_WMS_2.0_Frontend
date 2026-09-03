/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/upload-incoming-ahm.state";
import {
  DownloadTemplatePayload,
  UpsertRowPayload,
  UpsertRowResultPayload,
} from "@sera-types/upload-incoming-ahm.type";

export const uploadIncomingAhmState = createSlice({
  name: "uploadIncomingAhm",
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
  },
});

export const uploadIncomingAhmActions = uploadIncomingAhmState.actions;
export const uploadIncomingAhmReducer = uploadIncomingAhmState.reducer;
export default uploadIncomingAhmReducer;
