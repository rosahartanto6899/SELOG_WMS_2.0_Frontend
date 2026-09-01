import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface BusinessAreasAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface BusinessAreaState {
  isLoading?: boolean;
  error?: Error | string | null;
  data: BusinessArea[];
  options?: BaseType;
  autoComplete: BusinessAreasAutoComplete;
  businessAreaDetail: { data: BusinessArea };
  createNewBusinessArea: CreateNewBusinessAreaPayload;
  updateBusinessArea: UpdateBusinessAreaPayload;
  deleteBusinessArea: DeleteBusinessAreaPayload;
  dropdownBusinessAreas: {
    data: BusinessAreaDropdown[];
    options?: GetBusinessAreaDropdownPayload;
  };
}

export interface BusinessArea {
  id?: string;
  no?: number;
  name?: string;
  code?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface BusinessAreaDropdown {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  companyId?: string;
  customer?: { id?: string; name?: string };
}

export interface GetBusinessAreaDropdownPayload {
  search?: string;
  show?: string;
}

export interface CreateNewBusinessAreaPayload {
  name?: string;
}

export interface UpdateBusinessAreaPayload {
  id?: string;
  name?: string;
}
export interface DeleteBusinessAreaPayload {
  id?: string;
  name?: string;
  options?: BaseType;
}

export interface GetBusinessAreasResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: BusinessArea[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const businessAreaTypes = {
  GET_BUSINESS_AREAS: "businessAreas/getBusinessAreas",
  GET_BUSINESS_AREAS_FETCH: "businessAreas/getBusinessAreasFetch",
  GET_BUSINESS_AREAS_SUCCESS: "businessAreas/getBusinessAreasSuccess",
  GET_BUSINESS_AREAS_FAILURE: "businessAreas/getBusinessAreasFailure",

  GET_BUSINESS_AREAS_AUTOCOMPLETE: "businessAreas/getBusinessAreasAutoComplete",
  GET_BUSINESS_AREAS_AUTOCOMPLETE_FETCH:
    "businessAreas/getBusinessAreasAutoCompleteFetch",
  GET_BUSINESS_AREAS_AUTOCOMPLETE_SUCCESS:
    "businessAreas/getBusinessAreasAutoCompleteSuccess",
  GET_BUSINESS_AREAS_AUTOCOMPLETE_FAILURE:
    "businessAreas/getBusinessAreasAutoCompleteFailure",

  GET_BUSINESS_AREA_DETAIL: "businessAreas/getBusinessAreaDetail",
  GET_BUSINESS_AREA_DETAIL_FETCH: "businessAreas/getBusinessAreaDetailFetch",
  GET_BUSINESS_AREA_DETAIL_SUCCESS:
    "businessAreas/getBusinessAreaDetailSuccess",
  GET_BUSINESS_AREA_DETAIL_FAILURE:
    "businessAreas/getBusinessAreaDetailFailure",

  CREATE_BUSINESS_AREA: "businessAreas/createNewBusinessArea",
  CREATE_BUSINESS_AREA_FETCH: "businessAreas/createNewBusinessAreaFetch",
  CREATE_BUSINESS_AREA_SUCCESS: "businessAreas/createNewBusinessAreaSuccess",
  CREATE_BUSINESS_AREA_FAILURE: "businessAreas/createNewBusinessAreaFailure",

  UPDATE_BUSINESS_AREA: "businessAreas/updateBusinessArea",
  UPDATE_BUSINESS_AREA_FETCH: "businessAreas/updateBusinessAreaFetch",
  UPDATE_BUSINESS_AREA_SUCCESS: "businessAreas/updateBusinessAreaSuccess",
  UPDATE_BUSINESS_AREA_FAILURE: "businessAreas/updateBusinessAreaFailure",

  DELETE_BUSINESS_AREA: "businessAreas/deleteBusinessArea",
  DELETE_BUSINESS_AREA_FETCH: "businessAreas/deleteBusinessAreaFetch",
  DELETE_BUSINESS_AREA_SUCCESS: "businessAreas/deleteBusinessAreaSuccess",
  DELETE_BUSINESS_AREA_FAILURE: "businessAreas/deleteBusinessAreaFailure",

  GET_DROPDOWN_BUSINESS_AREAS: "businessAreas/getDropdownBusinessAreas",
  GET_DROPDOWN_BUSINESS_AREAS_FETCH:
    "businessAreas/getDropdownBusinessAreasFetch",
  GET_DROPDOWN_BUSINESS_AREAS_SUCCESS:
    "businessAreas/getDropdownBusinessAreasSuccess",
  GET_DROPDOWN_BUSINESS_AREAS_FAILURE:
    "businessAreas/getDropdownBusinessAreasFailure",
};
