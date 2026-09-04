import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * API Master Location (SELOG_WMS_2.0_ServiceMasterData).
 */
const LocationApi = () => {
  async function retrieveLocations(payload: {
    warehouseCode?: string;
    zoneId?: string;
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/locations`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveDropdownLocations(payload: {
    customerCode?: string;
    warehouseCode?: string;
    zoneId?: string;
  }) {
    return httpService
      .get(`${apiUrl.master}/locations/dropdown`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveLocationDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/locations/${payload.id}`)
      .then((resp) => resp);
  }

  async function retrieveAvailableBarcodes() {
    return httpService
      .get(`${apiUrl.master}/locations/available-barcodes`)
      .then((resp) => resp);
  }

  async function createLocation(payload: {
    warehouseCode: string;
    warehouseName?: string;
    code: string;
    name: string;
    barcode: string;
    zoneId: string;
    category?: string;
    description?: string;
  }) {
    return httpService
      .post(`${apiUrl.master}/locations`, payload)
      .then((resp) => resp);
  }

  async function updateLocation(payload: {
    id: string;
    items: {
      name: string;
      zoneId: string;
      category?: string;
      description?: string;
    };
  }) {
    return httpService
      .put(`${apiUrl.master}/locations/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteLocation(id: string) {
    return httpService
      .del(`${apiUrl.master}/locations/${id}`)
      .then((resp) => resp);
  }

  async function generateBarcodeLabels(
    items: {
      barcode: string;
      code?: string;
      name?: string;
    }[],
  ) {
    return httpService
      .post(`${apiUrl.master}/locations/barcode-labels`, { items })
      .then((resp) => resp);
  }

  return {
    retrieveLocations,
    retrieveDropdownLocations,
    retrieveLocationDetail,
    retrieveAvailableBarcodes,
    createLocation,
    updateLocation,
    deleteLocation,
    generateBarcodeLabels,
  };
};

export default LocationApi;
