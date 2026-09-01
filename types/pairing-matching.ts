import { UnitPositionData } from "@sera-components/leaflet_maps/cluster-maps";

import { AutoCompleteType, BaseState, PaginationType } from "./base.type";

export interface PairingMatchingState {
  getSummary: BaseState<Summary, UnitParams>;
  getUnitPosition: BaseState<UnitPosition[], UnitPositionParams>;
  getUnitDetail: BaseState<UnitDetail, UnitDetailParams>;
  getDemands: BaseState<Demands[], UnitParams>;
  getACDemands: BaseState<AutoCompleteType[], UnitParams>;
  getUnpairedUnit: BaseState<UnpairedUnit[], UnitParams>;
  getACUnpairedUnit: BaseState<AutoCompleteType[]>;
  getUnpairedDriver: BaseState<UnpairedDriver[], UnitParams>;
  getACUnpairedDriver: BaseState<AutoCompleteType[], UnitParams>;
  pairingProcess: BaseState<PairingProcess, PairingProcessPayload>;
  getCapacityPaired: BaseState<CapacityPaired[], UnitParams>;
  getACCapacityPaired: BaseState<AutoCompleteType[]>;
  pairingConfirm: BaseState<PairingConfirm, PairingConfirmPayload>;
  getPairingHistory: BaseState<PairingHistory, PairingHistoryParams>;
}

export interface Summary {
  totalShipment?: number;
  unassigned?: number;
  repaired?: number;
  onPairing?: number;
  assigned?: number;
}

export interface UnitParams {
  branchId?: string[];
  area?: string[];
  unitTypeId?: string[];
}

export interface UnitPosition {
  destinationArea?: string;
  items?: UnitPositionData[];
  count?: number;
}

export interface UnitDetail {
  bookingNo?: string;
  shipmentNo?: string;
  customer?: string;
  status?: string;
  branchName?: string;
  shipmentType?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  revenue?: string;
  unitType?: string;
  licensePlate?: string;
  driverId1?: string;
  driverName1?: string;
  phoneNumber1?: string;
  driverId2?: string;
  driverName2?: string;
  phoneNumber2?: string;
}

export interface UnitPositionParams extends Omit<UnitParams, "area"> {
  capacityStatus?: string[];
  destinationArea?: string[];
}

export interface UnitDetailParams {
  id?: string;
}

export interface Demands {
  no?: number;
  id?: string;
  priority?: null;
  createdAt?: string;
  createdBy?: string;
  shipmentNo?: string;
  bookingNo?: string;
  customer?: string;
  branchOrder?: string;
  unitType?: string;
  vehicleTypeId?: string;
  qtyDriver?: number;
  originId?: string;
  origin?: string;
  destinationId?: string;
  destination?: string;
  pickupDate?: string;
  estUnloading?: null;
  revenue?: number;
  note?: string;
}

export interface UnpairedUnit {
  no?: number;
  id?: string;
  status?: string;
  licensePlate?: string;
  unitType?: string;
  unitYear?: string;
  lastLocation?: string;
  isAllotment?: boolean;
}

export interface UnpairedDriver {
  no?: number;
  id?: string;
  capacityStatus?: string;
  vkvd?: string;
  driverName?: string;
  employeeStatus?: string;
  fatigueStatus?: string;
  lastLocation?: string;
  allotment?: boolean;
  tierDriver?: string;
}

export interface PairingProcess {
  any?: null;
}

export interface PairingProcessPayload {
  id?: string;
  vehicleId?: string;
  driverId1?: string;
  driverId2?: string | null;
}

export interface CapacityPaired {
  no?: number;
  id?: string;
  confirmationStatus?: string;
  shipmentNo?: string;
  bookingNo?: string;
  customer?: string;
  branchName?: string;
  unitType?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  licensePlate?: string;
  driverName1?: string;
  phoneNumber1?: string;
  driverName2?: string;
  phoneNumber2?: string;
}

export interface PairingConfirm {
  any?: null;
}

export interface PairingConfirmPayload {
  id?: string;
}

export interface PairingHistory {
  shipmentId?: string;
  history?: PairingHistoryList[];
}

export interface PairingHistoryList {
  no?: number;
  id?: string;
  shipmentNo?: string;
  activityDetail?: string;
  activityDate?: string;
  activityBy?: string;
}

