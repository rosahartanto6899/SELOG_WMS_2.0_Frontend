/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExportLog, GetExportLogResponse } from "@sera-types/export-log.type";

import initialState from "../states/export-log.state";

export const exportLogState = createSlice({
  name: "exportLogs",
  initialState,
  reducers: {
    getExportLogsFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getExportLogsSuccess: (
      state,
      action: PayloadAction<GetExportLogResponse>,
    ) => {
      const data = action.payload.data as ExportLog[];
      if (data) {
        state.data = data.map((exportLog: ExportLog, index: number) => {
          const no = index + 1;
          return { ...exportLog, no };
        });
      }
      state.isLoading = false;
    },
    getExportLogsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getExportLogsFetch,
  getExportLogsSuccess,
  getExportLogsFailure,
} = exportLogState.actions;

export const exportLogActions = exportLogState.actions;
export const exportLogReducers = exportLogState.reducer;
export default exportLogReducers;
