import { BaseType, PaginationType } from "@sera-types/base.type";

/** Satu baris hasil parsing Excel mapping (4 kolom) + status UI submit. */
export interface UploadMaterialLocationMappingRow {
  no?: number;
  materialCode: string;
  materialName?: string;
  materialBrand?: string;
  locationName: string;
  warehouseCode?: string;
  warehouseName?: string;
  /** UI-only */
  upsertStatus?: "pending" | "submitting" | "success" | "failed";
  upsertReason?: string;
}

export interface MaterialLocationMapping {
  id?: string;
  no?: number;
  materialCode?: string | null;
  materialName?: string | null;
  materialBrand?: string | null;
  locationName?: string | null;
  createdDate?: string;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

export interface GetMappingsResponse extends BaseType {
  pagination?: PaginationType;
  data?: MaterialLocationMapping[] | [];
}

export interface UploadMaterialLocationMappingState {
  isLoading: boolean;
  error: unknown;
  activeUpsert: number;
  summary: { success: number; failed: number } | null;
  lastResult: UpsertRowResultPayload | null;
}

export interface MaterialLocationMappingState {
  data?: MaterialLocationMapping[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
}

export interface DownloadTemplatePayload {
  warehouseCode: string;
  fileName: string;
}

export interface UpsertRowPayload {
  index: number;
  row: UploadMaterialLocationMappingRow;
}

export interface UpsertRowResultPayload {
  index: number;
  status: "success" | "failed";
  reason?: string;
}
