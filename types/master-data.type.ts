import { BaseState } from "./base.type";

export interface MasterDataState {
  getAreas: BaseState<MasterDataItem[]>;
  getOrderPriorities: BaseState<MasterDataItem[]>;
  getUnitCapacityStatuses: BaseState<MasterDataItem[]>;
  getDriverCapacityStatuses: BaseState<MasterDataItem[]>;
  getEmployeeStatuses: BaseState<MasterDataItem[]>;
  getTierLevels: BaseState<MasterDataItem[]>;
  getShipmentConfirmationStatuses: BaseState<MasterDataItem[]>;
  getVoDCategories: BaseState<MasterDataItem[]>;
  getVoDStatuses: BaseState<MasterDataItem[]>;
  getVoDTypes: BaseState<MasterDataItem[]>;
  getShipmentCancellationReasons: BaseState<MasterDataItem[]>;
  getLocationReverse: BaseState<string, LocationReversePayload>;
  getJourneyStatuses: BaseState<MasterDataItem[]>;
}

export interface MasterDataItem {
  id: string;
  name: string;
  color?: string;
}

export interface MasterDataResponse {
  status?: boolean;
  message?: string;
  data?: MasterDataItem[];
  code?: string;
  eTag?: string;
}

export interface LocationReversePayload {
  latitude?: string;
  longitude?: string;
}

export interface LocationReverseResponse {
  status?: boolean;
  message?: string;
  data?: string;
  code?: string;
  eTag?: string;
}

export interface ShipmentType {
  id: string;
  name: string;
}

export interface OwnershipType {
  id: string;
  name: string;
}

export interface IEmployeeStatus {
  id: string;
  name: string;
}

export interface DriverStatus {
  id: string;
  name: string;
}

export interface ShipmentTypesState {
  data: ShipmentType[];
  isLoading: boolean;
  error?: Error | string | null;
}

export interface IEmployeeStatusState {
  data: IEmployeeStatus[];
  isLoading: boolean;
  error?: Error | string | null;
}

export interface DriverStatusState {
  data: DriverStatus[];
  isLoading: boolean;
  error?: Error | string | null;
}

export interface OwnershipTypesState {
  data: OwnershipType[];
  isLoading: boolean;
  error?: Error | string | null;
}

