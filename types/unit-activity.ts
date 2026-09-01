import { MONTH_NAMES, WEEKS } from "@sera-utils/constants/common";

import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  PaginationType,
} from "./base.type";

export interface UnitActivityState extends BaseState<Unit[], UnitParams> {
  autoComplete: BaseState<AutoCompleteType[]>;
  unitDetail: BaseState<UnitDetail, UnitDetailPayload>;
  pmCheckDetail: BaseState<PMCheckDetail, UnitDetailPayload>;
  getSummary: BaseState<Summary, UnitParams>;
  createMaintenance: BaseState<MaintenancePayload>;
  updateMaintenance: BaseState<MaintenanceUpdatePayload>;
  updatePMCheck: BaseState<PMCheckPayload>;
  lastLocation: BaseState<LastLocation, LocationPayload>;
  maintenanceStatus: BaseState<MaintenanceStatus[]>;
  maintenanceType: BaseState<MaintenanceType[]>;
  maintenanceLevel: BaseState<MaintenanceLevel[]>;
  locationCount: BaseState<LocationCount, UnitDetailPayload>;
}

export interface Unit extends BaseResponseData, UnitInformation {
  no?: number;
}

export interface UnitParams {
  branchId?: string[];
  unitTypeId?: string[];
}

export interface LocationPayload {
  type?: "form";
  vin?: string;
}

export interface UnitDetailPayload {
  id?: string;
}

export interface MaintenancePayload {
  vehicleId?: string;
  status?: string;
  maintenanceType?: string;
  maintenanceCategory?: string;
  maintenanceLevel?: string;
  maintenanceLocationId?: string;
  bookingStartDate?: string;
  bookingEndDate?: string;
  note?: string;
}

export interface MaintenanceUpdatePayload extends MaintenancePayload {
  id?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  maintenanceDetail?: MaintenancePayloadDetail[];
}

export interface MaintenancePayloadDetail {
  activityDateTime?: string;
  activityDetail?: string;
}

export interface PMCheckPayload {
  vehicleId?: string;
  KM?: number;
}

export interface UnitDetail {
  dataMaintenance?: UnitMaintenance;
  dataVehicle?: UnitInformation;
  maintenanceLocationName?: string;
}

export interface PMCheckDetail extends BaseResponseData {
  licensePlate?: string;
  vehicleStatus?: string;
  vehicleDescription?: string | null;
  vehicleYear?: string;
  acquisitionDate?: string;
  licenseExpired?: string;
  kirExpired?: string;
  kirStatus?: string;
  licenseStatus?: string;
  maintenanceLocation?: string;
  type?: { name?: string };
  branchData?: { name?: string }[];
  maintenance?: {
    maintenanceCategory?: string;
    maintenanceLocationId?: string;
    planStartDate?: string;
    actualStartDate?: string;
  }[];
  pmcheck?: PMCheck[];
}

export interface PMCheck extends BaseResponseData {
  KM?: number;
  createdByName?: string;
}

export interface UnitInformation {
  id?: string;
  actualDisposalDate?: string;
  acquisitionDate?: string;
  branchId?: string;
  branchName?: string;
  customerId?: string;
  description?: string | null;
  hasDashcam?: boolean;
  hasObd?: boolean;
  kirExpired?: string;
  kirStatus?: string;
  licenseExpired?: string;
  licenseNumber?: string | null;
  licensePlate?: string;
  licenseStatus?: string;
  maintenanceStatus?: string;
  ownership?: string;
  serviceGroupId?: string | null;
  shipmentType?: string;
  status?: string;
  unitType?: string;
  unitYear?: string;
  vehicleDescription?: string | null;
  vehicleStatus?: string;
  vehicleTypeId?: string;
  vehicleYear?: string;
  vin?: string;
  type?: { name?: string };
}

export interface UnitMaintenance extends BaseResponseData {
  id?: string;
  actualEndDate?: string;
  actualStartDate?: string;
  bookingEndDate?: string;
  bookingStartDate?: string;
  maintenanceCategory?: string;
  maintenanceLevel?: string;
  maintenanceLocationId?: string;
  maintenanceType?: string;
  note?: string | null;
  planEndDate?: string;
  planStartDate?: string;
  vehicleId?: string;
  detailMaintenance: UnitMaintenanceDetail[];
}

