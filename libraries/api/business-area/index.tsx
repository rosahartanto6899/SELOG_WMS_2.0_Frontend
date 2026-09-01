import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewBusinessAreaPayload,
  GetBusinessAreaDropdownPayload,
  UpdateBusinessAreaPayload,
} from "@sera-types/business-area.type";

const BusinessAreaApi = () => {
  async function retrieveBusinessAreas(payload: BaseType) {
    return httpService
      .get(`${apiUrl.master}/branches`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveBusinessAreaDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/branches/${payload.id}`)
      .then((resp) => resp);
  }

  async function createBusinessArea(payload: CreateNewBusinessAreaPayload) {
    return httpService
      .post(`${apiUrl.master}/branches`, payload)
      .then((resp) => resp);
  }

  async function updateBusinessArea(payload: {
    id: string;
    items?: UpdateBusinessAreaPayload;
  }) {
    return httpService
      .put(`${apiUrl.master}/branches/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteBusinessArea(id: string) {
    return httpService
      .del(`${apiUrl.master}/branches/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownBusinessAreas(
    params: GetBusinessAreaDropdownPayload,
  ) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(
        `${apiUrl.user}/warehouses/dropdown${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  return {
    retrieveBusinessAreas,
    retrieveBusinessAreaDetail,
    createBusinessArea,
    updateBusinessArea,
    deleteBusinessArea,
    retrieveDropdownBusinessAreas,
  };
};

export default BusinessAreaApi;
