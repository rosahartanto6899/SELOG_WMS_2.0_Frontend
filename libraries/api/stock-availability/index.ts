import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  StockAvailabilityListPayload,
  StockOnHandHistoryRow,
} from "@sera-types/stock-availability.type";

/**
 * API untuk Dashboard Stock Availability (SELOG_WMS_2.0_ServiceInventoryStock).
 * Envelope respons backend: { data, pagination? }.
 */
const StockAvailabilityApi = () => {
  const base = `${apiUrl.inventoryStock}/stock-availability`;

  /** Q1 — list stock per material (server-side paging/search/sort) */
  function retrieveList(payload: StockAvailabilityListPayload) {
    return httpService.get(base, { params: payload }).then((resp) => resp);
  }

  /** Q2 — riwayat mutasi SOH satu material (parity usp_GetHistoryStockOnHand) */
  async function retrieveHistory(params: {
    customerCode?: string;
    warehouseCode?: string;
    materialCode: string;
  }): Promise<StockOnHandHistoryRow[]> {
    const resp: any = await httpService
      .get(`${base}/history`, { params })
      .then((r) => r);
    return resp?.data?.data ?? [];
  }

  return {
    retrieveList,
    retrieveHistory,
  };
};

export default StockAvailabilityApi;
