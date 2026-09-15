import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { UploadStockAdjustmentRow } from "@sera-types/upload-stock-adjustment.type";

/**
 * API untuk Upload Stock Adjustment (SELOG_WMS_2.0_ServiceInventoryStock).
 */
const UploadStockAdjustmentApi = () => {
  async function downloadTemplate() {
    return httpService
      .get(`${apiUrl.inventoryStock}/upload-stock-adjustment/template`, {
        responseType: "blob",
      })
      .then((resp) => resp);
  }

  // Satu baris per call — pola upsertVehicle (ServiceVehicle)
  async function upsertRow(payload: UploadStockAdjustmentRow) {
    return httpService
      .put(`${apiUrl.inventoryStock}/upload-stock-adjustment/bulk`, payload)
      .then((resp) => resp);
  }

  return { downloadTemplate, upsertRow };
};

export default UploadStockAdjustmentApi;
