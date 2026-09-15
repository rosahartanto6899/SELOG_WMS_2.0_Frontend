/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, PaginationType } from "@sera-types/base.type";

/** Row list stock availability — parity StockAvailabilityDto legacy CoreApp */
export interface StockAvailabilityRow {
  id: string;
  no?: number;
  customerCode?: string | null;
  customerName?: string | null;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  materialCode: string;
  materialName?: string | null;
  materialBrand?: string | null;
  uom?: string | null;
  qtySOH: number;
  qtyPlanIncoming?: number;
  qtyPlanOutgoing?: number;
  qtyAvailable?: number;
  createdAt?: string | null;
}

export interface StockAvailabilityListPayload extends BaseType {
  customerCode?: string | null;
  warehouseCode?: string | null;
}

export interface GetStockAvailabilityResponse {
  data?: StockAvailabilityRow[];
  pagination?: PaginationType;
  recordsTotal?: number;
}

export interface StockAvailabilityState {
  isLoading: boolean;
  error: Error | string | null;
  data: StockAvailabilityRow[];
  options: BaseType & { [key: string]: any };
  recordsTotal: number;
}

/** Row history SOH — parity GetHistoryStockOnHandDto legacy */
export interface StockOnHandHistoryRow {
  category?: string | null;
  transactionType?: string | null;
  deliveryNoteNo?: string | null;
  qty: number;
  qtySOHBefore: number;
  qtySOHAfter: number;
  poDate?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
}

/** Row tab plan qty (incoming/outgoing) — parity PlanQtyDto legacy */
export interface PlanQtyRow {
  deliveryNoteNo?: string | null;
  qty: number;
  createdAt?: string | null;
}

/** Konstanta action type — pola LOGIS (loading slice matcher) */
export const stockAvailabilityTypes = {
  GET_STOCK_AVAILABILITY: "stockAvailability/getStockAvailability",
  GET_STOCK_AVAILABILITY_FETCH: "stockAvailability/getStockAvailabilityFetch",
  GET_STOCK_AVAILABILITY_SUCCESS:
    "stockAvailability/getStockAvailabilitySuccess",
  GET_STOCK_AVAILABILITY_FAILURE:
    "stockAvailability/getStockAvailabilityFailure",
  GET_STOCK_AVAILABILITY_CLEAR: "stockAvailability/getStockAvailabilityClear",
};
