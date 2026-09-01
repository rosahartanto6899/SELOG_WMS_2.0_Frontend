import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/pod-collection.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  ApprovalPodPayload,
  DeliveryResponse,
  GetApprovalResponse,
  GetDetailsResponse,
  GetListResponse,
  GetSummaryResponse,
  HardcopyResponse,
  List,
  LoadingResponse,
  PayloadDetails,
  PodDeliveryPayload,
  PodHardcopyPayload,
  PodLoadingPayload,
  PodTimestampPayload,
  PodUnloadingPayload,
  TimestampResponse,
  UnitParams,
  UnloadingResponse,
} from "@sera-types/pod-collection.type";

export const podCollectionSlice = createSlice({
  name: "podCollection",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<UnitParams>) => {
      state.getSummary.isLoading = true;
      state.getSummary.error = null;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<GetSummaryResponse>) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = null;
      if (action?.payload?.data) {
        state.getSummary.data = { ...action?.payload?.data };
      }
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = { ...initialState.getSummary.data };
    },
    getListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getList.isLoading = true;
      state.getList.error = null;
      state.getList.data = [];
      state.getList.options = { ...action.payload };
    },
    getListSuccess: (state, action: PayloadAction<GetListResponse>) => {
      state.getList.isLoading = false;
      state.getList.error = null;

      const { data, pagination } = action.payload as GetListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getList.data = data?.map((_record: List, _index: number) => {
          const no = (page - 1) * limit + _index + 1;
          return { ..._record, no };
        });
      }

      state.getList.options = {
        ...state.getList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getListFailure: (state, action) => {
      state.getList.isLoading = false;
      state.getList.error = { ...action.payload };
      state.getList.data = [];
    },
    getDetailsFetch: (state, action: PayloadAction<PayloadDetails>) => {
      state.getDetails.isLoading = true;
      state.getDetails.error = null;
      state.getDetails.payload = { ...action.payload };
    },
    getDetailsSuccess: (state, action: PayloadAction<GetDetailsResponse>) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = null;
      if (action?.payload?.data) {
        state.getDetails.data = { ...action?.payload?.data };
      }
    },
    getDetailsFailure: (state, action) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = { ...action.payload };
      state.getDetails.data = { ...initialState.getDetails.data };
    },
    podLoadingFetch: (
      state,
      action: PayloadAction<{
        payload: PodLoadingPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.podLoading.isLoading = true;
      state.podLoading.error = null;
      state.podLoading.payload = { ...action.payload.payload };
    },
    podLoadingSuccess: (state, action: PayloadAction<LoadingResponse>) => {
      state.podLoading.isLoading = false;
      state.podLoading.error = null;
      state.podLoading.data = action?.payload?.data ?? {};
    },
    podLoadingFailure: (state, action) => {
      state.podLoading.isLoading = false;
      state.podLoading.error = { ...action.payload };
      state.podLoading.data = {};
    },
    podUnloadingFetch: (
      state,
      action: PayloadAction<{
        payload: PodUnloadingPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.podUnloading.isLoading = true;
      state.podUnloading.error = null;
      state.podUnloading.payload = { ...action.payload.payload };
    },
    podUnloadingSuccess: (state, action: PayloadAction<UnloadingResponse>) => {
      state.podUnloading.isLoading = false;
      state.podUnloading.error = null;
      state.podUnloading.data = action?.payload?.data ?? {};
    },
    podUnloadingFailure: (state, action) => {
      state.podLoading.isLoading = false;
      state.podLoading.error = { ...action.payload };
      state.podLoading.data = {};
    },
    podDeliveryFetch: (
      state,
      action: PayloadAction<{
        payload: PodDeliveryPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.podDelivery.isLoading = true;
      state.podDelivery.error = null;
      state.podDelivery.payload = { ...action.payload.payload };
    },
    podDeliverySuccess: (state, action: PayloadAction<DeliveryResponse>) => {
      state.podDelivery.isLoading = false;
      state.podDelivery.error = null;
      state.podDelivery.data = action?.payload?.data ?? {};
    },
    podDeliveryFailure: (state, action) => {
      state.podDelivery.isLoading = false;
      state.podDelivery.error = { ...action.payload };
      state.podDelivery.data = {};
    },
    podTimestampFetch: (
      state,
      action: PayloadAction<{
        payload: PodTimestampPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.podTimestamp.isLoading = true;
      state.podTimestamp.error = null;
      state.podTimestamp.payload = { ...action.payload.payload };
    },
    podTimestampSuccess: (state, action: PayloadAction<TimestampResponse>) => {
      state.podTimestamp.isLoading = false;
      state.podTimestamp.error = null;
      state.podTimestamp.data = action?.payload?.data ?? {};
    },
    podTimestampFailure: (state, action) => {
      state.podTimestamp.isLoading = false;
      state.podTimestamp.error = { ...action.payload };
      state.podTimestamp.data = {};
    },
    podHardcopyFetch: (
      state,
      action: PayloadAction<{
        payload: PodHardcopyPayload;
        callback?: (message?: string) => void;
      }>,
    ) => {
      state.podHardcopy.isLoading = true;
      state.podHardcopy.error = null;
      state.podHardcopy.payload = { ...action.payload.payload };
    },
    podHardcopySuccess: (state, action: PayloadAction<HardcopyResponse>) => {
      state.podHardcopy.isLoading = false;
      state.podHardcopy.error = null;
      state.podHardcopy.data = action?.payload?.data ?? {};
    },
    podHardcopyFailure: (state, action) => {
      state.podHardcopy.isLoading = false;
      state.podHardcopy.error = { ...action.payload };
      state.podHardcopy.data = {};
    },
    getApprovalFetch: (
      state,
      action: PayloadAction<{
        payload: ApprovalPodPayload;
        callback?: () => void;
      }>,
    ) => {
      state.podApproval.isLoading = true;
      state.podApproval.error = null;
      state.podApproval.payload = { ...action.payload.payload };
    },
    getApprovalSuccess: (state, action: PayloadAction<GetApprovalResponse>) => {
      state.podApproval.isLoading = false;
      state.podApproval.error = null;
      if (action?.payload?.data) {
        state.podApproval.data = { ...action?.payload?.data };
      }
    },
    getApprovalFailure: (state, action) => {
      state.podApproval.isLoading = false;
      state.podApproval.error = { ...action.payload };
      state.podApproval.data = { ...initialState.podApproval.data };
    },
  },
});

export const podCollectionActions = podCollectionSlice.actions;
export const podCollectionReducers = podCollectionSlice.reducer;
export default podCollectionReducers;