export interface PairingHistoryParams {
  id?: string;
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetUnitPositionResponse {
  status?: boolean;
  message?: string;
  data?: UnitPosition[];
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

export interface GetDemandsResponse {
  status?: boolean;
  message?: string;
  data?: Demands[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetUnpairedUnitResponse {
  status?: boolean;
  message?: string;
  data?: UnpairedUnit[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetUnpairedDriverResponse {
  status?: boolean;
  message?: string;
  data?: UnpairedDriver[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface PairingProcessResponse {
  status?: boolean;
  message?: string;
  data?: PairingProcess;
  code?: string;
  eTag?: string;
}

export interface GetCapacityPairedResponse {
  status?: boolean;
  message?: string;
  data?: CapacityPaired[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface PairingConfirmResponse {
  status?: boolean;
  message?: string;
  data?: PairingConfirm;
  code?: string;
  eTag?: string;
}

export interface GetPairingHistoryResponse {
  status?: boolean;
  message?: string;
  data?: PairingHistory;
  code?: string;
  eTag?: string;
}

export const pairingMatchingTypes = {
  GET_SUMMARY: "pairingMatching/getSummary",
  GET_SUMMARY_FETCH: "pairingMatching/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "pairingMatching/getSummarySuccess",
  GET_SUMMARY_FAILURE: "pairingMatching/getSummaryFailure",

  GET_UNIT_POSITION: "pairingMatching/getUnitPosition",
  GET_UNIT_POSITION_FETCH: "pairingMatching/getUnitPositionFetch",
  GET_UNIT_POSITION_SUCCESS: "pairingMatching/getUnitPositionSuccess",
  GET_UNIT_POSITION_FAILURE: "pairingMatching/getUnitPositionFailure",

  GET_UNIT_DETAIL: "pairingMatching/getUnitDetail",
  GET_UNIT_DETAIL_FETCH: "pairingMatching/getUnitDetailFetch",
  GET_UNIT_DETAIL_SUCCESS: "pairingMatching/getUnitDetailSuccess",
  GET_UNIT_DETAIL_FAILURE: "pairingMatching/getUnitDetailFailure",

  GET_DEMANDS: "pairingMatching/getDemands",
  GET_DEMANDS_FETCH: "pairingMatching/getDemandsFetch",
  GET_DEMANDS_SUCCESS: "pairingMatching/getDemandsSuccess",
  GET_DEMANDS_FAILURE: "pairingMatching/getDemandsFailure",

  GET_AC_DEMANDS: "pairingMatching/getACDemands",
  GET_AC_DEMANDS_FETCH: "pairingMatching/getACDemandsFetch",
  GET_AC_DEMANDS_SUCCESS: "pairingMatching/getACDemandsSuccess",
  GET_AC_DEMANDS_FAILURE: "pairingMatching/getACDemandsFailure",

  GET_UNPAIRED_UNIT: "pairingMatching/getUnpairedUnit",
  GET_UNPAIRED_UNIT_FETCH: "pairingMatching/getUnpairedUnitFetch",
  GET_UNPAIRED_UNIT_SUCCESS: "pairingMatching/getUnpairedUnitSuccess",
  GET_UNPAIRED_UNIT_FAILURE: "pairingMatching/getUnpairedUnitFailure",

  GET_AC_UNPAIRED_UNIT: "pairingMatching/getACUnpairedUnit",
  GET_AC_UNPAIRED_UNIT_FETCH: "pairingMatching/getACUnpairedUnitFetch",
  GET_AC_UNPAIRED_UNIT_SUCCESS: "pairingMatching/getACUnpairedUnitSuccess",
  GET_AC_UNPAIRED_UNIT_FAILURE: "pairingMatching/getACUnpairedUnitFailure",

  GET_UNPAIRED_DRIVER: "pairingMatching/getUnpairedDriver",
  GET_UNPAIRED_DRIVER_FETCH: "pairingMatching/getUnpairedDriverFetch",
  GET_UNPAIRED_DRIVER_SUCCESS: "pairingMatching/getUnpairedDriverSuccess",
  GET_UNPAIRED_DRIVER_FAILURE: "pairingMatching/getUnpairedDriverFailure",

  GET_AC_UNPAIRED_DRIVER: "pairingMatching/getACUnpairedDriver",
  GET_AC_UNPAIRED_DRIVER_FETCH: "pairingMatching/getACUnpairedDriverFetch",
  GET_AC_UNPAIRED_DRIVER_SUCCESS: "pairingMatching/getACUnpairedDriverSuccess",
  GET_AC_UNPAIRED_DRIVER_FAILURE: "pairingMatching/getACUnpairedDriverFailure",

  PAIRING_PROCESS: "pairingMatching/pairingProcess",
  PAIRING_PROCESS_FETCH: "pairingMatching/pairingProcessFetch",
  PAIRING_PROCESS_SUCCESS: "pairingMatching/pairingProcessSuccess",
  PAIRING_PROCESS_FAILURE: "pairingMatching/pairingProcessFailure",

  GET_CAPACITY_PAIRED: "pairingMatching/getCapacityPaired",
  GET_CAPACITY_PAIRED_FETCH: "pairingMatching/getCapacityPairedFetch",
  GET_CAPACITY_PAIRED_SUCCESS: "pairingMatching/getCapacityPairedSuccess",
  GET_CAPACITY_PAIRED_FAILURE: "pairingMatching/getCapacityPairedFailure",

  GET_AC_CAPACITY_PAIRED: "pairingMatching/getACCapacityPaired",
  GET_AC_CAPACITY_PAIRED_FETCH: "pairingMatching/getACCapacityPairedFetch",
  GET_AC_CAPACITY_PAIRED_SUCCESS: "pairingMatching/getACCapacityPairedSuccess",
  GET_AC_CAPACITY_PAIRED_FAILURE: "pairingMatching/getACCapacityPairedFailure",

  PAIRING_CONFIRM: "pairingMatching/pairingConfirm",
  PAIRING_CONFIRM_FETCH: "pairingMatching/pairingConfirmFetch",
  PAIRING_CONFIRM_SUCCESS: "pairingMatching/pairingConfirmSuccess",
  PAIRING_CONFIRM_FAILURE: "pairingMatching/pairingConfirmFailure",

  GET_PAIRING_HISTORY: "pairingMatching/getPairingHistory",
  GET_PAIRING_HISTORY_FETCH: "pairingMatching/getPairingHistoryFetch",
  GET_PAIRING_HISTORY_SUCCESS: "pairingMatching/getPairingHistorySuccess",
  GET_PAIRING_HISTORY_FAILURE: "pairingMatching/getPairingHistoryFailure",
};
