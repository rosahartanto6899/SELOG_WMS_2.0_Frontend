import { BaseType, PaginationType } from "@sera-types/base.type";

// ================= spec 004 — worklist outstanding outgoing (Fase 1) =================

/** Row Q1 — tab DN List (kolom parity legacy + indikator YES/NO) */
export interface OutstandingOutgoingListRow {
  id: string;
  deliveryNoteNo: string;
  outgoingDate?: string | null;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  customerDestination?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  status?: string | null;
  isActive?: boolean;
  isHold?: number;
  createdAt?: string | null;
  createdBy?: string | null;
  indicator?: "YES" | "NO";
  no?: number;
}

/** Row Q2 — tab DN Items */
export interface OutstandingOutgoingItemRow {
  id: string;
  deliveryNoteNo: string;
  poNo: string;
  materialBarcode?: string | null;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  uom: string;
  poQty: number;
  pickingQty: number;
  customerDestination?: string | null;
  status?: string | null;
  createdAt?: string | null;
}

/** Row Q3 — tab Packaging */
export interface OutstandingOutgoingPackagingRow {
  id: string;
  packagingNo: string;
  customerDestination?: string | null;
  materialCode?: string | null;
  materialName?: string | null;
  materialBrand?: string | null;
  qty?: number | null;
  uom?: string | null;
  weight?: number;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  shipmentNo?: string | null;
  createdAt?: string | null;
}

/** Row Q4 — tab Shipment */
export interface OutstandingOutgoingShipmentRow {
  shipmentNo: string;
  customerDestination?: string | null;
  modifiedDate?: string | null;
}

export interface OutstandingOutgoingTotalsRow {
  totalDataOutstanding: number;
  warehouseCode?: string;
  warehouseName?: string;
}

export interface OutstandingOutgoingListPayload extends BaseType {
  customerCode?: string | null;
  warehouseCode?: string | null;
  deliveryNoteNoFilter?: string | null;
}

