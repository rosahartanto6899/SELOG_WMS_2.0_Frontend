import {
  AutoCompleteType,
  BaseResponseType,
  BaseType,
  PaginationType,
} from "./base.type";

export type ErrorCustom = Error | string | null;

export interface Coordinate {
  type: string;
  coordinates: number[];
}

export interface VehicleClusterData {
  _id: string;
  licensePlate: string;
  deviceTime: Date;
  latitude: number;
  longitude: number;
  direction: number;
  vehicleActivity: string;
  vehicleNumber?: string;
  simcardNumber?: string;
  isOverstay: string;
  eventType: string;
}

export interface Drivers {
  _id: string;
  driverCode: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
}

export interface VehicleClusterDetailData {
  no?: number;
  coordinate?: Coordinate;
  _id?: string;
  imei?: string;
  fleetGroupId?: string;
  fleetGroupName?: string;
  businessAreaId?: string;
  businessAreaName?: string;
  simcardProviderId?: string;
  simcardProviderName?: string;
  driverCode?: string;
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  simcardNumber?: string;
  machineNumber?: string;
  vehicleNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleId?: string;
  fuelConsumed?: number;
  deviceTime?: string;
  serverTime?: string;
  deviceId?: string;
  vehicleStatus?: string;
  receiveMessage?: number;
  latitude?: number;
  longitude?: number;
  eventName?: string;
  eventType?: string;
  speed?: number;
  direction?: number;
  internalBatteryVoltage?: number;
  externalPowerVoltage?: number;
  engineCoolantTemperatureX?: number;
  engineSpeedX?: number;
  totalOdometer?: number;
  ignition?: number;
  panic?: string;
  dleft?: string;
  dright?: string;
  drear?: string;
  fcamera?: string;
  isOverstay?: string;
  updatedAt?: string;
  createdAt?: string;
  deviceType?: string;
  deviceModel?: string;
  priority?: string;
  location?: string;
  altitude?: number;
  satellite?: number;
  accuracy?: string;
  dtcNumber?: number;
  lac?: number;
  gpsPdop?: string;
  gpsHdop?: string;
  gsmSignalLevel?: number;
  tripOdometer?: number;
  internalBatteryCurrent?: string;
  cellId?: string;
  ptoState?: string;
  engineTotalFuelUsed?: string;
  fuelLevel1X?: string;
  fuelLevel?: number;
  deviceTimestamp?: number;
  engineTotalHoursOfOperationX?: string;
  serviceDistance?: string;
  atLeastPtoEngaged?: string;
  ecoDrivingType?: string;
  ecoDrivingValue?: string;
  wheelBasedSpeed?: string;
  acceleratorPedalPosition?: string;
  enginePercentLoad?: string;
  tachoVehicleSpeedX?: string;
  instantaneousFuelEconomyX?: string;
  digitalInput1?: number;
  digitalInput2?: number;
  digitalInput3?: number;
  digitalInput4?: number;
  sensor?: string;
  crashDetection?: string;
  geofenceZone01?: string;
  digitalOutput1?: string;
  digitalOutput2?: string;
  gpsStatus?: number;
  movementSensor?: number;
  dataMode?: number;
  deepSleep?: number;
  analogInput1?: number;
  gsmOperator?: number;
  dallasTemperature1?: number;
  dallasTemperature2?: number;
  dallasTemperature3?: number;
  dallasTemperature4?: number;
  dallasId1?: string;
  dallasId2?: string;
  dallasId3?: string;
  dallasId4?: string;
  event?: string;
  eventTypeId?: string;
  telemetry?: string;
  isBlackbox?: number;
  isVendorname?: string;
  mainBatteryStatus?: string;
  engineTemperatureStatus?: string;
  engineRpmStatus?: string;
  vehicleActivity?: string;
  activityDate?: string;
  totalSubscriber?: number;
  address?: string;
  drivers?: Drivers[] | [];
  vehicleCategory?: string;
  fatigue?: boolean;
  sbeltmain?: string;
  sbeltsecond?: string;
}

export interface VehicleSummaryListData {
  data?: VehicleClusterDetailData[] | [];
  pagination?: PaginationType;
}

export interface VehicleDashboardSummaryData {
  totalVehicle: number | null;
  vehicleStop: number | null;
  vehicleMoving: number | null;
  vehicleSilence: number | null;
  vehicleIdle: number | null;
}
export interface VehicleClusterResponse extends BaseResponseType {
  data?: VehicleClusterData[];
  updateFilter?: boolean;
}
export interface VehicleSummaryResponse extends BaseResponseType {
  data?: VehicleDashboardSummaryData;
}
export interface VehicleClusterDetailResponse extends BaseResponseType {
  data?: VehicleClusterDetailData;
}

