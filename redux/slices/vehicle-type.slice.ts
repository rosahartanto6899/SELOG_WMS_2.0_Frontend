/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/vehicle-type.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateNewVehicleTypePayload,
  DeleteVehicleTypePayload,
  GetVehicleTypeDropdownPayload,
  GetVehicleTypesResponse,
  UpdateVehicleTypePayload,
  VehicleType,
  VehicleTypeDropdown,
  VehicleTypeState,
} from "@sera-types/vehicle-type.type";
import { uniqBy } from "lodash";

export const vehicleTypeState = createSlice({
  name: "vehicleTypes",
  initialState,
  reducers: {
    // Get Vehicle Types
    getVehicleTypesFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getVehicleTypesSuccess: (
      state: VehicleTypeState,
      action: PayloadAction<GetVehicleTypesResponse>,
    ) => {
      const { data, pagination } = action.payload as GetVehicleTypesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };

      if (data) {
        state.data = data.map((r: VehicleType, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no, key: no };
        });
      }
      state.isLoading = false;
    },
    getVehicleTypesFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getVehicleTypesClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    // Get Vehicle Types Auto Complete
    getVehicleTypesAutoCompleteFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };

      if (state?.autoComplete) {
        state.autoComplete.options.searchBy = action.payload.searchBy;
      }
    },
    getVehicleTypesAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetVehicleTypesResponse>,
    ) => {
      const { data, pagination } = action.payload as GetVehicleTypesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const uniqueData = uniqBy(data, searchBy);

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];
      }
      state.isLoading = false;
    },
    getVehicleTypesAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getVehicleTypesAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    // Create New Vehicle Type
    createNewVehicleTypeFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewVehicleTypeSuccess: (
      state,
      action: PayloadAction<CreateNewVehicleTypePayload>,
    ) => {
      state.createNewVehicleType = action.payload || {};
      state.isLoading = false;
    },
    createNewVehicleTypeFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    createNewVehicleTypeClear: (state) => {
      state.createNewVehicleType = initialState.createNewVehicleType;
    },

    // Get Detail Vehicle Type
    getVehicleTypeDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getVehicleTypeDetailSuccess: (
      state,
      action: PayloadAction<GetVehicleTypesResponse>,
    ) => {
      const { data } = action.payload as GetVehicleTypesResponse;
      state.vehicleTypeDetail.data = {
        ...state.vehicleTypeDetail.data,
        ...data,
      };
      state.isLoading = false;
    },
    getVehicleTypeDetailFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getVehicleTypeDetailClear: (state) => {
      state.vehicleTypeDetail = initialState.vehicleTypeDetail;
    },

    // Update Vehicle Type
    updateVehicleTypeFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateVehicleTypeSuccess: (
      state,
      action: PayloadAction<UpdateVehicleTypePayload>,
    ) => {
      state.updateVehicleType = action.payload || {};
      state.isLoading = false;
    },
    updateVehicleTypeFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    updateVehicleTypeClear: (state) => {
      state.updateVehicleType = initialState.updateVehicleType;
    },

    // Delete Vehicle Type
    deleteVehicleTypeFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...state.options, ...action.payload.options };
    },
    deleteVehicleTypeSuccess: (
      state,
      action: PayloadAction<DeleteVehicleTypePayload>,
    ) => {
      state.deleteVehicleType = action.payload || {};
      state.isLoading = false;
    },
    deleteVehicleTypeFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    deleteVehicleTypeClear: (state) => {
      state.deleteVehicleType = initialState.deleteVehicleType;
    },

    // Dropdown Vehicle Type
    getDropdownVehicleTypesFetch: (
      state,
      action: PayloadAction<GetVehicleTypeDropdownPayload>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.dropdownVehicleTypes.options = action.payload;
    },
    getDropdownVehicleTypesSuccess: (
      state,
      action: PayloadAction<GetVehicleTypesResponse>,
    ) => {
      const data = action.payload.data as VehicleTypeDropdown[];
      state.dropdownVehicleTypes.data =
        data.map((item) => ({ ...item, id: item.id?.toUpperCase() })) ?? [];
      state.isLoading = false;
    },
    getDropdownVehicleTypesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownVehicleTypesClear: (state) => {
      state.options = initialState.options;
      state.dropdownVehicleTypes.data = initialState.dropdownVehicleTypes.data;
      state.dropdownVehicleTypes.options = {};
    },
  },
});

export const vehicleTypeActions = vehicleTypeState.actions;
export const vehicleTypeReducers = vehicleTypeState.reducer;
export default vehicleTypeReducers;
