import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  LocationPayload,
  MaintenancePayload,
  MaintenanceUpdatePayload,
  PMCheckPayload,
  UnitDetailPayload,
  UnitParams,
} from "@sera-types/unit-activity";

const UnitActivityApi = () => {
  async function getUnit(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-maintenance/schedule`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getUnitDetail(_payload: UnitDetailPayload) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-maintenance/${_payload?.id}`)
      .then((__resp) => __resp);
  }

  async function getPMCheckDetail(_payload: UnitDetailPayload) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-maintenance/pm-check/${_payload?.id}`)
      .then((__resp) => __resp);
  }

  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-maintenance/schedule/summary`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function createMaintenance(_payload: MaintenancePayload) {
    return httpService
      .post(`${apiUrl.vehicle}/vehicle-maintenance`, _payload)
      .then((_resp) => _resp);
  }

  async function updateMaintenance({
    id,
    ..._payload
  }: MaintenanceUpdatePayload) {
    return httpService
      .put(`${apiUrl.vehicle}/vehicle-maintenance/${id}`, _payload)
      .then((_resp) => _resp);
  }

  async function updatePMCheck(_payload: PMCheckPayload) {
    return httpService
      .post(`${apiUrl.vehicle}/vehicle-maintenance/pm-check`, _payload)
      .then((_resp) => _resp);
  }

  async function getLastLocation(_payload: LocationPayload) {
    return httpService
      .get(
        `${apiUrl.vehicle}/vehicles/last-location/${_payload?.vin}`,
        _payload?.type ? { params: { type: _payload?.type } } : {},
      )
      .then((_resp) => _resp);
  }

  async function getMaintenanceStatus() {
    return httpService
      .get(`${apiUrl.master}/maintenance-status`)
      .then((_resp) => _resp);
  }

  async function getMaintenanceType() {
    return httpService
      .get(`${apiUrl.master}/maintenance-type`)
      .then((_resp) => _resp);
  }

  async function getMaintenanceLevel() {
    return httpService
      .get(`${apiUrl.master}/maintenance-level`)
      .then((_resp) => _resp);
  }

  async function getLocationCount(_payload: UnitDetailPayload) {
    return httpService
      .get(
        `${apiUrl.vehicle}/vehicle-maintenance/location-count/${_payload?.id}`,
      )
      .then((_resp) => _resp);
  }

  return {
    getUnit,
    getUnitDetail,
    getPMCheckDetail,
    getSummary,
    createMaintenance,
    updateMaintenance,
    updatePMCheck,
    getLastLocation,
    getMaintenanceStatus,
    getMaintenanceType,
    getMaintenanceLevel,
    getLocationCount,
  };
};

export default UnitActivityApi;
