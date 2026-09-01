import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * Handles API calls related to warehouses.
 */
const WmsWarehouseApi = () => {
  async function retrieveWarehouses(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/warehouses`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveWarehouseDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/warehouses/${payload.id}`)
      .then((resp) => resp);
  }

  async function createWarehouse(payload: {
    customerId?: string;
    code?: string;
    name?: string;
    address?: string;
    phone?: string;
  }) {
    return httpService
      .post(`${apiUrl.user}/warehouses`, payload)
      .then((resp) => resp);
  }

  async function updateWarehouse(payload: {
    id: string;
    items?: {
      customerId?: string;
      code?: string;
      name?: string;
      address?: string;
      phone?: string;
    };
  }) {
    return httpService
      .put(`${apiUrl.user}/warehouses/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteWarehouse(id: string) {
    return httpService
      .del(`${apiUrl.user}/warehouses/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownWarehouses() {
    return httpService
      .get(`${apiUrl.user}/warehouses/dropdown`)
      .then((resp) => resp);
  }

  async function retrieveWarehouseCustomers() {
    return httpService
      .get(`${apiUrl.user}/warehouses/customers`)
      .then((resp) => resp);
  }

  return {
    retrieveWarehouses,
    retrieveWarehouseDetail,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    retrieveDropdownWarehouses,
    retrieveWarehouseCustomers,
  };
};

export default WmsWarehouseApi;
