import { BaseState, BaseType, PaginationType } from "./base.type";

export interface IPerformanceListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: IPerformanceListResponseData[];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface IPerformanceListResponseData {
  id: string;
  period: string;
  shipment: number;
  workDays: number;
  clockIn: number;
  onTimePickup: number;
  onTimeDelivery: number;
  onTimePodReturn: number;
  claim: number;
  harsh: number;
  accident: number;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  branchName: string;
  shipmentType: string;
  customerId: string;
  endDate: string;
  status: string;
  totalCiComplience: number;
  totalOntimePickup: number;
  totalOntimeDelivery: number;
  totalPODhandling: number;
  totalClaim: number;
  totalHarshShipment: number;
  average: number;
  score: string;
}

export interface ISummaryPayload {
  "branchId[]"?: string[];
  "shipmentType[]"?: string[];
  "employeeStatus[]"?: string[];
}

export interface IPerformanceSummaryResponse {
  data: IPerformanceSummaryResponseData;
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
}
export interface IPerformanceSummaryResponseData {
  totalDrivers: number;
  performanceSummary: IPerformanceSummary;
}
export interface IPerformanceSummary {
  A: number;
  B: number;
  C: number;
}

export interface IDriverPerformanceState extends BaseState<any[], BaseType> {
  getSummary: BaseState<IPerformanceSummaryResponseData, ISummaryPayload>;
  //TODO filter
  getFilterOption: BaseState<any[]>;
}

export const driverPerformanceTypes = {
  GET_SUMMARY: "driverPerformance/getSummaryFetch",
  GET_PERFORMANCE_LIST_FETCH: "driverPerformance/getPerformanceListFetch",
  GET_PERFORMANCE_FILTER_FETCH: "driverPerformance/getPerformanceFilterFetch",
};
