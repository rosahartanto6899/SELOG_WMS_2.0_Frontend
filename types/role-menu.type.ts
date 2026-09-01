import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";

export interface RoleMenu {
  no?: number;
  id?: string;
  isRead?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
  isExport?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  role?: {
    id?: string;
    roleName?: string;
  };
  fleetGroup?: {
    id?: string;
    fleetGroupName?: string;
  };
  menu?: {
    id?: string;
    menuName?: string;
  };
  level?: {
    id?: number;
    levelDescription?: string;
  };
}

export interface RoleMenuDetail {
  no?: number;
  id?: string;
  isRead?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
  isExport?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  roleId?: string;
  menuId?: string;
  levelsId?: number;
}

export interface GetRoleMenusResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: RoleMenu[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface RoleMenusAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface RoleMenusDropdown {
  options: BaseType;
  data: RoleMenu[] | [];
}

export interface RoleMenuState {
  data?: RoleMenu[];
  saveState?: boolean;
  autoComplete: RoleMenusAutoComplete;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownRoleMenus: RoleMenusDropdown;
  createNewRoleMenu: {
    data: GetRoleMenusResponse[];
  };
  roleMenuDetail: {
    data: RoleMenuDetail;
  };
  updateRoleMenu: {
    data: GetRoleMenusResponse[];
  };
  allRoleMenus: {
    data: RoleMenu[] | [];
  };
  roleId: string | null;
  fleetGroupId: string | null;
  postCreateNewRoleMenus: PostCreateNewRoleMenuPayload;
  postUpdateRoleMenus: PostUpdateMenuPayload;
  postDeleteRoleMenus: PostDeleteMenuPayload;
}

export interface PostCreateNewRoleMenuPayload {
  success: boolean;
  message: string;
}

export interface PostUpdateMenuPayload {
  success: boolean;
  message: string;
}

export interface PostDeleteMenuPayload {
  success: boolean;
  message: string;
  menuName: string;
}

export interface RoleMenuPayload {
  roleId?: string;
  menuId?: string;
  isRead: number;
  isCreate: number;
  isUpdate: number;
  isDelete: number;
  isExport?: number;
}

export interface CreateNewRoleMenuPayload extends RoleMenuPayload {
  levelsId?: string;
}

export interface UpdateRoleMenuPayload extends RoleMenuPayload {
  id: string;
  levelsId?: string;
}

export interface DeleteRoleMenuPayload {
  id: string;
  menuName: string;
  options: BaseType;
}

export const roleMenuTypes = {
  GET_ROLE_MENUS: "roleMenus/getRoleMenus",
  GET_ROLE_MENUS_FETCH: "roleMenus/getRoleMenusFetch",
  GET_ROLE_MENUS_SUCCESS: "roleMenus/getRoleMenusSuccess",
  GET_ROLE_MENUS_FAILURE: "roleMenus/getRoleMenusFailure",

  GET_ROLE_MENU_DETAIL: "roleMenus/getRoleMenuDetail",
  GET_ROLE_MENU_DETAIL_FETCH: "roleMenus/getRoleMenuDetailFetch",
  GET_ROLE_MENU_DETAIL_SUCCESS: "roleMenus/getRoleMenuDetailSuccess",
  GET_ROLE_MENU_DETAIL_FAILURE: "roleMenus/getRoleMenuDetailFailure",

  CREATE_ROLE_MENU: "roleMenus/createNewRoleMenu",
  CREATE_ROLE_MENU_FETCH: "roleMenus/createNewRoleMenuFetch",
  CREATE_ROLE_MENU_SUCCESS: "roleMenus/createNewRoleMenuSuccess",
  CREATE_ROLE_MENU_FAILURE: "roleMenus/createNewRoleMenuFailure",

  UPDATE_ROLE_MENU: "roleMenus/updateRoleMenu",
  UPDATE_ROLE_MENU_FETCH: "roleMenus/updateRoleMenuFetch",
  UPDATE_ROLE_MENU_SUCCESS: "roleMenus/updateRoleMenuSuccess",
  UPDATE_ROLE_MENU_FAILURE: "roleMenus/updateRoleMenuFailure",

  DELETE_ROLE_MENU: "roleMenus/deleteRoleMenu",
  DELETE_ROLE_MENU_FETCH: "roleMenus/deleteRoleMenuFetch",
  DELETE_ROLE_MENU_SUCCESS: "roleMenus/deleteRoleMenuSuccess",
  DELETE_ROLE_MENU_FAILURE: "roleMenus/deleteRoleMenuFailure",

  GET_ROLE_MENUS_AUTOCOMPLETE_FETCH: "roleMenus/getRoleMenusAutoCompleteFetch",
  GET_ROLE_MENUS_AUTOCOMPLETE_SUCCESS:
    "roleMenus/getRoleMenusAutoCompleteSuccess",
  GET_ROLE_MENUS_AUTOCOMPLETE_FAILURE:
    "roleMenus/getRoleMenusAutoCompleteFailure",
  CLEAR_ROLE_MENUS_AUTOCOMPLETE: "roleMenus/clearRoleMenusAutoComplete",

  GET_DROPDOWN_ROLE_MENUS: "roleMenus/getDropdownRoleMenus",
  GET_DROPDOWN_ROLE_MENUS_FETCH: "roleMenus/getDropdownRoleMenusFetch",
  GET_DROPDOWN_ROLE_MENUS_SUCCESS: "roleMenus/getDropdownRoleMenusSuccess",
  GET_DROPDOWN_ROLE_MENUS_FAILURE: "roleMenus/getDropdownRoleMenusFailure",

  LOADMORE_DROPDOWN_ROLE_MENUS: "roleMenus/loadmoreDropdownRoleMenus",
  LOADMORE_DROPDOWN_ROLE_MENUS_FETCH:
    "roleMenus/loadmoreDropdownRoleMenusFetch",
  LOADMORE_DROPDOWN_ROLE_MENUS_SUCCESS:
    "roleMenus/loadmoreDropdownRoleMenusSuccess",
  LOADMORE_DROPDOWN_ROLE_MENUS_FAILURE:
    "roleMenus/loadmoreDropdownRoleMenusFailure",

  GET_ALL_ROLE_MENUS: "roleMenus/getAllRoleMenus",
  GET_ALL_ROLE_MENUS_FETCH: "roleMenus/getAllRoleMenusFetch",
  GET_ALL_ROLE_MENUS_SUCCESS: "roleMenus/getAllRoleMenusSuccess",
  GET_ALL_ROLE_MENUS_FAILURE: "roleMenus/getAllRoleMenusFailure",
};
