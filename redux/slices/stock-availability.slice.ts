/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/stock-availability.state";
import { PaginationType } from "@sera-types/base.type";
import {
  GetStockAvailabilityResponse,
  StockAvailabilityListPayload,
  StockAvailabilityRow,
} from "@sera-types/stock-availability.type";

export const stockAvailabilitySlice = createSlice({
  name: "stockAvailability",
  initialState,
  reducers: {
    getStockAvailabilityFetch: (
      state,
      action: PayloadAction<StockAvailabilityListPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getStockAvailabilitySuccess: (
      state,
      action: PayloadAction<GetStockAvailabilityResponse>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } = (pagination ??
        {}) as PaginationType;
      state.options = {
        ...state.options,
        page,
        limit,
        totalData,
        totalPage,
        // stamp waktu fetch sukses — bertahan saat kembali dari halaman Detail
        lastUpdated: new Date().toISOString(),
      };
      state.recordsTotal = recordsTotal ?? totalData ?? 0;
      if (data) {
        state.data = data.map((r: StockAvailabilityRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }));
      }
      state.isLoading = false;
    },
    getStockAvailabilityFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getStockAvailabilityClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { actions: stockAvailabilityActions } = stockAvailabilitySlice;
export const stockAvailabilityReducer = stockAvailabilitySlice.reducer;
export default stockAvailabilityReducer;