export const masterDataTypes = {
  GET_SHIPMENT_TYPES: "shipmentTypes/getShipmentTypes",
  GET_SHIPMENT_TYPES_FETCH: "shipmentTypes/getShipmentTypesFetch",
  GET_SHIPMENT_TYPES_SUCCESS: "shipmentTypes/getShipmentTypesSuccess",
  GET_SHIPMENT_TYPES_FAILURE: "shipmentTypes/getShipmentTypesFailure",

  GET_OWNERSHIP_TYPES: "ownershipTypes/getOwnershipTypes",
  GET_OWNERSHIP_TYPES_FETCH: "ownershipTypes/getOwnershipTypesFetch",
  GET_OWNERSHIP_TYPES_SUCCESS: "ownershipTypes/getOwnershipTypesSuccess",
  GET_OWNERSHIP_TYPES_FAILURE: "ownershipTypes/getOwnershipTypesFailure",

  GET_EMPLOYEE_STATUS: "employeeStatus/getEmployeeStatus",
  GET_EMPLOYEE_STATUS_TYPES_FETCH: "employeeStatus/getEmployeeStatusFetch",
  GET_EMPLOYEE_STATUS_TYPES_SUCCESS: "employeeStatus/getEmployeeStatusSuccess",
  GET_EMPLOYEE_STATUS_TYPES_FAILURE: "employeeStatus/getEmployeeStatusFailure",

  GET_DRIVER_STATUS: "driverStatus/getDriverStatus",
  GET_DRIVER_STATUS_FETCH: "driverStatus/getDriverStatusFetch",
  GET_DRIVER_STATUS_SUCCESS: "driverStatus/getDriverStatusSuccess",
  GET_DRIVER_STATUS_FAILURE: "driverStatus/getDriverStatusFailure",

  GET_AREAS: "masterData/getAreas",
  GET_AREAS_FETCH: "masterData/getAreasFetch",
  GET_AREAS_SUCCESS: "masterData/getAreasSuccess",
  GET_AREAS_FAILURE: "masterData/getAreasFailure",

  GET_ORDER_PRIORITIES: "masterData/getOrderPriorities",
  GET_ORDER_PRIORITIES_FETCH: "masterData/getOrderPrioritiesFetch",
  GET_ORDER_PRIORITIES_SUCCESS: "masterData/getOrderPrioritiesSuccess",
  GET_ORDER_PRIORITIES_FAILURE: "masterData/getOrderPrioritiesFailure",

  GET_UNIT_CAPACITY_STATUSES: "masterData/getUnitCapacityStatuses",
  GET_UNIT_CAPACITY_STATUSES_FETCH: "masterData/getUnitCapacityStatusesFetch",
  GET_UNIT_CAPACITY_STATUSES_SUCCESS:
    "masterData/getUnitCapacityStatusesSuccess",
  GET_UNIT_CAPACITY_STATUSES_FAILURE:
    "masterData/getUnitCapacityStatusesFailure",

  GET_DRIVER_CAPACITY_STATUSES: "masterData/getDriverCapacityStatuses",
  GET_DRIVER_CAPACITY_STATUSES_FETCH:
    "masterData/getDriverCapacityStatusesFetch",
  GET_DRIVER_CAPACITY_STATUSES_SUCCESS:
    "masterData/getDriverCapacityStatusesSuccess",
  GET_DRIVER_CAPACITY_STATUSES_FAILURE:
    "masterData/getDriverCapacityStatusesFailure",

  GET_EMPLOYEE_STATUSES: "masterData/getEmployeeStatuses",
  GET_EMPLOYEE_STATUSES_FETCH: "masterData/getEmployeeStatusesFetch",
  GET_EMPLOYEE_STATUSES_SUCCESS: "masterData/getEmployeeStatusesSuccess",
  GET_EMPLOYEE_STATUSES_FAILURE: "masterData/getEmployeeStatusesFailure",

  GET_TIER_LEVELS: "masterData/getTierLevels",
  GET_TIER_LEVELS_FETCH: "masterData/getTierLevelsFetch",
  GET_TIER_LEVELS_SUCCESS: "masterData/getTierLevelsSuccess",
  GET_TIER_LEVELS_FAILURE: "masterData/getTierLevelsFailure",

  GET_SHIPMENT_CONFIRMATION_STATUSES:
    "masterData/getShipmentConfirmationStatuses",
  GET_SHIPMENT_CONFIRMATION_STATUSES_FETCH:
    "masterData/getShipmentConfirmationStatusesFetch",
  GET_SHIPMENT_CONFIRMATION_STATUSES_SUCCESS:
    "masterData/getShipmentConfirmationStatusesSuccess",
  GET_SHIPMENT_CONFIRMATION_STATUSES_FAILURE:
    "masterData/getShipmentConfirmationStatusesFailure",

  GET_VOD_CATEGORIES: "masterData/getVoDCategories",
  GET_VOD_CATEGORIES_FETCH: "masterData/getVoDCategoriesFetch",
  GET_VOD_CATEGORIES_SUCCESS: "masterData/getVoDCategoriesSuccess",
  GET_VOD_CATEGORIES_FAILURE: "masterData/getVoDCategoriesFailure",

  GET_VOD_STATUSES: "masterData/getVoDStatuses",
  GET_VOD_STATUSES_FETCH: "masterData/getVoDStatusesFetch",
  GET_VOD_STATUSES_SUCCESS: "masterData/getVoDStatusesSuccess",
  GET_VOD_STATUSES_FAILURE: "masterData/getVoDStatusesFailure",

  GET_VOD_TYPES: "masterData/getVoDTypes",
  GET_VOD_TYPES_FETCH: "masterData/getVoDTypesFetch",
  GET_VOD_TYPES_SUCCESS: "masterData/getVoDTypesSuccess",
  GET_VOD_TYPES_FAILURE: "masterData/getVoDTypesFailure",

  GET_SHIPMENT_CANCELLATION_REASONS:
    "masterData/getShipmentCancellationReasons",
  GET_SHIPMENT_CANCELLATION_REASONS_FETCH:
    "masterData/getShipmentCancellationReasonsFetch",
  GET_SHIPMENT_CANCELLATION_REASONS_SUCCESS:
    "masterData/getShipmentCancellationReasonsSuccess",
  GET_SHIPMENT_CANCELLATION_REASONS_FAILURE:
    "masterData/getShipmentCancellationReasonsFailure",

  GET_LOCATION_REVERSE: "masterData/getLocationReverse",
  GET_LOCATION_REVERSE_FETCH: "masterData/getLocationReverseFetch",
  GET_LOCATION_REVERSE_SUCCESS: "masterData/getLocationReverseSuccess",
  GET_LOCATION_REVERSE_FAILURE: "masterData/getLocationReverseFailure",

  GET_JOURNEY_STATUSES: "masterData/getJourneyStatuses",
  GET_JOURNEY_STATUSES_FETCH: "masterData/getJourneyStatusesFetch",
  GET_JOURNEY_STATUSES_SUCCESS: "masterData/getJourneyStatusesSuccess",
  GET_JOURNEY_STATUSES_FAILURE: "masterData/getJourneyStatusesFailure",
};
