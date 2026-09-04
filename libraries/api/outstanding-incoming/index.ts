import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  BinningSlipRow,
  FilterResultRow,
  ForActualResult,
  HoldRowResult,
  InputIncomingPayload,
  OutstandingIncomingHeader,
  OutstandingIncomingHistory,
  OutstandingIncomingListPayload,
  OutstandingIncomingTotals,
  StockAvailabilityResult,
} from "@sera-types/outstanding-incoming.type";

/**
 * API untuk Outstanding Incoming (SELOG_WMS_2.0_ServiceIncoming §2 spec).
 * Envelope respons backend: { data, pagination? }.
 */
const OutstandingIncomingApi = () => {
  const base = `${apiUrl.incoming}/outstanding-incoming`;

  // ===== Query Q1–Q9 =====
  function retrieveList(payload: OutstandingIncomingListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  function retrieveDetail(id: string) {
    return httpService.get(`${base}/${id}/details`).then((resp) => resp);
  }

  function retrieveByMaterial(params: {
    customerCode: string;
    warehouseCode: string;
    materialCode: string;
  }) {
    return httpService
      .get(`${base}/by-material`, { params })
      .then((resp) => resp);
  }

  function retrievePlanQty(params: {
    customerCode: string;
    warehouseCode: string;
  }) {
    return httpService.get(`${base}/plan-qty`, { params }).then((resp) => resp);
  }

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

  function retrieveHistory(id: string) {
    return httpService.get(`${base}/${id}/history`).then((resp) => resp);
  }

  function checkIndicator(payload: {
    customerCode: string;
    warehouseCode: string;
  }) {
    return httpService.post(`${base}/indicator`, payload).then((resp) => resp);
  }

  // ===== Aksi A =====
  function confirmDraft(ids: string[]) {
    return httpService
      .post(`${base}/confirm-draft`, { ids })
      .then((resp) => resp);
  }

  function insertHolds(
    holds: Array<{
      planIncomingHeaderId: string;
      locationId?: string;
      locationName?: string;
      qty: number;
      description?: string;
      attachPhotos?: string;
    }>,
  ) {
    return httpService.post(`${base}/holds`, { holds }).then((resp) => resp);
  }

  function uploadHoldAttachment(id: string, file: File) {
    const form = new FormData();
    form.append("id", id);
    form.append("file", file);
    return httpService
      .post(`${base}/holds/attachments`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((resp) => resp);
  }

  function retrieveHolds(params?: Record<string, string | undefined>) {
    return httpService.get(`${base}/holds`, { params }).then((resp) => resp);
  }

  function retrieveHoldDetail(headerId: string) {
    return httpService.get(`${base}/holds/${headerId}`).then((resp) => resp);
  }

  function toggleHold(id: string) {
    return httpService.post(`${base}/holds/${id}/toggle`).then((resp) => resp);
  }

  function updatePlanQty(
    id: string,
    payload: { planQty: number; description?: string },
  ): Promise<{
    data: { message: string; stockAvailabilities: StockAvailabilityResult[] };
  }> {
    return httpService
      .put(`${base}/details/${id}/plan-qty`, payload)
      .then((resp) => resp.data) as any;
  }

  function updateStatus(id: string, status: string) {
    return httpService
      .put(`${base}/${id}/status`, { status })
      .then((resp) => resp);
  }

  function deleteOutstanding(ids: string[]) {
    return httpService.post(`${base}/delete`, { ids }).then((resp) => resp);
  }

  function cancelPlanIncoming(id: string) {
    return httpService.post(`${base}/${id}/cancel`).then((resp) => resp);
  }

  function retrieveForActual(ids: string[]): Promise<ForActualResult> {
    return httpService
      .post(`${base}/for-actual`, { ids })
      .then((resp) => resp.data?.data ?? resp.data) as any;
  }

  function createActual(payload: {
    ids: string[];
    picReceiver?: string;
    picBinner?: string;
  }) {
    return httpService.post(`${base}/actual`, payload).then((resp) => resp);
  }

  // ===== Binning & QI B1–B7 =====
  function retrieveLocations(id: string) {
    return httpService.get(`${base}/${id}/locations`).then((resp) => resp);
  }

  function binning(id: string, actualQty: number) {
    return httpService
      .post(`${base}/details/${id}/binning`, { actualQty })
      .then((r) => r);
  }

  function retrieveBinningSlip(id: string): Promise<BinningSlipRow[]> {
    return httpService
      .get(`${base}/${id}/binning-slip`)
      .then((resp) => resp.data?.data ?? []) as any;
  }

  function retrieveFilterResult(payload: {
    customerCode: string;
    warehouseCodes: string[];
    searchParam: string;
  }): Promise<FilterResultRow[]> {
    return httpService
      .post(`${base}/filter-result`, payload)
      .then((r) => r.data?.data ?? []) as any;
  }

  function saveQualityInspection(
    id: string,
    items: Array<{
      materialCode: string;
      partialQty: number;
      description?: string;
    }>,
  ) {
    return httpService
      .post(`${base}/quality-inspection`, { id, items })
      .then((resp) => resp);
  }

  function retrieveDetailAttachments(id: string) {
    return httpService
      .get(`${base}/details/${id}/attachments`)
      .then((resp: any) => resp?.data?.data ?? []);
  }

  function updateQiDetail(
    id: string,
    payload: {
      materialCode?: string;
      materialName?: string;
      materialBrand?: string;
      materialBarcode?: string;
      materialLocationBarcode?: string;
      uom?: string;
      planQty?: number;
      actualQty?: number;
      partialQty?: number;
      description?: string;
    },
  ) {
    return httpService
      .put(`${base}/details/${id}/qi`, payload)
      .then((resp) => resp);
  }

  // ===== Input manual C1–C6 =====
  function createIncoming(payload: InputIncomingPayload) {
    return httpService.post(base, payload).then((resp) => resp);
  }

  function addDetails(id: string, details: InputIncomingPayload["details"]) {
    return httpService
      .post(`${base}/${id}/details`, { details })
      .then((resp) => resp);
  }

  function updateIncomingHeader(
    id: string,
    payload: Partial<InputIncomingPayload>,
  ) {
    return httpService.put(`${base}/${id}`, payload).then((resp) => resp);
  }

  function updateIncomingDetail(
    id: string,
    payload: {
      qty: number;
      additionalInformation?: Array<{ name?: string; value?: string }>;
    },
  ) {
    return httpService
      .put(`${base}/details/${id}`, payload)
      .then((resp) => resp);
  }

  function deleteDetails(ids: string[]) {
    return httpService
      .post(`${base}/details/delete`, { ids })
      .then((resp) => resp);
  }

  function retrieveEdit(id: string): Promise<OutstandingIncomingHeader> {
    return httpService
      .get(`${base}/${id}/edit`)
      .then((resp) => resp.data?.data ?? resp.data) as any;
  }

  // helpers bertipe untuk modal
  async function retrieveDetailTyped(
    id: string,
  ): Promise<OutstandingIncomingHeader> {
    const resp: any = await retrieveDetail(id);
    return resp?.data?.data ?? resp?.data;
  }

  async function retrieveHistoryTyped(
    id: string,
  ): Promise<OutstandingIncomingHistory[]> {
    const resp: any = await retrieveHistory(id);
    return resp?.data?.data ?? [];
  }

  async function retrieveHoldsTyped(
    params?: Record<string, string | undefined>,
  ): Promise<HoldRowResult[]> {
    const resp: any = await retrieveHolds(params);
    return resp?.data?.data ?? [];
  }

  async function retrieveTotalsTyped(payload: {
    customerCode?: string;
    warehouseCodes: string[];
  }): Promise<OutstandingIncomingTotals> {
    const resp: any = await retrieveTotals(payload);
    return resp?.data?.data ?? { totalDataOutstanding: 0 };
  }

  async function retrieveTotalsByWarehouseTyped(payload: {
    customerCode?: string;
    warehouseCodes: string[];
  }): Promise<OutstandingIncomingTotals[]> {
    const resp: any = await retrieveTotalsByWarehouse(payload);
    return resp?.data?.data ?? [];
  }

  return {
    retrieveList,
    retrieveDetail,
    retrieveDetailTyped,
    retrieveByMaterial,
    retrievePlanQty,
    retrieveTotals,
    retrieveTotalsTyped,
    retrieveTotalsByWarehouse,
    retrieveTotalsByWarehouseTyped,
    retrieveHistory,
    retrieveHistoryTyped,
    checkIndicator,
    confirmDraft,
    insertHolds,
    uploadHoldAttachment,
    retrieveHolds,
    retrieveHoldsTyped,
    retrieveHoldDetail,
    toggleHold,
    updatePlanQty,
    updateStatus,
    deleteOutstanding,
    cancelPlanIncoming,
    retrieveForActual,
    createActual,
    retrieveLocations,
    binning,
    retrieveBinningSlip,
    retrieveFilterResult,
    saveQualityInspection,
    retrieveDetailAttachments,
    updateQiDetail,
    createIncoming,
    addDetails,
    updateIncomingHeader,
    updateIncomingDetail,
    deleteDetails,
    retrieveEdit,
  };
};

export default OutstandingIncomingApi;
