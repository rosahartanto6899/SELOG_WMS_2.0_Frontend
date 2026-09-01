import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";

import { City } from "./cities.type";
import { Customer } from "./customer.type";
import { District } from "./districts.type";
import { Province } from "./provinces.type";

export interface OperationDay {
  id?: string;
  day?: string;
  isOpened?: boolean;
  openedHour?: string;
  closedHour?: string;
}
export interface CustomerLocation {
  no?: number;
  id?: string;
  name?: string;
  address?: string;
  coordinate?: string;
  province?: Province;
  city?: City;
  district?: District;
  area?: string;
  operationDays?: OperationDay[];
  customer?: Customer;
  customerId?: string;
  customerName?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface GetCustomerLocationsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: CustomerLocation[];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface CustomerLocationsAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface CustomerLocationState {
  data?: CustomerLocation[];
  saveState?: boolean;
  autoComplete: CustomerLocationsAutoComplete;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownCustomerLocations: {
    data: CustomerLocation[];
    payload: DropdownCustomerLocationPayload;
  };
  createNewCustomerLocation: {
    data: GetCustomerLocationsResponse[];
  };
  customerLocationDetail: {
    isLoading?: boolean;
    data: CustomerLocation;
    error?: Error | string | null;
  };
  updaCustomerLocation: {
    data: GetCustomerLocationsResponse[];
  };
  postCreateNewCustomerLocation: CreateNewCustomerLocationPayload;
  postUpdateCustomerLocation: UpdateCustomerLocationPayload;
  postDeleteCustomerLocation: DeleteCustomerLocationPayload;
}

export interface CreateNewCustomerLocationPayload {
  name: string;
  coordinate: string;
  provinceId: string;
  cityId: string;
  districtId: string;
  area: string;
  address: string;
  customerId: string;
  operationDays: OperationDay[];
}

export interface UpdateCustomerLocationPayload {
  id: string;
  name: string;
  coordinate: string;
  provinceId: string;
  cityId: string;
  districtId: string;
  area: string;
  address: string;
  customerId: string;
  operationDays: OperationDay[];
}

export interface DeleteCustomerLocationPayload {
  id: string;
  name: string;
  options?: BaseType;
}

export interface DropdownCustomerLocationPayload {
  type?: string;
}

export const customerLocationTypes = {
  GET_CUSTOMER_LOCATIONS: "customerLocations/getCustomerLocations",
  GET_CUSTOMER_LOCATIONS_FETCH: "customerLocations/getCustomerLocationsFetch",
  GET_CUSTOMER_LOCATIONS_SUCCESS:
    "customerLocations/getCustomerLocationsSuccess",
  GET_CUSTOMER_LOCATIONS_FAILURE:
    "customerLocations/getCustomerLocationsFailure",

  GET_CUSTOMER_LOCATION_DETAIL: "customerLocations/getCustomerLocationDetail",
  GET_CUSTOMER_LOCATION_DETAIL_FETCH:
    "customerLocations/getCustomerLocationDetailFetch",
  GET_CUSTOMER_LOCATION_DETAIL_SUCCESS:
    "customerLocations/getCustomerLocationDetailSuccess",
  GET_CUSTOMER_LOCATION_DETAIL_FAILURE:
    "customerLocations/getCustomerLocationDetailFailure",

  CREATE_CUSTOMER_LOCATION: "customerLocations/createNewCustomerLocation",
  CREATE_CUSTOMER_LOCATION_FETCH:
    "customerLocations/createNewCustomerLocationFetch",
  CREATE_CUSTOMER_LOCATION_SUCCESS:
    "customerLocations/createNewCustomerLocationSuccess",
  CREATE_CUSTOMER_LOCATION_FAILURE:
    "customerLocations/createNewCustomerLocationFailure",

  UPDATE_CUSTOMER_LOCATION: "customerLocations/updateCustomerLocation",
  UPDATE_CUSTOMER_LOCATION_FETCH:
    "customerLocations/updateCustomerLocationFetch",
  UPDATE_CUSTOMER_LOCATION_SUCCESS:
    "customerLocations/updateCustomerLocationSuccess",
  UPDATE_CUSTOMER_LOCATION_FAILURE:
    "customerLocations/updateCustomerLocationFailure",

  DELETE_CUSTOMER_LOCATION: "customerLocations/deleteCustomerLocation",
  DELETE_CUSTOMER_LOCATION_FETCH:
    "customerLocations/deleteCustomerLocationFetch",
  DELETE_CUSTOMER_LOCATION_SUCCESS:
    "customerLocations/deleteCustomerLocationSuccess",
  DELETE_CUSTOMER_LOCATION_FAILURE:
    "customerLocations/deleteCustomerLocationFailure",

  GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE:
    "customerLocations/getCustomerLocationsAutoComplete",
  GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE_FETCH:
    "customerLocations/getCustomerLocationsAutoCompleteFetch",
  GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE_SUCCESS:
    "customerLocations/getCustomerLocationsAutoCompleteSuccess",
  GET_CUSTOMER_LOCATIONS_AUTOCOMPLETE_FAILURE:
    "customerLocations/getCustomerLocationsAutoCompleteFailure",

  GET_DROPDOWN_CUSTOMER_LOCATIONS:
    "customerLocations/getDropdownCustomerLocations",
  GET_DROPDOWN_CUSTOMER_LOCATIONS_FETCH:
    "customerLocations/getDropdownCustomerLocationsFetch",
  GET_DROPDOWN_CUSTOMER_LOCATIONS_SUCCESS:
    "customerLocations/getDropdownCustomerLocationsSuccess",
  GET_DROPDOWN_CUSTOMER_LOCATIONS_FAILURE:
    "customerLocations/getDropdownCustomerLocationsFailure",
};
