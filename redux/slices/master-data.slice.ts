/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/master-data.state";
import {
  LocationReversePayload,
  LocationReverseResponse,
  MasterDataResponse,
} from "@sera-types/master-data.type";
import { AREA_ORDER } from "@sera-utils/constants/common";

export const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    getAreasFetch: (state) => {
      state.getAreas.isLoading = true;
      state.getAreas.error = null;
    },
    getAreasSuccess: (state, action: PayloadAction<MasterDataResponse>) => {
      state.getAreas.isLoading = false;
      state.getAreas.error = null;
      state.getAreas.data = AREA_ORDER?.map((_areaName) =>
        action?.payload?.data?.find((_item) => _item?.name === _areaName),
      )?.filter((_item) => _item !== undefined);
    },
    getAreasFailure: (state, action) => {
      state.getAreas.isLoading = false;
      state.getAreas.error = { ...action.payload };
      state.getAreas.data = [];
    },
    getAreasClear: (state) => {
      state.getAreas = initialState.getAreas;
    },

    getOrderPrioritiesFetch: (state) => {
      state.getOrderPriorities.isLoading = true;
      state.getOrderPriorities.error = null;
    },
    getOrderPrioritiesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getOrderPriorities.isLoading = false;
      state.getOrderPriorities.error = null;
      state.getOrderPriorities.data = action?.payload?.data ?? [];
    },
    getOrderPrioritiesFailure: (state, action) => {
      state.getOrderPriorities.isLoading = false;
      state.getOrderPriorities.error = { ...action.payload };
      state.getOrderPriorities.data = [];
    },
    getOrderPrioritiesClear: (state) => {
      state.getOrderPriorities = initialState.getOrderPriorities;
    },

    getUnitCapacityStatusesFetch: (state) => {
      state.getUnitCapacityStatuses.isLoading = true;
      state.getUnitCapacityStatuses.error = null;
    },
    getUnitCapacityStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getUnitCapacityStatuses.isLoading = false;
      state.getUnitCapacityStatuses.error = null;
      state.getUnitCapacityStatuses.data = action?.payload?.data ?? [];
    },
    getUnitCapacityStatusesFailure: (state, action) => {
      state.getUnitCapacityStatuses.isLoading = false;
      state.getUnitCapacityStatuses.error = { ...action.payload };
      state.getUnitCapacityStatuses.data = [];
    },
    getUnitCapacityStatusesClear: (state) => {
      state.getUnitCapacityStatuses = initialState.getUnitCapacityStatuses;
    },

    getDriverCapacityStatusesFetch: (state) => {
      state.getDriverCapacityStatuses.isLoading = true;
      state.getDriverCapacityStatuses.error = null;
    },
    getDriverCapacityStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getDriverCapacityStatuses.isLoading = false;
      state.getDriverCapacityStatuses.error = null;
      state.getDriverCapacityStatuses.data = action?.payload?.data ?? [];
    },
    getDriverCapacityStatusesFailure: (state, action) => {
      state.getDriverCapacityStatuses.isLoading = false;
      state.getDriverCapacityStatuses.error = { ...action.payload };
      state.getDriverCapacityStatuses.data = [];
    },
    getDriverCapacityStatusesClear: (state) => {
      state.getDriverCapacityStatuses = initialState.getDriverCapacityStatuses;
    },

    getEmployeeStatusesFetch: (state) => {
      state.getEmployeeStatuses.isLoading = true;
      state.getEmployeeStatuses.error = null;
    },
    getEmployeeStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getEmployeeStatuses.isLoading = false;
      state.getEmployeeStatuses.error = null;
      state.getEmployeeStatuses.data = action?.payload?.data ?? [];
    },
    getEmployeeStatusesFailure: (state, action) => {
      state.getEmployeeStatuses.isLoading = false;
      state.getEmployeeStatuses.error = { ...action.payload };
      state.getEmployeeStatuses.data = [];
    },
    getEmployeeStatusesClear: (state) => {
      state.getEmployeeStatuses = initialState.getEmployeeStatuses;
    },

    getTierLevelsFetch: (state) => {
      state.getTierLevels.isLoading = true;
      state.getTierLevels.error = null;
    },
    getTierLevelsSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getTierLevels.isLoading = false;
      state.getTierLevels.error = null;
      state.getTierLevels.data = action?.payload?.data ?? [];
    },
    getTierLevelsFailure: (state, action) => {
      state.getTierLevels.isLoading = false;
      state.getTierLevels.error = { ...action.payload };
      state.getTierLevels.data = [];
    },
    getTierLevelsClear: (state) => {
      state.getTierLevels = initialState.getTierLevels;
    },

    getShipmentConfirmationStatusesFetch: (state) => {
      state.getShipmentConfirmationStatuses.isLoading = true;
      state.getShipmentConfirmationStatuses.error = null;
    },
    getShipmentConfirmationStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getShipmentConfirmationStatuses.isLoading = false;
      state.getShipmentConfirmationStatuses.error = null;
      state.getShipmentConfirmationStatuses.data = action?.payload?.data ?? [];
    },
    getShipmentConfirmationStatusesFailure: (state, action) => {
      state.getShipmentConfirmationStatuses.isLoading = false;
      state.getShipmentConfirmationStatuses.error = { ...action.payload };
      state.getShipmentConfirmationStatuses.data = [];
    },
    getShipmentConfirmationStatusesClear: (state) => {
      state.getShipmentConfirmationStatuses =
        initialState.getShipmentConfirmationStatuses;
    },

    getVoDCategoriesFetch: (state) => {
      state.getVoDCategories.isLoading = true;
      state.getVoDCategories.error = null;
    },
    getVoDCategoriesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getVoDCategories.isLoading = false;
      state.getVoDCategories.error = null;
      state.getVoDCategories.data = action?.payload?.data ?? [];
    },
    getVoDCategoriesFailure: (state, action) => {
      state.getVoDCategories.isLoading = false;
      state.getVoDCategories.error = { ...action.payload };
      state.getVoDCategories.data = [];
    },
    getVoDCategoriesClear: (state) => {
      state.getVoDCategories = initialState.getVoDCategories;
    },

    getVoDStatusesFetch: (state) => {
      state.getVoDStatuses.isLoading = true;
      state.getVoDStatuses.error = null;
    },
    getVoDStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getVoDStatuses.isLoading = false;
      state.getVoDStatuses.error = null;
      state.getVoDStatuses.data = action?.payload?.data ?? [];
    },
    getVoDStatusesFailure: (state, action) => {
      state.getVoDStatuses.isLoading = false;
      state.getVoDStatuses.error = { ...action.payload };
      state.getVoDStatuses.data = [];
    },
    getVoDStatusesClear: (state) => {
      state.getVoDStatuses = initialState.getVoDStatuses;
    },

    getVoDTypesFetch: (state) => {
      state.getVoDTypes.isLoading = true;
      state.getVoDTypes.error = null;
    },
    getVoDTypesSuccess: (state, action: PayloadAction<MasterDataResponse>) => {
      state.getVoDTypes.isLoading = false;
      state.getVoDTypes.error = null;
      state.getVoDTypes.data = action?.payload?.data ?? [];
    },
    getVoDTypesFailure: (state, action) => {
      state.getVoDTypes.isLoading = false;
      state.getVoDTypes.error = { ...action.payload };
      state.getVoDTypes.data = [];
    },
    getVoDTypesClear: (state) => {
      state.getVoDTypes = initialState.getVoDTypes;
    },
    getShipmentCancellationReasonsFetch: (state) => {
      state.getShipmentCancellationReasons.isLoading = true;
      state.getShipmentCancellationReasons.error = null;
    },
    getShipmentCancellationReasonsSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getShipmentCancellationReasons.isLoading = false;
      state.getShipmentCancellationReasons.error = null;
      state.getShipmentCancellationReasons.data = action?.payload?.data ?? [];
    },
    getShipmentCancellationReasonsFailure: (state, action) => {
      state.getShipmentCancellationReasons.isLoading = false;
      state.getShipmentCancellationReasons.error = { ...action.payload };
      state.getShipmentCancellationReasons.data = [];
    },
    getShipmentCancellationReasonsClear: (state) => {
      state.getShipmentCancellationReasons =
        initialState.getShipmentCancellationReasons;
    },

    getLocationReverseFetch: (
      state,
      action: PayloadAction<LocationReversePayload>,
    ) => {
      state.getLocationReverse.isLoading = true;
      state.getLocationReverse.error = null;
      state.getLocationReverse.payload = { ...action.payload };
    },
    getLocationReverseSuccess: (
      state,
      action: PayloadAction<LocationReverseResponse>,
    ) => {
      state.getLocationReverse.isLoading = false;
      state.getLocationReverse.error = null;
      state.getLocationReverse.data = action?.payload?.data ?? "NOT FOUND";
    },
    getLocationReverseFailure: (state, action) => {
      state.getLocationReverse.isLoading = false;
      state.getLocationReverse.error = { ...action.payload };
      state.getLocationReverse.data = "";
    },
    getLocationReverseClear: (state) => {
      state.getLocationReverse = initialState.getLocationReverse;
    },

    getJourneyStatusesFetch: (state) => {
      state.getJourneyStatuses.isLoading = true;
      state.getJourneyStatuses.error = null;
    },
    getJourneyStatusesSuccess: (
      state,
      action: PayloadAction<MasterDataResponse>,
    ) => {
      state.getJourneyStatuses.isLoading = false;
      state.getJourneyStatuses.error = null;
      state.getJourneyStatuses.data = action?.payload?.data ?? [];
    },
    getJourneyStatusesFailure: (state, action) => {
      state.getJourneyStatuses.isLoading = false;
      state.getJourneyStatuses.error = { ...action.payload };
      state.getJourneyStatuses.data = [];
    },
    getJourneyStatusesClear: (state) => {
      state.getJourneyStatuses = initialState.getJourneyStatuses;
    },
  },
});

export const masterDataActions = masterDataSlice.actions;
export const masterDataReducers = masterDataSlice.reducer;
export default masterDataReducers;
