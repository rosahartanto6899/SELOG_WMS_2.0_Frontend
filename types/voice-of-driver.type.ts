import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  PaginationType,
} from "./base.type";

export interface VoDState {
  getSummary: BaseState<Summary, ListParams>;
  getVoDList: BaseState<VoDList[], ListParams>;
  getACVoDList: BaseState<AutoCompleteType[], ListParams>;
  getShipment: BaseState<ShipmentList[]>;
  createVoD: BaseState<CreateVoD, CreateVoDPayload>;
  detailVoD: BaseState<DetailVoD, DetailVoDPayload>;
  updateVoD: BaseState<Record<string, boolean>, UpdateVoDPayload>;
}

export interface ListParams {
  branchId?: string[];
  status?: string[];
  voiceType?: string[];
}

export interface Summary {
  summary?: {
    total?: number;
    open?: number;
    onProgress?: number;
    closed?: number;
  };
}

export interface VoDList extends BaseResponseData {
  no?: number;
  id?: string;
  ticketNumber?: string;
  category?: string;
  shipmentId?: string;
  shipmentNo?: string;
  branchId?: string;
  branchCode?: string;
  branchName?: string;
  referenceId?: string;
  referenceNo?: string;
  vehicleId?: string;
  licensePlate?: string;
  driverId?: string;
  employeeId?: string;
  employeeName?: string;
  employeeStatus?: string;
  customerId?: string;
  CMD?: string;
  customerName?: string;
  position?: string;
  deviceTime?: string;
  voiceType?: string;
  voiceDetail?: string;
  status?: string;
  note?: string;
}

export interface ShipmentList {
  no?: number;
  id?: string;
  shipmentNo?: string;
  vehicleId?: string;
  licensePlate?: string;
  bookingOrderId?: string;
  customerId?: string;
  customerName?: string;
  branchId?: string;
  branchName?: string;
  driverId?: string;
  driverName?: string;
  shipmentType?: string;
}

export interface CreateVoD {
  ticketNumber?: string;
}

export interface DetailVoD extends BaseResponseData {
  id?: string;
  ticketNumber?: string;
  category?: string;
  shipmentId?: string;
  shipmentNo?: string;
  shipmentType?: string;
  branchId?: string;
  branchCode?: string;
  branchName?: string;
  referenceId?: string;
  referenceNo?: string;
  vehicleId?: string;
  licensePlate?: string;
  driverId?: string;
  employeeId?: string;
  employeeName?: string;
  employeeStatus?: string;
  customerId?: string;
  CMD?: string;
  customerName?: string;
  position?: string;
  dateOfAccident?: string;
  voiceType?: string;
  voiceDetail?: string;
  coordinate?: string;
  status?: string;
  note?: string;
}

export interface CreateVoDPayload {
  category?: string;
  shipmentId?: string;
  customerId?: string;
  branchId?: string;
  licensePlate?: string;
  driverId?: string;
  voiceType?: string;
  voiceDetail?: string;
  position?: string;
  dateOfAccident?: string;
  coordinate?: string;
}

export interface DetailVoDPayload {
  id?: string;
}

export interface UpdateVoDPayload {
  id?: string;
  status?: string;
  note?: string;
  ticketNumber?: string;
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetVoDListResponse {
  status?: boolean;
  message?: string;
  data?: VoDList[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetShipmentResponse {
  status?: boolean;
  message?: string;
  data?: ShipmentList[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface CreateVoDResponse {
  status?: boolean;
  message?: string;
  data?: CreateVoD;
  code?: string;
  eTag?: string;
}

export interface GetDetailVoDResponse {
  status?: boolean;
  message?: string;
  data?: DetailVoD;
  code?: string;
  eTag?: string;
}

export const vodTypes = {
  GET_SUMMARY: "vod/getSummary",
  GET_SUMMARY_FETCH: "vod/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "vod/getSummarySuccess",
  GET_SUMMARY_FAILURE: "vod/getSummaryFailure",

  GET_VOD_LIST: "vod/getVoDList",
  GET_VOD_LIST_FETCH: "vod/getVoDListFetch",
  GET_VOD_LIST_SUCCESS: "vod/getVoDListSuccess",
  GET_VOD_LIST_FAILURE: "vod/getVoDListFailure",

  GET_AC_VOD_LIST: "vod/getACVoDList",
  GET_AC_VOD_LIST_FETCH: "vod/getACVoDListFetch",
  GET_AC_VOD_LIST_SUCCESS: "vod/getACVoDListSuccess",
  GET_AC_VOD_LIST_FAILURE: "vod/getACVoDListFailure",

  GET_SHIPMENT: "vod/getShipment",
  GET_SHIPMENT_FETCH: "vod/getShipmentFetch",
  GET_SHIPMENT_SUCCESS: "vod/getShipmentSuccess",
  GET_SHIPMENT_FAILURE: "vod/getShipmentFailure",

  CREATE_VOD: "vod/createVoD",
  CREATE_VOD_FETCH: "vod/createVoDFetch",
  CREATE_VOD_SUCCESS: "vod/createVoDSuccess",
  CREATE_VOD_FAILURE: "vod/createVoDFailure",

  DETAIL_VOD: "vod/detailVoD",
  DETAIL_VOD_FETCH: "vod/detailVoDFetch",
  DETAIL_VOD_SUCCESS: "vod/detailVoDSuccess",
  DETAIL_VOD_FAILURE: "vod/detailVoDFailure",

  UPDATE_VOD: "vod/updateVoD",
  UPDATE_VOD_FETCH: "vod/updateVoDFetch",
  UPDATE_VOD_SUCCESS: "vod/updateVoDSuccess",
  UPDATE_VOD_FAILURE: "vod/updateVoDFailure",
};
