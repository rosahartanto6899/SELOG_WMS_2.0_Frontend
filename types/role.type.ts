import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";

export interface Role {
  no?: number;
  id?: string;
  roleName?: string;
  numberOfUsers?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface GetRolesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Role[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface RolesAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface RoleState {
  data?: Role[];
  saveState?: boolean;
  autoComplete: RolesAutoComplete;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownRoles: {
    data: Role[];
  };
  createNewRole: {
    data: GetRolesResponse[];
  };
  roleDetail: {
    data: Role;
  };
  updateRole: {
    data: GetRolesResponse[];
  };
  postCreateNewRole: CreateNewRolePayload;
  postUpdateRole: UpdateRolePayload;
  postDeleteRole: UpdateRolePayload;
}

export interface CreateNewRolePayload {
  roleName: string;
}

export interface UpdateRolePayload {
  id: string;
  roleName: string;
}

export interface DeleteRolePayload {
  id: string;
  roleName: string;
  options: BaseType;
}

export const roleTypes = {
  GET_ROLES: "roles/getRoles",
  GET_ROLES_FETCH: "roles/getRolesFetch",
  GET_ROLES_SUCCESS: "roles/getRolesSuccess",
  GET_ROLES_FAILURE: "roles/getRolesFailure",

  GET_ROLE_DETAIL: "roles/getRoleDetail",
  GET_ROLE_DETAIL_FETCH: "roles/getRoleDetailFetch",
  GET_ROLE_DETAIL_SUCCESS: "roles/getRoleDetailSuccess",
  GET_ROLE_DETAIL_FAILURE: "roles/getRoleDetailFailure",

  CREATE_ROLE: "roles/createNewRole",
  CREATE_ROLE_FETCH: "roles/createNewRoleFetch",
  CREATE_ROLE_SUCCESS: "roles/createNewRoleSuccess",
  CREATE_ROLE_FAILURE: "roles/createNewRoleFailure",

  UPDATE_ROLE: "roles/updateRole",
  UPDATE_ROLE_FETCH: "roles/updateRoleFetch",
  UPDATE_ROLE_SUCCESS: "roles/updateRoleSuccess",
  UPDATE_ROLE_FAILURE: "roles/updateRoleFailure",

  DELETE_ROLE: "roles/deleteRole",
  DELETE_ROLE_FETCH: "roles/deleteRoleFetch",
  DELETE_ROLE_SUCCESS: "roles/deleteRoleSuccess",
  DELETE_ROLE_FAILURE: "roles/deleteRoleFailure",

  GET_ROLES_AUTOCOMPLETE_FETCH: "roles/getRolesAutoCompleteFetch",
  GET_ROLES_AUTOCOMPLETE_SUCCESS: "roles/getRolesAutoCompleteSuccess",
  GET_ROLES_AUTOCOMPLETE_FAILURE: "roles/getRolesAutoCompleteFailure",

  GET_DROPDOWN_ROLES: "roles/getDropdownRoles",
  GET_DROPDOWN_ROLES_FETCH: "roles/getDropdownRolesFetch",
  GET_DROPDOWN_ROLES_SUCCESS: "roles/getDropdownRolesSuccess",
  GET_DROPDOWN_ROLES_FAILURE: "roles/getDropdownRolesFailure",
};
