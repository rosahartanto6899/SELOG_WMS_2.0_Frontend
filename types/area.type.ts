import { BaseType, PaginationType } from "@sera-types/base.type";

export interface Area {
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

export interface GetAreasResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Area[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface AreaState {
  data?: Area[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownAreas: {
    data: Area[];
  };
}

export const areaTypes = {
  GET_DROPDOWN_AREAS: "areas/getDropdownAreas",
  GET_DROPDOWN_AREAS_FETCH: "areas/getDropdownAreasFetch",
  GET_DROPDOWN_AREAS_SUCCESS: "areas/getDropdownAreasSuccess",
  GET_DROPDOWN_AREAS_FAILURE: "areas/getDropdownAreasFailure",
};
