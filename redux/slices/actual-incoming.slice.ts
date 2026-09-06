/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/actual-incoming.state";
import {
  ActualIncomingListPayload,
  ActualIncomingRow,
  GetActualIncomingResponse,
} from "@sera-types/actual-incoming.type";
import { PaginationType } from "@sera-types/base.type";

export const actualIncomingSlice = createSlice({
  name: "actualIncoming",
  initialState,
  reducers: {
    getActualIncomingFetch: (
      state,
      action: PayloadAction<ActualIncomingListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getActualIncomingSuccess: (
      state,
      action: PayloadAction<GetActualIncomingResponse>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: ActualIncomingRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getActualIncomingFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getActualIncomingClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: actualIncomingActions } = actualIncomingSlice;
export const actualIncomingReducer = actualIncomingSlice.reducer;
export default actualIncomingReducer;
