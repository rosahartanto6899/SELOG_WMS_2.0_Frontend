/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row list actual incoming — parity ActualListRow backend (A-List) */
export interface ActualIncomingRow {
  id: string;
  no?: number;
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
  description?: string | null;
  status?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  picReceiver?: string | null;
  picBinner?: string | null;
  grBy?: string | null;
  grDate?: string | null;
  binningLocation?: string | null;
}

export interface ActualIncomingListPayload extends BaseType {
  customerCode?: string | null;
  warehouseCode?: string | null;
}

export interface GetActualIncomingResponse {
  data?: ActualIncomingRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface ActualIncomingDeleteItem {
  id: string;
  description: string;
}

export interface ActualIncomingDeleteResponse {
  deleted?: number;
  skipped?: Array<{ id: string; reason: string }>;
}

export interface ActualIncomingState {
  isLoading: boolean;
  error: Error | string | null;
  data: ActualIncomingRow[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const actualIncomingTypes = {
  GET_ACTUAL_INCOMING: "actualIncoming/getActualIncoming",
  GET_ACTUAL_INCOMING_FETCH: "actualIncoming/getActualIncomingFetch",
  GET_ACTUAL_INCOMING_SUCCESS: "actualIncoming/getActualIncomingSuccess",
  GET_ACTUAL_INCOMING_FAILURE: "actualIncoming/getActualIncomingFailure",
  GET_ACTUAL_INCOMING_CLEAR: "actualIncoming/getActualIncomingClear",
};
