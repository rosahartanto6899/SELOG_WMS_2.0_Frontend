import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface ServiceGroupState extends BaseState<ServiceGroup[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  dropdown: BaseState<ServiceGroup[]>;
  createServiceGroup: BaseState<CreateServiceGroupPayload>;
  detailServiceGroup: BaseState<ServiceGroupDetail, DetailServiceGroupPayload>;
  updateServiceGroup: BaseState<UpdateServiceGroupPayload>;
  deleteServiceGroup: BaseState<DeleteServiceGroupPayload>;
}

export interface ServiceGroup extends BaseResponseData {
  no?: number;
  id?: string;
  name?: string;
  branchName?: string;
}

export interface ServiceGroupDetail extends BaseResponseData {
  id?: string;
  name?: string;
  branchId?: string;
}

export interface CreateServiceGroupPayload {
  name?: string;
  branchId?: string;
}

export interface DetailServiceGroupPayload {
  id?: string;
}

export interface UpdateServiceGroupPayload {
  id?: string;
  name?: string;
  branchId?: string;
}

export interface DeleteServiceGroupPayload {
  id?: string;
  name?: string;
  options?: BaseType;
}

export interface GetServiceGroupsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: ServiceGroup[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetServiceGroupDetailResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: ServiceGroupDetail[];
  code?: string;
  eTag?: string;
}

export const serviceGroupTypes = {
  GET_SERVICE_GROUPS: "serviceGroups/getServiceGroup",
  GET_SERVICE_GROUPS_FETCH: "serviceGroups/getServiceGroupFetch",
  GET_SERVICE_GROUPS_SUCCESS: "serviceGroups/getServiceGroupSuccess",
  GET_SERVICE_GROUPS_FAILURE: "serviceGroups/getServiceGroupFailure",

  GET_SERVICE_GROUPS_AUTOCOMPLETE: "serviceGroups/getServiceGroupAutoComplete",
  GET_SERVICE_GROUPS_AUTOCOMPLETE_FETCH:
    "serviceGroups/getServiceGroupAutoCompleteFetch",
  GET_SERVICE_GROUPS_AUTOCOMPLETE_SUCCESS:
    "serviceGroups/getServiceGroupAutoCompleteSuccess",
  GET_SERVICE_GROUPS_AUTOCOMPLETE_FAILURE:
    "serviceGroups/getServiceGroupAutoCompleteFailure",

  CREATE_SERVICE_GROUP: "serviceGroups/createServiceGroup",
  CREATE_SERVICE_GROUP_FETCH: "serviceGroups/createServiceGroupFetch",
  CREATE_SERVICE_GROUP_SUCCESS: "serviceGroups/createServiceGroupSuccess",
  CREATE_SERVICE_GROUP_FAILURE: "serviceGroups/createServiceGroupFailure",

  DETAIL_SERVICE_GROUP: "serviceGroups/detailServiceGroup",
  DETAIL_SERVICE_GROUP_FETCH: "serviceGroups/detailServiceGroupFetch",
  DETAIL_SERVICE_GROUP_SUCCESS: "serviceGroups/detailServiceGroupSuccess",
  DETAIL_SERVICE_GROUP_FAILURE: "serviceGroups/detailServiceGroupFailure",

  UPDATE_SERVICE_GROUP: "serviceGroups/updateServiceGroup",
  UPDATE_SERVICE_GROUP_FETCH: "serviceGroups/updateServiceGroupFetch",
  UPDATE_SERVICE_GROUP_SUCCESS: "serviceGroups/updateServiceGroupSuccess",
  UPDATE_SERVICE_GROUP_FAILURE: "serviceGroups/updateServiceGroupFailure",

  DELETE_SERVICE_GROUP: "serviceGroups/deleteServiceGroup",
  DELETE_SERVICE_GROUP_FETCH: "serviceGroups/deleteServiceGroupFetch",
  DELETE_SERVICE_GROUP_SUCCESS: "serviceGroups/deleteServiceGroupSuccess",
  DELETE_SERVICE_GROUP_FAILURE: "serviceGroups/deleteServiceGroupFailure",

  GET_SERVICE_GROUPS_DROPDOWN: "serviceGroups/getServiceGroupDropdown",
  GET_SERVICE_GROUPS_DROPDOWN_FETCH:
    "serviceGroups/getServiceGroupDropdownFetch",
  GET_SERVICE_GROUPS_DROPDOWN_SUCCESS:
    "serviceGroups/getServiceGroupDropdownSuccess",
  GET_SERVICE_GROUPS_DROPDOWN_FAILURE:
    "serviceGroups/getServiceGroupDropdownFailure",
};
