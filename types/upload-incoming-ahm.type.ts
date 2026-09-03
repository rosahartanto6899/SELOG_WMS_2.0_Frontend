/** Satu baris hasil parsing Excel AHM (19 kolom) + kolom status UI submit. */
export interface UploadIncomingAhmRow {
  no?: number;
  deliveryNoteNo: string;
  deliveryNoteDate: string;
  deliveryNoteStatus: string;
  deliveryNoteType: string;
  planReceiveMinDate?: string;
  planReceiveMinTime?: string;
  planReceiveMaxDate?: string;
  planReceiveMaxTime?: string;
  plantId: string;
  plantDesc?: string;
  poNumber: string;
  gateId: string;
  supplierId: string;
  supplierDesc?: string;
  poItem: string;
  supplierPartNumber: string;
  partNumberDesc?: string;
  qtySumDiOri: number;
  qtyDn: number;
  /** Konteks header — dari halaman, dulu parameter SP. */
  customerCode?: string;
  customerName?: string;
  warehouseCode?: string;
  warehouseName?: string;
  /** UI-only */
  upsertStatus?: "pending" | "submitting" | "success" | "failed";
  upsertReason?: string;
}

export interface UploadIncomingAhmState {
  isLoading: boolean;
  error: unknown;
  /** Status per baris untuk submit berantai. */
  activeUpsert: number;
  summary: { success: number; failed: number } | null;
  lastResult: UpsertRowResultPayload | null;
}

export interface DownloadTemplatePayload {
  fileName: string;
}

export interface UpsertRowPayload {
  index: number;
  row: UploadIncomingAhmRow;
}

export interface UpsertRowResultPayload {
  index: number;
  status: "success" | "failed";
  reason?: string;
}
