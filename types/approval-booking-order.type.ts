import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface ApprovalBookingOrderState
  extends BaseState<ApprovalBookingRecord[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  summary: BaseState<
    ApprovalBookingOrderSummary,
    ApprovalBookingOrderSummaryPayload
  >;
  detailApprovalBooking: BaseState<
    ApprovalBookingOrderDetail,
    ApprovalBookingOrderDetailPayload
  >;
  updateApprovalBooking: BaseState<
    { id?: string },
    UpdateApprovalBookingOrderPayload
  >;
  confirmationStatus: BaseState<ConfirmationStatus[]>;
}

export interface ApprovalBookingRecord {
  no?: number;
  id: string;
  createdAt: string;
  createdBy: string;
  bookingCode: string;
  branchId: string;
  branchName: string;
  salesDealing: string;
  salesServicing: string;
  shipmentType: string;
  serviceType: string;
  pickupDate: string;
  customerName: string;
  unitType: string;
  origin: string;
  destination: string;
  qtyUnit: number;
  fulfill: number;
  unfill: number;
  notes: string;
  confirmationStatus: string;
  confirmedBy: string;
  confirmedAt: string;
}

export interface ApprovalBookingOrderSummary {
  totalOrder: number;
  totalConfirmed: number;
  totalRejected: number;
  totalRequested: number;
  totalCancelled: number;
}

export interface ApprovalBookingOrderSummaryPayload {
  branchId?: string[];
}

export interface ApprovalBookingOrderDetail {
  id?: string;
  salesDealing?: string;
  salesServicing?: string;
  branchId?: string;
  branchName?: string;
  pickupDate?: string;
  pickupTime?: string;
  customerId?: string;
  customerName?: string;
  shipmentType?: string;
  additionalRequests?: AdditionalRequest[];
  unitTypeId?: string;
  customerRouteId?: string;
  qtyDriver?: number;
  qtyUnit?: number;
  routeCode?: string;
  shipmentDetail?: ShipmentDetail;
  notes?: string;
  status?: string;
  isDraft?: boolean;
}

export interface AdditionalRequest {
  id?: string;
  itemName?: string;
}

export interface ShipmentDetail {
  shipmentId: string;
  vehicleId: string;
  estimateTimeArrival: string;
  drivers: string[];
  routeLocations: RouteLocation[];
}

export interface RouteLocation {
  locationName: string;
  routeOrder: number;
  routeActivityType: string;
}

export interface ApprovalBookingOrderDetailPayload {
  id?: string;
}

export interface UpdateApprovalBookingOrderPayload {
  id: string;
  fulfill: number;
  note: string;
  callback?: () => void;
}

export interface ConfirmationStatus {
  id: string;
  name: string;
  description: string;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export interface GetApprovalBookingOrderResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: ApprovalBookingRecord[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export type GetApprovalBookingOrderDetailResponse =
  BaseResponse<ApprovalBookingOrderDetail>;
export type GetApprovalBookingOrderSummaryResponse =
  BaseResponse<ApprovalBookingOrderSummary>;
export type UpdateApprovalBookingOrderResponse = BaseResponse<{ id?: string }>;
export type GetConfirmationStatusResponse = BaseResponse<ConfirmationStatus[]>;

export const approvalBookingOrderTypes = {
  GET_APPROVAL_BOOKING_ORDER: "approvalBookingOrder/getApprovalBookingOrder",
  GET_APPROVAL_BOOKING_ORDER_FETCH:
    "approvalBookingOrder/getApprovalBookingOrderFetch",
  GET_APPROVAL_BOOKING_ORDER_SUCCESS:
    "approvalBookingOrder/getApprovalBookingOrderSuccess",
  GET_APPROVAL_BOOKING_ORDER_FAILURE:
    "approvalBookingOrder/getApprovalBookingOrderFailure",

  GET_APPROVAL_BOOKING_ORDER_AUTOCOMPLETE:
    "approvalBookingOrder/getApprovalBookingOrderAutoComplete",
  GET_APPROVAL_BOOKING_ORDER_AUTOCOMPLETE_FETCH:
    "approvalBookingOrder/getApprovalBookingOrderAutoCompleteFetch",
  GET_APPROVAL_BOOKING_ORDER_AUTOCOMPLETE_SUCCESS:
    "approvalBookingOrder/getApprovalBookingOrderAutoCompleteSuccess",
  GET_APPROVAL_BOOKING_ORDER_AUTOCOMPLETE_FAILURE:
    "approvalBookingOrder/getApprovalBookingOrderAutoCompleteFailure",

  GET_APPROVAL_BOOKING_ORDER_DETAIL:
    "approvalBookingOrder/getApprovalBookingOrderDetail",
  GET_APPROVAL_BOOKING_ORDER_DETAIL_FETCH:
    "approvalBookingOrder/getApprovalBookingOrderDetailFetch",
  GET_APPROVAL_BOOKING_ORDER_DETAIL_SUCCESS:
    "approvalBookingOrder/getApprovalBookingOrderDetailSuccess",
  GET_APPROVAL_BOOKING_ORDER_DETAIL_FAILURE:
    "approvalBookingOrder/getApprovalBookingOrderDetailFailure",

  GET_APPROVAL_BOOKING_ORDER_SUMMARY:
    "approvalBookingOrder/getApprovalBookingOrderSummary",
  GET_APPROVAL_BOOKING_ORDER_SUMMARY_FETCH:
    "approvalBookingOrder/getApprovalBookingOrderSummaryFetch",
  GET_APPROVAL_BOOKING_ORDER_SUMMARY_SUCCESS:
    "approvalBookingOrder/getApprovalBookingOrderSummarySuccess",
  GET_APPROVAL_BOOKING_ORDER_SUMMARY_FAILURE:
    "approvalBookingOrder/getApprovalBookingOrderSummaryFailure",

  UPDATE_APPROVAL_BOOKING_ORDER:
    "approvalBookingOrder/updateApprovalBookingOrder",
  UPDATE_APPROVAL_BOOKING_ORDER_FETCH:
    "approvalBookingOrder/updateApprovalBookingOrderFetch",
  UPDATE_APPROVAL_BOOKING_ORDER_SUCCESS:
    "approvalBookingOrder/updateApprovalBookingOrderSuccess",
  UPDATE_APPROVAL_BOOKING_ORDER_FAILURE:
    "approvalBookingOrder/updateApprovalBookingOrderFailure",

  GET_CONFIRMATION_STATUS: "approvalBookingOrder/getConfirmationStatus",
  GET_CONFIRMATION_STATUS_FETCH:
    "approvalBookingOrder/getConfirmationStatusFetch",
  GET_CONFIRMATION_STATUS_SUCCESS:
    "approvalBookingOrder/getConfirmationStatusSuccess",
  GET_CONFIRMATION_STATUS_FAILURE:
    "approvalBookingOrder/getConfirmationStatusFailure",
};
