import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface UserRole {
  id: string;
  name: string;
  description: string;
}

export interface User {
  no?: number;
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  nrp?: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  // roleId?: string;
  // fleetGroupId?: string;
  // fleetGroupName?: string;
  // password?: string;
  // deviceToken?: string;
  // loginAttemptDate?: string;
  // deactivateDate?: string;
  // expiredDate?: string;
  // isInternal?: boolean;
  // lastLogin?: string;
  // isMultipleFleetGroup?: boolean;
  // userFleetGroup?: [];
  // userBranch?: [];
  roles?: UserRole[];
}

export interface GetUsersResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: User[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetUserGradeResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: UserGrade[];
  code?: string;
  eTag?: string;
}

export interface UsersAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface UserState {
  isLoading?: boolean;
  error?: Error | string | null;
  data?: User[];
  options?: BaseType;
  autoComplete?: UsersAutoComplete;
  userDetail: { data: User };
  createNewUser: CreateNewUserPayload;
  updateUser: UpdateUserPayload;
  deleteUser: DeleteUserPayload;
  userGrade: UserGradePayload;
  updateActiveVendor: UpdateActiveVendorResponse;
}

export interface CreateNewUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  nrp?: string;
  roles?: { id: number; warehouses: string[] }[];
  isInternal?: 0 | 1;
  isActive?: 0 | 1;
  warehouses?: string[];
}

export interface UpdateUserPayload {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  nrp?: string;
  roles?: { id: number; warehouses: string[] }[];
  isActive?: boolean;
}

export interface DeleteUserPayload {
  id?: string;
  name?: string;
  options?: BaseType;
}

export interface UserGradePayload {
  isLoading: boolean;
  isSuccess: boolean;
  error?: Error | string | null;
  data: UserGrade[];
}

export interface UpdateActiveVendorResponse {
  success: boolean;
  error?: Error | string | null | boolean;
  data: UpdateActiveVendorPayload;
}

export interface UserGrade {
  id: string;
  name: string;
}

export interface UpdateActiveVendorPayload {
  id: string;
  status: string;
  name?: string;
  reactivatedAt?: string;
}

export const userTypes = {
  GET_USERS: "users/getUsers",
  GET_USERS_FETCH: "users/getUsersFetch",
  GET_USERS_SUCCESS: "users/getUsersSuccess",
  GET_USERS_FAILURE: "users/getUsersFailure",

  GET_USERS_AUTOCOMPLETE_FETCH: "users/getUsersAutoCompleteFetch",
  GET_USERS_AUTOCOMPLETE_SUCCESS: "users/getUsersAutoCompleteSuccess",
  GET_USERS_AUTOCOMPLETE_FAILURE: "users/getUsersAutoCompleteFailure",

  GET_USER_DETAIL: "users/getUserDetail",
  GET_USER_DETAIL_FETCH: "users/getUserDetailFetch",
  GET_USER_DETAIL_SUCCESS: "users/getUserDetailSuccess",
  GET_USER_DETAIL_FAILURE: "users/getUserDetailFailure",

  GET_USER_GRADE: "users/getUserGrade",
  GET_USER_GRADE_FETCH: "users/getUserGradeFetch",
  GET_USER_GRADE_SUCCESS: "users/getUserGradeSuccess",
  GET_USER_GRADE_FAILURE: "users/getUserGradeFailure",

  CREATE_USER: "users/createNewUser",
  CREATE_USER_FETCH: "users/createNewUserFetch",
  CREATE_USER_SUCCESS: "users/createNewUserSuccess",
  CREATE_USER_FAILURE: "users/createNewUserFailure",

  UPDATE_USER: "users/updateUser",
  UPDATE_USER_FETCH: "users/updateUserFetch",
  UPDATE_USER_SUCCESS: "users/updateUserSuccess",
  UPDATE_USER_FAILURE: "users/updateUserFailure",

  DELETE_USER: "users/deleteUser",
  DELETE_USER_FETCH: "users/deleteUserFetch",
  DELETE_USER_SUCCESS: "users/deleteUserSuccess",
  DELETE_USER_FAILURE: "users/deleteUserFailure",

  UPDATE_ACTIVE_VENDOR: "users/updateActiveVendor",
  UPDATE_ACTIVE_VENDOR_FETCH: "users/updateActiveVendorFetch",
  UPDATE_ACTIVE_VENDOR_SUCCESS: "users/updateActiveVendorSuccess",
  UPDATE_ACTIVE_VENDOR_FAILURE: "users/updateActiveVendorFailure",
};
