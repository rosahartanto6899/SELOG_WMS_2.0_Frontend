import { BaseState, PaginationType } from "./base.type";

export interface UnitParams {
  branchId?: string[];
  shipmentType?: string[];
}

export interface Summary {
  totalShipment: number;
  podLoading: number;
  podUnloading: number;
  podDelivery: number;
  podHardcopy: number;
  podCheckpoint: number;
}

interface Driver {
  id: string;
  name: string;
}

export interface List {
  id: string;
  shipmentNo: string;
  podStatus: string;
  bookingOrderNo: string;
  customerName: string;
  shipmentType: string;
  origin: string;
  destination?: string;
  licensePlate?: string;
  driver1?: Driver;
  driver2?: Driver;
  expenseStatus?: string;
  expenseTransferred: boolean;
  totalExpense: number;
}

export interface Attachment {
  fileUrl: string;
  fileExtension: string;
  createdAt: string;
  createdBy: string;
}

export interface Pod {
  id: string;
  podType: string;
  submittedDate: string;
  submittedBy: string;
  confirmedDate?: string;
  confirmedBy?: string;
  attachments: Attachment[];
  isClaim?: boolean;
  shipmentNo: string;
  shipmentId: string;
  amount?: number;
  receiptNumber?: string;
  receiptDate?: string;
  courier?: string;
  picName?: string;
  status?: string;
}

export interface CustomerSale {
  id: string;
  customerId: string;
  branchId: string;
  salesDealingId: string;
  salesDealingName: string;
  salesServicingId: string;
  salesServicingName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: any;
  deletedAt?: any;
  deletedBy?: any;
}

export interface Customer {
  id: string;
  cmd: string;
  name: string;
  city: string;
  street: string;
  phone: string;
  email: string;
  industry: string;
  category: string;
  termOfPayment: string;
  isPhysicalPOD: boolean;
  isEPOD: boolean;
  status: string;
  createdBy: string;
  updatedBy: string;
  deletedAt?: any;
  deletedBy?: any;
  createdAt: string;
  updatedAt: string;
  customerSales: CustomerSale[];
}

export interface Details {
  shipmentId: string;
  shipmentNo: string;
  customer: Customer;
  pods: Pod[];
}

export interface PayloadDetails {
  id: string;
}

export interface LoadingResponse {
  data?: any;
}

export interface GetLoadingResponse {
  status?: boolean;
  message?: string;
  data?: LoadingResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface UnloadingResponse {
  data?: any;
}

export interface DeliveryResponse {
  data?: any;
}

export interface TimestampResponse {
  data?: any;
}

export interface HardcopyResponse {
  data?: any;
}

export interface ApprovalResponse {
  data?: any;
}

export interface GetUnloadingResponse {
  status?: boolean;
  message?: string;
  data?: UnloadingResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDeliveryResponse {
  status?: boolean;
  message?: string;
  data?: DeliveryResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetTimestampResponse {
  status?: boolean;
  message?: string;
  data?: TimestampResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetHardcopyResponse {
  status?: boolean;
  message?: string;
  data?: HardcopyResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetApprovalResponse {
  status?: boolean;
  message?: string;
  data?: ApprovalResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
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
  data?: List[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDetailsResponse {
  status?: boolean;
  message?: string;
  data?: Details;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface PodLoadingPayload {
  shipmentNumber: string;
  picName: string;
  files: File[] | Blob[];
}

export interface PodUnloadingPayload {
  shipmentNumber: string;
  picName: string;
  isClaim: boolean;
  files: File[] | Blob[];
}

export interface PodDeliveryPayload {
  shipmentNumber: string;
  receiptNumber: string;
  receiptDate: string;
  courier: string;
  amount: number | string;
  files: File[] | Blob[];
}

export interface PodTimestampPayload {
  shipmentNumber: string;
  files: File[] | Blob[];
}

export interface PodHardcopyPayload {
  shipmentNumber: string;
  submittedDate: string;
}

export type ApprovalActionType = "Approved" | "Rejected";

export interface ApprovalPodPayload {
  id: string;
  action: ApprovalActionType;
  reason: string;
}

export interface InitialStateType {
  getSummary: BaseState<Summary, UnitParams>;
  getList: BaseState<List[], UnitParams>;
  getDetails: BaseState<Details, PayloadDetails>;
  podLoading: BaseState<LoadingResponse, PodLoadingPayload>;
  podUnloading: BaseState<UnloadingResponse, PodUnloadingPayload>;
  podDelivery: BaseState<DeliveryResponse, PodDeliveryPayload>;
  podTimestamp: BaseState<TimestampResponse, PodTimestampPayload>;
  podHardcopy: BaseState<HardcopyResponse, PodHardcopyPayload>;
  podApproval: BaseState<ApprovalResponse, ApprovalPodPayload>;
}

export const podCollectionTypes = {
  GET_SUMMARY_FETCH: "podCollection/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "podCollection/getSummarySuccess",
  GET_SUMMARY_FAILURE: "podCollection/getSummaryFailure",

  GET_LIST_FETCH: "podCollection/getListFetch",
  GET_LIST_SUCCESS: "podCollection/getListSuccess",
  GET_LIST_FAILURE: "podCollection/getListFailure",

  GET_DETAILS_FETCH: "podCollection/getDetailsFetch",
  GET_DETAILS_SUCCESS: "podCollection/getDetailsSuccess",
  GET_DETAILS_FAILURE: "podCollection/getDetailsFailure",

  GET_LOADING_FETCH: "podCollection/podLoadingFetch",
  GET_LOADING_SUCCESS: "podCollection/podLoadingSuccess",
  GET_LOADING_FAILURE: "podCollection/podLoadingFailure",

  GET_UNLOADING_FETCH: "podCollection/podUnloadingFetch",
  GET_UNLOADING_SUCCESS: "podCollection/podUnloadingSuccess",
  GET_UNLOADING_FAILURE: "podCollection/podUnloadingFailure",

  GET_DELIVERY_FETCH: "podCollection/podDeliveryFetch",
  GET_DELIVERY_SUCCESS: "podCollection/podDeliverySuccess",
  GET_DELIVERY_FAILURE: "podCollection/podDeliveryFailure",

  GET_TIMESTAMP_FETCH: "podCollection/podTimestampFetch",
  GET_TIMESTAMP_SUCCESS: "podCollection/podTimestampSuccess",
  GET_TIMESTAMP_FAILURE: "podCollection/podTimestampFailure",

  GET_HARDCOPY_FETCH: "podCollection/podHardcopyFetch",
  GET_HARDCOPY_SUCCESS: "podCollection/podHardcopySuccess",
  GET_HARDCOPY_FAILURE: "podCollection/podHardcopyFailure",

  GET_APPROVAL_FETCH: "podCollection/getApprovalFetch",
  GET_APPROVAL_SUCCESS: "podCollection/getApprovalSuccess",
  GET_APPROVAL_FAILURE: "podCollection/getApprovalFailure",
};
