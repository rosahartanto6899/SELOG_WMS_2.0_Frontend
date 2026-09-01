import {
  AutoCompleteType,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface BookingOrderAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface BookingOrderAdditonalRequest {
  id: string;
  name: string;
}

export interface BookingOrderState extends BaseState<BookingOrderRecord[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  summary: BaseState<BookingOrderSummary, BookingOrderSummaryPayload>;
  detailBooking: BaseState<BookingOrderDetail, BookingOrderDetailPayload>;
  createBooking: BaseState<CreateBookingOrderResponse>;
  updateBooking: BaseState<
    UpdateBookingOrderResponse,
    UpdateBookingOrderPayload
  >;
  updateStatusBooking: BaseState<UpdateStatusBookingOrderPayload>;
  dropdownAdditionalRequestItems: BaseState<BookingOrderAdditonalRequest[]>;
}

export interface BookingOrderRecord {
  no?: number;
  id: string;
  createdAt: string;
  createdBy: string;
  bookingCode: string;
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
  fulfill: number;
  fulfillment: number;
  unfill: number;
  approvalStatus: string;
  approvedBy: string;
  approvedDate: string;
  notes: string;
}

export interface BookingOrderSummary {
  totalOrder: number;
  totalConfirmed: number;
  totalRejected: number;
  totalRequested: number;
}

export interface RouteLocations {
  customerRouteId?: string;
  routeOrder?: number;
  routeActivityType?: string;
  qtyDriver?: number;
  origin?: string;
  destination?: string;
}

export interface ShipmentDetail {
  vehicleId?: string;
  unitTypeName?: string;
  shipmentId?: string;
  pickupHour?: string;
  routes?: string[];
  customerRoute?: string;
  customerRouteId?: string;
  drivers?: string[];
  notes?: string;
  qtyDriver?: number;
  qtyUnit?: number;
  unitTypeId?: string;
  routeCode?: string;
  routeLocations?: RouteLocations[];
}

export interface BookingShipmentStatus {
  status?: string;
  shipmentNumbers?: string[];
}

export interface RouteJourneyRecord {
  no?: number;
  type?: string;
  location?: string;
  address?: string;
}

export interface AdditionalRequestBookingOrder {
  id?: string;
  itemName?: string;
}

export interface BookingOrderDetail {
  id?: string;
  salesDealing?: string;
  salesServicing?: string;
  branchId?: string;
  pickUpDate?: string;
  shipmentType?: string;
  customerId?: string;
  additionalRequests?: AdditionalRequestBookingOrder[];
  shipmentDetail?: ShipmentDetail;
}

export interface BookingOrderPayload {
  isDropBase?: boolean;
  id?: string;
  salesDealing?: string;
  salesServicing?: string;
  branchId?: string;
  pickUpDate?: string;
  shipmentType?: string;
  customerId?: string;
  additionalRequests?: string[];
  isDraft?: boolean;
}

export interface BookingOrderSummaryPayload {
  shipmentType?: string[];
  branchId?: string[];
}

export interface LicensePlateRecord {
  licensePlate: string;
  vehicleYear: string;
  maintenanceStatus: string;
  shipmentStatus: string;
}

export interface DriverRecord {
  driverName: string;
  driverId: string;
  driverStatus: string;
  shipmentStatus: string;
}

export interface BookingOrderDetailPayload {
  id?: string;
  serviceType?: string;
}

export interface ShipmentStatusDatePayload {
  pickUpDate?: string;
  pickUpHour?: string;
}

export interface ShipmentStatusVehiclePayload
  extends ShipmentStatusDatePayload {
  vehicleId?: string;
}

export interface ShipmentStatusDriverPayload extends ShipmentStatusDatePayload {
  driverId?: string;
}

export interface UpdateStatusBookingOrderPayload {
  id?: string;
  status?: string;
}

export type CreateBookingOrderPayload = BookingOrderPayload & {
  shipmentDetails?: ShipmentDetail[];
};
export type UpdateBookingOrderPayload = BookingOrderPayload & {
  shipmentDetail?: ShipmentDetail;
};
export interface BookingOrderResponse {
  list: BookingOrderRecord[];
}

export type BookingOrderSummaryResponse = BaseResponse<BookingOrderSummary>;
export type BookingOrderAdditionalRequestResposne = BaseResponse<
  BookingOrderAdditonalRequest[]
>;
export type BookingOrderDetailResponse = BaseResponse<BookingOrderDetail>;
export interface CreateBookingOrderResponse {
  bookingOrders?: {
    id: string;
    bookingOrderNo: string;
  }[];
  totalCreated?: 1;
}
export interface UpdateBookingOrderResponse {
  id?: string;
}

export interface BaseResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  code?: string;
  eTag?: string;
}

