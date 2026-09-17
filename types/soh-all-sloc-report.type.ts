/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row SOH All SLOC — parity StockDto legacy CoreApp (Report/SOHAllSLOCReport):
 *  satu baris per material, qty per warehouse jadi kolom dinamis. */
export interface SohAllSlocReportRow {
  no?: number;
  materialCode: string;
  materialName?: string | null;
  materialBrand?: string | null;
  totalQty: number;
  warehouses: Record<string, number>;
}

/** Payload list — tanpa filter tambahan; scope tenant dari session backend */
export type SohAllSlocReportListPayload = BaseType;

export interface GetSohAllSlocReportResponse {
  data?: SohAllSlocReportRow[];
  /** kode warehouse user — sumber kolom dinamis tabel */
  warehouses?: string[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface SohAllSlocReportState {
  isLoading: boolean;
  error: Error | string | null;
  data: SohAllSlocReportRow[];
  /** kolom warehouse dinamis dari backend */
  warehouses: string[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Konstanta action type — pola matcher loading slice */
export const sohAllSlocReportTypes = {
  GET_SOH_ALL_SLOC_REPORT: "sohAllSlocReport/getSohAllSlocReport",
  GET_SOH_ALL_SLOC_REPORT_FETCH: "sohAllSlocReport/getSohAllSlocReportFetch",
  GET_SOH_ALL_SLOC_REPORT_SUCCESS:
    "sohAllSlocReport/getSohAllSlocReportSuccess",
  GET_SOH_ALL_SLOC_REPORT_FAILURE:
    "sohAllSlocReport/getSohAllSlocReportFailure",
  GET_SOH_ALL_SLOC_REPORT_CLEAR: "sohAllSlocReport/getSohAllSlocReportClear",
};
