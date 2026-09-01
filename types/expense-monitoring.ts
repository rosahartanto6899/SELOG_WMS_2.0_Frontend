import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface ExpenseState {
  getSummary: BaseState<Summary, FilterParams>;
  getSummaryExpenses: BaseState<SummaryExpenses[], FilterParams>;
  getShipmentExpenses: BaseState<ShipmentExpenses[], FilterParams>;
  getACShipmentExpenses: BaseState<AutoCompleteType[], FilterParams>;
  updateTermin1Date: BaseState<UpdateTermin1DatePayload>;
  getDetailExpenses: BaseState<DetailExpenses[], DetailExpensesPayload>;
  updateDetailExpense: BaseState<UpdateDetailExpensePayload>;
  getAuditTrail: BaseState<AuditTrail[], AuditTrailPayload>;
  getAddExpenses: BaseState<AdditionalExpenses[], AdditionalExpensesPayload>;
  createAddExpenses: BaseState<CreateAdditionalExpensesPayload>;
}

export interface FilterParams {
  branchId?: string[];
  shipmentType?: string[];
}

export interface Summary {
  totalShipmentQty?: number;
  totalShipmentAmount?: number;
  totalTransferredQty?: number;
  totalTransferredAmount?: number;
  totalExpenseRequestedQty?: number;
  totalExpenseRequestedAmount?: number;
  totalAdditionalRequestQty?: number;
  totalAdditionalRequestAmount?: number;
}

export interface SummaryExpenses {
  branchId?: string;
  branchName?: string;
  requestedQty?: number;
  requestedAmount?: number;
  termin1Qty?: number;
  termin1Amount?: number;
  termin2Qty?: number;
  termin2Amount?: number;
  termin3Qty?: number;
  termin3Amoun?: number;
  termin4Qty?: number;
  termin4Amount?: number;
  termin5Qty?: number;
  termin5Amount?: number;
  termin6Qty?: number;
  termin6Amount?: number;
  totalQty?: number;
  totalAmount?: number;
}

export interface ShipmentExpenses extends BaseResponseData {
  no?: number;
  id?: string;
  shipmentId?: string;
  shipmentNo?: string;
  customerName?: string;
  expenseType?: string;
  fuel?: number;
  toll?: number;
  mell?: number;
  loadingUnloading?: number;
  harborCrossing?: number;
  workerContributions?: number;
  security?: number;
  incentiveKM?: number;
  incentiveDaily?: number;
  incentiveSIO?: number;
  termin1?: number;
  termin2?: number;
  termin3?: number;
  termin4?: number;
  termin5?: number;
  termin6?: number;
  soNumber?: string;
  soCreatedDate?: string;
  note?: string;
  IsBillToCustomer: false;
  status?: string;
  approvalNote: null;
  bookingOrderNo?: string;
  shipmentType?: string;
  licensePlate?: string;
  unitType?: string;
  originName?: string;
  destinationName?: string;
  driver1Id?: string;
  driver1Name?: string;
  driver1vkvd?: string;
  driver2Id?: string;
  driver2Name?: string;
  driver2vkvd?: string;
  expenseTransfered?: number;
  totalExpense?: number;
  termin1TransferDate?: string;
}

export interface DetailExpenses extends BaseResponseData {
  details?: DetailExpensesDetail[];
}

export interface DetailExpensesDetail {
  no?: number;
  id?: string;
  amount?: number;
  adminFee?: number;
  approvalNote?: string;
  bphNumber?: string;
  driverId?: string;
  driverType?: string;
  note?: string;
  referenceNumber?: string;
  shipmentExpenseId?: string;
  status?: string;
  termin?: number;
  transferredDate?: string;
  umNumber?: string;
}

export interface AuditTrail extends BaseResponseData {
  no?: number;
  id?: string;
  shipmentId?: string;
  status?: string;
  description?: string;
}

export interface AdditionalExpenses extends BaseResponseData {
  no?: number;
  id?: string;
  expenseType?: string;
  fuel?: number;
  toll?: number;
  mell?: number;
  loadingUnloading?: number;
  harborCrossing?: number;
  workerContributions?: number;
  security?: number;
  incentiveKM?: number;
  incentiveDaily?: number;
  incentiveSIO?: number;
  note?: string;
  isBillingToCustomer?: boolean;
  totalExpense?: number;
}

export interface UpdateTermin1DatePayload {
  id?: string;
  termin1TransferDate?: string;
}

export interface DetailExpensesPayload {
  id?: string;
}

export interface UpdateDetailExpensePayload {
  id?: string;
  umNumber?: string;
  bphNumber?: string;
  transferredDate?: string;
  amount?: string;
  referenceNumber?: string;
  note?: string;
}

export interface AuditTrailPayload {
  id?: string;
}

export interface CreateAdditionalExpensesPayload {
  branchId?: string;
  shipmentId?: string;
  shipmentNo?: string;
  shipmentType?: string;
  customerName?: string;
  fuel?: number;
  toll?: number;
  mell?: number;
  loadingUnloading?: number;
  harborCrossing?: number;
  workerContributions?: number;
  security?: number;
  incentiveKM?: number;
  incentiveDaily?: number;
  incentiveSIO?: number;
  isBillToCustomer?: number;
  note?: string;
}

