import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewVehicleTypePayload,
  GetVehicleTypeDropdownPayload,
  UpdateVehicleTypePayload,
} from "@sera-types/vehicle-type.type";

const VehicleTypeApi = () => {
  async function retrieveVehicleTypes(payload: BaseType) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-types`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveVehicleTypeDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-types/${payload.id}`)
      .then((resp) => resp);
  }

  async function retrieveVehicleTypesAutoComplete(payload: BaseType) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-types`, { params: payload })
      .then((resp) => resp);
  }

  async function createVehicleType(payload: CreateNewVehicleTypePayload) {
    return httpService
      .post(`${apiUrl.vehicle}/vehicle-types`, payload)
      .then((resp) => resp);
  }

  async function updateVehicleType(payload: {
    id: string;
    items?: UpdateVehicleTypePayload;
  }) {
    const { items } = payload;
    const data = {
      name: items?.name,
      code: items?.code,
      group: items?.group,
    };
    return httpService
      .put(`${apiUrl.vehicle}/vehicle-types/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteVehicleType(id: string) {
    return httpService
      .del(`${apiUrl.vehicle}/vehicle-types/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownVehicleTypes(
    params: GetVehicleTypeDropdownPayload,
  ) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");

    return httpService
      .get(
        `${apiUrl.vehicle}/vehicle-types/dropdown${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }
  return {
    retrieveVehicleTypes,
    retrieveVehicleTypeDetail,
    retrieveVehicleTypesAutoComplete,
    createVehicleType,
    updateVehicleType,
    deleteVehicleType,
    retrieveDropdownVehicleTypes,
  };
};

export default VehicleTypeApi;
