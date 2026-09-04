/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UploadMaterialLocationMappingRow } from "@sera-types/material-location-mapping.type";
import { isEqual } from "lodash";
import * as XLSX from "xlsx";

/** Sheets that must exist in the uploaded file (template integrity). */
export const REQUIRED_SHEET = [
  "Formulir input",
  "Ref_bodyKey",
  "Ref_material",
  "Ref_location",
] as const;

/** Header row starts at row 5 (index 4) — ServiceVehicle template convention. */
export const HEADER_ROW_RANGE = 4;

/** Max data rows per upload (parity with the legacy rule). */
export const MAX_ROWS = 25000;

/**
 * 4 field keys — MUST match the backend `columns[].key`
 * (material-location-mapping.constant.ts). Used for Ref_bodyKey integrity checks.
 */
export const HEADER_KEYS = [
  "materialCode",
  "materialName",
  "materialBrand",
  "locationName",
] as const;

export const REQUIRED_KEYS = ["materialCode", "locationName"] as const;

/** Human-readable column labels — identical to the Excel template headers. */
export const COLUMN_LABELS: Record<string, string> = {
  materialCode: "Material Code",
  materialName: "Material Name",
  materialBrand: "Material Brand",
  locationName: "Location Name",
};

export function XLSXtoJSON(
  workbook: XLSX.WorkBook,
  key: (typeof REQUIRED_SHEET)[number],
  range = 0,
  header = false,
): { [_key: string]: any }[] {
  return XLSX.utils.sheet_to_json(workbook.Sheets[key], {
    ...(header ? { header: 1 } : {}),
    range,
    defval: "",
  });
}

/**
 * 3-layer template integrity check:
 * 1. required sheets exist; 2. main sheet header == names in Ref_bodyKey;
 * 3. ids in Ref_bodyKey == FE HEADER_KEYS (detects old/modified templates).
 */
export function validateWorkbookIntegrity(
  workbook: XLSX.WorkBook,
): string | null {
  const missing = REQUIRED_SHEET.filter((name) => !workbook.Sheets[name]);
  if (missing.length > 0) return "message.import";

  const bodyRef = XLSXtoJSON(workbook, "Ref_bodyKey");
  const bodyRefIds = bodyRef?.map(({ id }) => id);
  const bodyRefNames = bodyRef?.map(({ name }) => name);
  const sheetHeader = XLSXtoJSON(
    workbook,
    "Formulir input",
    HEADER_ROW_RANGE,
    true,
  )[0];

  if (!isEqual(bodyRefNames, sheetHeader)) return "message.import";
  if (!isEqual(bodyRefIds as string[], HEADER_KEYS as unknown as string[]))
    return "message.import";

  return null;
}

/** Ref membership — dropdown column values must exist in the ref sheet. */
export function validateRefMembership(
  value: string,
  refRows: { name?: string }[],
): boolean {
  return refRows.some((r) => String(r?.name ?? "") === value);
}

/** Parse data rows + per-cell validation (required + ref membership). */
export function parseRows(
  workbook: XLSX.WorkBook,
  onCellError: (rowIndex: number, key: string, message: string) => void,
): UploadMaterialLocationMappingRow[] {
  const raw = XLSXtoJSON(workbook, "Formulir input", HEADER_ROW_RANGE);
  // cell headers are labels ("Material Code"), not ids — map via Ref_bodyKey.
  const labelToKey = new Map<string, string>(
    XLSXtoJSON(workbook, "Ref_bodyKey").map((r: any) => [r.name, r.id]),
  );
  const refMaterial = XLSXtoJSON(workbook, "Ref_material");
  const refLocation = XLSXtoJSON(workbook, "Ref_location");
  const rows: UploadMaterialLocationMappingRow[] = [];

  raw.forEach((r, i) => {
    const src: Record<string, any> = {};
    Object.entries(r).forEach(([k, v]) => {
      src[labelToKey.get(k) ?? k] = v;
    });
    const row: any = {};
    HEADER_KEYS.forEach((key) => {
      row[key] =
        typeof src[key] === "string" ? (src[key] as string).trim() : src[key];
    });

    if (!row.materialCode && !row.locationName) return; // empty row

    REQUIRED_KEYS.forEach((key) => {
      if (row[key] === "" || row[key] === null || row[key] === undefined) {
        onCellError(i, key, "required");
      }
    });
    if (
      row.materialCode &&
      !validateRefMembership(row.materialCode, refMaterial)
    )
      onCellError(i, "materialCode", "notFound");
    if (
      row.locationName &&
      !validateRefMembership(row.locationName, refLocation)
    )
      onCellError(i, "locationName", "notFound");

    rows.push({ ...row, no: i + 1, upsertStatus: "pending" });
  });

  return rows;
}