export interface AdditionalExpensesPayload extends BaseType {
  id?: string;
}

export interface SummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface SummaryExpensesResponse {
  status?: boolean;
  message?: string;
  data?: SummaryExpenses[];
  code?: string;
  eTag?: string;
}

export interface ShipmentExpensesResponse {
  status?: boolean;
  message?: string;
  data?: ShipmentExpenses[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface DetailExpensesResponse {
  status?: boolean;
  message?: string;
  data?: DetailExpenses[];
  code?: string;
  eTag?: string;
}

export interface AuditTrailResponse {
  status?: boolean;
  message?: string;
  data?: AuditTrail[];
  code?: string;
  eTag?: string;
}

export interface AdditionalExpensesResponse {
  status?: boolean;
  message?: string;
  data?: AdditionalExpenses[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const expenseTypes = {
  GET_SUMMARY: "expenseMonitoring/getSummary",
  GET_SUMMARY_FETCH: "expenseMonitoring/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "expenseMonitoring/getSummarySuccess",
  GET_SUMMARY_FAILURE: "expenseMonitoring/getSummaryFailure",

  GET_SUMMARY_EXPENSES: "expenseMonitoring/getSummaryExpenses",
  GET_SUMMARY_EXPENSES_FETCH: "expenseMonitoring/getSummaryExpensesFetch",
  GET_SUMMARY_EXPENSES_SUCCESS: "expenseMonitoring/getSummaryExpensesSuccess",
  GET_SUMMARY_EXPENSES_FAILURE: "expenseMonitoring/getSummaryExpensesFailure",

  GET_SHIPMENT_EXPENSES: "expenseMonitoring/getShipmentExpenses",
  GET_SHIPMENT_EXPENSES_FETCH: "expenseMonitoring/getShipmentExpensesFetch",
  GET_SHIPMENT_EXPENSES_SUCCESS: "expenseMonitoring/getShipmentExpensesSuccess",
  GET_SHIPMENT_EXPENSES_FAILURE: "expenseMonitoring/getShipmentExpensesFailure",

  GET_AC_SHIPMENT_EXPENSES: "expenseMonitoring/getACShipmentExpenses",
  GET_AC_SHIPMENT_EXPENSES_FETCH:
    "expenseMonitoring/getACShipmentExpensesFetch",
  GET_AC_SHIPMENT_EXPENSES_SUCCESS:
    "expenseMonitoring/getACShipmentExpensesSuccess",
  GET_AC_SHIPMENT_EXPENSES_FAILURE:
    "expenseMonitoring/getACShipmentExpensesFailure",

  UPDATE_TERMIN1_DATE: "expenseMonitoring/updateTermin1Date",
  UPDATE_TERMIN1_DATE_FETCH: "expenseMonitoring/updateTermin1DateFetch",
  UPDATE_TERMIN1_DATE_SUCCESS: "expenseMonitoring/updateTermin1DateSuccess",
  UPDATE_TERMIN1_DATE_FAILURE: "expenseMonitoring/updateTermin1DateFailure",

  GET_DETAIL_EXPENSES: "expenseMonitoring/getDetailExpenses",
  GET_DETAIL_EXPENSES_FETCH: "expenseMonitoring/getDetailExpensesFetch",
  GET_DETAIL_EXPENSES_SUCCESS: "expenseMonitoring/getDetailExpensesSuccess",
  GET_DETAIL_EXPENSES_FAILURE: "expenseMonitoring/getDetailExpensesFailure",

  UPDATE_DETAIL_EXPENSE: "expenseMonitoring/updateDetailExpense",
  UPDATE_DETAIL_EXPENSE_FETCH: "expenseMonitoring/updateDetailExpenseFetch",
  UPDATE_DETAIL_EXPENSE_SUCCESS: "expenseMonitoring/updateDetailExpenseSuccess",
  UPDATE_DETAIL_EXPENSE_FAILURE: "expenseMonitoring/updateDetailExpenseFailure",

  GET_AUDIT_TRAIL: "expenseMonitoring/getAuditTrail",
  GET_AUDIT_TRAIL_FETCH: "expenseMonitoring/getAuditTrailFetch",
  GET_AUDIT_TRAIL_SUCCESS: "expenseMonitoring/getAuditTrailSuccess",
  GET_AUDIT_TRAIL_FAILURE: "expenseMonitoring/getAuditTrailFailure",

  GET_ADD_EXPENSES: "expenseMonitoring/getAddExpenses",
  GET_ADD_EXPENSES_FETCH: "expenseMonitoring/getAddExpensesFetch",
  GET_ADD_EXPENSES_SUCCESS: "expenseMonitoring/getAddExpensesSuccess",
  GET_ADD_EXPENSES_FAILURE: "expenseMonitoring/getAddExpensesFailure",

  CREATE_ADD_EXPENSES: "expenseMonitoring/createAddExpenses",
  CREATE_ADD_EXPENSES_FETCH: "expenseMonitoring/createAddExpensesFetch",
  CREATE_ADD_EXPENSES_SUCCESS: "expenseMonitoring/createAddExpensesSuccess",
  CREATE_ADD_EXPENSES_FAILURE: "expenseMonitoring/createAddExpensesFailure",
};
