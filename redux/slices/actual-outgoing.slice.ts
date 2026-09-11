/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/actual-outgoing.state";
import {
  ActualOutgoingListPayload,
  ActualOutgoingRow,
  GetActualOutgoingResponse,
} from "@sera-types/actual-outgoing.type";
import { PaginationType } from "@sera-types/base.type";

export const actualOutgoingSlice = createSlice({
  name: "actualOutgoing",
  initialState,
  reducers: {
    getActualOutgoingFetch: (
      state,
      action: PayloadAction<ActualOutgoingListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getActualOutgoingSuccess: (
      state,
      action: PayloadAction<GetActualOutgoingResponse>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: ActualOutgoingRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getActualOutgoingFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getActualOutgoingClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: actualOutgoingActions } = actualOutgoingSlice;
export const actualOutgoingReducer = actualOutgoingSlice.reducer;
export default actualOutgoingReducer;
