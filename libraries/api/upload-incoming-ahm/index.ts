import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { UploadIncomingAhmRow } from "@sera-types/upload-incoming-ahm.type";

/**
 * API untuk Upload Incoming AHM (SELOG_WMS_2.0_ServiceIncoming).
 */
const UploadIncomingAhmApi = () => {
  async function downloadTemplate() {
    return httpService
      .get(`${apiUrl.incoming}/upload-incoming-ahm/template`, {
        responseType: "blob",
      })
      .then((resp) => resp);
  }

  // Satu baris per call — pola upsertVehicle (ServiceVehicle)
  async function upsertRow(payload: UploadIncomingAhmRow) {
    return httpService
      .put(`${apiUrl.incoming}/upload-incoming-ahm/bulk`, payload)
      .then((resp) => resp);
  }

  return { downloadTemplate, upsertRow };
};

export default UploadIncomingAhmApi;
