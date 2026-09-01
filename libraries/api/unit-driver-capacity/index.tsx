import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  UnitCapacityForecastPayload,
  UnitDriverSummaryPayload,
} from "@sera-types/unit-driver-capacity.type";

const UnitDriverCapacityApi = () => {
  async function retrieveUnitCapacity(payload: BaseType) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-capacity`, { params: payload })
      .then((resp) => resp);
  }
  async function retrieveDriverCapacity(payload: BaseType) {
    return httpService
      .get(`${apiUrl.driver}/drivers/capacity`, { params: payload })
      .then((resp) => resp);
  }

  async function getUnitCapacitySummary(payload: UnitDriverSummaryPayload) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-capacity/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getDriverCapacitySummary(payload: UnitDriverSummaryPayload) {
    return httpService
      .get(`${apiUrl.driver}/drivers/capacity/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getUnitCapacityForecast(payload: UnitCapacityForecastPayload) {
    return httpService
      .post(`${apiUrl.vehicle}/vehicle-forecasts`, payload)
      .then((resp) => resp);
  }

  async function getDriverCapacityForecast(
    payload: UnitCapacityForecastPayload,
  ) {
    return httpService
      .post(`${apiUrl.driver}/driver-forecasts`, payload)
      .then((resp) => resp);
  }

  async function getDriverCapacityStatuses() {
    return httpService
      .get(`${apiUrl.master}/driver-capacity-statuses`)
      .then((resp) => resp);
  }

  async function getUnitCapacityStatuses() {
    return httpService
      .get(`${apiUrl.master}/unit-capacity-statuses`)
      .then((resp) => resp);
  }

  async function getEmployeeStatuses() {
    return httpService
      .get(`${apiUrl.master}/employee-statuses`)
      .then((resp) => resp);
  }

  async function getUnitCapacityDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.vehicle}/vehicle-capacity/${payload.id}`)
      .then((resp) => resp);
  }

  async function getDriverCapacityDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.driver}/drivers/capacity/${payload.id}`)
      .then((resp) => resp);
  }

  return {
    retrieveUnitCapacity,
    retrieveDriverCapacity,
    getUnitCapacitySummary,
    getDriverCapacitySummary,
    getUnitCapacityForecast,
    getDriverCapacityForecast,
    getDriverCapacityStatuses,
    getUnitCapacityStatuses,
    getUnitCapacityDetail,
    getDriverCapacityDetail,
    getEmployeeStatuses,
  };
};

export default UnitDriverCapacityApi;
