import { BaseType, PaginationType } from "@sera-types/base.type";

export interface LocationType {
  no?: number;
  id?: string;
  code?: string;
  name?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface GetLocationTypesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: LocationType[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface LocationTypeState {
  data?: LocationType[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownLocationTypes: {
    data: LocationType[];
  };
}

export const locationTypeTypes = {
  GET_DROPDOWN_LOCATION_TYPES: "locationTypes/getDropdownLocationTypes",
  GET_DROPDOWN_LOCATION_TYPES_FETCH:
    "locationTypes/getDropdownLocationTypesFetch",
  GET_DROPDOWN_LOCATION_TYPES_SUCCESS:
    "locationTypes/getDropdownLocationTypesSuccess",
  GET_DROPDOWN_LOCATION_TYPES_FAILURE:
    "locationTypes/getDropdownLocationTypesFailure",
};
