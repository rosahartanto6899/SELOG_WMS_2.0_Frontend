import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface UnitCapacityState extends BaseState<UnitCapacity[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  summary: BaseState<UnitCapacitySummary, UnitDriverSummaryPayload>;
  detail: BaseState<UnitCapacityDetail, { id: string }>;
  forecast: BaseState<UnitCapacityForecast, UnitCapacityForecastPayload>;
  capacityStatuses: BaseState<CapacityStatus[]>;
}

export interface DriverCapacityState extends BaseState<DriverCapacity[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  summary: BaseState<DriverCapacitySummary, UnitDriverSummaryPayload>;
  detail: BaseState<DriverCapacityDetail, { id: string }>;
  forecast: BaseState<DriverCapacityForecast, DriverCapacityForecastPayload>;
  capacityStatuses: BaseState<CapacityStatus[]>;
  employeeStatuses: BaseState<EmployeeStatus[]>;
}

export interface UnitDriverCapacityState {
  unitCapacity: UnitCapacityState;
  driverCapacity: DriverCapacityState;
}

export interface UnitCapacity {
  no?: number;
  id: string;
  licensePlate: string;
  unitYear: number;
  unitType: string;
  status: string | null;
  lastPosition: string | null;
  destinationArea: string | null;
  eta: string | null;
  branch: string;
  shipmentType: string;
  vehicleTypeId: string;
}

export interface DriverCapacity {
  no?: number;
  id?: string;
  driverId: string;
  vkvd: string;
  driverName: string;
  phoneNumber: string;
  employeeStatus: string;
  status: string | null;
  detailPosition: string | null;
  destinationArea: string | null;
  estimationTimeArrival: string | null;
  branch: string;
  shipmentType: string;
  area: string | null;
}

export interface UnitDriver {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  serviceGroupId: string;
  shipmentType: string;
  customerId: string;
  startDate: string;
  endDate: string;
  joinDate: string;
  resignDate: string | null;
  mcuDate: string;
  mcuResult: string | null;
  birthPlace: string;
  birthDate: string;
  mobilePhone: string;
  email: string;
  citizenIdAddress: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpired: string;
  bankName: string;
  bankAccount: string;
  bankAccountHolder: string;
  note: string | null;
  capacityStatus: string;
  isAllotment: boolean;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  abilityAreas: string[];
  abilityUnits: string[];
  trainings: string[];
  contractStatus: string;
  branchName: string;
  customerName: string;
  fatigueStatus: string;
  licenseStatus: string;
  lastLocation: string | null;
  healthAssessment: {
    healthResult: string;
    createdAt: string;
  };
}

export interface UnitCapacityDetail {
  unitInformation?: {
    id: string;
    licensePlate: string;
    unitYear: string;
    vehicleType: string;
    shipmentType: string | null;
    customerAssignment: string | null;
    branch: string;
    lastPosition: string | null;
    area: string | null;
    description: string | null;
    note: string | null;
    ownership: string | null;
  };
  shipmentInformation?: {
    bookingCode: string | null;
    shipmentNo: string | null;
    origin: string | null;
    destination: string | null;
    estimationTimeArrival: string | null;
    note: string | null;
    driver1: UnitDriver | null;
    driver2: UnitDriver | null;
    customerName: string | null;
  };
}

export interface DriverCapacityDetail {
  driver?: {
    driverId: string;
    vkvd: string;
    driverName: string;
    employeeStatus: string;
    shipmentType: string;
    customerAssignment: string | null;
    branchId: string;
    branchName: string | null;
    area: string | null;
    lastPosition: string | null;
    note: string | null;
    phoneNumber: string | null;
  };
  shipment?: {
    bookingCode: string | null;
    shipmentNo: string | null;
    customerName: string | null;
    origin: string | null;
    destination: string | null;
    estimateTimeArrival: string | null;
    licensePlate: string | null;
    unitType: string | null;
    note: string | null;
  };
}

