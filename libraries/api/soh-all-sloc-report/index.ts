import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { SohAllSlocReportListPayload } from "@sera-types/soh-all-sloc-report.type";

/**
 * API untuk Report SOH All SLOC (SELOG_WMS_2.0_ServiceInventoryStock).
 * Envelope respons backend: { data: { warehouses, rows }, pagination } —
 * warehouses = kode semua warehouse user (kolom dinamis tabel).
 * Scope customer + semua warehouse user diambil backend dari session aktif.
 */
const SohAllSlocReportApi = () => {
  const base = `${apiUrl.inventoryStock}/soh-all-sloc`;

  /** List SOH dipivot per warehouse user (server-side paging/search/sort) */
  function retrieveList(payload: SohAllSlocReportListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  return { retrieveList };
};

export default SohAllSlocReportApi;
