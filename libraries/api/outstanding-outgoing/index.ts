import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  InputOutgoingPayload,
  OutstandingOutgoingAddInfo,
  OutstandingOutgoingListPayload,
} from "@sera-types/outstanding-outgoing.type";

/**
 * API untuk Outstanding Outgoing (SELOG_WMS_2.0_ServiceOutgoing §contracts 003).
 * Envelope respons backend: { data, pagination? }. Dikonsumsi saga, bukan komponen.
 */
const OutstandingOutgoingApi = () => {
  const base = `${apiUrl.outgoing}/outstanding-outgoing`;

  /** C1 — create atomic (header + details + add-info) */
  function createOutgoing(payload: InputOutgoingPayload) {
    return httpService.post(base, payload).then((resp) => resp);
  }

  /** C2 — tambah material ke DN existing */
  function addDetails(id: string, details: InputOutgoingPayload["details"]) {
    return httpService
      .post(`${base}/${id}/details`, { details })
      .then((resp) => resp);
  }

  /** C3 — update header + add-info replace */
  function updateOutgoingHeader(
    id: string,
    payload: Omit<InputOutgoingPayload, "details">,
  ) {
    return httpService.put(`${base}/${id}`, payload).then((resp) => resp);
  }

  /** C4 — update qty + add-info detail */
  function updateOutgoingDetail(
    detailId: string,
    payload: {
      qty: number;
      additionalInformation?: OutstandingOutgoingAddInfo[];
    },
  ) {
    return httpService
      .put(`${base}/details/${detailId}`, payload)
      .then((resp) => resp);
  }

  /** C6 — data form edit */
  function retrieveEdit(id: string) {
    return httpService.get(`${base}/${id}/edit`).then((resp) => resp);
  }

  // ===== Worklist queries (spec 004 Fase 1) =====

  /** Q1 — list DN outstanding (server-side) */
  function retrieveList(payload: OutstandingOutgoingListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  /** Q2/Q3/Q4 — tab DN Items / Packaging / Shipment (server-side parity) */
  function retrieveItems(params: {
    customerCode: string;
    warehouseCode: string;
    [key: string]: any;
  }) {
    return httpService.get(base, { params }).then((resp) => resp);
  }

  function retrievePackagings(params: {
    customerCode: string;
    warehouseCode: string;
    [key: string]: any;
  }) {
    return httpService
      .get(`${base}/packagings`, { params })
      .then((resp) => resp);
  }

  function retrieveShipments(params: {
    customerCode: string;
    warehouseCode: string;
    [key: string]: any;
  }) {
    return httpService
      .get(`${base}/shipments`, { params })
      .then((resp) => resp);
  }

  /** Q10/Q11 — totals badge + rincian per warehouse */
  function retrieveTotals(payload: {
    customerCode?: string;
    warehouseCodes: string[];
  }) {
    return httpService.post(`${base}/totals`, payload).then((resp) => resp);
  }

  function retrieveTotalsByWarehouse(payload: {
    customerCode?: string;
    warehouseCodes: string[];
  }) {
    return httpService
      .post(`${base}/totals/by-warehouse`, payload)
      .then((resp) => resp);
  }

  // ===== Aksi massal (spec 004 Fase 2) =====

  /** A1 — bulk Draft → Confirmed */
  function confirmDraft(ids: string[]) {
    return httpService
      .post(`${base}/confirm-draft`, { ids })
      .then((resp) => resp);
  }

  /** A2 — bulk → Cancelled (+SQS stok balik picked) */
  function confirmCancellation(ids: string[]) {
    return httpService
      .post(`${base}/confirm-cancellation`, { ids })
      .then((resp) => resp);
  }

  /** A3 — bulk soft delete (Draft saja) */
  function deleteOutgoing(ids: string[]) {
    return httpService.post(`${base}/delete`, { ids }).then((resp) => resp);
  }

  /** A4 — ubah status single (Picking/QC/Transit) */
  function updateStatus(id: string, status: string) {
    return httpService
      .put(`${base}/${id}/status`, { status })
      .then((resp) => resp);
  }

  // ===== View detail + adjust qty (spec 004 Fase 3) =====

  /** Q7 — detail DN (header + details + addInfo + canEdit) */
  function retrieveDetails(id: string) {
    return httpService.get(`${base}/${id}/details`).then((resp) => resp);
  }

  /** Q8 — history status */
  function retrieveHistory(id: string) {
    return httpService.get(`${base}/${id}/history`).then((resp) => resp);
  }

  /** A6 — adjust qty detail (Draft→POQty; picked→PickingQty; desc append) */
  function adjustPlanQty(
    detailId: string,
    payload: { planQty: number; description: string },
  ) {
    return httpService
      .put(`${base}/details/${detailId}/plan-qty`, payload)
      .then((resp) => resp);
  }

  // ===== Picking (spec 004 Fase 4) =====

  /** A7 — realisasi picking satu detail (SET pickingQty=actualQty; 0/null→POQty) */
  function submitPicking(payload: {
    detailId: string;
    actualQty?: number;
    materialBarcode?: string;
    locationBarcode?: string;
  }) {
    return httpService.post(`${base}/picking`, payload).then((resp) => resp);
  }

  /** Q15 — data cetak picking slip */
  function retrievePickingSlip(headerId: string) {
    return httpService
      .get(`${base}/${headerId}/picking-slip`)
      .then((resp) => (resp as any)?.data?.data ?? []);
  }

  // ===== Packaging + Ready To Ship (spec 004 Fase 5) =====

  /** A8 — create packaging (1 PackagingNo per submit) */
  function createPackagings(payload: {
    detailIds: string[];
    packagings: Array<{
      materialCode: string;
      materialName?: string;
      materialBrand?: string;
      uom?: string;
      qty: number;
      weight?: number;
      length?: number;
      width?: number;
      height?: number;
      customerDestination?: string;
    }>;
  }) {
    return httpService.post(`${base}/packagings`, payload).then((resp) => resp);
  }

  /** A9 — create shipment */
  function readyToShip(packagingNos: string[]) {
    return httpService
      .post(`${base}/ready-to-ship`, { packagingNos })
      .then((resp) => resp);
  }

  /** Q5 — PO pembentuk packaging (server-side paging/search) */
  function retrievePosByPackaging(
    packagingNo: string,
    params?: { [key: string]: any },
  ) {
    return httpService
      .get(`${base}/packagings/${encodeURIComponent(packagingNo)}/pos`, {
        params,
      })
      .then((resp) => resp);
  }

  /** Q6 — packaging per shipment (server-side paging/search) */
  function retrievePackagingsByShipment(
    shipmentNo: string,
    params?: { [key: string]: any },
  ) {
    return httpService
      .get(`${base}/shipments/${encodeURIComponent(shipmentNo)}/packagings`, {
        params,
      })
      .then((resp) => resp);
  }

  // ===== Sequential AHM (spec 004 Fase 6) =====

  /** A10 — flag sequential per customer (env-driven svc) */
  function getSequentialConfig(customerCode: string) {
    return httpService
      .get(`${base}/sequential-config`, { params: { customerCode } })
      .then((resp) => (resp as any)?.data?.data);
  }

  /** A5 — bulk status sequential (Ready To Ship) */
  function updateStatuses(ids: string[], status: string) {
    return httpService
      .post(`${base}/statuses`, { ids, status })
      .then((resp) => resp);
  }

  return {
    createOutgoing,
    addDetails,
    updateOutgoingHeader,
    updateOutgoingDetail,
    retrieveEdit,
    retrieveList,
    retrieveItems,
    retrievePackagings,
    retrieveShipments,
    retrieveTotals,
    retrieveTotalsByWarehouse,
    confirmDraft,
    confirmCancellation,
    deleteOutgoing,
    updateStatus,
    retrieveDetails,
    retrieveHistory,
    adjustPlanQty,
    submitPicking,
    retrievePickingSlip,
    createPackagings,
    readyToShip,
    retrievePosByPackaging,
    retrievePackagingsByShipment,
    getSequentialConfig,
    updateStatuses,
  };
};

export default OutstandingOutgoingApi;
