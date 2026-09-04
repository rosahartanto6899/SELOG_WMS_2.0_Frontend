import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { Zone, ZoneDropdown } from "@sera-types/zone.type";

/**
 * API Master Zone (SELOG_WMS_2.0_ServiceMasterData).
 */
const ZoneApi = () => {
  async function retrieveZones(payload: {
    warehouseCode?: string;
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/zones`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveDropdownZones(payload: {
    customerCode?: string;
    warehouseCode?: string;
  }) {
    return httpService
      .get(`${apiUrl.master}/zones/dropdown`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveZoneDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/zones/${payload.id}`)
      .then((resp) => resp);
  }

  async function createZone(payload: {
    warehouseCode: string;
    warehouseName?: string;
    code: string;
    name: string;
    description?: string;
  }) {
    return httpService
      .post(`${apiUrl.master}/zones`, payload)
      .then((resp) => resp);
  }

  async function updateZone(payload: {
    id: string;
    items: { name: string; description?: string };
  }) {
    return httpService
      .put(`${apiUrl.master}/zones/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteZone(id: string) {
    return httpService.del(`${apiUrl.master}/zones/${id}`).then((resp) => resp);
  }

  return {
    retrieveZones,
    retrieveDropdownZones,
    retrieveZoneDetail,
    createZone,
    updateZone,
    deleteZone,
  };
};

export type { Zone, ZoneDropdown };
export default ZoneApi;
