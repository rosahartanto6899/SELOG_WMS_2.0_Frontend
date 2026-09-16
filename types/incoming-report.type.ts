/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row incoming report — parity IncomingReport legacy CoreApp/WMS_Incoming */
export interface IncomingReportRow {
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
export interface IncomingReportListPayload extends BaseType {
  startDate: string;
  endDate: string;
}

export interface GetIncomingReportResponse {
  data?: IncomingReportRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface IncomingReportState {
  isLoading: boolean;
  error: Error | string | null;
  data: IncomingReportRow[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const incomingReportTypes = {
  GET_INCOMING_REPORT: "incomingReport/getIncomingReport",
  GET_INCOMING_REPORT_FETCH: "incomingReport/getIncomingReportFetch",
  GET_INCOMING_REPORT_SUCCESS: "incomingReport/getIncomingReportSuccess",
  GET_INCOMING_REPORT_FAILURE: "incomingReport/getIncomingReportFailure",
  GET_INCOMING_REPORT_CLEAR: "incomingReport/getIncomingReportClear",
};
