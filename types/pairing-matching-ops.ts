import { UnitPositionData } from "@sera-components/leaflet_maps/cluster-maps";

import { AutoCompleteType, BaseState, PaginationType } from "./base.type";

export interface IDemandFilterOptions {
  label: string;
  value: string;
  options: { label: string; value: string }[] | null;
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

export interface PairingMatchingState {
  getSummary: BaseState<Summary, UnitParams>;
  getUnitPosition: BaseState<UnitPosition[]>;
  getUnitDetail: BaseState<UnitDetail, UnitDetailParams>;
  getDemands: BaseState<Demands[], UnitParams>;
  getDemandFilter: BaseState<IDemandFilterOptions[]>;
  getACDemands: BaseState<AutoCompleteType[], UnitParams>;
  getUnpairedUnit: BaseState<UnpairedUnit[], UnitParams>;
  getACUnpairedUnit: BaseState<AutoCompleteType[]>;
  getUnpairedDriver: BaseState<UnpairedDriver[], UnitParams>;
  getACUnpairedDriver: BaseState<AutoCompleteType[], UnitParams>;
  pairingProcess: BaseState<PairingProcess, PairingProcessPayload>;
  getCapacityPaired: BaseState<CapacityPaired[], UnitParams>;
  getACCapacityPaired: BaseState<AutoCompleteType[]>;
  pairingConfirm: BaseState<PairingConfirm, PairingConfirmPayload>;
  pairingRepair: BaseState<PairingConfirm, PairingRepairPayload>;
  getPairingHistory: BaseState<PairingHistory, PairingHistoryParams>;
  getShipmentDetail: BaseState<ShipmentDetail, ShipmentDetailPayload>;
}

export interface ShipmentDetail {
  shipmentNumber?: string;
  customerName?: string;
  pickupDate?: string;
  origin?: string;
  destination?: string;
  licensePlate?: string;
  unitType?: string;
  driver1?: string;
  driver2?: string;
  revenue?: number;
  cost?: number;
  ratioExpense?: number;
  jmpCode?: string;
}

export interface ShipmentDetailPayload {
  id?: string;
}

export interface GetShipmentDetailResponse {
  status?: boolean;
  message?: string;
  data?: ShipmentDetail;
  code?: string;
  eTag?: string;
}

export interface Summary {
  totalShipment: number;
  needToConfirm: number;
  assigned: number;
  repaired: number;
  cancelled: number;
}

export interface UnitParams {
  branchId?: string[];
  area?: string[];
  unitTypeId?: string[];
  shipmentType?: string[];
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
  phoneNumber1?: string;
  driverId2?: string;
  phoneNumber2?: string;
}

export interface UnitDetailParams extends UnitParams {
  id?: string;
}

export interface Demands {
  id: string;
  priority: string;
  status: string;
  confirmationStatus: string;
  createdAt: string;
  createdBy: string;
  shipmentNo: string;
  bookingCode: string;
  shipmentType: string;
  customer: string;
  customerId: string;
  branchOrder: string;
  branchId: string;
  unitType: string;
  vehicleTypeId: string;
  qtyDriver: number;
  routeCode: string;
  origin: string;
  originId: string;
  destination: string;
  pickupDate: string;
  estUnloading: string | null;
  vehicleId: string;
  shipmentDriverId1: string;
  shipmentDriverId2?: any;
  note: string | null;
  licensePlate?: any;
  driverVkd1: string;
  driverId1: string;
  driver1: string;
  phoneDriver1: string;
  driverVkd2?: any;
  driverId2?: any;
  driver2?: any;
  phoneDriver2?: any;
  revenue: number;
  expenses?: any;
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
  asd?: null;
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
  statusConfirmation?: string;
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
  asd?: null;
}

export interface PairingRepair {
  asd?: null;
}

export interface PairingRepairPayload {
  id?: string;
  vehicleId?: boolean;
  driverId1?: boolean;
  driverId2?: boolean;
  note?: string | null;
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

export interface IFilterDemandResponse {
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
  data: IFilterDemandResponseData[];
}
export interface IFilterDemandResponseData {
  id: string;
  name: string;
  description?: string;
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

export interface PairingRepairResponse {
  status?: boolean;
  message?: string;
  data?: PairingRepair;
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
  GET_SUMMARY: "pairingMatchingOps/getSummary",
  GET_SUMMARY_FETCH: "pairingMatchingOps/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "pairingMatchingOps/getSummarySuccess",
  GET_SUMMARY_FAILURE: "pairingMatchingOps/getSummaryFailure",

  GET_UNIT_POSITION: "pairingMatchingOps/getUnitPosition",
  GET_UNIT_POSITION_FETCH: "pairingMatchingOps/getUnitPositionFetch",
  GET_UNIT_POSITION_SUCCESS: "pairingMatchingOps/getUnitPositionSuccess",
  GET_UNIT_POSITION_FAILURE: "pairingMatchingOps/getUnitPositionFailure",

  GET_UNIT_DETAIL: "pairingMatchingOps/getUnitDetail",
  GET_UNIT_DETAIL_FETCH: "pairingMatchingOps/getUnitDetailFetch",
  GET_UNIT_DETAIL_SUCCESS: "pairingMatchingOps/getUnitDetailSuccess",
  GET_UNIT_DETAIL_FAILURE: "pairingMatchingOps/getUnitDetailFailure",

  GET_DEMANDS: "pairingMatchingOps/getDemands",
  GET_DEMANDS_FETCH: "pairingMatchingOps/getDemandsFetch",
  GET_DEMANDS_SUCCESS: "pairingMatchingOps/getDemandsSuccess",
  GET_DEMANDS_FAILURE: "pairingMatchingOps/getDemandsFailure",

