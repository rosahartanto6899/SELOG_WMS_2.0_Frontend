import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/shipment-cancellations.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetApprovalHistoryResponse,
  GetShipmentCancellationsDetailResponse,
  GetShipmentCancellationsListResponse,
  GetShipmentCancellationsSummaryResponse,
  ShipmentCancellationsDetailPayload,
  ShipmentCancellationsRecord,
  ShipmentCancellationsSummaryPayload,
  UpdateApprovalCancelPayload,
  UpdateApprovalReroutePayload,
  UpdateApprovalReschedulePayload,
} from "@sera-types/shipment-cancellations.type";
import { uniqBy } from "lodash";

export const shipmentCancellationsSlice = createSlice({
  name: "shipmentCancellations",
  initialState,
  reducers: {
    getShipmentCancellationsFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.options = { ...action.payload };
    },
    getShipmentCancellationsSuccess: (
      state,
      action: PayloadAction<GetShipmentCancellationsListResponse>,
    ) => {
      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map(
          (r: ShipmentCancellationsRecord, index: number) => {
            const no = (page - 1) * limit + index + 1;
            return { ...r, no: no };
          },
        );
      }
      state.isLoading = false;
    },
    getShipmentCancellationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getShipmentCancellationsClear: (state) => {
      state.data = initialState.data;
      state.options = initialState.options;
      state.error = null;
      state.isLoading = false;
    },
    getShipmentCancellationsAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getShipmentCancellationsAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetShipmentCancellationsListResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = (state?.autoComplete?.options?.searchBy ?? "") as any;

      if (state?.autoComplete?.options && state?.autoComplete?.data && data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getShipmentCancellationsAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getShipmentCancellationsAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
      state.error = initialState.autoComplete.error;
    },
    getShipmentCancellationsSummaryFetch: (
      state,
      action: PayloadAction<ShipmentCancellationsSummaryPayload>,
    ) => {
      state.summary.isLoading = true;
      state.summary.error = null;
      state.summary.payload = { ...action.payload };
    },
    getShipmentCancellationsSummarySuccess: (
      state,
      action: PayloadAction<GetShipmentCancellationsSummaryResponse>,
    ) => {
      state.summary.isLoading = false;
      if (action.payload.data) {
        state.summary.data = action.payload.data.summary;
      }
    },
    getShipmentCancellationsSummaryFailure: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = action.payload;
    },
    getShipmentCancellationsSummaryClear: (state) => {
      state.summary = initialState.summary;
    },
    getShipmentCancellationsDetailFetch: (
      state,
      action: PayloadAction<ShipmentCancellationsDetailPayload>,
    ) => {
      state.detail.isLoading = true;
      state.detail.error = null;
      state.detail.payload = { ...action.payload };
    },
    getShipmentCancellationsDetailSuccess: (
      state,
      action: PayloadAction<GetShipmentCancellationsDetailResponse>,
    ) => {
      state.detail.isLoading = false;
      if (action.payload.data) {
        state.detail.data = action.payload.data;
      }
    },
    getShipmentCancellationsDetailFailure: (state, action) => {
      state.detail.isLoading = false;
      state.detail.error = action.payload;
    },
    getShipmentCancellationsDetailClear: (state) => {
      state.detail = initialState.detail;
    },
    updateApprovalRerouteShipmentFetch: (
      state,
      action: PayloadAction<UpdateApprovalReroutePayload>,
    ) => {
      state.updateApprovalReroute.isLoading = true;
      state.updateApprovalReroute.error = null;
      state.updateApprovalReroute.data = { ...action.payload };
    },
    updateApprovalRerouteShipmentSuccess: (state) => {
      state.updateApprovalReroute.isLoading = false;
      state.updateApprovalReroute.error = null;
    },
    updateApprovalRerouteShipmentFailure: (state, action) => {
      state.updateApprovalReroute.isLoading = false;
      state.updateApprovalReroute.error = action.payload;
    },
    updateApprovalRerouteShipmentClear: (state) => {
      state.updateApprovalReroute = initialState.updateApprovalReroute;
    },
    updateApprovalCancelShipmentFetch: (
      state,
      action: PayloadAction<UpdateApprovalCancelPayload>,
    ) => {
      state.updateApprovalCancel.isLoading = true;
      state.updateApprovalCancel.error = null;
      state.updateApprovalCancel.data = { ...action.payload };
    },
    updateApprovalCancelShipmentSuccess: (state) => {
      state.updateApprovalCancel.isLoading = false;
      state.updateApprovalCancel.error = null;
    },
    updateApprovalCancelShipmentFailure: (state, action) => {
      state.updateApprovalCancel.isLoading = false;
      state.updateApprovalCancel.error = action.payload;
    },
    updateApprovalCancelShipmentClear: (state) => {
      state.updateApprovalCancel = initialState.updateApprovalCancel;
    },
    updateApprovalRescheduleShipmentFetch: (
      state,
      action: PayloadAction<UpdateApprovalReschedulePayload>,
    ) => {
      state.updateApprovalReschedule.isLoading = true;
      state.updateApprovalReschedule.error = null;
      state.updateApprovalReschedule.data = { ...action.payload };
    },
    updateApprovalRescheduleShipmentSuccess: (state) => {
      state.updateApprovalReschedule.isLoading = false;
      state.updateApprovalReschedule.error = null;
    },
    updateApprovalRescheduleShipmentFailure: (state, action) => {
      state.updateApprovalReschedule.isLoading = false;
      state.updateApprovalReschedule.error = action.payload;
    },
    updateApprovalRescheduleShipmentClear: (state) => {
      state.updateApprovalReschedule = initialState.updateApprovalReschedule;
    },
    getApprovalHistoryFetch: (
      state,
      action: PayloadAction<ShipmentCancellationsDetailPayload>,
    ) => {
      state.approvalHistory.isLoading = true;
      state.approvalHistory.error = null;
      state.approvalHistory.payload = { ...action.payload };
    },
    getApprovalHistorySuccess: (
      state,
      action: PayloadAction<GetApprovalHistoryResponse>,
    ) => {
      state.approvalHistory.isLoading = false;
      state.approvalHistory.error = null;
      if (action.payload.data) {
        state.approvalHistory.data = action.payload.data.map((v, i) => ({
          ...v,
          no: i + 1,
        }));
      }
    },
    getApprovalHistoryFailure: (state, action) => {
      state.approvalHistory.isLoading = false;
      state.approvalHistory.error = action.payload;
    },
    getApprovalHistoryClear: (state) => {
      state.approvalHistory = initialState.approvalHistory;
    },
  },
});

export const shipmentCancellationsReducer = shipmentCancellationsSlice.reducer;
export const shipmentCancellationsActions = shipmentCancellationsSlice.actions;