export interface VehicleSummaryListResponse extends BaseResponseType {
  status?: boolean;
  message?: string;
  data?: VehicleSummaryListData;
  code?: string;
  eTag?: string;
}

export interface ListSummaryAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface GeofenceDashboard {
  _id?: string;
  geofenceId?: string;
  alertInZone?: string;
  alertOutZone?: string;
  createdBy?: string;
  geofenceName?: string;
  type?: string;
  colour?: string;
  isRedZone?: number;
  outOfGeofence?: number;
}

export interface GeofenceViolationData {
  _id?: string;
  vehicleId?: string;
  licensePlate?: string;
  fleetGroupId?: string;
  vin?: string;
  imeiObdNumber?: number;
  reffVehicleId?: string;
  geofence?: GeofenceDashboard[] | [];
  fleetGroupName?: string;
  driverName?: string;
  outOfGeofence?: number;
  updateTime?: string;
  vehicleStatus?: string;
  vehicleNumber?: string;
  driverPhone?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  simcardNumber?: string;
  machineNumber?: string;
  simcardProviderId?: string;
  simcardProviderName?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  __v?: number;
  updatedBy?: string;
  businessCategory?: string;
}

export interface GeofenceViolationPayload extends BaseType {
  selectedCategoryBusiness?: string;
  selectedBusinessArea?: string;
  selectedUserFleetGroup?: string;
  updateTime?: string;
}
export interface DataGeofenceViolation {
  data?: GeofenceViolationData[] | [];
  pagination?: PaginationType;
}

export interface GeofenceViolationResponse extends BaseResponseType {
  status?: boolean;
  message?: string;
  data?: DataGeofenceViolation;
  options: BaseType;
  code?: string;
  eTag?: string;
}

export interface ListGeofenceViolationAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface CountTotalAlertPayload {
  fleetGroupId?: string;
  businessCategoryId?: string;
  businessAreaId?: string;
  alertCategoryId?: string;
}

export interface CountTotalAlert {
  _id?: string;
  total?: number;
  alertName?: string;
  alertCategoryName?: string;
  eventId?: string;
  alertCategoryId?: string;
  businessCategoryId?: string | null;
  businessAreaId?: string | null;
  fleetGroupId?: string | null;
  eventCode?: string | null;
}

export interface CountTotalAlertResponse extends BaseResponseType {
  status?: boolean;
  message?: string;
  data?: CountTotalAlert[] | [];
  options: BaseType;
  code?: string;
  eTag?: string;
}

export interface VehicleClusterHistory {
  no: number;
  _id: string;
  latitude: number;
  longitude: number;
  direction: number;
  speed: string;
  deviceTime: string;
  ignition: number;
  eventType: string;
  driverName: string;
  driverPhone: string;
  licensePlate: string;
  address: string;
  vehicleBrand: string;
  vehicleModel: string;
  totalOdometer: string;
  externalPowerVoltage: string;
  tachoVehicleSpeedX: string;
  engineTemperatureStatus: string;
  drivers: Drivers[];
}

export interface VehicleClusterSearchParam {
  businessCategoryId: string | null;
  businessAreaId: string | null;
  fleetGroupId: string | null;
  vehicleActivity: string[] | null;
  incident: string[] | null;
  geofenceId: string[] | null;
  searchBy: string | null;
  search: string[] | null;
  simcardProviderId: string | null;
  fetchData: boolean;
}

export interface VehicleClusterIncident {
  _id: string;
  alertName: string;
  licensePlate: string[];
  total: string;
}

export interface VehicleClusterState {
  data?: VehicleClusterData[] | null;
  filter?: VehicleClusterData[];
  searchParam?: VehicleClusterSearchParam;
  listSummary: {
    data?: VehicleClusterDetailData[];
    autoComplete: ListSummaryAutoComplete;
    options?: BaseType;
    error?: ErrorCustom;
  };
  listSummaryGeofence: {
    data?: VehicleClusterDetailData[];
  };
  incidents: VehicleClusterIncident[];
  summary?: VehicleDashboardSummaryData;
  history: VehicleClusterHistory[];
  detail: {
    data: VehicleClusterDetailData;
  };
  detailHistory: {
    data: VehicleClusterDetailData;
  };
  geofenceViolation: {
    total?: number;
    data?: GeofenceViolationData[];
    autoComplete: ListGeofenceViolationAutoComplete;
    options?: BaseType;
    error?: ErrorCustom;
  };
  geofence: {
    data?: VehicleClusterDetailData[];
    autoComplete: ListSummaryAutoComplete;
    options?: BaseType;
    error?: ErrorCustom;
  };
  totalAlert: CountTotalAlert[];
  error?: ErrorCustom;
  isLoading?: boolean;
  options?: BaseType;
}

