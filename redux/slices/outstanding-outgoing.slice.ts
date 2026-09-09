/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/outstanding-outgoing.state";
import { PaginationType } from "@sera-types/base.type";
import {
  InputOutgoingPayload,
  OutstandingOutgoingHeader,
  OutstandingOutgoingListPayload,
  OutstandingOutgoingListRow,
  OutstandingOutgoingTotalsRow,
  UpdateOutgoingPayload,
} from "@sera-types/outstanding-outgoing.type";

/** Submit form input plan outgoing — create (C1) / update (C3+C4+C2). */
export const outstandingOutgoingSlice = createSlice({
  name: "outstandingOutgoing",
  initialState,
  reducers: {
    submitOutgoingFetch: {
      // payload create / update dibedakan lewat properti id (update)
      reducer: (
        state,
        _action: PayloadAction<InputOutgoingPayload | UpdateOutgoingPayload>,
      ) => {
        state.submit = {
          ...state.submit,
          isLoading: true,
          error: null,
          success: false,
          message: null,
        };
      },
      prepare: (payload: InputOutgoingPayload | UpdateOutgoingPayload) => ({
        payload,
      }),
    },
    submitOutgoingSuccess: (state, action: PayloadAction<string | null>) => {
      state.submit.isLoading = false;
      state.submit.success = true;
      state.submit.message = action.payload ?? null;
    },
    submitOutgoingFailure: (state, action) => {
      state.submit.isLoading = false;
      state.submit.error = { ...action.payload };
    },
    submitOutgoingClear: (state) => {
      state.submit = initialState.submit;
    },

    getOutgoingEditFetch: (state, _action: PayloadAction<{ id: string }>) => {
      state.edit = { ...state.edit, isLoading: true, error: null, data: null };
    },
    getOutgoingEditSuccess: (
      state,
      action: PayloadAction<{ data: OutstandingOutgoingHeader | null }>,
    ) => {
      state.edit.isLoading = false;
      state.edit.data = action.payload.data ?? null;
    },
    getOutgoingEditFailure: (state, action) => {
      state.edit.isLoading = false;
      state.edit.error = { ...action.payload };
    },
    getOutgoingEditClear: (state) => {
      state.edit = initialState.edit;
    },

    // ================= spec 004 Fase 3 — view detail + history =================

    getOutgoingDetailFetch: (state, _action: PayloadAction<{ id: string }>) => {
      state.detail = { ...state.detail, isLoading: true, error: null };
    },
    getOutgoingDetailSuccess: (
      state,
      action: PayloadAction<{
        data?: OutstandingOutgoingHeader | null;
        history?: any[];
      }>,
    ) => {
      state.detail.isLoading = false;
      state.detail.data = action.payload.data ?? null;
      state.detail.history = action.payload.history ?? [];
    },
    getOutgoingDetailFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = { ...action.payload };
    },
    getOutgoingDetailClear: (state) => {
      state.detail = initialState.detail;
    },

    // ================= spec 004 Fase 1 — worklist =================

    getOutgoingListFetch: (
      state,
      action: PayloadAction<OutstandingOutgoingListPayload>,
    ) => {
      state.list.isLoading = true;
      state.list.error = null;
      state.list.options = { ...action.payload };
    },
    getOutgoingListSuccess: (
      state,
      action: PayloadAction<{
        data?: OutstandingOutgoingListRow[];
        pagination?: PaginationType;
        recordsTotal?: number;
      }>,
    ) => {
      const { data, pagination, recordsTotal } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.list.options = {
        ...state.list.options,
        page,
        limit,
        totalData,
        totalPage,
      };
      state.list.recordsTotal = recordsTotal ?? totalData ?? 0;
      state.list.data = (data ?? []).map(
        (r: OutstandingOutgoingListRow, index: number) => ({
          ...r,
          no: (page - 1) * limit + index + 1,
        }),
      );
      state.list.isLoading = false;
    },
    getOutgoingListFailure: (state, action) => {
      state.list.isLoading = false;
      state.list.error = { ...action.payload };
    },
    getOutgoingListClear: (state) => {
      state.list = initialState.list;
    },

    getOutgoingItemsFetch: (
      state,
      _action: PayloadAction<{ customerCode: string; warehouseCode: string }>,
    ) => {
      state.items.isLoading = true;
      state.items.error = null;
    },
    getOutgoingItemsSuccess: (
      state,
      action: PayloadAction<{
        data?: OutstandingOutgoingListRow[] | any[];
      }>,
    ) => {
      state.items.isLoading = false;
      state.items.data = (action.payload.data ?? []) as any;
    },
    getOutgoingItemsFailure: (state, action) => {
      state.items.isLoading = false;
      state.items.error = { ...action.payload };
    },

    getOutgoingPackagingsFetch: (
      state,
      _action: PayloadAction<{ customerCode: string; warehouseCode: string }>,
    ) => {
      state.packagings.isLoading = true;
      state.packagings.error = null;
    },
    getOutgoingPackagingsSuccess: (state, action) => {
      state.packagings.isLoading = false;
      state.packagings.data = action.payload.data ?? [];
    },
    getOutgoingPackagingsFailure: (state, action) => {
      state.packagings.isLoading = false;
      state.packagings.error = { ...action.payload };
    },

    getOutgoingShipmentsFetch: (
      state,
      _action: PayloadAction<{ customerCode: string; warehouseCode: string }>,
    ) => {
      state.shipments.isLoading = true;
      state.shipments.error = null;
    },
    getOutgoingShipmentsSuccess: (state, action) => {
      state.shipments.isLoading = false;
      state.shipments.data = action.payload.data ?? [];
    },
    getOutgoingShipmentsFailure: (state, action) => {
      state.shipments.isLoading = false;
      state.shipments.error = { ...action.payload };
    },

    getOutgoingTotalsFetch: (
      state,
      action: PayloadAction<{ warehouseCodes?: string[] | null }>,
    ) => {
      state.totals = {
        ...state.totals,
        isLoading: true,
        error: null,
        payload: { ...action.payload },
      } as any;
    },
    getOutgoingTotalsSuccess: (
      state,
      action: PayloadAction<{
        total?: number;
        byWarehouse?: OutstandingOutgoingTotalsRow[];
      }>,
    ) => {
      state.totals.isLoading = false;
      state.totals.data = {
        total: action.payload.total ?? 0,
        byWarehouse: action.payload.byWarehouse ?? [],
      };
    },
    getOutgoingTotalsFailure: (state, action) => {
      state.totals.isLoading = false;
      state.totals.error = { ...action.payload };
    },
  },
});

export const { actions: outstandingOutgoingActions } = outstandingOutgoingSlice;
export const outstandingOutgoingReducer = outstandingOutgoingSlice.reducer;
export default outstandingOutgoingReducer;
