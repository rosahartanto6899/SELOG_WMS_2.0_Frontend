/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/menu.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateNewMenuPayload,
  DeleteMenuPayload,
  GetMenusResponse,
  Menus,
  MenuState,
  UpdateMenuPayload,
} from "@sera-types/menu.type";
import { uniqBy } from "lodash";

export const menuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    // Get Menus
    getMenusFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getMenusSuccess: (
      state: MenuState,
      action: PayloadAction<GetMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetMenusResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      // LEVEL 1
      if (data) {
        state.data = data.map((r: Menus, index: number) => {
          const no = (page - 1) * limit + index + 1;
          const data = { ...r, no, key: no };
          // LEVEL 2
          if (data.children && data.children.length > 0) {
            data.children = data.children.map((r2: Menus, index2: number) => {
              const key2 = Number(`${data.key}${index2 + 1}`);
              const dataLevel2 = { ...r2, key: key2 };
              // LEVEL 3
              if (dataLevel2.children && dataLevel2.children.length > 0) {
                dataLevel2.children = dataLevel2.children.map(
                  (r3: Menus, index3: number) => {
                    const key3 = Number(`${dataLevel2.key}${index3 + 1}`);
                    return { ...r3, key: key3 };
                  },
                );
              }
              return dataLevel2;
            });
          }
          return data;
        });
      }
      state.isLoading = false;
    },
    getMenusFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getMenusClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    // Get Menus Auto Complete
    getMenusAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };

      if (state?.autoComplete) {
        state.autoComplete.options.searchBy = action.payload.searchBy;
      }
    },
    getMenusAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetMenusResponse>,
    ) => {
      const { data, pagination } = action.payload as GetMenusResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.autoComplete?.options?.searchBy ?? "menuName";

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
    getMenusAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getMenusAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    // Get Dropdown Parent Menus
    getDropdownParentMenusFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getDropdownParentMenusSuccess: (
      state,
      action: PayloadAction<GetMenusResponse>,
    ) => {
      const { data } = action.payload as GetMenusResponse;
      state.dropdownParentMenus.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownParentMenusFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownParentMenusClear: (state) => {
      state.dropdownParentMenus = initialState.dropdownParentMenus;
    },

    // Get Dropdown Menus
    getDropdownMenusFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    getDropdownMenusSuccess: (
      state,
      action: PayloadAction<GetMenusResponse>,
    ) => {
      const { data } = action.payload as GetMenusResponse;
      state.dropdownMenus.data = data ?? [];
      state.isLoading = false;
    },
    getDropdownMenusFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getDropdownMenusClear: (state) => {
      state.dropdownMenus = initialState.dropdownMenus;
    },

    // Create New Menu
    createNewMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewMenuSuccess: (
      state,
      action: PayloadAction<CreateNewMenuPayload>,
    ) => {
      state.createNewMenu = action.payload || {};
      state.isLoading = false;
    },
    createNewMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    createNewMenuClear: (state) => {
      state.createNewMenu = initialState.createNewMenu;
    },

    // Get Detail Menu
    getMenuDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getMenuDetailSuccess: (state, action: PayloadAction<GetMenusResponse>) => {
      const { data } = action.payload as GetMenusResponse;
      state.menuDetail.data = { ...state.menuDetail.data, ...data };
      state.isLoading = false;
    },
    getMenuDetailFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getMenuDetailClear: (state) => {
      state.menuDetail = initialState.menuDetail;
    },

    // Update Menu
    updateMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateMenuSuccess: (state, action: PayloadAction<UpdateMenuPayload>) => {
      state.updateMenu = action.payload || {};
      state.isLoading = false;
    },
    updateMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    updateMenuClear: (state) => {
      state.updateMenu = initialState.updateMenu;
    },

    // Delete Menu
    deleteMenuFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...state.options, ...action.payload.options };
    },
    deleteMenuSuccess: (state, action: PayloadAction<DeleteMenuPayload>) => {
      state.deleteMenu = action.payload || {};
      state.isLoading = false;
    },
    deleteMenuFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    deleteMenuClear: (state) => {
      state.deleteMenu = initialState.deleteMenu;
    },
  },
});

export const {
  getMenusFetch,
  getMenusSuccess,
  getMenusFailure,
  getMenusClear,
  getMenusAutoCompleteFetch,
  getMenusAutoCompleteSuccess,
  getMenusAutoCompleteFailure,
  getMenusAutoCompleteClear,
  getDropdownParentMenusFetch,
  getDropdownParentMenusSuccess,
  getDropdownParentMenusFailure,
  getDropdownParentMenusClear,
  createNewMenuFetch,
  createNewMenuSuccess,
  createNewMenuFailure,
  createNewMenuClear,
  getMenuDetailFetch,
  getMenuDetailSuccess,
  getMenuDetailFailure,
  getMenuDetailClear,
  updateMenuFetch,
  updateMenuSuccess,
  updateMenuFailure,
  updateMenuClear,
  deleteMenuFetch,
  deleteMenuSuccess,
  deleteMenuFailure,
  deleteMenuClear,
} = menuSlice.actions;

export const menuActions = menuSlice.actions;
export const menuReducers = menuSlice.reducer;
export default menuReducers;
