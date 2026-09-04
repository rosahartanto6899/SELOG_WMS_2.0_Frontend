import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * API Master Material (SELOG_WMS_2.0_ServiceMasterData).
 */
const MaterialApi = () => {
  async function retrieveMaterials(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/materials`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveDropdownMaterials(payload: { customerCode?: string }) {
    return httpService
      .get(`${apiUrl.master}/materials/dropdown`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveMaterialDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/materials/${payload.id}`)
      .then((resp) => resp);
  }

  async function retrieveAvailableBarcodes() {
    return httpService
      .get(`${apiUrl.master}/materials/available-barcodes`)
      .then((resp) => resp);
  }

  async function createMaterial(payload: {
    code: string;
    name: string;
    category: string;
    barcode: string;
    brand?: string;
    uoM?: string;
    description?: string;
  }) {
    return httpService
      .post(`${apiUrl.master}/materials`, payload)
      .then((resp) => resp);
  }

  async function updateMaterial(payload: {
    id: string;
    items: {
      name: string;
      category: string;
      brand?: string;
      uoM?: string;
      description?: string;
    };
  }) {
    return httpService
      .put(`${apiUrl.master}/materials/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteMaterial(id: string) {
    return httpService
      .del(`${apiUrl.master}/materials/${id}`)
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
      .post(`${apiUrl.master}/materials/barcode-labels`, { items })
      .then((resp) => resp);
  }

  return {
    retrieveMaterials,
    retrieveDropdownMaterials,
    retrieveMaterialDetail,
    retrieveAvailableBarcodes,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    generateBarcodeLabels,
  };
};

export default MaterialApi;
