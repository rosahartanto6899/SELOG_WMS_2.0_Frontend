import { AutoCompleteType, BaseListResponse, BaseState } from "./base.type";

export interface ShipmentDetailPayload {
  additionalRequest?: { id: string; name: string }[];
  bookingNumber?: string;
  branch?: string;
  branchOrder?: string;
  contractNo?: string;
  customerName?: string;
  distanceCargo?: string;
  distanceEmpty?: string;
  driver1_branch?: string;
  driver1_customerName?: string;
  driver1_driverId?: string;
  driver1_driverName?: string;
  driver1_employeeStatus?: string;
  driver1_mobilePhone?: string;
  driver1_note?: string;
  driver1_shipmentType?: string;
  driver1_tierDriver?: string;
  driver1_vkVd?: string;
  driver2_branch?: string;
  driver2_customerName?: string;
  vehicle_customerName?: string;
  driver2_driverId?: string;
  driver2_driverName?: string;
  driver2_employeeStatus?: string;
  driver2_mobilePhone?: string;
  driver2_note?: string;
  driver2_shipmentType?: string;
  driver2_tierDriver?: string;
  driver2_vkVd?: string;
  eta?: string;
  expenseRatio?: number | string;
  fuel?: number;
  fuelCargo?: number;
  fuelEmpty?: number;
  harborCrossing?: number;
  hasDashcam?: boolean | string;
  hasObd?: boolean | string;
  incentiveDaily?: number;
  incentiveKm?: number;
  incentiveSio?: number;
  jmpCode?: string;
  licensePlate?: string;
  loadingUnloading?: number;
  mell?: number;
  note?: string;
  vehicleNote?: string;
  ownership?: string;
  pickupDate?: string;
  revenue?: number | string;
  routeCode?: string;
  salesDealing?: string;
  salesServicing?: string;
  security?: number;
  shipmentNumber?: string;
  shipmentType?: string;
  soCreatedDate?: string;
  soNumber?: string;
  toleranceCargo?: number;
  toleranceEmpty?: number;
  toll?: number;
  tollUsage?: number | string;
  totalCost?: number;
  totalDistance?: number;
  totalDistanceCargo?: number;
  totalDistanceEmpty?: number;
  totalExpense?: number;
  totalFuel?: number;
  totalIncentive?: number;
  unitType?: string;
  vin?: string;
  workerContributions?: string;
  year?: string;
  documentShippingFee?: number;
  termin1?: number;
  termin2?: number;
  termin3?: number;
  termin4?: number;
  termin5?: number;
  termin6?: number;
}

export interface SummaryRouteRecord {
  no: number;
  type: string;
  location: string;
  address: string;
  province: string;
  city: string;
  district: string;
  area: string;
}

export interface AdditionalExpenseRecord {
  no: number;
  id: string;
  shipmentId: string;
  referenceValue: string;
  approvalMatrixRoleId: string;
  status: string;
  roleName: string;
  shipmentNo: string;
  bookingOrderNo: string;
  branchId: string;
  branchName: string;
  startJourneyDate: string;
  customerName: string;
  shipmentType: string;
  unitType: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  licensePlate: string;
  driver1: string;
  driver1Name: string;
  driver2: string;
  driver2Name: string;
  requestType: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  type: string;
  expenseAmount: number;
}

