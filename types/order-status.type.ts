import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface BaseDetailLocationOrderStatus {
  id: string;
  area: string;
  address: string;
  name: string;
  province: string;
  type: string;
  coordinate: string;
}

export interface OrderStatusRecord {
  id: string;
  no?: number;
  createdAt: string;
  createdBy: string;
  shipmentNo: string;
  shipmentType: string;
  customerName: string;
  salesDealing: string;
  salesServicing: string;
  unitType: string;
  origin: string;
  detailOrigin: BaseDetailLocationOrderStatus;
  destination: string;
  detailDestination: BaseDetailLocationOrderStatus;
  revenue: string;
  status: string;
  soNumber: string;
  updatedAt: string;
  updatedBy: string;
}

export interface OrderStatusSummaryInformation {
  summary: {
    totalShipment: number;
    pairingProcess: number;
    shipmentJourney: number;
    shipmentOrder: number;
    administrationProcess: number;
    shipmentDone: number;
  };
  shipmentStatus: {
    status: string;
    branches: {
      name: string;
      count: number;
    }[];
  }[];
}

export interface ShipmentStatusProgress {
  status?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
}

export interface RouteLocation {
  locationId: string;
  locationName: string;
  address: string;
  routeOrder: number;
  routeActivityType: string;
}

export interface ShipmentRouteDetail {
  customerRouteId: string;
  routeCode: string;
  notes: string;
  routeLocations: RouteLocation[];
}

export interface ShipmentStatusInfo {
  id: string;
  bookingOrderNo: string;
  shipmentNo: string;
  shipmentType: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  licensePlate: string;
  unitTypeId: string;
  unitTypeName: string;
  salesDealing: string;
  salesServicing: string;
  branchId: string;
  branchName: string;
  pickUpDate: string;
  qtyDriver: number;
  driverId: string;
  driverId1: string;
  driverId2: string;
  driverName1: string;
  driverName2: string;
  status: string;
  confirmationStatus: string;
  additionalRequests: {
    id: string;
    name: string;
  }[];
  shipmentDetail: ShipmentRouteDetail;
  // shipmentNo?: string;
  // shipmentType?: string;
  // customerName?: string;
  // vehicleId?: string;
  // driverId?: string;
  // branchId?: string;
  // customerId?: string;
  // status?: string;
  // startJourneyDate?: string;
  // endJourneyDate?: string;
}

export interface OrderStatusDetail {
  shipment?: ShipmentStatusInfo;
  shipmentStatus?: ShipmentStatusProgress[];
}

export interface OrderStatusDetailPayload {
  id: string;
}

export interface OrderStatusSummaryPayload {
  shipmentType?: string[];
  status?: string[];
}

export interface OrderStatusReroutePayload {
  shipmentId: string;
  customerRouteId: string;
  reason: string;
  callback?: () => void;
}

export interface OrderStatusCancelPayload {
  shipmentId: string;
  cancellationReason: string;
  chronology: string;
  callback?: () => void;
}

export interface OrderStatusReschedulePayload {
  shipmentId: string;
  pickupDate: string; //YYYY-MM-DD HH:mm
  reason: string;
  callback?: () => void;
}

export interface GetOrderStatusResponse extends BaseType {
  transactionId?: string;
  code?: string;
  message?: string;
  eTag?: string;
  data?: OrderStatusRecord[];
  pagination?: PaginationType;
}

export type GetOrderDetailResponse = BaseResponse<OrderStatusDetail>;
export type GetOrderStatusSummaryResponse =
  BaseResponse<OrderStatusSummaryInformation>;

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export interface OrderStatusState extends BaseState<OrderStatusRecord[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  summary: BaseState<OrderStatusSummaryInformation>;
  detail: BaseState<OrderStatusDetail, OrderStatusDetailPayload>;
  updateReroute: BaseState<OrderStatusReroutePayload>;
  updateCancel: BaseState<OrderStatusCancelPayload>;
  updateReschedule: BaseState<OrderStatusReschedulePayload>;
}

export const orderStatusTypes = {
  GET_ORDER_STATUS: "orderStatus/getOrderStatus",
  GET_ORDER_STATUS_FETCH: "orderStatus/getOrderStatusFetch",
  GET_ORDER_STATUS_SUCCESS: "orderStatus/getOrderStatusSuccess",
  GET_ORDER_STATUS_FAILURE: "orderStatus/getOrderStatusFailure",

  GET_ORDER_STATUS_DETAIL: "orderStatus/getOrderStatusDetail",
  GET_ORDER_STATUS_DETAIL_FETCH: "orderStatus/getOrderStatusDetailFetch",
  GET_ORDER_STATUS_DETAIL_SUCCESS: "orderStatus/getOrderStatusDetailSuccess",
  GET_ORDER_STATUS_DETAIL_FAILURE: "orderStatus/getOrderStatusDetailFailure",

  GET_ORDER_STATUS_AUTOCOMPLETE: "orderStatus/getOrderStatusAutoComplete",
  GET_ORDER_STATUS_AUTOCOMPLETE_FETCH:
    "orderStatus/getOrderStatusAutoCompleteFetch",
  GET_ORDER_STATUS_AUTOCOMPLETE_SUCCESS:
    "orderStatus/getOrderStatusAutoCompleteSuccess",
  GET_ORDER_STATUS_AUTOCOMPLETE_FAILURE:
    "orderStatus/getOrderStatusAutoCompleteFailure",

  GET_ORDER_STATUS_SUMMARY_INFORMATION:
    "orderStatus/getOrderStatusSummaryInformation",
  GET_ORDER_STATUS_SUMMARY_INFORMATION_FETCH:
    "orderStatus/getOrderStatusSummaryInformationFetch",
  GET_ORDER_STATUS_SUMMARY_INFORMATION_SUCCESS:
    "orderStatus/getOrderStatusSummaryInformationSuccess",
  GET_ORDER_STATUS_SUMMARY_INFORMATION_FAILURE:
    "orderStatus/getOrderStatusSummaryInformationFailure",

  UPDATE_REROUTE_ORDER_STATUS: "orderStatus/updateRerouteOrderStatus",
  UPDATE_REROUTE_ORDER_STATUS_FETCH:
    "orderStatus/updateRerouteOrderStatusFetch",
  UPDATE_REROUTE_ORDER_STATUS_SUCCESS:
    "orderStatus/updateRerouteOrderStatusSuccess",
  UPDATE_REROUTE_ORDER_STATUS_FAILURE:
    "orderStatus/updateRerouteOrderStatusFailure",

  UPDATE_CANCEL_ORDER_STATUS: "orderStatus/updateCancelOrderStatus",
  UPDATE_CANCEL_ORDER_STATUS_FETCH: "orderStatus/updateCancelOrderStatusFetch",
  UPDATE_CANCEL_ORDER_STATUS_SUCCESS:
    "orderStatus/updateCancelOrderStatusSuccess",
  UPDATE_CANCEL_ORDER_STATUS_FAILURE:
    "orderStatus/updateCancelOrderStatusFailure",

  UPDATE_RESCHEDULE_ORDER_STATUS: "orderStatus/updateRescheduleOrderStatus",
  UPDATE_RESCHEDULE_ORDER_STATUS_FETCH:
    "orderStatus/updateRescheduleOrderStatusFetch",
  UPDATE_RESCHEDULE_ORDER_STATUS_SUCCESS:
    "orderStatus/updateRescheduleOrderStatusSuccess",
  UPDATE_RESCHEDULE_ORDER_STATUS_FAILURE:
    "orderStatus/updateRescheduleOrderStatusFailure",
};
