import { BaseType, PaginationType } from "@sera-types/base.type";

export interface City {
  no?: number;
  id?: string;
  name?: string;
}

export interface GetCitiesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: City[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface CityState {
  data?: City[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownCities: {
    data: City[];
  };
}

export interface GetCityDropdownPayload {
  search?: string;
}

export interface GetCityDropdownResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    id?: string;
    name?: string;
  }[];
  code?: string;
  eTag?: string;
}

export const cityTypes = {
  GET_DROPDOWN_CITIES: "cities/getDropdownCities",
  GET_DROPDOWN_CITIES_FETCH: "cities/getDropdownCitiesFetch",
  GET_DROPDOWN_CITIES_SUCCESS: "cities/getDropdownCitiesSuccess",
  GET_DROPDOWN_CITIES_FAILURE: "cities/getDropdownCitiesFailure",
  GET_DROPDOWN_CITIES_CLEAR: "cities/getDropdownCitiesClear",
};
