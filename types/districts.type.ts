import { BaseType, PaginationType } from "@sera-types/base.type";

export interface District {
  no?: number;
  id?: string;
  name?: string;
  area?: string;
  areaGroup?: string;
  cityId?: string;
}

export interface GetDistrictsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: District[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface DistrictState {
  data?: District[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownDistricts: {
    data: District[];
  };
}

export interface GetDistrictDropdownPayload {
  search?: string;
}

export interface GetDistrictDropdownResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    id?: string;
    name?: string;
  }[];
  code?: string;
  eTag?: string;
}

export const districtTypes = {
  GET_DROPDOWN_DISTRICTS: "districts/getDropdownDi\stricts",
  GET_DROPDOWN_DISTRICTS_FETCH: "districts/getDropdownDistrictsFetch",
  GET_DROPDOWN_DISTRICTS_SUCCESS: "districts/getDropdownDistrictsSuccess",
  GET_DROPDOWN_DISTRICTS_FAILURE: "districts/getDropdownDistrictsFailure",
  GET_DROPDOWN_DISTRICTS_CLEAR: "districts/getDropdownDistrictsClear",
};