export interface VehicleClusterHistoryPayload {
  licensePlate: string;
  eventType?: string;
  lastTrack?: number;
  startDate?: string;
  endDate?: string;
}

export interface VehicleClusterHistoryResponse extends BaseResponseType {
  data?: VehicleClusterHistory[];
  options: BaseType;
}

export interface DataVehicleClusterHistory {
  data?: VehicleClusterHistory[] | [];
  pagination?: PaginationType;
}

export interface NumberofIncidentPayload {
  fleetGroupId?: string;
  businessCategoryId?: string;
  businessAreaId?: string;
  alertCategoryId?: string;
}

export const dashboardTypes = {
  GET_VEHICLE_CLUSTER: "dashboard/getVehicleCluster",
  GET_VEHICLE_CLUSTER_FETCH: "dashboard/getVehicleClusterFetch",
  GET_VEHICLE_CLUSTER_SUCCESS: "dashboard/getVehicleClusterSuccess",
  GET_VEHICLE_CLUSTER_FAILURE: "dashboard/getVehicleClusterFailure",

  GET_VEHICLE_CLUSTER_V2: "dashboard/getVehicleClusterv2",
  GET_VEHICLE_CLUSTER_V2_FETCH: "dashboard/getVehicleClusterv2Fetch",
  GET_VEHICLE_CLUSTER_V2_SUCCESS: "dashboard/getVehicleClusterv2Success",
  GET_VEHICLE_CLUSTER_V2_FAILURE: "dashboard/getVehicleClusterv2Failure",

  GET_VEHICLE_DASHBOARD_SUMMARY: "dashboard/getVehicleDashboardSummary",
  GET_VEHICLE_DASHBOARD_SUMMARY_FETCH:
    "dashboard/getVehicleDashboardSummaryFetch",
  GET_VEHICLE_DASHBOARD_SUMMARY_SUCCESS:
    "dashboard/getVehicleDashboardSummarySuccess",
  GET_VEHICLE_DASHBOARD_SUMMARY_FAILURE:
    "dashboard/getVehicleDashboardSummaryFailure",

  GET_DETAIL_VEHICLE_CLUSTER: "dashboard/getDetailVehicleCluster",
  GET_DETAIL_VEHICLE_CLUSTER_FETCH: "dashboard/getDetailVehicleClusterFetch",
  GET_DETAIL_VEHICLE_CLUSTER_SUCCESS:
    "dashboard/getDetailVehicleClusterSuccess",
  GET_DETAIL_VEHICLE_CLUSTER_FAILURE:
    "dashboard/getDetailVehicleClusterFailure",

  GET_VEHICLE_CLUSTER_INCIDENT_FETCH:
    "dashboard/getVehicleClusterIncidentFetch",
  GET_VEHICLE_CLUSTER_INCIDENT_SUCCESS:
    "dashboard/getVehicleClusterIncidentSuccess",
  GET_VEHICLE_CLUSTER_INCIDENT_FAILURE:
    "dashboard/getVehicleClusterIncidentFailure",

  GET_LIST_VEHICLE_SUMMARY: "dashboard/getListSummary",
  GET_LIST_VEHICLE_SUMMARY_FETCH: "dashboard/getListSummaryFetch",
  GET_LIST_VEHICLE_SUMMARY_SUCCESS: "dashboard/getListSummarySuccess",
  GET_LIST_VEHICLE_SUMMARY_FAILURE: "dashboard/getListSummaryFailure",
  GET_LIST_VEHICLE_SUCLEARAILURE: "dashboard/getListSummaryClear",

  GET_LIST_VEHICLE_GEOFENCE: "dashboard/getListGeofence",
  GET_LIST_VEHICLE_GEOFENCE_FETCH: "dashboard/getListGeofenceFetch",
  GET_LIST_VEHICLE_GEOFENCE_SUCCESS: "dashboard/getListGeofenceSuccess",
  GET_LIST_VEHICLE_GEOFENCE_FAILURE: "dashboard/getListGeofenceFailure",

  GET_AUTOCOMPLETE_LIST_VEHICLE_SUMMARY_FETCH:
    "dashboard/getAutoCompleteListSummaryFetch",
  GET_AUTOCOMPLETE_LIST_VEHICLE_SUMMARY_SUCCESS:
    "dashboard/getAutoCompleteListSummarySuccess",
  GET_AUTOCOMPLETE_LIST_VEHICLE_SUMMARY_FAILURE:
    "dashboard/getAutoCompleteListSummaryFailure",
  GET_AUTOCOMPLETE_LIST_VEHICLE_SUMMARY_CLEAR:
    "dashboard/getAutoCompleteListSummaryClear",

  GET_VEHICLE_CLUSTER_HISTORY: "dashboard/getVehicleClusterHistory",
  GET_VEHICLE_CLUSTER_HISTORY_FETCH: "dashboard/getVehicleClusterHistoryFetch",
  GET_VEHICLE_CLUSTER_HISTORY_SUCCESS:
    "dashboard/getVehicleClusterHistorySuccess",
  GET_VEHICLE_CLUSTER_HISTORY_FAILURE:
    "dashboard/getVehicleClusterHistoryFailure",

  GET_GEOFENCE_VIOLATION: "dashboard/getGeofenceViolation",
  GET_GEOFENCE_VIOLATION_FETCH: "dashboard/getGeofenceViolationFetch",
  GET_GEOFENCE_VIOLATION_SUCCESS: "dashboard/getGeofenceViolationSuccess",
  GET_GEOFENCE_VIOLATION_FAILURE: "dashboard/getGeofenceViolationFailure",
  GET_GEOFENCE_VIOLATION_CLEAR: "dashboard/getGeofenceViolationClear",

  GET_AUTOCOMPLETE_GEOFENCE_VIOLATION:
    "dashboard/getAutoCompleteGeofenceViolation",
  GET_AUTOCOMPLETE_GEOFENCE_VIOLATION_FETCH:
    "dashboard/getAutoCompleteGeofenceViolationFetch",
  GET_AUTOCOMPLETE_GEOFENCE_VIOLATION_SUCCESS:
    "dashboard/getAutoCompleteGeofenceViolationSuccess",
  GET_AUTOCOMPLETE_GEOFENCE_VIOLATION_FAILURE:
    "dashboard/getAutoCompleteGeofenceViolationFailure",
  GET_AUTOCOMPLETE_GEOFENCE_VIOLATION_CLEAR:
    "dashboard/getAutoCompleteGeofenceViolationClear",

  SET_SEARCH_PARAM: "dashboard/setSearchParam",

  GET_TOTAL_ALERT: "dashboard/getTotalAlert",
  GET_TOTAL_ALERT_FETCH: "dashboard/getTotalAlertFetch",
  GET_TOTAL_ALERT_SUCCESS: "dashboard/getTotalAlertSuccess",
  GET_TOTAL_ALERT_FAILURE: "dashboard/getTotalAlertFailure",

  GET_DETAIL_VEHICLE_CLUSTER_HISTORY:
    "dashboard/getDetailVehicleClusterHistory",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_FETCH:
    "dashboard/getDetailVehicleClusterHistoryFetch",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_SUCCESS:
    "dashboard/getDetailVehicleClusterHistorySuccess",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_FAILURE:
    "dashboard/getDetailVehicleClusterHistoryFailure",

  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_BY_PACKAGE:
    "dashboard/getDetailVehicleClusterHistoryByPackage",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_BY_PACKAGE_FETCH:
    "dashboard/getDetailVehicleClusterHistoryByPackageFetch",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_BY_PACKAGE_SUCCESS:
    "dashboard/getDetailVehicleClusterHistoryByPackageSuccess",
  GET_DETAIL_VEHICLE_CLUSTER_HISTORY_BY_PACKAGE_FAILURE:
    "dashboard/getDetailVehicleClusterHistoryByPackageFailure",

  GET_NUMBER_OF_INCIDENT: "dashboard/getNumberofIncident",
  GET_NUMBER_OF_INCIDENT_FETCH: "dashboard/getNumberofIncidentFetch",
  GET_NUMBER_OF_INCIDENT_SUCCESS: "dashboard/getNumberofIncidentSuccess",
  GET_NUMBER_OF_INCIDENT_FAILURE: "dashboard/getNumberofIncidentFailure",

  GET_VEHICLE_CLUSTER_BY_ALERT: "dashboard/getVehicleClusterByAlert",
  GET_VEHICLE_CLUSTER_BY_ALERT_FETCH: "dashboard/getVehicleClusterByAlertFetch",
  GET_VEHICLE_CLUSTER_BY_ALERT_SUCCESS:
    "dashboard/getVehicleClusterByAlertSuccess",
  GET_VEHICLE_CLUSTER_BY_ALERT_FAILURE:
    "dashboard/getVehicleClusterByAlertFailure",
};
