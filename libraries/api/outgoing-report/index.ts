import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { OutgoingReportListPayload } from "@sera-types/outgoing-report.type";

/**
 * API untuk Outgoing Report (SELOG_WMS_2.0_ServiceOutgoing).
 * Envelope respons backend: { page: {...}, data }.
 * Tenant (customer/warehouse) diambil backend dari session aktif.
 */
const OutgoingReportApi = () => {
  const base = `${apiUrl.outgoing}/outgoing-report`;

  /** List barang masuk per rentang poDate (server-side paging/search/sort) */
  function retrieveList(payload: OutgoingReportListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  return { retrieveList };
};

export default OutgoingReportApi;
