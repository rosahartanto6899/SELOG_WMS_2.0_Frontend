import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface VehicleTypesAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface VehicleTypeState {
  isLoading?: boolean;
  error?: Error | string | null;
  data: VehicleType[];
  options?: BaseType;
  autoComplete: VehicleTypesAutoComplete;
  vehicleTypeDetail: { data: VehicleType };
  createNewVehicleType: CreateNewVehicleTypePayload;
  updateVehicleType: UpdateVehicleTypePayload;
  deleteVehicleType: DeleteVehicleTypePayload;
  dropdownVehicleTypes: {
    data: VehicleTypeDropdown[];
    options?: GetVehicleTypeDropdownPayload;
  };
}

export interface VehicleType {
  no?: number;
  id?: string;
  name?: string;
  code?: string;
  group?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface VehicleTypeDropdown {
  id?: string;
  name?: string;
  group?: string;
}

export interface GetVehicleTypeDropdownPayload {
  search?: string;
  show?: string;
}

export interface CreateNewVehicleTypePayload {
  name?: string;
  code?: string;
  group?: string;
}

export interface UpdateVehicleTypePayload {
  id?: string;
  name?: string;
  code?: string;
  group?: string;
}

export interface DeleteVehicleTypePayload {
  id?: string;
  name?: string;
  options?: BaseType;
}

export interface GetVehicleTypesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: VehicleType[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const vehicleTypeTypes = {
  GET_VEHICLE_TYPES: "vehicleTypes/getVehicleTypes",
  GET_VEHICLE_TYPES_FETCH: "vehicleTypes/getVehicleTypesFetch",
  GET_VEHICLE_TYPES_SUCCESS: "vehicleTypes/getVehicleTypesSuccess",
  GET_VEHICLE_TYPES_FAILURE: "vehicleTypes/getVehicleTypesFailure",

  GET_VEHICLE_TYPES_AUTOCOMPLETE: "vehicleTypes/getVehicleTypesAutoComplete",
  GET_VEHICLE_TYPES_AUTOCOMPLETE_FETCH:
    "vehicleTypes/getVehicleTypesAutoCompleteFetch",
  GET_VEHICLE_TYPES_AUTOCOMPLETE_SUCCESS:
    "vehicleTypes/getVehicleTypesAutoCompleteSuccess",
  GET_VEHICLE_TYPES_AUTOCOMPLETE_FAILURE:
    "vehicleTypes/getVehicleTypesAutoCompleteFailure",

  GET_VEHICLE_TYPE_DETAIL: "vehicleTypes/getVehicleTypeDetail",
  GET_VEHICLE_TYPE_DETAIL_FETCH: "vehicleTypes/getVehicleTypeDetailFetch",
  GET_VEHICLE_TYPE_DETAIL_SUCCESS: "vehicleTypes/getVehicleTypeDetailSuccess",
  GET_VEHICLE_TYPE_DETAIL_FAILURE: "vehicleTypes/getVehicleTypeDetailFailure",

  CREATE_VEHICLE_TYPE: "vehicleTypes/createNewVehicleType",
  CREATE_VEHICLE_TYPE_FETCH: "vehicleTypes/createNewVehicleTypeFetch",
  CREATE_VEHICLE_TYPE_SUCCESS: "vehicleTypes/createNewVehicleTypeSuccess",
  CREATE_VEHICLE_TYPE_FAILURE: "vehicleTypes/createNewVehicleTypeFailure",

  UPDATE_VEHICLE_TYPE: "vehicleTypes/updateVehicleType",
  UPDATE_VEHICLE_TYPE_FETCH: "vehicleTypes/updateVehicleTypeFetch",
  UPDATE_VEHICLE_TYPE_SUCCESS: "vehicleTypes/updateVehicleTypeSuccess",
  UPDATE_VEHICLE_TYPE_FAILURE: "vehicleTypes/updateVehicleTypeFailure",

  DELETE_VEHICLE_TYPE: "vehicleTypes/deleteVehicleType",
  DELETE_VEHICLE_TYPE_FETCH: "vehicleTypes/deleteVehicleTypeFetch",
  DELETE_VEHICLE_TYPE_SUCCESS: "vehicleTypes/deleteVehicleTypeSuccess",
  DELETE_VEHICLE_TYPE_FAILURE: "vehicleTypes/deleteVehicleTypeFailure",

  GET_DROPDOWN_VEHICLE_TYPES: "vehicleTypes/getDropdownVehicleTypes",
  GET_DROPDOWN_VEHICLE_TYPES_FETCH: "vehicleTypes/getDropdownVehicleTypesFetch",
  GET_DROPDOWN_VEHICLE_TYPES_SUCCESS:
    "vehicleTypes/getDropdownVehicleTypesSuccess",
  GET_DROPDOWN_VEHICLE_TYPES_FAILURE:
    "vehicleTypes/getDropdownVehicleTypesFailure",

  // Clear actions
  GET_VEHICLE_TYPES_AUTOCOMPLETE_CLEAR:
    "vehicleTypes/getVehicleTypesAutoCompleteClear",
  GET_VEHICLE_TYPE_DETAIL_CLEAR: "vehicleTypes/getVehicleTypeDetailClear",
  CREATE_VEHICLE_TYPE_CLEAR: "vehicleTypes/createNewVehicleTypeClear",
  UPDATE_VEHICLE_TYPE_CLEAR: "vehicleTypes/updateVehicleTypeClear",
  DELETE_VEHICLE_TYPE_CLEAR: "vehicleTypes/deleteVehicleTypeClear",
};
