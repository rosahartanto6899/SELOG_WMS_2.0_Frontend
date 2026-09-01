// /* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { GetRolesResponse, Role } from "@sera-types/role.type";

import initialState from "../states/role.state";

export const roleState = createSlice({
  name: "roles",
  initialState,
  reducers: {
    getRolesFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getRolesSuccess: (state, action: PayloadAction<GetRolesResponse>) => {
      const { data, pagination } = action.payload as GetRolesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: Role, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getRolesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getRolesClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getRolesAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
    },
    getRolesAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetRolesResponse>,
    ) => {
      const { data, pagination } = action.payload as GetRolesResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        state.autoComplete.data = data
          ? data.map((item) => ({
              label: item.roleName,
              value: item.roleName,
              id: item.id,
            }))
          : ([] as any);
      }
      state.isLoading = false;
    },
    getRolesAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    createNewRoleFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createNewRoleSuccess: (state, action) => {
      const { data } = action.payload;
      state.createNewRole.data = data ?? [];
      state.isLoading = false;
      state.postCreateNewRole.roleName = data.roleName;
    },
    createNewRoleFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postCreateNewRoleClear: (state) => {
      state.postCreateNewRole = initialState.postCreateNewRole;
    },

    getRoleDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
    },
    getRoleDetailSuccess: (state, action: PayloadAction<GetRolesResponse>) => {
      const { data } = action.payload as GetRolesResponse;
      state.roleDetail.data = { ...state.roleDetail.data, ...data };
      state.isLoading = false;
    },
    getRoleDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    updateRoleFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    updateRoleSuccess: (state, action) => {
      const { data } = action.payload;
      state.updateRole.data = data ?? [];
      state.postUpdateRole = {
        id: data.id,
        roleName: data.roleName,
      };
    },
    updateRoleFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postUpdateRoleClear: (state) => {
      state.postUpdateRole = initialState.postUpdateRole;
    },

    deleteRoleFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteRoleSuccess: (state, action: PayloadAction<GetRolesResponse>) => {
      state.isLoading = false;
    },
    deleteRoleFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    postDeleteRoleNotification: (state, action) => {
      const {
        payload: { id, roleName },
      } = action;
      state.postDeleteRole = { id, roleName };
    },
    postDeleteRoleClear: (state) => {
      state.postDeleteRole = initialState.postDeleteRole;
    },

    getDropdownRolesFetch: (state, action: PayloadAction) => {
      state.isLoading = true;
      state.error = null;
    },
    getDropdownRolesSuccess: (
      state,
      action: PayloadAction<GetRolesResponse>,
    ) => {
      const { data } = action.payload as GetRolesResponse;
      state.dropdownRoles.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownRolesFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getRolesFetch,
  getRolesSuccess,
  getRolesFailure,
  getRolesAutoCompleteFetch,
  getRolesAutoCompleteSuccess,
  getRolesAutoCompleteFailure,
  createNewRoleFetch,
  createNewRoleSuccess,
  createNewRoleFailure,
  postCreateNewRoleClear,
  getRoleDetailFetch,
  getRoleDetailSuccess,
  getRoleDetailFailure,
  updateRoleFetch,
  updateRoleSuccess,
  updateRoleFailure,
  postUpdateRoleClear,
  deleteRoleFetch,
  deleteRoleSuccess,
  deleteRoleFailure,
  postDeleteRoleNotification,
  postDeleteRoleClear,
  getDropdownRolesFetch,
  getDropdownRolesSuccess,
  getDropdownRolesFailure,
} = roleState.actions;

export const roleActions = roleState.actions;
export const roleReducers = roleState.reducer;
export default roleReducers;