export interface ShipmentExpenseDetail {
  id: string;
  shipmentExpenseId: string;
  driverId: string;
  driverType: string;
  termin: number;
  umNumber: string;
  bphNumber: string;
  transferredDate: string;
  amount: number;
  referenceNumber: string;
  status: string;
  note: string;
  approvalNote: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ShipmentExpenseDetailRecord {
  id: string;
  branchId: string;
  shipmentId: string;
  details: ShipmentExpenseDetail[];
}

export interface AdditionalExpenseSummaryRoute {
  type: string;
  location: string;
  address: string;
  province: string;
  city: string;
  district: string;
  area: string;
}

export interface AdditionalExpenseDetailDriver {
  no: number;
  termin: string;
  umNumber: string;
  bphNumber: string;
  transferredDate: string;
  amount: number;
  referenceNumber: string;
  status: string;
  note: string;
  approvalNote: string;
}

export interface AdditionalExpenseAuditTrail {
  createdAt: string;
  createdBy: string;
  createdByName: string;
  description: string | null;
  id: string;
  shipmentId: string;
  status: string;
}

export interface AdditionalExpenseSummary {
  waitingForApproval: number;
  approved: number;
  rejected: number;
  total: number;
  open: number;
}

export interface AdditionalExpenseDetail {
  id?: string;
  branchId?: string;
  shipmentId?: string;
  shipmentNo?: string;
  shipmentType?: string;
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
  isBillToCustomer?: boolean;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string | null;
  approvalNote?: string | null;
}

export interface AdditionalExpenseSummaryPayload {
  branchId?: string[];
  shipmentType?: string[];
}

export interface AdditionalExpenseDetailPayload {
  id: string;
}

export interface UpdateApprovalAdditionalExpensePayload {
  referenceId: string;
  note?: string;
  type: "approve" | "reject";
  callback?: () => void;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export type GetAdditionalExpenseListResponse = BaseListResponse<
  AdditionalExpenseRecord[]
>;

export type GetAdditionalExpenseSummaryResponse = BaseResponse<{
  summary: AdditionalExpenseSummary;
}>;

export type GetAdditionalExpenseDetailResponse =
  BaseResponse<AdditionalExpenseDetail>;
export type GetExpenseDetailResponse = BaseResponse<
  ShipmentExpenseDetailRecord[]
>;
export type GetAuditTrailResponse = BaseResponse<AdditionalExpenseAuditTrail[]>;
export interface AdditionalExpenseState
  extends BaseState<AdditionalExpenseRecord[]> {
  detail: BaseState<AdditionalExpenseDetail, AdditionalExpenseDetailPayload>;
  summary: BaseState<AdditionalExpenseSummary, AdditionalExpenseSummaryPayload>;
  autoComplete: BaseState<AutoCompleteType[]>;
  auditTrail: BaseState<
    AdditionalExpenseAuditTrail[],
    AdditionalExpenseDetailPayload
  >;
  expenseDetail: BaseState<
    ShipmentExpenseDetailRecord[],
    AdditionalExpenseDetailPayload
  >;
  updateApproval: BaseState<UpdateApprovalAdditionalExpensePayload>;
}

export const additionalExpenseTypes = {
  GET_ADDITIONAL_EXPENSE: "additionalExpense/getAdditionalExpense",
  GET_ADDITIONAL_EXPENSE_FETCH: "additionalExpense/getAdditionalExpenseFetch",
  GET_ADDITIONAL_EXPENSE_SUCCESS:
    "additionalExpense/getAdditionalExpenseSuccess",
  GET_ADDITIONAL_EXPENSE_FAILURE:
    "additionalExpense/getAdditionalExpenseFailure",
  GET_ADDITIONAL_EXPENSE_CLEAR: "additionalExpense/getAdditionalExpenseClear",

  GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE:
    "additionalExpense/getAdditionalExpenseAutoComplete",
  GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE_FETCH:
    "additionalExpense/getAdditionalExpenseAutoCompleteFetch",
  GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE_SUCCESS:
    "additionalExpense/getAdditionalExpenseAutoCompleteSuccess",
  GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE_FAILURE:
    "additionalExpense/getAdditionalExpenseAutoCompleteFailure",
  GET_ADDITIONAL_EXPENSE_AUTOCOMPLETE_CLEAR:
    "additionalExpense/getAdditionalExpenseAutoCompleteClear",

  GET_ADDITIONAL_EXPENSE_SUMMARY:
    "additionalExpense/getAdditionalExpenseSummary",
  GET_ADDITIONAL_EXPENSE_SUMMARY_FETCH:
    "additionalExpense/getAdditionalExpenseSummaryFetch",
  GET_ADDITIONAL_EXPENSE_SUMMARY_SUCCESS:
    "additionalExpense/getAdditionalExpenseSummarySuccess",
  GET_ADDITIONAL_EXPENSE_SUMMARY_FAILURE:
    "additionalExpense/getAdditionalExpenseSummaryFailure",
  GET_ADDITIONAL_EXPENSE_SUMMARY_CLEAR:
    "additionalExpense/getAdditionalExpenseSummaryClear",

  GET_ADDITIONAL_EXPENSE_DETAIL: "additionalExpense/getAdditionalExpenseDetail",
  GET_ADDITIONAL_EXPENSE_DETAIL_FETCH:
    "additionalExpense/getAdditionalExpenseDetailFetch",
  GET_ADDITIONAL_EXPENSE_DETAIL_SUCCESS:
    "additionalExpense/getAdditionalExpenseDetailSuccess",
  GET_ADDITIONAL_EXPENSE_DETAIL_FAILURE:
    "additionalExpense/getAdditionalExpenseDetailFailure",
  GET_ADDITIONAL_EXPENSE_DETAIL_CLEAR:
    "additionalExpense/getAdditionalExpenseDetailClear",

  GET_EXPENSE_DETAIL: "additionalExpense/getExpenseDetail",
  GET_EXPENSE_DETAIL_FETCH: "additionalExpense/getExpenseDetailFetch",
  GET_EXPENSE_DETAIL_SUCCESS: "additionalExpense/getExpenseDetailSuccess",
  GET_EXPENSE_DETAIL_FAILURE: "additionalExpense/getExpenseDetailFailure",
  GET_EXPENSE_DETAIL_CLEAR: "additionalExpense/getExpenseDetailClear",

  GET_AUDIT_TRAIL: "additionalExpense/getAuditTrail",
  GET_AUDIT_TRAIL_FETCH: "additionalExpense/getAuditTrailFetch",
  GET_AUDIT_TRAIL_SUCCESS: "additionalExpense/getAuditTrailSuccess",
  GET_AUDIT_TRAIL_FAILURE: "additionalExpense/getAuditTrailFailure",
  GET_AUDIT_TRAIL_CLEAR: "additionalExpense/getAuditTrailClear",

  UPDATE_APPROVAL_ADDITIONAL_EXPENSE:
    "additionalExpense/updateApprovalAdditionalExpense",
  UPDATE_APPROVAL_ADDITIONAL_EXPENSE_FETCH:
    "additionalExpense/updateApprovalAdditionalExpenseFetch",
  UPDATE_APPROVAL_ADDITIONAL_EXPENSE_SUCCESS:
    "additionalExpense/updateApprovalAdditionalExpenseSuccess",
  UPDATE_APPROVAL_ADDITIONAL_EXPENSE_FAILURE:
    "additionalExpense/updateApprovalAdditionalExpenseFailure",
  UPDATE_APPROVAL_ADDITIONAL_EXPENSE_CLEAR:
    "additionalExpense/updateApprovalAdditionalExpenseClear",
};