export interface UnitMaintenanceDetail extends BaseResponseData {
  id?: string;
  vehicleMaintenanceId?: string;
  activityDateTime?: string;
  activityDetail?: string;
  updatedByName?: string;
}

export interface Summary {
  branchNames?: string[];
  categories?: string[];
  vehicleUnitData?: {
    total?: number;
    planned?: number;
    inProgress?: number;
    delayed?: number;
    finishingUp?: number;
  };
  maintenanceStatus?: {
    [_category: string]: Record<
      string,
      Record<string, number> & { total?: number }
    >;
  };
  forcastUnit?: {
    [_month: (typeof MONTH_NAMES)[number]]: {
      [_week: (typeof WEEKS)[number]]: SummaryForecast;
    };
  };
}

export interface SummaryForecast {
  estPlanMaintenance?: number;
  estUnitReadiness?: number;
  estUnitAvailability?: number;
}

export interface LastLocation {
  vin?: string;
  statusObd?: string;
  lastLocation?: string;
  lastUpdateObd?: string;
}

export interface MaintenanceStatus {
  id?: string;
  name?: string;
  description?: string;
}

export interface MaintenanceType {
  id?: string;
  name?: string;
  description?: string;
  subTypes?: MaintenanceTypeSubType[];
}

export interface MaintenanceLevel {
  id?: string;
  name?: string;
  description?: string;
}

export interface MaintenanceTypeSubType {
  id?: string;
  name?: string;
  sla: MaintenanceTypeSubTypeSLA[];
}

export interface MaintenanceTypeSubTypeSLA {
  id?: string;
  value?: number;
}

export interface LocationCount {
  dataLocationCount?: number;
}