  GET_DEMANDS_FILTER_FETCH: "pairingMatchingOps/getFilterDemandFetch",
  GET_DEMANDS_FILTER_SUCCESS: "pairingMatchingOps/getFilterDemandSuccess",
  GET_DEMANDS_FILTER_FAILURE: "pairingMatchingOps/getFilterDemandFailure",

  GET_AC_DEMANDS: "pairingMatchingOps/getACDemands",
  GET_AC_DEMANDS_FETCH: "pairingMatchingOps/getACDemandsFetch",
  GET_AC_DEMANDS_SUCCESS: "pairingMatchingOps/getACDemandsSuccess",
  GET_AC_DEMANDS_FAILURE: "pairingMatchingOps/getACDemandsFailure",

  GET_UNPAIRED_UNIT: "pairingMatchingOps/getUnpairedUnit",
  GET_UNPAIRED_UNIT_FETCH: "pairingMatchingOps/getUnpairedUnitFetch",
  GET_UNPAIRED_UNIT_SUCCESS: "pairingMatchingOps/getUnpairedUnitSuccess",
  GET_UNPAIRED_UNIT_FAILURE: "pairingMatchingOps/getUnpairedUnitFailure",

  GET_AC_UNPAIRED_UNIT: "pairingMatchingOps/getACUnpairedUnit",
  GET_AC_UNPAIRED_UNIT_FETCH: "pairingMatchingOps/getACUnpairedUnitFetch",
  GET_AC_UNPAIRED_UNIT_SUCCESS: "pairingMatchingOps/getACUnpairedUnitSuccess",
  GET_AC_UNPAIRED_UNIT_FAILURE: "pairingMatchingOps/getACUnpairedUnitFailure",

  GET_UNPAIRED_DRIVER: "pairingMatchingOps/getUnpairedDriver",
  GET_UNPAIRED_DRIVER_FETCH: "pairingMatchingOps/getUnpairedDriverFetch",
  GET_UNPAIRED_DRIVER_SUCCESS: "pairingMatchingOps/getUnpairedDriverSuccess",
  GET_UNPAIRED_DRIVER_FAILURE: "pairingMatchingOps/getUnpairedDriverFailure",

  GET_AC_UNPAIRED_DRIVER: "pairingMatchingOps/getACUnpairedDriver",
  GET_AC_UNPAIRED_DRIVER_FETCH: "pairingMatchingOps/getACUnpairedDriverFetch",
  GET_AC_UNPAIRED_DRIVER_SUCCESS:
    "pairingMatchingOps/getACUnpairedDriverSuccess",
  GET_AC_UNPAIRED_DRIVER_FAILURE:
    "pairingMatchingOps/getACUnpairedDriverFailure",

  PAIRING_PROCESS: "pairingMatchingOps/pairingProcess",
  PAIRING_PROCESS_FETCH: "pairingMatchingOps/pairingProcessFetch",
  PAIRING_PROCESS_SUCCESS: "pairingMatchingOps/pairingProcessSuccess",
  PAIRING_PROCESS_FAILURE: "pairingMatchingOps/pairingProcessFailure",

  GET_CAPACITY_PAIRED: "pairingMatchingOps/getCapacityPaired",
  GET_CAPACITY_PAIRED_FETCH: "pairingMatchingOps/getCapacityPairedFetch",
  GET_CAPACITY_PAIRED_SUCCESS: "pairingMatchingOps/getCapacityPairedSuccess",
  GET_CAPACITY_PAIRED_FAILURE: "pairingMatchingOps/getCapacityPairedFailure",

  GET_AC_CAPACITY_PAIRED: "pairingMatchingOps/getACCapacityPaired",
  GET_AC_CAPACITY_PAIRED_FETCH: "pairingMatchingOps/getACCapacityPairedFetch",
  GET_AC_CAPACITY_PAIRED_SUCCESS:
    "pairingMatchingOps/getACCapacityPairedSuccess",
  GET_AC_CAPACITY_PAIRED_FAILURE:
    "pairingMatchingOps/getACCapacityPairedFailure",

  PAIRING_CONFIRM: "pairingMatchingOps/pairingConfirm",
  PAIRING_CONFIRM_FETCH: "pairingMatchingOps/pairingConfirmFetch",
  PAIRING_CONFIRM_SUCCESS: "pairingMatchingOps/pairingConfirmSuccess",
  PAIRING_CONFIRM_FAILURE: "pairingMatchingOps/pairingConfirmFailure",

  PAIRING_REPAIR: "pairingMatchingOps/pairingRepair",
  PAIRING_REPAIR_FETCH: "pairingMatchingOps/pairingRepairFetch",
  PAIRING_REPAIR_SUCCESS: "pairingMatchingOps/pairingRepairSuccess",
  PAIRING_REPAIR_FAILURE: "pairingMatchingOps/pairingRepairFailure",

  GET_PAIRING_HISTORY: "pairingMatchingOps/getPairingHistory",
  GET_PAIRING_HISTORY_FETCH: "pairingMatchingOps/getPairingHistoryFetch",
  GET_PAIRING_HISTORY_SUCCESS: "pairingMatchingOps/getPairingHistorySuccess",
  GET_PAIRING_HISTORY_FAILURE: "pairingMatchingOps/getPairingHistoryFailure",

  GET_SHIPMENT_DETAIL: "pairingMatchingOps/getShipmentDetail",
  GET_SHIPMENT_DETAIL_FETCH: "pairingMatchingOps/getShipmentDetailFetch",
  GET_SHIPMENT_DETAIL_SUCCESS: "pairingMatchingOps/getShipmentDetailSuccess",
  GET_SHIPMENT_DETAIL_FAILURE: "pairingMatchingOps/getShipmentDetailFailure",
};
