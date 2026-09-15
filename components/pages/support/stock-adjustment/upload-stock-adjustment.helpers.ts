/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UploadStockAdjustmentRow } from "@sera-types/upload-stock-adjustment.type";
import { isEqual } from "lodash";
import * as XLSX from "xlsx";

/** Sheets that must exist in the uploaded file (template integrity). */
export const REQUIRED_SHEET = ["Formulir input", "Ref_bodyKey"] as const;

/** Header row starts at row 5 (index 4) — ServiceVehicle template convention. */
export const HEADER_ROW_RANGE = 4;

/** Max data rows per upload (parity with the AHM upload rule). */
export const MAX_ROWS = 5000;

/**
 * 4 field keys — MUST match the backend `columns[].key`
 * (upload-stock-adjustment.constant.ts). Used for Ref_bodyKey integrity checks.
 */
export const HEADER_KEYS = [
  "materialCode",
  "materialName",
  "materialBrand",
  "qty",
] as const;

export const REQUIRED_KEYS = HEADER_KEYS.filter(
  (k) => k !== "materialBrand" && k !== "materialName",
);

/** Human-readable column labels — identical to the Excel template headers. */
export const COLUMN_LABELS: Record<string, string> = {
  materialCode: "MaterialCode",
  materialName: "MaterialName",
  materialBrand: "MaterialBrand",
  qty: "Qty",
};

export const INT_KEYS = ["qty"];

/** Regex alfanumerik parity model lama UploadStockAdjustment (CoreApp). */
const ALNUM_RE = /^[a-zA-Z0-9\[\]\(\)\-\/\#\&\+,.!? ]*$/;

/** Duplicate MaterialCode dalam satu file — parity aturan
 *  usp_GetUploadStockAdjustment: duplikat dgn nama beda/sama dua-duanya
 *  invalid (error beda pesan). Key sel: `${index}-materialCode`. */
export function validateDuplicates(
  rows: UploadStockAdjustmentRow[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  const seen = new Map<string, string>();
  rows.forEach((row, i) => {
    const code = String(row.materialCode ?? "").trim();
    if (!code) return;
    const firstName = seen.get(code);
    if (firstName === undefined) {
      seen.set(code, String(row.materialName ?? ""));
      return;
    }
    errors[`${i}-materialCode`] =
      firstName !== String(row.materialName ?? "")
        ? "duplicateDiffName"
        : "duplicate";
  });
  return errors;
}

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
  const sheetHeader = (XLSXtoJSON(
    workbook,
    "Formulir input",
    HEADER_ROW_RANGE,
    true,
  )[0] ?? []) as unknown[];
  // merge instruksi A:E membuat range sheet 5 kolom — sheet_to_json(header:1)
  // mem-pad baris header dgn trailing "" — buang sebelum dibandingkan
  while (sheetHeader.length && sheetHeader[sheetHeader.length - 1] === "") {
    sheetHeader.pop();
  }

  if (!isEqual(bodyRefNames, sheetHeader)) return "message.import";
  if (!isEqual(bodyRefIds as string[], HEADER_KEYS as unknown as string[]))
    return "message.import";

  return null;
}

/** Parse data rows + per-cell validation. */
export function parseRows(
  workbook: XLSX.WorkBook,
  onCellError: (rowIndex: number, key: string, message: string) => void,
): UploadStockAdjustmentRow[] {
  const raw = XLSXtoJSON(workbook, "Formulir input", HEADER_ROW_RANGE);
  // cell headers are labels ("MaterialCode"), not ids — map via Ref_bodyKey.
  const labelToKey = new Map<string, string>(
    XLSXtoJSON(workbook, "Ref_bodyKey").map((r: any) => [r.name, r.id]),
  );
  const rows: UploadStockAdjustmentRow[] = [];

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

    if (!row.materialCode && row.qty === "") return; // empty row

    REQUIRED_KEYS.forEach((key) => {
      if (row[key] === "" || row[key] === null || row[key] === undefined) {
        onCellError(i, key, "required");
      }
    });
    ["materialCode", "materialName", "materialBrand"].forEach((key) => {
      if (row[key] && !ALNUM_RE.test(String(row[key])))
        onCellError(i, key, "format");
    });
    INT_KEYS.forEach((key) => {
      const n = Number(row[key]);
      if (!Number.isInteger(n) || n < 0) onCellError(i, key, "format");
      row[key] = n;
    });

    rows.push({ ...row, no: i + 1, upsertStatus: "pending" });
  });

  return rows;
}
