import { BaseType, PaginationType } from "@sera-types/base.type";

export interface VehicleGroup {
  no?: number;
  id?: string;
  name?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface GetVehicleGroupsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: VehicleGroup[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface VehicleGroupState {
  data?: VehicleGroup[];
  saveState?: boolean;
  options?: BaseType;
  error?: Error | string | null;
  isLoading?: boolean;
  dropdownVehicleGroups: {
    data: VehicleGroup[];
  };
}

export const vehicleGroupTypes = {
  GET_DROPDOWN_VEHICLE_GROUPS: "vehicleGroups/getDropdownVehicleGroups",
  GET_DROPDOWN_VEHICLE_GROUPS_FETCH:
    "vehicleGroups/getDropdownVehicleGroupsFetch",
  GET_DROPDOWN_VEHICLE_GROUPS_SUCCESS:
    "vehicleGroups/getDropdownVehicleGroupsSuccess",
  GET_DROPDOWN_VEHICLE_GROUPS_FAILURE:
    "vehicleGroups/getDropdownVehicleGroupsFailure",
};