export interface CapacityStatus {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface EmployeeStatus {
  id: string;
  name: string;
}

export interface ForecastCapacity {
  active: number;
  absent: number;
  available: number;
}

export interface UnitCapacitySummary {
  areas: string[];
  rows: Record<string, string | number>[];
  totals: Record<string, string | number>;
}

export interface DriverCapacitySummary {
  areas: string[];
  rows: Record<string, string | number>[];
  totals: Record<string, string | number>;
}

export interface DriverForecast {
  date: string;
  driver: {
    mitra: ForecastCapacity;
    pkwt: ForecastCapacity;
    total: ForecastCapacity;
  };
}

export interface UnitType {
  active: number;
  available: number;
  group: string;
  name: string;
  vehicleTypeId: string;
}

export interface UnitForecast {
  date: string;
  unit: {
    byType: UnitType[];
    total: {
      active: number;
      available: number;
      out: number;
    };
  };
}

export interface UnitCapacityForecast {
  dateFrom: string;
  dateTo: string;
  days: UnitForecast[];
}

export interface DriverCapacityForecast {
  dateFrom: string;
  dateTo: string;
  days: DriverForecast[];
}

export interface UnitDriverSummaryPayload {
  branch?: string[];
  shipmentType?: string[];
}

export interface UnitCapacityForecastPayload {
  dateFrom: string;
  dateTo: string;
  branchIds: string[];
  shipmentTypes: string[];
}

export interface DriverCapacityForecastPayload {
  dateFrom: string;
  dateTo: string;
  branchIds: string[];
  shipmentTypes: string[];
  serviceGroupIds: string[];
  customerIds: string[];
  employeeStatuses: string[];
  excludeAllotment: boolean;
  capacityStatus?: string;
}

export interface GetUnitDriverCapacityResponse<T = unknown> extends BaseType {
  status?: boolean;
  message?: string;
  data?: T[];
  pagination?: PaginationType;
  code?: string;
}
export type GetUnitCapacityResponse =
  GetUnitDriverCapacityResponse<UnitCapacity>;

export type GetDriverCapacityResponse =
  GetUnitDriverCapacityResponse<DriverCapacity>;

export type GetUnitCapacityDetailResponse = BaseResponse<UnitCapacityDetail>;
export type GetDriverCapacityDetailResponse =
  BaseResponse<DriverCapacityDetail>;

export type GetUnitCapacitySummaryResponse = BaseResponse<any>;
export type GetDriverCapacitySummaryResponse = BaseResponse<any>;

export type GetUnitCapacityForecastResponse = BaseResponse<any>;
export type GetDriverCapacityForecastResponse = BaseResponse<any>;

export type GetCapacityStatusResponse = BaseResponse<CapacityStatus[]>;

export type GetEmployeeStatusResponse = BaseResponse<EmployeeStatus[]>;

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export const unitDriverCapacityTypes = {
  GET_UNIT_CAPACITY: "unitDriverCapacity/getUnitCapacity",
  GET_UNIT_CAPACITY_FETCH: "unitDriverCapacity/getUnitCapacityFetch",
  GET_UNIT_CAPACITY_SUCCESS: "unitDriverCapacity/getUnitCapacitySuccess",
  GET_UNIT_CAPACITY_FAILURE: "unitDriverCapacity/getUnitCapacityFailure",
  GET_UNIT_CAPACITY_CLEAR: "unitDriverCapacity/getUnitCapacityClear",

  GET_UNIT_CAPACITY_AUTOCOMPLETE:
    "unitDriverCapacity/getUnitCapacityAutoComplete",
  GET_UNIT_CAPACITY_AUTOCOMPLETE_FETCH:
    "unitDriverCapacity/getUnitCapacityAutoCompleteFetch",
  GET_UNIT_CAPACITY_AUTOCOMPLETE_SUCCESS:
    "unitDriverCapacity/getUnitCapacityAutoCompleteSuccess",
  GET_UNIT_CAPACITY_AUTOCOMPLETE_FAILURE:
    "unitDriverCapacity/getUnitCapacityAutoCompleteFailure",
  GET_UNIT_CAPACITY_AUTOCOMPLETE_CLEAR:
    "unitDriverCapacity/getUnitCapacityAutoCompleteClear",

  GET_DRIVER_CAPACITY: "unitDriverCapacity/getDriverCapacity",
  GET_DRIVER_CAPACITY_FETCH: "unitDriverCapacity/getDriverCapacityFetch",
  GET_DRIVER_CAPACITY_SUCCESS: "unitDriverCapacity/getDriverCapacitySuccess",
  GET_DRIVER_CAPACITY_FAILURE: "unitDriverCapacity/getDriverCapacityFailure",
  GET_DRIVER_CAPACITY_CLEAR: "unitDriverCapacity/getDriverCapacityClear",

  GET_DRIVER_CAPACITY_AUTOCOMPLETE:
    "unitDriverCapacity/getDriverCapacityAutoComplete",
  GET_DRIVER_CAPACITY_AUTOCOMPLETE_FETCH:
    "unitDriverCapacity/getDriverCapacityAutoCompleteFetch",
  GET_DRIVER_CAPACITY_AUTOCOMPLETE_SUCCESS:
    "unitDriverCapacity/getDriverCapacityAutoCompleteSuccess",
  GET_DRIVER_CAPACITY_AUTOCOMPLETE_FAILURE:
    "unitDriverCapacity/getDriverCapacityAutoCompleteFailure",
  GET_DRIVER_CAPACITY_AUTOCOMPLETE_CLEAR:
    "unitDriverCapacity/getDriverCapacityAutoCompleteClear",

  GET_UNIT_CAPACITY_SUMMARY: "unitDriverCapacity/getUnitCapacitySummary",
  GET_UNIT_CAPACITY_SUMMARY_FETCH:
    "unitDriverCapacity/getUnitCapacitySummaryFetch",
  GET_UNIT_CAPACITY_SUMMARY_SUCCESS:
    "unitDriverCapacity/getUnitCapacitySummarySuccess",
  GET_UNIT_CAPACITY_SUMMARY_FAILURE:
    "unitDriverCapacity/getUnitCapacitySummaryFailure",
  GET_UNIT_CAPACITY_SUMMARY_CLEAR:
    "unitDriverCapacity/getUnitCapacitySummaryClear",

  GET_DRIVER_CAPACITY_SUMMARY: "unitDriverCapacity/getDriverCapacitySummary",
  GET_DRIVER_CAPACITY_SUMMARY_FETCH:
    "unitDriverCapacity/getDriverCapacitySummaryFetch",
  GET_DRIVER_CAPACITY_SUMMARY_SUCCESS:
    "unitDriverCapacity/getDriverCapacitySummarySuccess",
  GET_DRIVER_CAPACITY_SUMMARY_FAILURE:
    "unitDriverCapacity/getDriverCapacitySummaryFailure",
  GET_DRIVER_CAPACITY_SUMMARY_CLEAR:
    "unitDriverCapacity/getDriverCapacitySummaryClear",

  GET_UNIT_CAPACITY_FORECAST: "unitDriverCapacity/getUnitCapacityForecast",
  GET_UNIT_CAPACITY_FORECAST_FETCH:
    "unitDriverCapacity/getUnitCapacityForecastFetch",
  GET_UNIT_CAPACITY_FORECAST_SUCCESS:
    "unitDriverCapacity/getUnitCapacityForecastSuccess",
  GET_UNIT_CAPACITY_FORECAST_FAILURE:
    "unitDriverCapacity/getUnitCapacityForecastFailure",
  GET_UNIT_CAPACITY_FORECAST_CLEAR:
    "unitDriverCapacity/getUnitCapacityForecastClear",

  GET_DRIVER_CAPACITY_FORECAST: "unitDriverCapacity/getDriverCapacityForecast",
  GET_DRIVER_CAPACITY_FORECAST_FETCH:
    "unitDriverCapacity/getDriverCapacityForecastFetch",
  GET_DRIVER_CAPACITY_FORECAST_SUCCESS:
    "unitDriverCapacity/getDriverCapacityForecastSuccess",
  GET_DRIVER_CAPACITY_FORECAST_FAILURE:
    "unitDriverCapacity/getDriverCapacityForecastFailure",
  GET_DRIVER_CAPACITY_FORECAST_CLEAR:
    "unitDriverCapacity/getDriverCapacityForecastClear",

  GET_UNIT_CAPACITY_STATUSES: "unitDriverCapacity/getUnitCapacityStatuses",
  GET_UNIT_CAPACITY_STATUSES_FETCH:
    "unitDriverCapacity/getUnitCapacityStatusesFetch",
  GET_UNIT_CAPACITY_STATUSES_SUCCESS:
    "unitDriverCapacity/getUnitCapacityStatusesSuccess",
  GET_UNIT_CAPACITY_STATUSES_FAILURE:
    "unitDriverCapacity/getUnitCapacityStatusesFailure",
  GET_UNIT_CAPACITY_STATUSES_CLEAR:
    "unitDriverCapacity/getUnitCapacityStatusesClear",

  GET_DRIVER_CAPACITY_STATUSES: "unitDriverCapacity/getDriverCapacityStatuses",
  GET_DRIVER_CAPACITY_STATUSES_FETCH:
    "unitDriverCapacity/getDriverCapacityStatusesFetch",
  GET_DRIVER_CAPACITY_STATUSES_SUCCESS:
    "unitDriverCapacity/getDriverCapacityStatusesSuccess",
  GET_DRIVER_CAPACITY_STATUSES_FAILURE:
    "unitDriverCapacity/getDriverCapacityStatusesFailure",
  GET_DRIVER_CAPACITY_STATUSES_CLEAR:
    "unitDriverCapacity/getDriverCapacityStatusesClear",

  GET_UNIT_CAPACITY_DETAIL: "unitDriverCapacity/getUnitCapacityDetail",
  GET_UNIT_CAPACITY_DETAIL_FETCH:
    "unitDriverCapacity/getUnitCapacityDetailFetch",
  GET_UNIT_CAPACITY_DETAIL_SUCCESS:
    "unitDriverCapacity/getUnitCapacityDetailSuccess",
  GET_UNIT_CAPACITY_DETAIL_FAILURE:
    "unitDriverCapacity/getUnitCapacityDetailFailure",
  GET_UNIT_CAPACITY_DETAIL_CLEAR:
    "unitDriverCapacity/getUnitCapacityDetailClear",

  GET_DRIVER_CAPACITY_DETAIL: "unitDriverCapacity/getDriverCapacityDetail",
  GET_DRIVER_CAPACITY_DETAIL_FETCH:
    "unitDriverCapacity/getDriverCapacityDetailFetch",
  GET_DRIVER_CAPACITY_DETAIL_SUCCESS:
    "unitDriverCapacity/getDriverCapacityDetailSuccess",
  GET_DRIVER_CAPACITY_DETAIL_FAILURE:
    "unitDriverCapacity/getDriverCapacityDetailFailure",
  GET_DRIVER_CAPACITY_DETAIL_CLEAR:
    "unitDriverCapacity/getDriverCapacityDetailClear",

  GET_EMPLOYEE_STATUSES: "unitDriverCapacity/getEmployeeStatuses",
  GET_EMPLOYEE_STATUSES_FETCH: "unitDriverCapacity/getEmployeeStatusesFetch",
  GET_EMPLOYEE_STATUSES_SUCCESS:
    "unitDriverCapacity/getEmployeeStatusesSuccess",
  GET_EMPLOYEE_STATUSES_FAILURE:
    "unitDriverCapacity/getEmployeeStatusesFailure",
  GET_EMPLOYEE_STATUSES_CLEAR: "unitDriverCapacity/getEmployeeStatusesClear",
};
