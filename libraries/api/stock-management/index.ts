import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  DetailVehiclePayload,
  GetStockPayload,
  UpdateVehiclePayload,
  VehiclePayload,
} from "@sera-types/stock-management.type";

const StockManagementApi = () => {
  async function retrieveStock(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicles`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getSummary(_payload?: GetStockPayload) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicles/summary`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function createVehicle(_payload: VehiclePayload) {
    return httpService
      .post(`${apiUrl.vehicle}/vehicles`, _payload)
      .then((__resp) => __resp);
  }

  async function detailVehicle(_payload: DetailVehiclePayload) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicles/${_payload?.id}`)
      .then((_resp) => _resp);
  }

  async function updateVehicle(_payload: UpdateVehiclePayload) {
    return httpService
      .put(`${apiUrl.vehicle}/vehicles`, _payload)
      .then((_resp) => _resp);
  }

  async function upsertVehicle(_payload: VehiclePayload) {
    return httpService
      .put(`${apiUrl.vehicle}/vehicles/bulk`, _payload)
      .then((_resp) => _resp)
      .catch((error) => {
        throw error;
      });
  }

  async function downloadTemplate() {
    return httpService
      .get(`${apiUrl.vehicle}/vehicles/template`, { responseType: "blob" })
      .then((_resp) => _resp);
  }

  async function stockStatus() {
    return httpService
      .get(`${apiUrl.master}/stock-monitoring-status`)
      .then((_resp) => _resp);
  }

  return {
    retrieveStock,
    getSummary,
    createVehicle,
    detailVehicle,
    updateVehicle,
    upsertVehicle,
    downloadTemplate,
    stockStatus,
  };
};

export default StockManagementApi;
