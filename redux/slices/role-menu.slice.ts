import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/role-menu.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import { GetRoleMenusResponse, RoleMenu } from "@sera-types/role-menu.type";
import _ from "lodash";

export const roleMenuState = createSlice({
  name: "roleMenus",
  initialState,
  reducers: {
    getRoleMenusFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getRoleMenusSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetRoleMenusResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((r: RoleMenu, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });

        state.roleMenuDetail.data = {};
      }
      state.isLoading = false;
    },
    getRoleMenusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getRoleMenusClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getRoleMenusAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      if (state?.autoComplete) {
        state.autoComplete.options.searchBy = action.payload.searchBy;
        state.autoComplete.options.search = action.payload.search;
      }
      state.error = null;
      state.isLoading = true;
    },
    getRoleMenusAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as any;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        (state.autoComplete && state.autoComplete.options.searchBy) || "menu";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const uniqueData =
          searchBy === "menu"
            ? _.uniqBy(data, "menu")
            : _.uniqBy(data, searchBy);

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => {
              if (searchBy === "menu") {
                return {
                  label: item.menu.menuName,
                  value: item.menu.menuName,
                };
              }

              return {
                label: item[searchBy],
                value: item[searchBy],
              };
            })
          : ([] as any);
      }
      state.isLoading = false;
    },
    getRoleMenusAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    clearRoleMenusAutoComplete: (state) => {
      if (state.autoComplete) {
        state.autoComplete.data = [];
        state.autoComplete.options = initialState.autoComplete.options;
      }
    },

    createNewRoleMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewRoleMenuSuccess: (state, action) => {
      const { data } = action.payload;
      state.createNewRoleMenu.data = data ?? [];
      state.isLoading = false;
      state.postCreateNewRoleMenus = {
        success: true,
        message: "has been added!",
      };
    },
    createNewRoleMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    postCreateNewRoleMenuClear: (state) => {
      state.postCreateNewRoleMenus = initialState.postCreateNewRoleMenus;
    },

    getRoleMenuDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getRoleMenuDetailSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data } = action.payload as GetRoleMenusResponse;
      state.isLoading = false;
      state.roleMenuDetail.data = { ...state.roleMenuDetail.data, ...data };
    },
    getRoleMenuDetailFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },

    updateRoleMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateRoleMenuSuccess: (state, action) => {
      const { data } = action.payload;
      state.isLoading = false;
      state.updateRoleMenu.data = data ?? [];
      state.postUpdateRoleMenus = {
        success: true,
        message: "has been updated!",
      };
    },
    updateRoleMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    postUpdateNewRoleMenuClear: (state) => {
      state.postUpdateRoleMenus = initialState.postUpdateRoleMenus;
    },

    deleteRoleMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    deleteRoleMenuSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      state.isLoading = false;
      state.options = { ...action.payload };
    },
    deleteRoleMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    setPostDeleteNewRoleMenu: (state, action) => {
      state.postDeleteRoleMenus = {
        success: true,
        message: "has been successfully removed!",
        menuName: action.payload,
      };
    },
    postDeleteNewRoleMenuClear: (state) => {
      state.postDeleteRoleMenus = {
        success: false,
        message: "",
        menuName: "",
      };
    },

    getDropdownRoleMenusFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getDropdownRoleMenusSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetRoleMenusResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.dropdownRoleMenus.options = {
        ...state.options,
        page,
        limit,
        totalData,
        totalPage,
      };
      state.dropdownRoleMenus.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownRoleMenusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },

    loadmoreDropdownRoleMenusFetch: (
      state,
      action: PayloadAction<BaseType>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    loadmoreDropdownRoleMenusSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetRoleMenusResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.dropdownRoleMenus.options = {
        ...state.options,
        page,
        limit,
        totalData,
        totalPage,
      };
      if (data) {
        state.dropdownRoleMenus.data = [
          ...state.dropdownRoleMenus.data,
          ...data,
        ];
      }
      state.isLoading = false;
    },
    loadmoreDropdownRoleMenusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    setFleetGroupIdOnRoleMenu: (state, action) => {
      state.fleetGroupId = action.payload;
    },
    setRoleIdOnRoleMenu: (state, action) => {
      state.roleId = action.payload;
    },

    getAllRoleMenusFetch: (
      state,
      action: PayloadAction<BaseType & { roleId: string }>,
    ) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getAllRoleMenusSuccess: (
      state,
      action: PayloadAction<GetRoleMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetRoleMenusResponse;
      const { page, limit } = pagination as PaginationType;
      if (data) {
        state.allRoleMenus.data = data.map((r: RoleMenu, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...r, no };
        });
      }
      state.isLoading = false;
    },
    getAllRoleMenusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    clearAllRoleMenus: (state) => {
      state.isLoading = false;
      state.allRoleMenus.data = [];
      state.options = initialState.options;
    },
  },
});

export const {
  getRoleMenusFetch,
  getRoleMenusSuccess,
  getRoleMenusFailure,
  getRoleMenusAutoCompleteFetch,
  getRoleMenusAutoCompleteSuccess,
  getRoleMenusAutoCompleteFailure,
  createNewRoleMenuFetch,
  createNewRoleMenuSuccess,
  createNewRoleMenuFailure,
  postCreateNewRoleMenuClear,
  getRoleMenuDetailFetch,
  getRoleMenuDetailSuccess,
  getRoleMenuDetailFailure,
  updateRoleMenuFetch,
  updateRoleMenuSuccess,
  updateRoleMenuFailure,
  postUpdateNewRoleMenuClear,
  deleteRoleMenuFetch,
  deleteRoleMenuSuccess,
  deleteRoleMenuFailure,
  postDeleteNewRoleMenuClear,
  getDropdownRoleMenusFetch,
  getDropdownRoleMenusSuccess,
  getDropdownRoleMenusFailure,
  loadmoreDropdownRoleMenusFetch,
  loadmoreDropdownRoleMenusSuccess,
  loadmoreDropdownRoleMenusFailure,
  setFleetGroupIdOnRoleMenu,
  setRoleIdOnRoleMenu,
  getAllRoleMenusFetch,
  getAllRoleMenusSuccess,
  getAllRoleMenusFailure,
  clearAllRoleMenus,
} = roleMenuState.actions;

export const roleMenuActions = roleMenuState.actions;
export const roleMenuReducers = roleMenuState.reducer;
export default roleMenuReducers;
