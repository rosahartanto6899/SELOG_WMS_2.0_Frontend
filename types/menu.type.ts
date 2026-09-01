import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface Menu {
  id?: string;
  key?: number;
  menuName?: string;
  parentId?: string;
  menuIcon?: string;
  menuLink?: string;
  menuOrder?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface MenuDropdown {
  code?: string;
  label?: number;
  level?: string;
  parentId?: string;
  parentName?: string;
  value?: string;
}

export interface Menus extends Menu {
  parent?: Menu;
  children?: Menu[];
}

export interface GetMenusResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Menus[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface MenuAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface MenuState {
  data?: Menus[];
  autoComplete?: MenuAutoComplete;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownParentMenus: { data: Menus[] };
  dropdownMenus: { data: MenuDropdown[] };
  menuDetail: { data: Menus };
  createNewMenu: CreateNewMenuPayload;
  updateMenu: UpdateMenuPayload;
  deleteMenu: DeleteMenuPayload;
}

export interface CreateNewMenuPayload {
  menuName: string;
  parentId?: string;
  menuIcon?: string;
  menuLink?: string;
  menuOrder?: number;
}

export interface UpdateMenuPayload {
  id: string;
  menuName: string;
  parentId?: string;
  menuIcon?: string;
  menuLink?: string;
  menuOrder?: number;
}

export interface DeleteMenuPayload {
  id: string;
  menuName: string;
  options: BaseType;
}

export interface PermissionUtilsDetailType {
  id?: string;
  roleId?: string;
  menuId?: string;
  isRead?: boolean;
  isCreate?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
  isExport?: boolean;
  fleetGroupId?: string;
  levelsId?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  parentId?: string;
}

export interface PermissionUtilsType {
  id?: string;
  menuName?: string;
  parentId?: string;
  menuIcon?: string;
  menuLink?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  data?: PermissionUtilsDetailType;
  child: PermissionUtilsType[] | [];
}

export interface SavedAccessMenus {
  status?: boolean;
  message?: string;
  code?: string;
  eTag?: string;
  fleetGroupId?: string;
  role_id?: string;
  user_id?: string;
  data?: PermissionUtilsType[] | [];
}

export const menuTypes = {
  GET_MENUS: "menus/getMenus",
  GET_MENUS_FETCH: "menus/getMenusFetch",
  GET_MENUS_SUCCESS: "menus/getMenusSuccess",
  GET_MENUS_FAILURE: "menus/getMenusFailure",

  GET_MENU_DETAIL: "menus/getMenuDetail",
  GET_MENU_DETAIL_FETCH: "menus/getMenuDetailFetch",
  GET_MENU_DETAIL_SUCCESS: "menus/getMenuDetailSuccess",
  GET_MENU_DETAIL_FAILURE: "menus/getMenuDetailFailure",

  CREATE_MENU: "menus/createNewMenu",
  CREATE_MENU_FETCH: "menus/createNewMenuFetch",
  CREATE_MENU_SUCCESS: "menus/createNewMenuSuccess",
  CREATE_MENU_FAILURE: "menus/createNewMenuFailure",

  UPDATE_MENU: "menus/updateMenu",
  UPDATE_MENU_FETCH: "menus/updateMenuFetch",
  UPDATE_MENU_SUCCESS: "menus/updateMenuSuccess",
  UPDATE_MENU_FAILURE: "menus/updateMenuFailure",

  DELETE_MENU: "menus/deleteMenu",
  DELETE_MENU_FETCH: "menus/deleteMenuFetch",
  DELETE_MENU_SUCCESS: "menus/deleteMenuSuccess",
  DELETE_MENU_FAILURE: "menus/deleteMenuFailure",

  GET_MENUS_AUTOCOMPLETE_FETCH: "menus/getMenusAutoCompleteFetch",
  GET_MENUS_AUTOCOMPLETE_SUCCESS: "menus/getMenusAutoCompleteSuccess",
  GET_MENUS_AUTOCOMPLETE_FAILURE: "menus/getMenusAutoCompleteFailure",

  GET_DROPDOWN_PARENT_MENUS: "menus/getDropdownParentMenus",
  GET_DROPDOWN_PARENT_MENUS_FETCH: "menus/getDropdownParentMenusFetch",
  GET_DROPDOWN_PARENT_MENUS_SUCCESS: "menus/getDropdownParentMenusSuccess",
  GET_DROPDOWN_PARENT_MENUS_FAILURE: "menus/getDropdownParentMenusFailure",

  GET_DROPDOWN_MENUS: "menus/getDropdownMenus",
  GET_DROPDOWN_MENUS_FETCH: "menus/getDropdownMenusFetch",
  GET_DROPDOWN_MENUS_SUCCESS: "menus/getDropdownMenusSuccess",
  GET_DROPDOWN_MENUS_FAILURE: "menus/getDropdownMenusFailure",

  GET_ALL_ROLE_MENUS: "roleMenus/getAllRoleMenus",
};
