import { INCOMING_STATUS } from "@sera-types/outstanding-incoming.type";

/**
 * Warna tag per tahap alur Incoming (Outstanding Incoming & Actual Incoming) —
 * progresif dari Confirmed sampai selesai (Goods Receipt). Draft sengaja tidak
 * di-override, tetap pakai bucket global StatusTag "warning" (kuning) — sudah
 * cocok untuk status belum-final.
 */
export const INCOMING_STATUS_COLOR: Record<string, string> = {
  [INCOMING_STATUS.CONFIRMED]: "blue",
  [INCOMING_STATUS.QUALITY_INSPECTION]: "gold",
  [INCOMING_STATUS.BARCODE_LABELING]: "purple",
  [INCOMING_STATUS.BINNING]: "cyan",
  [INCOMING_STATUS.GOODS_RECEIPT]: "green",
};
