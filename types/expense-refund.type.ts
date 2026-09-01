import { BaseState, PaginationType } from "./base.type";

export interface UnitParams {
  branchId?: string[];
  shipmentType?: string[];
}

export interface Summary {
  outstandingRefund: number;
  outstandingAmount: number;
}

export interface List {
  shipmentId: string;
  shipmentType: string;
  expenseStatus: string;
  expenseTransferred: number;
  totalExpense: number;
  shipmentNumber: string;
  bookingNumber: string;
  customerName: string;
  unitType?: any;
  origin: string;
  destination: string;
  licensePlate: string;
  driver1: string;
  driver2: string;
  driver1Name: string;
  driver2Name: string;
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetListResponse {
  status?: boolean;
  message?: string;
  data?: { list: List[] };
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}
export interface ExpenseRefundProcessPayload {
  id: string;
  refunds: {
    driverId: string;
    refundAmount: number;
    transferredDate: string;
    referenceNumber?: string;
    note?: string;
  }[];
}

export interface RefundProcessResponse {
  //TODO typecheck response when BE is ready
  data?: any;
}

export interface PayloadDetails {
  id: string;
}

export interface Driver2 {
  vkd: string;
  driverId: string;
  driverName: string;
  umNumber: string;
  refundAmount: number;
  transferredDate?: any;
  referenceNumber?: any;
  note: string;
  status: string;
}
export interface Driver1 {
  vkd: string;
  driverId: string;
  driverName: string;
  umNumber: string;
  refundAmount: number;
  transferredDate: string;
  referenceNumber: string;
  note: string;
  status: string;
}

export interface DetailsResponse {
  id: string;
  driver1: Driver1;
  driver2: Driver2 | null;
}

export interface GetDetailsResponse {
  status?: boolean;
  message?: string;
  data?: DetailsResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface ExpenseRefundState {
  getSummary: BaseState<Summary, UnitParams>;
  getList: BaseState<List[], UnitParams>;
  refundProcess: BaseState<RefundProcessResponse, ExpenseRefundProcessPayload>;
  getDetails: BaseState<DetailsResponse, PayloadDetails>;
}

export const expenseRefundTypes = {
  GET_SUMMARY_FETCH: "expenseRefund/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "expenseRefund/getSummarySuccess",
  GET_SUMMARY_FAILURE: "expenseRefund/getSummaryFailure",

  GET_LIST_FETCH: "expenseRefund/getListFetch",
  GET_LIST_SUCCESS: "expenseRefund/getListSuccess",
  GET_LIST_FAILURE: "expenseRefund/getListFailure",

  REFUND_PROCESS_FETCH: "expenseRefund/refundExpenseFetch",
  REFUND_PROCESS_SUCCESS: "expenseRefund/refundExpenseSuccess",
  REFUND_PROCESS_FAILURE: "expenseRefund/refundExpenseFailure",

  GET_DETAILS_FETCH: "expenseRefund/getDetailsFetch",
  GET_DETAILS_SUCCESS: "expenseRefund/getDetailsSuccess",
  GET_DETAILS_FAILURE: "expenseRefund/getDetailsFailure",
};
