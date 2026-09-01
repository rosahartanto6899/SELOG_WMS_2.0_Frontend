import {
  AutoCompleteType,
  BaseType,
  PaginationType,
} from "@sera-types/base.type";

import { City } from "./cities.type";
import { Customer } from "./customer.type";
import { District } from "./districts.type";
import { Province } from "./provinces.type";

export interface Location {
  no?: number;
  id?: string;
  name?: string;
  type?: string;
  address?: string;
  province?: Province;
  city?: City;
  district?: District;
  area?: string;
  coordinate?: string;
  customer?: Customer;
  customerId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface GetLocationsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Location[];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface LocationsAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface LocationState {
  data?: Location[];
  saveState?: boolean;
  autoComplete: LocationsAutoComplete;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownLocations: {
    isSuccess: boolean;
    data: Location[];
    payload: DropdownLocationPayload;
  };
  createNewLocation: {
    data: GetLocationsResponse[];
  };
  locationDetail: {
    data: Location;
  };
  updateLocation: {
    data: GetLocationsResponse[];
  };
  postCreateNewLocation: CreateNewLocationPayload;
  postUpdateLocation: UpdateLocationPayload;
  postDeleteLocation: DeleteLocationPayload;
}

export interface CreateNewLocationPayload {
  code: string;
  name: string;
  province: string;
  area: string;
  address: string;
  coordinate: string;
  type: string;
}

export interface UpdateLocationPayload {
  id: string;
  code: string;
  name: string;
  province: string;
  area: string;
  address: string;
  coordinate: string;
  type: string;
}

export interface DeleteLocationPayload {
  id: string;
  name: string;
  options?: BaseType;
}

export interface DropdownLocationPayload {
  type?: string;
}

export const locationTypes = {
  GET_LOCATIONS: "locations/getLocations",
  GET_LOCATIONS_FETCH: "locations/getLocationsFetch",
  GET_LOCATIONS_SUCCESS: "locations/getLocationsSuccess",
  GET_LOCATIONS_FAILURE: "locations/getLocationsFailure",

  GET_LOCATION_DETAIL: "locations/getLocationDetail",
  GET_LOCATION_DETAIL_FETCH: "locations/getLocationDetailFetch",
  GET_LOCATION_DETAIL_SUCCESS: "locations/getLocationDetailSuccess",
  GET_LOCATION_DETAIL_FAILURE: "locations/getLocationDetailFailure",

  CREATE_LOCATION: "locations/createNewLocation",
  CREATE_LOCATION_FETCH: "locations/createNewLocationFetch",
  CREATE_LOCATION_SUCCESS: "locations/createNewLocationSuccess",
  CREATE_LOCATION_FAILURE: "locations/createNewLocationFailure",

  UPDATE_LOCATION: "locations/updateLocation",
  UPDATE_LOCATION_FETCH: "locations/updateLocationFetch",
  UPDATE_LOCATION_SUCCESS: "locations/updateLocationSuccess",
  UPDATE_LOCATION_FAILURE: "locations/updateLocationFailure",

  DELETE_LOCATION: "locations/deleteLocation",
  DELETE_LOCATION_FETCH: "locations/deleteLocationFetch",
  DELETE_LOCATION_SUCCESS: "locations/deleteLocationSuccess",
  DELETE_LOCATION_FAILURE: "locations/deleteLocationFailure",

  GET_LOCATIONS_AUTOCOMPLETE: "locations/getLocationsAutoComplete",
  GET_LOCATIONS_AUTOCOMPLETE_FETCH: "locations/getLocationsAutoCompleteFetch",
  GET_LOCATIONS_AUTOCOMPLETE_SUCCESS:
    "locations/getLocationsAutoCompleteSuccess",
  GET_LOCATIONS_AUTOCOMPLETE_FAILURE:
    "locations/getLocationsAutoCompleteFailure",

  GET_DROPDOWN_LOCATIONS: "locations/getDropdownLocations",
  GET_DROPDOWN_LOCATIONS_FETCH: "locations/getDropdownLocationsFetch",
  GET_DROPDOWN_LOCATIONS_SUCCESS: "locations/getDropdownLocationsSuccess",
  GET_DROPDOWN_LOCATIONS_FAILURE: "locations/getDropdownLocationsFailure",
};
