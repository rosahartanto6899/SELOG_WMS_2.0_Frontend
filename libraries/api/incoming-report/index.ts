import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { IncomingReportListPayload } from "@sera-types/incoming-report.type";

/**
 * API untuk Incoming Report (SELOG_WMS_2.0_ServiceIncoming).
 * Envelope respons backend: { page: {...}, data }.
 * Tenant (customer/warehouse) diambil backend dari session aktif.
 */
const IncomingReportApi = () => {
  const base = `${apiUrl.incoming}/incoming-report`;

  /** List barang masuk per rentang poDate (server-side paging/search/sort) */
  function retrieveList(payload: IncomingReportListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  return { retrieveList };
};

export default IncomingReportApi;
