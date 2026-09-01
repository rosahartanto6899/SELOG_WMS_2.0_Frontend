import { BaseType, PaginationType } from "@sera-types/base.type";

export interface Province {
  no?: number;
  id?: string;
  name?: string;
}

export interface GetProvincesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Province[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface ProvinceState {
  data?: Province[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownProvinces: {
    data: Province[];
  };
}

export interface GetProvinceDropdownPayload {
  search?: string;
}

export interface GetProvinceDropdownResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    id?: string;
    province?: string;
    area?: string;
  }[];
  code?: string;
  eTag?: string;
}

export const provinceTypes = {
  GET_DROPDOWN_PROVINCES: "provinces/getDropdownProvinces",
  GET_DROPDOWN_PROVINCES_FETCH: "provinces/getDropdownProvincesFetch",
  GET_DROPDOWN_PROVINCES_SUCCESS: "provinces/getDropdownProvincesSuccess",
  GET_DROPDOWN_PROVINCES_FAILURE: "provinces/getDropdownProvincesFailure",
  GET_DROPDOWN_PROVINCES_CLEAR: "provinces/getDropdownProvincesClear",
};
