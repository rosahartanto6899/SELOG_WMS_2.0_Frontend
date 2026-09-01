import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateSalesPayload,
  CustomerContactsPayload,
  CustomerSalesPayload,
  DeleteSalesPayload,
  DetailCustomerPayload,
  GetAllCustomerDropdownPayload,
  GetCustomerDropdownPayload,
  UpdateCustomerPayload,
} from "@sera-types/customer.type";

const CustomerApi = () => {
  async function getCustomers(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/customers`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getDetailCustomer(_payload: DetailCustomerPayload) {
    return httpService
      .get(`${apiUrl.order}/customers/${_payload?.id}`)
      .then((_resp) => _resp);
  }

  async function updateCustomer({ id, ..._payload }: UpdateCustomerPayload) {
    return httpService
      .put(`${apiUrl.order}/customers/${id}`, _payload)
      .then((_resp) => _resp);
  }

  async function createSales(_payload: CreateSalesPayload) {
    return httpService
      .post(`${apiUrl.order}/customers/sales`, _payload)
      .then((_resp) => _resp);
  }

  async function deleteSales(_payload: DeleteSalesPayload) {
    return httpService
      .del(`${apiUrl.order}/customers/sales/${_payload.id}`)
      .then((_resp) => _resp);
  }

  async function getCustomerSales(payload: CustomerSalesPayload) {
    return httpService
      .get(`${apiUrl.order}/customers/${payload?.customerId}/sales`)
      .then((resp) => resp);
  }

  async function getCustomerContacts(payload: CustomerContactsPayload) {
    return httpService
      .get(`${apiUrl.order}/customers/${payload?.customerId}/contacts`)
      .then((resp) => resp);
  }

  async function deleteCustomer(id: string) {
    return httpService
      .del(`${apiUrl.order}/customers/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownCustomers(params: GetCustomerDropdownPayload) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(`${apiUrl.order}/customers${keys.length ? "?" + PARAMS : ""}`)
      .then((resp) => resp);
  }

  async function getDropdownSales() {
    return httpService
      .get(`${apiUrl.user}/users/sales/dropdown`)
      .then((_resp) => _resp);
  }

  async function getDropdownAddReq() {
    return httpService
      .get(`${apiUrl.order}/customers/additional-req-items`)
      .then((resp) => resp);
  }

  async function getDropdownPOD() {
    return httpService
      .get(`${apiUrl.master}/pod-receipt-types`)
      .then((resp) => resp);
  }

  async function retrieveDropdownIndustries(
    params: GetAllCustomerDropdownPayload,
  ) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(
        `${apiUrl.order}/customers/industries${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  async function retrieveDropdownCustomerCategories() {
    return httpService
      .get(`${apiUrl.order}/customers/categories`)
      .then((resp) => resp);
  }

  async function retrieveDropdownCustomerStatuses() {
    return httpService
      .get(`${apiUrl.order}/customers/statuses`)
      .then((resp) => resp);
  }

  return {
    getCustomers,
    getDetailCustomer,
    updateCustomer,
    createSales,
    deleteSales,
    getCustomerSales,
    getCustomerContacts,
    deleteCustomer,
    retrieveDropdownCustomers,
    getDropdownSales,
    getDropdownAddReq,
    getDropdownPOD,
    retrieveDropdownIndustries,
    retrieveDropdownCustomerCategories,
    retrieveDropdownCustomerStatuses,
  };
};

export default CustomerApi;