export interface GetBookingOrderResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: BookingOrderResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const bookingOrderTypes = {
  GET_BOOKING_ORDER: "bookingOrder/getBookingOrder",
  GET_BOOKING_ORDER_FETCH: "bookingOrder/getBookingOrderFetch",
  GET_BOOKING_ORDER_SUCCESS: "bookingOrder/getBookingOrderSuccess",
  GET_BOOKING_ORDER_FAILURE: "bookingOrder/getBookingOrderFailure",

  GET_BOOKING_ORDER_AUTOCOMPLETE: "bookingOrder/getBookingOrderAutoComplete",
  GET_BOOKING_ORDER_AUTOCOMPLETE_FETCH:
    "bookingOrder/getBookingOrderAutoCompleteFetch",
  GET_BOOKING_ORDER_AUTOCOMPLETE_SUCCESS:
    "bookingOrder/getBookingOrderAutoCompleteSuccess",
  GET_BOOKING_ORDER_AUTOCOMPLETE_FAILURE:
    "bookingOrder/getBookingOrderAutoCompleteFailure",

  GET_BOOKING_ORDER_DETAIL: "bookingOrder/getBookingOrderDetail",
  GET_BOOKING_ORDER_DETAIL_FETCH: "bookingOrder/getBookingOrderDetailFetch",
  GET_BOOKING_ORDER_DETAIL_SUCCESS: "bookingOrder/getBookingOrderDetailSuccess",
  GET_BOOKING_ORDER_DETAIL_FAILURE: "bookingOrder/getBookingOrderDetailFailure",

  GET_BOOKING_ORDER_SUMMARY: "bookingOrder/getBookingOrderSummary",
  GET_BOOKING_ORDER_SUMMARY_FETCH: "bookingOrder/getBookingOrderSummaryFetch",
  GET_BOOKING_ORDER_SUMMARY_SUCCESS:
    "bookingOrder/getBookingOrderSummarySuccess",
  GET_BOOKING_ORDER_SUMMARY_FAILURE:
    "bookingOrder/getBookingOrderSummaryFailure",

  GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS:
    "bookingOrder/getDropdownAdditionalRequestItems",
  GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS_FETCH:
    "bookingOrder/getDropdownAdditionalRequestItemsFetch",
  GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS_SUCCESS:
    "bookingOrder/getDropdownAdditionalRequestItemsSuccess",
  GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS_FAILURE:
    "bookingOrder/getDropdownAdditionalRequestItemsFailure",

  CREATE_BOOKING_ORDER: "bookingOrder/createBookingOrder",
  CREATE_BOOKING_ORDER_FETCH: "bookingOrder/createBookingOrderFetch",
  CREATE_BOOKING_ORDER_SUCCESS: "bookingOrder/createBookingOrderSuccess",
  CREATE_BOOKING_ORDER_FAILURE: "bookingOrder/createBookingOrderFailure",

  UPDATE_BOOKING_ORDER: "bookingOrder/updateBookingOrder",
  UPDATE_BOOKING_ORDER_FETCH: "bookingOrder/updateBookingOrderFetch",
  UPDATE_BOOKING_ORDER_SUCCESS: "bookingOrder/updateBookingOrderSuccess",
  UPDATE_BOOKING_ORDER_FAILURE: "bookingOrder/updateBookingOrderFailure",

  UPDATE_BOOKING_ORDER_STATUS: "bookingOrder/updateBookingOrderStatus",
  UPDATE_BOOKING_ORDER_STATUS_FETCH:
    "bookingOrder/updateBookingOrderStatusFetch",
  UPDATE_BOOKING_ORDER_STATUS_SUCCESS:
    "bookingOrder/updateBookingOrderStatusSuccess",
  UPDATE_BOOKING_ORDER_STATUS_FAILURE:
    "bookingOrder/updateBookingOrderStatusFailure",
};
