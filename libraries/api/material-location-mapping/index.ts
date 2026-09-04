import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { UploadMaterialLocationMappingRow } from "@sera-types/material-location-mapping.type";

/**
 * API Material–Location Mapping (SELOG_WMS_2.0_ServiceMasterData).
 */
const MaterialLocationMappingApi = () => {
  async function downloadTemplate(warehouseCode: string) {
    return httpService
      .get(`${apiUrl.master}/upload-material-location-mapping/template`, {
        params: { warehouseCode },
        responseType: "blob",
      } as any)
      .then((resp) => resp);
  }

  async function upsertRow(payload: UploadMaterialLocationMappingRow) {
    return httpService
      .put(`${apiUrl.master}/upload-material-location-mapping/bulk`, payload)
      .then((resp) => resp);
  }

  async function retrieveMappings(payload: {
    warehouseCode?: string;
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/material-location-mappings`, { params: payload })
      .then((resp) => resp);
  }

  return { downloadTemplate, upsertRow, retrieveMappings };
};

export default MaterialLocationMappingApi;
