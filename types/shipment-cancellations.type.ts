import { AutoCompleteType, BaseListResponse, BaseState } from "./base.type";

export interface ShipmentCancellationsRecord {
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
}

export interface ShipmentCancellationsSummaryRoute {
  type: string;
  location: string;
  address: string;
  province: string;
  city: string;
  district: string;
  area: string;
}

export interface ShipmentCancellationsDetailDriver {
  no: string;
  termin: string;
  umNumber: string;
  bphNumber: string;
  transferredDate: string;
  amount: string;
  referenceNumber: string;
  transferStatus: string;
  note: string;
  approvalNote: string;
}

export interface ShipmentCancellationsAuditTrail {
  no: string;
  expenseStatus: string;
  createdDate: string;
  createdBy: string;
  note: string;
}

export interface ShipmentCancellationsSummary {
  waitingForApproval: number;
  approved: number;
  rejected: number;
  total: number;
  open: number;
}

export interface ApprovalHistoryShipment {
  shipmentNo: string;
  createdAt: string;
  bookingOrder: {
    branchId: string;
  };
}

export interface ApprovalHistoryRequest {
  id: string;
  shipmentId: string;
  category: string;
  type: string;
  referenceValue: string | null;
  reason: string;
  description: string;
  shipment: ApprovalHistoryShipment;
}

export interface ApprovalHistoryRecord {
  id: string;
  status: string;
  confirmedByName: string;
  confirmedDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  shipmentApprovalRequest: ApprovalHistoryRequest;
}

export type ShipmentCancellationsDetail = any;

export interface ShipmentCancellationsSummaryPayload {
  branchId?: string[];
  shipmentType?: string[];
}

export interface ShipmentCancellationsDetailPayload {
  id: string;
}

export interface UpdateApprovalReroutePayload {
  action: "approve" | "reject";
  note: string;
  id: string;
  callback?: () => void;
}

export interface UpdateApprovalCancelPayload {
  action: "approve" | "reject";
  note: string;
  id: string;
  callback?: () => void;
}

