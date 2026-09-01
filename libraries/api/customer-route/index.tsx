import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateCustomerRoutePayload,
  DetailCustomerRoutePayload,
  DownloadQuotationPayload,
  GetCustomerRouteDropdownPayload,
  UpdateCustomerRoutePayload,
  UploadQuotationPayload,
} from "@sera-types/customer-route.type";
import _ from "lodash";

const CustomerRouteApi = () => {
  async function getCustomerRoutes(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/customer-routes`, { params: payload })
      .then((resp) => resp);
  }

  async function createCustomerRoute(_payload: CreateCustomerRoutePayload) {
    return httpService
      .post(`${apiUrl.order}/customer-routes`, _payload)
      .then((_resp) => _resp);
  }

  async function retrieveCustomerRouteDetail(
    _payload: DetailCustomerRoutePayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/customer-routes/${_payload.id}`)
      .then((_resp) => _resp);
  }

  async function updateCustomerRoute(payload: {
    id: string;
    items?: UpdateCustomerRoutePayload;
  }) {
    const data = _.omit(payload.items, "name");
    return httpService
      .put(`${apiUrl.order}/customer-routes/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteCustomerRoute(_id: string) {
    return httpService
      .del(`${apiUrl.order}/customer-routes/${_id}`)
      .then((_resp) => _resp);
  }

  async function retrieveDropdownCustomerRoutes(
    params: GetCustomerRouteDropdownPayload,
  ) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(`${apiUrl.order}/customer-routes${keys.length ? "?" + PARAMS : ""}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownRouteActivityTypes() {
    return httpService
      .get(`${apiUrl.master}/route-activity-type`)
      .then((resp) => resp);
  }

  async function retrieveDropdownLeadTimeTypes() {
    return httpService
      .get(`${apiUrl.master}/leadtime-type`)
      .then((resp) => resp);
  }

  async function getDropdownTollUsages() {
    return httpService
      .get(`${apiUrl.master}/toll-usages`)
      .then((_resp) => _resp);
  }

  async function uploadQuotation(_payload: UploadQuotationPayload) {
    const formData = new FormData();
    formData.append("file", _payload?.file);

    return httpService
      .post(`${apiUrl.order}/customer-routes/upload-quotation`, formData)
      .then((_resp) => _resp);
  }

  async function downloadQuotation({ id }: DownloadQuotationPayload) {
    return httpService
      .get(`${apiUrl.order}/customer-routes/${id}/download-quotation`, {
        responseType: "blob",
      })
      .then((_resp) => _resp);
  }

  return {
    getCustomerRoutes,
    createCustomerRoute,
    retrieveCustomerRouteDetail,
    updateCustomerRoute,
    deleteCustomerRoute,
    retrieveDropdownCustomerRoutes,
    retrieveDropdownRouteActivityTypes,
    retrieveDropdownLeadTimeTypes,
    getDropdownTollUsages,
    uploadQuotation,
    downloadQuotation,
  };
};

export default CustomerRouteApi;
