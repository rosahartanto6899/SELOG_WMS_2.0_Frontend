/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UploadIncomingAhmRow } from "@sera-types/upload-incoming-ahm.type";
import { isEqual } from "lodash";
import * as XLSX from "xlsx";

/** Sheets that must exist in the uploaded file (template integrity). */
export const REQUIRED_SHEET = ["Formulir input", "Ref_bodyKey"] as const;

/** Header row starts at row 5 (index 4) — ServiceVehicle template convention. */
export const HEADER_ROW_RANGE = 4;

/** Max data rows per upload (parity with the legacy rule). */
export const MAX_ROWS = 5000;

/**
 * 19 field keys — MUST match the backend `columns[].key`
 * (upload-incoming-ahm.constant.ts). Used for Ref_bodyKey integrity checks.
 */
export const HEADER_KEYS = [
  "deliveryNoteNo",
  "deliveryNoteDate",
  "deliveryNoteStatus",
  "deliveryNoteType",
  "planReceiveMinDate",
  "planReceiveMinTime",
  "planReceiveMaxDate",
  "planReceiveMaxTime",
  "plantId",
  "plantDesc",
  "poNumber",
  "gateId",
  "supplierId",
  "supplierDesc",
  "poItem",
  "supplierPartNumber",
  "partNumberDesc",
  "qtySumDiOri",
  "qtyDn",
] as const;

export const REQUIRED_KEYS = HEADER_KEYS.filter(
  (k) =>
    ![
      "plantDesc",
      "supplierDesc",
      "partNumberDesc",
      "planReceiveMinDate",
      "planReceiveMinTime",
      "planReceiveMaxDate",
      "planReceiveMaxTime",
    ].includes(k),
);

/** Human-readable column labels — identical to the Excel template headers. */
export const COLUMN_LABELS: Record<string, string> = {
  deliveryNoteNo: "Delivery Note No",
  deliveryNoteDate: "DN Date",
  deliveryNoteStatus: "DN Status",
  deliveryNoteType: "DN Type",
  planReceiveMinDate: "Plan Recv Min Date",
  planReceiveMinTime: "Plan Recv Min Time",
  planReceiveMaxDate: "Plan Recv Max Date",
  planReceiveMaxTime: "Plan Recv Max Time",
  plantId: "Plant ID",
  plantDesc: "Plant Desc",
  poNumber: "PO Number",
  gateId: "Gate ID",
  supplierId: "Supplier ID",
  supplierDesc: "Supplier Desc",
  poItem: "PO Item",
  supplierPartNumber: "Part Number",
  partNumberDesc: "Part Desc",
  qtySumDiOri: "Qty SUM DI Ori",
  qtyDn: "Qty DN",
};

export const DATE_KEYS = [
  "deliveryNoteDate",
  "planReceiveMinDate",
  "planReceiveMaxDate",
];
export const TIME_KEYS = ["planReceiveMinTime", "planReceiveMaxTime"];
export const INT_KEYS = ["qtySumDiOri", "qtyDn"];

// Accept new format (YYYY-MM-DD, HH:mm) + legacy AHM (DD-MON-YYYY, HH:mm:ss)
const DATE_RE = /^(\d{4}-\d{2}-\d{2}|\d{2}-[A-Za-z]{3}-\d{4})$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/** 07-NOV-2022 → 2022-11-07; passes through if already canonical. */
export function normalizeDate(value: string): string {
  if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(value)) {
    const mm = String(
      MONTHS.indexOf(value.slice(3, 6).toUpperCase()) + 1,
    ).padStart(2, "0");
    return `${value.slice(7)}-${mm}-${value.slice(0, 2)}`;
  }
  return value;
}

/** 09:30 → 09:30:00 (canonical stored as HH:mm:ss); passes through if already full. */
export function normalizeTime(value: string): string {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? `${value}:00` : value;
}

/** Header fields — must be identical across rows sharing the same deliveryNoteNo (one DN = one header). */
export const HEADER_CONSISTENCY_KEYS = [
  "deliveryNoteDate",
  "deliveryNoteStatus",
  "deliveryNoteType",
  "poNumber",
  "plantId",
  "plantDesc",
  "gateId",
  "supplierId",
  "supplierDesc",
] as const;

/** Rows with the same DN but different header fields → per-cell error (key `${index}-${key}`). */
export function validateHeaderConsistency(
  rows: UploadIncomingAhmRow[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  const firstByDn = new Map<string, UploadIncomingAhmRow>();
  rows.forEach((row, i) => {
    const dn = String(row.deliveryNoteNo ?? "").trim();
    if (!dn) return;
    const ref = firstByDn.get(dn);
    if (!ref) {
      firstByDn.set(dn, row);
      return;
    }
    HEADER_CONSISTENCY_KEYS.forEach((key) => {
      if (String(row[key] ?? "") !== String(ref[key] ?? ""))
        errors[`${i}-${key}`] = "mismatch";
    });
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

/** Parse data rows + per-cell validation. Returns null if the file is invalid. */
export function parseRows(
  workbook: XLSX.WorkBook,
  onCellError: (rowIndex: number, key: string, message: string) => void,
): UploadIncomingAhmRow[] {
  const raw = XLSXtoJSON(workbook, "Formulir input", HEADER_ROW_RANGE);
  // cell headers are labels ("Delivery Note No"), not ids — map via Ref_bodyKey.
  const labelToKey = new Map<string, string>(
    XLSXtoJSON(workbook, "Ref_bodyKey").map((r: any) => [r.name, r.id]),
  );
  const rows: UploadIncomingAhmRow[] = [];

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

    if (!row.deliveryNoteNo && !row.supplierPartNumber) return; // empty row

    REQUIRED_KEYS.forEach((key) => {
      if (row[key] === "" || row[key] === null || row[key] === undefined) {
        onCellError(i, key, "required");
      }
    });
    DATE_KEYS.forEach((key) => {
      if (row[key] && !DATE_RE.test(String(row[key])))
        onCellError(i, key, "format");
    });
    TIME_KEYS.forEach((key) => {
      if (row[key] && !TIME_RE.test(String(row[key])))
        onCellError(i, key, "format");
    });
    INT_KEYS.forEach((key) => {
      const n = Number(row[key]);
      if (!Number.isInteger(n) || n < 1) onCellError(i, key, "format");
      row[key] = n;
    });
    if (Number(row.qtyDn) > Number(row.qtySumDiOri))
      onCellError(i, "qtyDn", "exceed");

    rows.push({ ...row, no: i + 1, upsertStatus: "pending" });
  });

  return rows;
}
