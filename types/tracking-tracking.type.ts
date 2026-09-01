import { BaseState, PaginationType } from "./base.type";

export interface UnitParams {
  branchId?: string[];
  shipmentType?: string[];
}

export interface Summary {
  shipmentOnDuty: number;
  unloading: number;
  onJourney: number;
  loading: number;
}

export interface UnitDriver {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  serviceGroupId?: string;
  shipmentType: string;
  customerId?: string;
  startDate: string;
  endDate: string;
  joinDate: string;
  resignDate?: any;
  mcuDate: string;
  mcuResult?: any;
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
  note?: any;
  capacityStatus: string;
  isAllotment?: boolean;
  createdBy: string;
  updatedBy: string;
  deletedAt?: any;
  deletedBy?: any;
  createdAt: string;
  updatedAt: string;
  abilityAreas: string[];
  abilityUnits: string[];
  trainings: any[];
  contractStatus: string;
  branchName: string;
  customerName?: string;
  fatigueStatus: string;
  licenseStatus: string;
  lastLocation?: any;
  healthAssessment: HealthAssessment;
}
export interface HealthAssessment {
  healthResult: string;
  createdAt: string;
}

export interface UnitList {
  id: string;
  shipmentNo: string;
  shipmentType: string;
  customerName: string;
  unitType?: string;
  origin?: string;
  destination?: string;
  licensePlate?: string;
  driver1?: UnitDriver;
  driver2?: UnitDriver;
  lastPosition?: any;
  lastUpdated?: string;
}
export interface DetailParams {
  id?: string;
}
export interface DetailActivityLog {
  time: string;
  status: string;
  actor: string;
}
export interface DetailDateTime {
  planLoadingIn: string;
  actualLoadingIn?: any;
  planLoadingOut: string;
  actualLoadingOut: string;
  estimateTimeArrival: string;
  ata: string;
  slaLeadtime: number;
  actualLeadtime?: any;
}
export interface DetailMaps {
  latitude: number;
  longitude: number;
  address: string;
  province: string;
  district: string;
  direction: number;
}
export interface DetailData {
  id: string;
  shipmentNo: string;
  status: string;
  shipmentType: string;
  customerName: string;
  branchOrder: BranchOrder;
  unitType: string;
  licensePlate: string;
  origin: string;
  originAddress: string;
  destination: string;
  destinationAddress: string;
  driver1: UnitDriver;
  driver2: UnitDriver;
  lastPosition: LastPosition;
  lastUpdate: string;
}
export interface LastPosition {
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  province: string;
  subDistrict?: any;
  activity?: any;
  speed?: any;
  lastUpdate?: any;
}
export interface BranchOrder {
  id: string;
  name: string;
  code: string;
  area: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitDetail {
  detail: DetailData;
  maps: DetailMaps;
  dateTime: DetailDateTime;
  activityLogs: DetailActivityLog[];
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetListResponse {
  status?: boolean;
  message?: string;
  data?: UnitList[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDetailsResponse {
  status?: boolean;
  message?: string;
  data?: GetDetailsResponseData;
  code?: string;
  eTag?: string;
}

export interface GetDetailsResponseData {
  status?: boolean;
  message?: string;
  data?: UnitDetail;
  code?: string;
  eTag?: string;
}

export interface ITracingTrackingState {
  getSummary: BaseState<Summary, UnitParams>;
  getList: BaseState<UnitList[], UnitParams>;
  getDetails: BaseState<UnitDetail, DetailParams>;
}

export const tracingTrackingTypes = {
  GET_SUMMARY: "tracingTracking/getSummaryFetch",
  GET_LIST: "tracingTracking/getListFetch",
  GET_DETAILS: "tracingTracking/getDetailsFetch",
};