export interface UpdateApprovalReschedulePayload {
  action: "approve" | "reject";
  note: string;
  id: string;
  callback?: () => void;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export type GetShipmentCancellationsListResponse = BaseListResponse<
  ShipmentCancellationsRecord[]
>;

export type GetShipmentCancellationsSummaryResponse = BaseResponse<{
  summary: ShipmentCancellationsSummary;
}>;

export type GetShipmentCancellationsDetailResponse =
  BaseResponse<ShipmentCancellationsDetail>;

export type GetApprovalHistoryResponse = BaseListResponse<
  ApprovalHistoryRecord[]
>;

export interface ShipmentCancellationsState
  extends BaseState<ShipmentCancellationsRecord[]> {
  detail: BaseState<
    ShipmentCancellationsDetail,
    ShipmentCancellationsDetailPayload
  >;
  summary: BaseState<
    ShipmentCancellationsSummary,
    ShipmentCancellationsSummaryPayload
  >;
  autoComplete: BaseState<AutoCompleteType[]>;
  approvalHistory: BaseState<ApprovalHistoryRecord[]>;
  updateApprovalReroute: BaseState<UpdateApprovalReroutePayload>;
  updateApprovalCancel: BaseState<UpdateApprovalCancelPayload>;
  updateApprovalReschedule: BaseState<UpdateApprovalReschedulePayload>;
}

export const shipmentCancellationsTypes = {
  GET_SHIPMENT_CANCELLATIONS: "shipmentCancellations/getShipmentCancellations",
  GET_SHIPMENT_CANCELLATIONS_FETCH:
    "shipmentCancellations/getShipmentCancellationsFetch",
  GET_SHIPMENT_CANCELLATIONS_SUCCESS:
    "shipmentCancellations/getShipmentCancellationsSuccess",
  GET_SHIPMENT_CANCELLATIONS_FAILURE:
    "shipmentCancellations/getShipmentCancellationsFailure",
  GET_SHIPMENT_CANCELLATIONS_CLEAR:
    "shipmentCancellations/getShipmentCancellationsClear",

  GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE:
    "shipmentCancellations/getShipmentCancellationsAutoComplete",
  GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE_FETCH:
    "shipmentCancellations/getShipmentCancellationsAutoCompleteFetch",
  GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE_SUCCESS:
    "shipmentCancellations/getShipmentCancellationsAutoCompleteSuccess",
  GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE_FAILURE:
    "shipmentCancellations/getShipmentCancellationsAutoCompleteFailure",
  GET_SHIPMENT_CANCELLATIONS_AUTOCOMPLETE_CLEAR:
    "shipmentCancellations/getShipmentCancellationsAutoCompleteClear",

  GET_SHIPMENT_CANCELLATIONS_SUMMARY:
    "shipmentCancellations/getShipmentCancellationsSummary",
  GET_SHIPMENT_CANCELLATIONS_SUMMARY_FETCH:
    "shipmentCancellations/getShipmentCancellationsSummaryFetch",
  GET_SHIPMENT_CANCELLATIONS_SUMMARY_SUCCESS:
    "shipmentCancellations/getShipmentCancellationsSummarySuccess",
  GET_SHIPMENT_CANCELLATIONS_SUMMARY_FAILURE:
    "shipmentCancellations/getShipmentCancellationsSummaryFailure",
  GET_SHIPMENT_CANCELLATIONS_SUMMARY_CLEAR:
    "shipmentCancellations/getShipmentCancellationsSummaryClear",

  GET_SHIPMENT_CANCELLATIONS_DETAIL:
    "shipmentCancellations/getShipmentCancellationsDetail",
  GET_SHIPMENT_CANCELLATIONS_DETAIL_FETCH:
    "shipmentCancellations/getShipmentCancellationsDetailFetch",
  GET_SHIPMENT_CANCELLATIONS_DETAIL_SUCCESS:
    "shipmentCancellations/getShipmentCancellationsDetailSuccess",
  GET_SHIPMENT_CANCELLATIONS_DETAIL_FAILURE:
    "shipmentCancellations/getShipmentCancellationsDetailFailure",
  GET_SHIPMENT_CANCELLATIONS_DETAIL_CLEAR:
    "shipmentCancellations/getShipmentCancellationsDetailClear",

  UPDATE_APPROVAL_REROUTE_SHIPMENT:
    "shipmentCancellations/updateApprovalRerouteShipment",
  UPDATE_APPROVAL_REROUTE_SHIPMENT_FETCH:
    "shipmentCancellations/updateApprovalRerouteShipmentFetch",
  UPDATE_APPROVAL_REROUTE_SHIPMENT_SUCCESS:
    "shipmentCancellations/updateApprovalRerouteShipmentSuccess",
  UPDATE_APPROVAL_REROUTE_SHIPMENT_FAILURE:
    "shipmentCancellations/updateApprovalRerouteShipmentFailure",

  UPDATE_APPROVAL_CANCEL_SHIPMENT:
    "shipmentCancellations/updateApprovalCancelShipment",
  UPDATE_APPROVAL_CANCEL_SHIPMENT_FETCH:
    "shipmentCancellations/updateApprovalCancelShipmentFetch",
  UPDATE_APPROVAL_CANCEL_SHIPMENT_SUCCESS:
    "shipmentCancellations/updateApprovalCancelShipmentSuccess",
  UPDATE_APPROVAL_CANCEL_SHIPMENT_FAILURE:
    "shipmentCancellations/updateApprovalCancelShipmentFailure",

  UPDATE_APPROVAL_RESCHEDULE_SHIPMENT:
    "shipmentCancellations/updateApprovalRescheduleShipment",
  UPDATE_APPROVAL_RESCHEDULE_SHIPMENT_FETCH:
    "shipmentCancellations/updateApprovalRescheduleShipmentFetch",
  UPDATE_APPROVAL_RESCHEDULE_SHIPMENT_SUCCESS:
    "shipmentCancellations/updateApprovalRescheduleShipmentSuccess",
  UPDATE_APPROVAL_RESCHEDULE_SHIPMENT_FAILURE:
    "shipmentCancellations/updateApprovalRescheduleShipmentFailure",

  GET_APPROVAL_HISTORY: "shipmentCancellations/getApprovalHistory",
  GET_APPROVAL_HISTORY_FETCH: "shipmentCancellations/getApprovalHistoryFetch",
  GET_APPROVAL_HISTORY_SUCCESS:
    "shipmentCancellations/getApprovalHistorySuccess",
  GET_APPROVAL_HISTORY_FAILURE:
    "shipmentCancellations/getApprovalHistoryFailure",
  GET_APPROVAL_HISTORY_CLEAR: "shipmentCancellations/getApprovalHistoryClear",
};
