/** Satu baris hasil parsing Excel Stock Adjustment (4 kolom) + kolom status UI submit. */
export interface UploadStockAdjustmentRow {
  no?: number;
  materialCode: string;
  materialName: string;
  materialBrand?: string;
  qty: number;
  /** UI-only */
  upsertStatus?: "pending" | "submitting" | "success" | "failed";
  upsertReason?: string;
}

export interface UploadStockAdjustmentState {
  isLoading: boolean;
  error: unknown;
  /** Status per baris untuk submit berantai. */
  activeUpsert: number;
  summary: { success: number; failed: number } | null;
  lastResult: UploadStockAdjustmentRowResultPayload | null;
}

export interface DownloadTemplatePayload {
  fileName: string;
}

export interface UpsertRowPayload {
  index: number;
  row: UploadStockAdjustmentRow;
}

export interface UploadStockAdjustmentRowResultPayload {
  index: number;
  status: "success" | "failed";
  reason?: string;
}