export interface GetOutstandingOutgoingListResponse {
  data?: OutstandingOutgoingListRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

/** History row Q8 — parity PlanOutgoingHistory */
export interface OutstandingOutgoingHistory {
  id: string;
  status?: string | null;
  date?: string | null;
  leadtime?: number | null;
  pic?: string | null;
  createdBy?: string | null;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const outstandingOutgoingTypes = {
  GET_OUTGOING_LIST: "outstandingOutgoing/getOutgoingList",
  GET_OUTGOING_LIST_FETCH: "outstandingOutgoing/getOutgoingListFetch",
  GET_OUTGOING_LIST_SUCCESS: "outstandingOutgoing/getOutgoingListSuccess",
  GET_OUTGOING_LIST_FAILURE: "outstandingOutgoing/getOutgoingListFailure",
  GET_OUTGOING_LIST_CLEAR: "outstandingOutgoing/getOutgoingListClear",
  GET_OUTGOING_ITEMS: "outstandingOutgoing/getOutgoingItems",
  GET_OUTGOING_ITEMS_FETCH: "outstandingOutgoing/getOutgoingItemsFetch",
  GET_OUTGOING_ITEMS_SUCCESS: "outgoingOutgoing/getOutgoingItemsSuccess",
  GET_OUTGOING_PACKAGINGS: "outstandingOutgoing/getOutgoingPackagings",
  GET_OUTGOING_PACKAGINGS_FETCH:
    "outstandingOutgoing/getOutgoingPackagingsFetch",
  GET_OUTGOING_SHIPMENTS: "outstandingOutgoing/getOutgoingShipments",
  GET_OUTGOING_SHIPMENTS_FETCH: "outstandingOutgoing/getOutgoingShipmentsFetch",
  GET_OUTGOING_TOTALS: "outstandingOutgoing/getOutgoingTotals",
  GET_OUTGOING_TOTALS_FETCH: "outstandingOutgoing/getOutgoingTotalsFetch",
  GET_OUTGOING_TOTALS_SUCCESS: "outstandingOutgoing/getOutgoingTotalsSuccess",
  GET_OUTGOING_TOTALS_FAILURE: "outstandingOutgoing/getOutgoingTotalsFailure",
  GET_OUTGOING_DETAIL: "outstandingOutgoing/getOutgoingDetail",
  GET_OUTGOING_DETAIL_FETCH: "outstandingOutgoing/getOutgoingDetailFetch",
  GET_OUTGOING_DETAIL_SUCCESS: "outstandingOutgoing/getOutgoingDetailSuccess",
  GET_OUTGOING_DETAIL_FAILURE: "outstandingOutgoing/getOutgoingDetailFailure",
  GET_OUTGOING_DETAIL_CLEAR: "outstandingOutgoing/getOutgoingDetailClear",
};

export interface OutstandingOutgoingAddInfo {
  name?: string;
  value?: string;
}

export interface OutstandingOutgoingDetail {
  id: string;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  materialBarcode?: string | null;
  materialLocationBarcode?: string | null;
  uom: string;
  poQty: number;
  pickingQty?: number;
  pickingDate?: string | null;
  description?: string | null;
  addInfos?: OutstandingOutgoingAddInfo[];
  canEdit?: boolean;
}

export interface OutstandingOutgoingHeader {
  id: string;
  customerCode?: string | null;
  customerName: string;
  warehouseCode?: string | null;
  warehouseName: string;
  deliveryNoteNo: string;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  outgoingDate?: string | null;
  customerDestination?: string | null;
  referenceNo?: string | null;
  materialCategory?: string | null;
  description?: string | null;
  status?: string | null;
  isHold?: number;
  createdAt?: string | null;
  createdBy?: string | null;
  addInfos?: OutstandingOutgoingAddInfo[];
  details?: OutstandingOutgoingDetail[];
}

/** Payload input manual C1 */
export interface InputOutgoingPayload {
  customerCode: string;
  customerName: string;
  warehouseCode: string;
  warehouseName: string;
  poNo: string;
  poType?: string;
  poDate?: string;
  deliveryNoteNo: string;
  outgoingDate?: string;
  customerDestination?: string;
  referenceNo?: string;
  materialCategory?: string;
  description?: string;
  additionalInformation?: OutstandingOutgoingAddInfo[];
  details: Array<{
    materialCode: string;
    materialName: string;
    materialBrand: string;
    uom: string;
    qty: number;
    barcode?: string;
    locationBarcode?: string;
    additionalInformation?: OutstandingOutgoingAddInfo[];
  }>;
}

/** Payload submit mode edit — C3 header + baris C4/C2 */
export interface UpdateOutgoingPayload extends InputOutgoingPayload {
  id: string;
  /** detail lama yang bisa diedit → PUT /details/:id (qty + add-info) */
  updateDetails: Array<{
    detailId: string;
    qty: number;
    additionalInformation?: OutstandingOutgoingAddInfo[];
  }>;
}

export interface GetOutgoingEditResponse {
  data?: OutstandingOutgoingHeader | null;
  pagination?: PaginationType;
}

export interface OutstandingOutgoingState {
  submit: {
    isLoading: boolean;
    error: Error | string | null;
    success: boolean;
    message?: string | null;
  };
  edit: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingHeader | null;
  };
  /** spec 004 Fase 3 — view detail (?id=) + history */
  detail: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingHeader | null;
    history: OutstandingOutgoingHistory[];
  };
  /** spec 004 Fase 1 — worklist */
  list: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingListRow[];
    options: BaseType;
    recordsTotal: number;
  };
  items: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingItemRow[];
  };
  packagings: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingPackagingRow[];
  };
  shipments: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingShipmentRow[];
  };
  totals: {
    isLoading: boolean;
    error: Error | string | null;
    payload: { warehouseCodes?: string[] | null } | null;
    data: { total: number; byWarehouse: OutstandingOutgoingTotalsRow[] };
  };
}
