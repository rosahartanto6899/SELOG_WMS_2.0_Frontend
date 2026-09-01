import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * Handles API calls related to customers (tenants).
 */
const WmsCustomerApi = () => {
  async function retrieveCustomers(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/customers`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveCustomerDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/customers/${payload.id}`)
      .then((resp) => resp);
  }

  async function createCustomer(payload: {
    code?: string;
    name?: string;
    address?: string;
    phone?: string;
  }) {
    return httpService
      .post(`${apiUrl.user}/customers`, payload)
      .then((resp) => resp);
  }

  async function updateCustomer(payload: {
    id: string;
    items?: { code?: string; name?: string; address?: string; phone?: string };
  }) {
    return httpService
      .put(`${apiUrl.user}/customers/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteCustomer(id: string) {
    return httpService
      .del(`${apiUrl.user}/customers/${id}`)
      .then((resp) => resp);
  }

  return {
    retrieveCustomers,
    retrieveCustomerDetail,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

export default WmsCustomerApi;
