import { BaseType, PaginationType } from "@sera-types/base.type";

/** Status enum parity backend (constant INCOMING_STATUS) */
export const INCOMING_STATUS = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  BARCODE_LABELING: "Barcode Labeling",
  QUALITY_INSPECTION: "Quality Inspection",
  BINNING: "Binning",
  INCOMING_FINISHED: "Incoming Finished",
  GOODS_RECEIPT: "Goods Receipt",
  TRANSIT_IN: "Transit In",
  TRANSIT_OUT: "Transit Out",
  CANCELLED: "Cancelled",
  HOLD: "Hold",
} as const;

export interface OutstandingIncomingRow {
  id: string;
  customerName: string;
  warehouseCode?: string | null;
  warehouseName: string;
  deliveryNoteNo: string;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  supplierName?: string | null;
  incomingDate?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  status?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
  createdBy?: string | null;
  isHold: number;
  no?: number;
}

export interface OutstandingIncomingAddInfo {
  name?: string | null;
  value?: string | null;
}

export interface OutstandingIncomingDetail {
  id: string;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  materialBarcode?: string | null;
  materialLocationBarcode?: string | null;
  uom: string;
  poQty: number;
  partialQty: number;
  binningQty: number;
  binningDate?: string | null;
  binningBy?: string | null;
  description?: string | null;
  addInfos?: OutstandingIncomingAddInfo[];
  canEdit?: boolean;
}

export interface OutstandingIncomingHeader {
  id: string;
  customerCode?: string | null;
  customerName: string;
  warehouseCode?: string | null;
  warehouseName: string;
  deliveryNoteNo: string;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  supplierName?: string | null;
  incomingDate?: string | null;
  referenceNo?: string | null;
  materialCategory?: string | null;
  description?: string | null;
  status?: string | null;
  isHold?: number;
  isActual?: number;
  createdAt?: string | null;
  createdBy?: string | null;
  addInfos?: OutstandingIncomingAddInfo[];
  details?: OutstandingIncomingDetail[];
}

export interface OutstandingIncomingHistory {
  id: string;
  status?: string | null;
  date?: string | null;
  pic?: string | null;
  leadtime?: number | null;
  createdAt?: string | null;
  createdBy?: string | null;
}

export interface OutstandingIncomingTotals {
  totalDataOutstanding: number;
  warehouseCode?: string | null;
  warehouseName?: string | null;
}

export interface StockAvailabilityResult {
  customerCode?: string | null;
  customerName?: string | null;
  deliveryNoteNo?: string | null;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  materialCode?: string | null;
  materialName?: string | null;
  materialBrand?: string | null;
  uom?: string | null;
  qtyPlanIncoming: number;
  qtyPlanOutgoing: number;
  qtySOH: number;
}

export interface HoldRowResult {
  id: string;
  deliveryNoteNo: string;
  customerName: string;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  poNo: string;
  status?: string | null;
  isHold: number;
  picReceiver?: string;
  picBinner?: string;
  binningLocation?: string;
  locationId?: string;
  locationName?: string;
  qty?: number;
  holdDescription?: string;
  attachPhotos?: string;
  updatedAt?: string | null;
}

export interface ForActualResult {
  headerIncoming: OutstandingIncomingHeader[];
  detailIncoming: OutstandingIncomingDetail[];
  additionalHeader: Array<{
    planIncomingHeaderId?: string;
    name?: string;
    value?: string;
  }>;
  additionalDetail: Array<{
    planIncomingDetailId?: string;
    name?: string;
    value?: string;
  }>;
  attachmentIncoming: Array<{
    incomingPlanDetailId: string;
    fileName: string;
    attachmentUrl: string;
  }>;
  stockAvailabilities: StockAvailabilityResult[];
}

export interface BinningSlipRow {
  id: string;
  customerCode?: string | null;
  customerName?: string | null;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  supplierName?: string | null;
  referenceNo?: string | null;
  poNo?: string | null;
  materialCode?: string | null;
  materialName?: string | null;
  description?: string | null;
  brand?: string | null;
  qty?: number | null;
  satuan?: string | null;
  loc?: string | null;
  remark?: string | null;
}

