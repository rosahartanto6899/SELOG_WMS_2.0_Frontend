/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row outgoing report — parity OutgoingReport legacy CoreApp */
export interface OutgoingReportRow {
  id: string;
  no?: number;
  materialCode: string;
  materialName?: string | null;
  materialBrand?: string | null;
  uom?: string | null;
  actualQty: number;
  deliveryNoteNo?: string | null;
  poDate?: string | null;
}

/** Payload list — startDate/endDate wajib (YYYY-MM-DD), parity filter legacy */
export interface OutgoingReportListPayload extends BaseType {
  startDate: string;
  endDate: string;
}

export interface GetOutgoingReportResponse {
  data?: OutgoingReportRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface OutgoingReportState {
  isLoading: boolean;
  error: Error | string | null;
  data: OutgoingReportRow[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const outgoingReportTypes = {
  GET_INCOMING_REPORT: "outgoingReport/getOutgoingReport",
  GET_INCOMING_REPORT_FETCH: "outgoingReport/getOutgoingReportFetch",
  GET_INCOMING_REPORT_SUCCESS: "outgoingReport/getOutgoingReportSuccess",
  GET_INCOMING_REPORT_FAILURE: "outgoingReport/getOutgoingReportFailure",
  GET_INCOMING_REPORT_CLEAR: "outgoingReport/getOutgoingReportClear",
};