export interface GetUnitResponse {
  status?: boolean;
  message?: string;
  data?: Unit[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetUnitDetailResponse {
  status?: boolean;
  message?: string;
  data?: UnitDetail;
  code?: string;
  eTag?: string;
}

export interface GetPMCheckDetailResponse {
  status?: boolean;
  message?: string;
  data?: PMCheckDetail;
  code?: string;
  eTag?: string;
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetMaintenanceStatusResponse {
  status?: boolean;
  message?: string;
  data?: MaintenanceStatus[];
  code?: string;
  eTag?: string;
}

export interface GetMaintenanceTypeResponse {
  status?: boolean;
  message?: string;
  data?: MaintenanceType[];
  code?: string;
  eTag?: string;
}

export interface GetMaintenanceLevelResponse {
  status?: boolean;
  message?: string;
  data?: MaintenanceLevel[];
  code?: string;
  eTag?: string;
}

export interface GetLastLocationResponse {
  status?: boolean;
  message?: string;
  data?: LastLocation;
  code?: string;
  eTag?: string;
}

export interface GetLocationCountResponse {
  status?: boolean;
  message?: string;
  data?: LocationCount;
  code?: string;
  eTag?: string;
}

export const unitActivityTypes = {
  GET_UNIT: "unitActivity/getUnit",
  GET_UNIT_FETCH: "unitActivity/getUnitFetch",
  GET_UNIT_SUCCESS: "unitActivity/getUnitSuccess",
  GET_UNIT_FAILURE: "unitActivity/getUnitFailure",

  GET_UNIT_AUTOCOMPLETE: "unitActivity/getUnitAutoComplete",
  GET_UNIT_AUTOCOMPLETE_FETCH: "unitActivity/getUnitAutoCompleteFetch",
  GET_UNIT_AUTOCOMPLETE_SUCCESS: "unitActivity/getUnitAutoCompleteSuccess",
  GET_UNIT_AUTOCOMPLETE_FAILURE: "unitActivity/getUnitAutoCompleteFailure",

  GET_UNIT_DETAIL: "unitActivity/getUnitDetail",
  GET_UNIT_DETAIL_FETCH: "unitActivity/getUnitDetailFetch",
  GET_UNIT_DETAIL_SUCCESS: "unitActivity/getUnitDetailSuccess",
  GET_UNIT_DETAIL_FAILURE: "unitActivity/getUnitDetailFailure",

  GET_PM_CHECK_DETAIL: "unitActivity/getPMCheckDetail",
  GET_PM_CHECK_DETAIL_FETCH: "unitActivity/getPMCheckDetailFetch",
  GET_PM_CHECK_DETAIL_SUCCESS: "unitActivity/getPMCheckDetailSuccess",
  GET_PM_CHECK_DETAIL_FAILURE: "unitActivity/getPMCheckDetailFailure",

  GET_SUMMARY: "unitActivity/getSummary",
  GET_SUMMARY_FETCH: "unitActivity/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "unitActivity/getSummarySuccess",
  GET_SUMMARY_FAILURE: "unitActivity/getSummaryFailure",

  CREATE_MAINTENANCE: "unitActivity/createMaintenance",
  CREATE_MAINTENANCE_FETCH: "unitActivity/createMaintenanceFetch",
  CREATE_MAINTENANCE_SUCCESS: "unitActivity/createMaintenanceSuccess",
  CREATE_MAINTENANCE_FAILURE: "unitActivity/createMaintenanceFailure",

  UPDATE_MAINTENANCE: "unitActivity/updateMaintenance",
  UPDATE_MAINTENANCE_FETCH: "unitActivity/updateMaintenanceFetch",
  UPDATE_MAINTENANCE_SUCCESS: "unitActivity/updateMaintenanceSuccess",
  UPDATE_MAINTENANCE_FAILURE: "unitActivity/updateMaintenanceFailure",

  UPDATE_PM_CHECK: "unitActivity/updatePMCheck",
  UPDATE_PM_CHECK_FETCH: "unitActivity/updatePMCheckFetch",
  UPDATE_PM_CHECK_SUCCESS: "unitActivity/updatePMCheckSuccess",
  UPDATE_PM_CHECK_FAILURE: "unitActivity/updatePMCheckFailure",

  GET_LAST_LOCATION: "unitActivity/getLastLocation",
  GET_LAST_LOCATION_FETCH: "unitActivity/getLastLocationFetch",
  GET_LAST_LOCATION_SUCCESS: "unitActivity/getLastLocationSuccess",
  GET_LAST_LOCATION_FAILURE: "unitActivity/getLastLocationFailure",

  GET_MAINTENANCE_STATUS: "unitActivity/getMaintenanceStatus",
  GET_MAINTENANCE_STATUS_FETCH: "unitActivity/getMaintenanceStatusFetch",
  GET_MAINTENANCE_STATUS_SUCCESS: "unitActivity/getMaintenanceStatusSuccess",
  GET_MAINTENANCE_STATUS_FAILURE: "unitActivity/getMaintenanceStatusFailure",

  GET_MAINTENANCE_TYPE: "unitActivity/getMaintenanceType",
  GET_MAINTENANCE_TYPE_FETCH: "unitActivity/getMaintenanceTypeFetch",
  GET_MAINTENANCE_TYPE_SUCCESS: "unitActivity/getMaintenanceTypeSuccess",
  GET_MAINTENANCE_TYPE_FAILURE: "unitActivity/getMaintenanceTypeFailure",

  GET_MAINTENANCE_LEVEL: "unitActivity/getMaintenanceLevel",
  GET_MAINTENANCE_LEVEL_FETCH: "unitActivity/getMaintenanceLevelFetch",
  GET_MAINTENANCE_LEVEL_SUCCESS: "unitActivity/getMaintenanceLevelSuccess",
  GET_MAINTENANCE_LEVEL_FAILURE: "unitActivity/getMaintenanceLevelFailure",

  LOCATION_COUNT: "unitActivity/getLocationCount",
  LOCATION_COUNT_FETCH: "unitActivity/getLocationCountFetch",
  LOCATION_COUNT_SUCCESS: "unitActivity/getLocationCountSuccess",
  LOCATION_COUNT_FAILURE: "unitActivity/getLocationCountFailure",
};