export interface FilterResultRow {
  warehouseCode?: string | null;
  warehouseName?: string | null;
  deliveryNoteNo?: string;
  poNo?: string;
  description?: string | null;
}

/** Payload input manual C1 */
export interface InputIncomingPayload {
  customerCode: string;
  customerName: string;
  warehouseCode: string;
  warehouseName: string;
  poNo: string;
  poType?: string;
  poDate?: string;
  supplierName?: string;
  deliveryNoteNo: string;
  incomingDate?: string;
  referenceNo?: string;
  materialCategory?: string;
  description?: string;
  additionalInformation?: OutstandingIncomingAddInfo[];
  details: Array<{
    materialCode: string;
    materialName: string;
    materialBrand: string;
    uom: string;
    qty: number;
    barcode?: string;
    locationBarcode?: string;
    additionalInformation?: OutstandingIncomingAddInfo[];
  }>;
}

export interface GetOutstandingIncomingResponse {
  data?: OutstandingIncomingRow[] | [];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface OutstandingIncomingState {
  data?: OutstandingIncomingRow[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  recordsTotal?: number;
  summary: {
    isLoading?: boolean;
    error?: Error | string | null;
    payload?: { warehouseCodes?: string[] | null } | null;
    data?: { total: number; byWarehouse: OutstandingIncomingTotals[] };
  };
  detail: {
    isLoading?: boolean;
    error?: Error | string | null;
    data?: OutstandingIncomingHeader | null;
    history?: OutstandingIncomingHistory[];
  };
}

export interface OutstandingIncomingListPayload extends BaseType {
  customerCode?: string | null;
  warehouseCode?: string | null;
  materialCategory?: string | null;
  deliveryNoteNoFilter?: string | null;
}

export interface OutstandingIncomingSummaryResponse {
  data?: { total: number; byWarehouse: OutstandingIncomingTotals[] };
}

export interface OutstandingIncomingDetailResponse {
  data?: OutstandingIncomingHeader;
}

export interface OutstandingIncomingDetailPayload {
  id: string;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const outstandingIncomingTypes = {
  GET_OUTSTANDING_INCOMING: "outstandingIncoming/getOutstandingIncoming",
  GET_OUTSTANDING_INCOMING_FETCH:
    "outstandingIncoming/getOutstandingIncomingFetch",
  GET_OUTSTANDING_INCOMING_SUCCESS:
    "outstandingIncoming/getOutstandingIncomingSuccess",
  GET_OUTSTANDING_INCOMING_FAILURE:
    "outstandingIncoming/getOutstandingIncomingFailure",
  GET_OUTSTANDING_INCOMING_CLEAR:
    "outstandingIncoming/getOutstandingIncomingClear",

  GET_OUTSTANDING_INCOMING_SUMMARY:
    "outstandingIncoming/getOutstandingIncomingSummary",
  GET_OUTSTANDING_INCOMING_SUMMARY_FETCH:
    "outstandingIncoming/getOutstandingIncomingSummaryFetch",
  GET_OUTSTANDING_INCOMING_SUMMARY_SUCCESS:
    "outstandingIncoming/getOutstandingIncomingSummarySuccess",
  GET_OUTSTANDING_INCOMING_SUMMARY_FAILURE:
    "outstandingIncoming/getOutstandingIncomingSummaryFailure",
  GET_OUTSTANDING_INCOMING_SUMMARY_CLEAR:
    "outstandingIncoming/getOutstandingIncomingSummaryClear",

  GET_OUTSTANDING_INCOMING_DETAIL:
    "outstandingIncoming/getOutstandingIncomingDetail",
  GET_OUTSTANDING_INCOMING_DETAIL_FETCH:
    "outstandingIncoming/getOutstandingIncomingDetailFetch",
  GET_OUTSTANDING_INCOMING_DETAIL_SUCCESS:
    "outstandingIncoming/getOutstandingIncomingDetailSuccess",
  GET_OUTSTANDING_INCOMING_DETAIL_FAILURE:
    "outstandingIncoming/getOutstandingIncomingDetailFailure",
  GET_OUTSTANDING_INCOMING_DETAIL_CLEAR:
    "outstandingIncoming/getOutstandingIncomingDetailClear",
};
