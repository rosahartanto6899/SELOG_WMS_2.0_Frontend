/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row list actual outgoing — parity ActualListRow backend (Q1, spec 005) */
export interface ActualOutgoingRow {
  id: string;
  no?: number;
  deliveryNoteNo: string;
  outgoingDate?: string | null;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  customerDestination?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  status?: string | null;
  createdDate?: string | null;
  createdBy?: string | null;
}

export interface ActualOutgoingListPayload extends BaseType {
  customerCode?: string | null;
  warehouseCode?: string | null;
}

export interface GetActualOutgoingResponse {
  data?: ActualOutgoingRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface ActualOutgoingState {
  isLoading: boolean;
  error: Error | string | null;
  data: ActualOutgoingRow[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Q2 detail material — parity legacy modal ActualOutgoing.js */
export interface ActualOutgoingDetailRow {
  id: string;
  shipmentNo?: string | null;
  packagingNo?: string | null;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  uom?: string | null;
  poQty: number;
  pickingQty: number;
  pickingDate?: string | null;
  description?: string | null;
  modifiedBy?: string | null;
  addInfos?: Array<{ name: string; value: string }>;
}

/** Q3 history row — parity leadtime menit (recompute read) */
export interface ActualOutgoingHistoryRow {
  id: string;
  status: string;
  date: string | null;
  leadtime: number | null;
  pic: string | null;
}

/** Q4/Q5 add-info row */
export interface ActualOutgoingAddInfoRow {
  name: string;
  value: string;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const actualOutgoingTypes = {
  GET_ACTUAL_OUTGOING: "actualOutgoing/getActualOutgoing",
  GET_ACTUAL_OUTGOING_FETCH: "actualOutgoing/getActualOutgoingFetch",
  GET_ACTUAL_OUTGOING_SUCCESS: "actualOutgoing/getActualOutgoingSuccess",
  GET_ACTUAL_OUTGOING_FAILURE: "actualOutgoing/getActualOutgoingFailure",
  GET_ACTUAL_OUTGOING_CLEAR: "actualOutgoing/getActualOutgoingClear",
};
