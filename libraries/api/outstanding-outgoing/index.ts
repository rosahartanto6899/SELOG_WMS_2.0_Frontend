import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  InputOutgoingPayload,
  OutstandingOutgoingAddInfo,
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

  return {
    createOutgoing,
    addDetails,
    updateOutgoingHeader,
    updateOutgoingDetail,
    retrieveEdit,
  };
};

export default OutstandingOutgoingApi;
