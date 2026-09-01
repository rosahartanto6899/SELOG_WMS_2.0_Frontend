/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/unit-activity.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  GetLastLocationResponse,
  GetMaintenanceLevelResponse,
  GetMaintenanceStatusResponse,
  GetMaintenanceTypeResponse,
  GetPMCheckDetailResponse,
  GetSummaryResponse,
  GetUnitDetailResponse,
  GetUnitResponse,
  LocationPayload,
  MaintenancePayload,
  MaintenanceUpdatePayload,
  PMCheckPayload,
  Unit,
  UnitDetailPayload,
  UnitParams,
} from "@sera-types/unit-activity";
import { uniqBy } from "lodash";

export const unitActivitySlice = createSlice({
  name: "unitActivity",
  initialState,
  reducers: {
    getUnitFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      state.data = [];
      state.options = { ...action.payload };
    },
    getUnitSuccess: (state, action: PayloadAction<GetUnitResponse>) => {
      state.isLoading = false;
      state.error = null;

      const { data, pagination } = action.payload as GetUnitResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.data = data.map((r: Unit, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }

      state.options = { ...state.options, page, limit, totalData, totalPage };
    },
    getUnitFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
      state.data = [];
    },
    getUnitClear: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = [];
      state.options = initialState.options;
    },

    getUnitAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.autoComplete.isLoading = true;
      state.autoComplete.error = null;
      state.autoComplete.data = [];
      state.autoComplete.options = { ...action.payload };
    },
    getUnitAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetUnitResponse>,
    ) => {
      state.autoComplete.isLoading = false;
      state.autoComplete.error = null;

      const { data, pagination } = action.payload as GetUnitResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
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
    getUnitAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getUnitAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    getUnitDetailFetch: (state, action: PayloadAction<UnitDetailPayload>) => {
      state.unitDetail.isLoading = true;
      state.unitDetail.error = null;
      state.unitDetail.payload = { ...action?.payload };
    },
    getUnitDetailSuccess: (
      state,
      action: PayloadAction<GetUnitDetailResponse>,
    ) => {
      state.unitDetail.isLoading = false;
      state.unitDetail.error = null;
      state.unitDetail.data = { ...action?.payload?.data };
    },
    getUnitDetailFailure: (state, action) => {
      state.unitDetail.isLoading = false;
      state.unitDetail.error = { ...action.payload };
      state.unitDetail.data = {};
    },
    getUnitDetailClear: (state) => {
      state.unitDetail = initialState.unitDetail;
    },

    getPMCheckDetailFetch: (
      state,
      action: PayloadAction<UnitDetailPayload>,
    ) => {
      state.pmCheckDetail.isLoading = true;
      state.pmCheckDetail.error = null;
      state.pmCheckDetail.payload = { ...action?.payload };
    },
    getPMCheckDetailSuccess: (
      state,
      action: PayloadAction<GetPMCheckDetailResponse>,
    ) => {
      state.pmCheckDetail.isLoading = false;
      state.pmCheckDetail.error = null;
      state.pmCheckDetail.data = { ...action?.payload?.data };
    },
    getPMCheckDetailFailure: (state, action) => {
      state.pmCheckDetail.isLoading = false;
      state.pmCheckDetail.error = { ...action.payload };
      state.pmCheckDetail.data = {};
    },
    getPMCheckDetailClear: (state) => {
      state.pmCheckDetail = initialState.pmCheckDetail;
    },

    getSummaryFetch: (state, action: PayloadAction<UnitParams>) => {
      state.getSummary.isLoading = true;
      state.getSummary.error = null;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<GetSummaryResponse>) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = null;
      state.getSummary.data = { ...action?.payload?.data };
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = {};
    },
    getSummaryClear: (state) => {
      state.getSummary = initialState.getSummary;
    },

    createMaintenanceFetch: (
      state,
      action: PayloadAction<MaintenancePayload>,
    ) => {
      state.createMaintenance.isLoading = true;
      state.createMaintenance.error = null;
      state.createMaintenance.payload = { ...action.payload };
    },
    createMaintenanceSuccess: (
      state,
      action: PayloadAction<MaintenancePayload>,
    ) => {
      state.createMaintenance.isLoading = false;
      state.createMaintenance.error = null;
      state.createMaintenance.data = { ...action?.payload };
    },
    createMaintenanceFailure: (state, action) => {
      state.createMaintenance.isLoading = false;
      state.createMaintenance.error = { ...action.payload };
      state.createMaintenance.data = {};
    },
    createMaintenanceClear: (state) => {
      state.createMaintenance = initialState.createMaintenance;
    },

    updateMaintenanceFetch: (
      state,
      action: PayloadAction<MaintenanceUpdatePayload>,
    ) => {
      state.updateMaintenance.isLoading = true;
      state.updateMaintenance.error = null;
      state.updateMaintenance.payload = { ...action.payload };
    },
    updateMaintenanceSuccess: (
      state,
      action: PayloadAction<MaintenanceUpdatePayload>,
    ) => {
      state.updateMaintenance.isLoading = false;
      state.updateMaintenance.error = null;
      state.updateMaintenance.data = { ...action?.payload };
    },
    updateMaintenanceFailure: (state, action) => {
      state.updateMaintenance.isLoading = false;
      state.updateMaintenance.error = { ...action.payload };
      state.updateMaintenance.data = {};
    },
    updateMaintenanceClear: (state) => {
      state.updateMaintenance = initialState.updateMaintenance;
    },

    updatePMCheckFetch: (state, action: PayloadAction<PMCheckPayload>) => {
      state.updatePMCheck.isLoading = true;
      state.updatePMCheck.error = null;
      state.updatePMCheck.payload = { ...action.payload };
    },
    updatePMCheckSuccess: (state, action: PayloadAction<PMCheckPayload>) => {
      state.updatePMCheck.isLoading = false;
      state.updatePMCheck.error = null;
      state.updatePMCheck.data = { ...action?.payload };
    },
    updatePMCheckFailure: (state, action) => {
      state.updatePMCheck.isLoading = false;
      state.updatePMCheck.error = { ...action.payload };
      state.updatePMCheck.data = {};
    },
    updatePMCheckClear: (state) => {
      state.updatePMCheck = initialState.updatePMCheck;
    },

    getLastLocationFetch: (state, action: PayloadAction<LocationPayload>) => {
      state.lastLocation.isLoading = true;
      state.lastLocation.error = null;
      state.lastLocation.payload = { ...action.payload };
    },
    getLastLocationSuccess: (
      state,
      action: PayloadAction<GetLastLocationResponse>,
    ) => {
      state.lastLocation.isLoading = false;
      state.lastLocation.error = null;
      state.lastLocation.data = action?.payload?.data ?? {};
    },
    getLastLocationFailure: (state, action) => {
      state.lastLocation.isLoading = false;
      state.lastLocation.error = { ...action.payload };
      state.lastLocation.data = {};
    },
    getLastLocationClear: (state) => {
      state.lastLocation = initialState.lastLocation;
    },

    getMaintenanceStatusFetch: (state) => {
      state.maintenanceStatus.isLoading = true;
      state.maintenanceStatus.error = null;
    },
    getMaintenanceStatusSuccess: (
      state,
      action: PayloadAction<GetMaintenanceStatusResponse>,
    ) => {
      state.maintenanceStatus.isLoading = false;
      state.maintenanceStatus.error = null;
      state.maintenanceStatus.data = action?.payload?.data ?? [];
    },
    getMaintenanceStatusFailure: (state, action) => {
      state.maintenanceStatus.isLoading = false;
      state.maintenanceStatus.error = { ...action.payload };
      state.maintenanceStatus.data = [];
    },
    getMaintenanceStatusClear: (state) => {
      state.maintenanceStatus = initialState.maintenanceStatus;
    },

    getMaintenanceTypeFetch: (state) => {
      state.maintenanceType.isLoading = true;
      state.maintenanceType.error = null;
    },
    getMaintenanceTypeSuccess: (
      state,
      action: PayloadAction<GetMaintenanceTypeResponse>,
    ) => {
      state.maintenanceType.isLoading = false;
      state.maintenanceType.error = null;
      state.maintenanceType.data = action?.payload?.data ?? [];
    },
    getMaintenanceTypeFailure: (state, action) => {
      state.maintenanceType.isLoading = false;
      state.maintenanceType.error = { ...action.payload };
      state.maintenanceType.data = [];
    },
    getMaintenanceTypeClear: (state) => {
      state.maintenanceType = initialState.maintenanceType;
    },

    getMaintenanceLevelFetch: (state) => {
      state.maintenanceLevel.isLoading = true;
      state.maintenanceLevel.error = null;
    },
    getMaintenanceLevelSuccess: (
      state,
      action: PayloadAction<GetMaintenanceLevelResponse>,
    ) => {
      state.maintenanceLevel.isLoading = false;
      state.maintenanceLevel.error = null;
      state.maintenanceLevel.data = action?.payload?.data ?? [];
    },
    getMaintenanceLevelFailure: (state, action) => {
      state.maintenanceLevel.isLoading = false;
      state.maintenanceLevel.error = { ...action.payload };
      state.maintenanceLevel.data = [];
    },
    getMaintenanceLevelClear: (state) => {
      state.maintenanceLevel = initialState.maintenanceLevel;
    },

    getLocationCountFetch: (
      state,
      action: PayloadAction<UnitDetailPayload>,
    ) => {
      state.locationCount.isLoading = true;
      state.locationCount.error = null;
      state.locationCount.payload = { ...action?.payload };
    },
    getLocationCountSuccess: (state, action: PayloadAction<any>) => {
      state.locationCount.isLoading = false;
      state.locationCount.error = null;
      state.locationCount.data = action?.payload?.data ?? {};
    },
    getLocationCountFailure: (state, action) => {
      state.locationCount.isLoading = false;
      state.locationCount.error = { ...action.payload };
      state.locationCount.data = {};
    },
    getLocationCountClear: (state) => {
      state.locationCount = initialState.locationCount;
    },
  },
});

export const unitActivityActions = unitActivitySlice.actions;
export const unitActivityReducers = unitActivitySlice.reducer;
export default unitActivityReducers;
