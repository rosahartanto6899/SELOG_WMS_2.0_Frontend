import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { LocationReversePayload } from "@sera-types/master-data.type";

const MasterDataApi = () => {
  async function getShipmentTypes() {
    return httpService
      .get(`${apiUrl.master}/shipment-types`)
      .then((resp) => resp)
      .catch((error) => {
        throw error;
      });
  }

  async function getOwnershipTypes() {
    return httpService
      .get(`${apiUrl.master}/ownership`)
      .then((resp) => resp)
      .catch((error) => {
        throw error;
      });
  }

  async function getEmployeeStatus() {
    return httpService
      .get(`${apiUrl.master}/employee-statuses`)
      .then((resp) => resp)
      .catch((error) => {
        throw error;
      });
  }

  async function getDriverStatus() {
    return httpService
      .get(`${apiUrl.master}/driver-gantt-chart-statuses`)
      .then((resp) => resp)
      .catch((error) => {
        throw error;
      });
  }

  async function getAreas() {
    return httpService.get(`${apiUrl.master}/areas`).then((_resp) => _resp);
  }

  async function getOrderPriorities() {
    return httpService
      .get(`${apiUrl.master}/order-priorities`)
      .then((_resp) => _resp);
  }

  async function getUnitCapacityStatuses() {
    return httpService
      .get(`${apiUrl.master}/unit-capacity-statuses`)
      .then((_resp) => _resp);
  }

  async function getDriverCapacityStatuses() {
    return httpService
      .get(`${apiUrl.master}/driver-capacity-statuses`)
      .then((_resp) => _resp);
  }

  async function getEmployeeStatuses() {
    return httpService
      .get(`${apiUrl.master}/employee-statuses`)
      .then((_resp) => _resp);
  }

  async function getTierLevels() {
    return httpService
      .get(`${apiUrl.master}/tier-levels`)
      .then((_resp) => _resp);
  }

  async function getShipmentConfirmationStatuses() {
    return httpService
      .get(`${apiUrl.master}/shipment-confirmation-statuses`)
      .then((_resp) => _resp);
  }

  async function getVoDCategories() {
    return httpService
      .get(`${apiUrl.master}/vod-categories`)
      .then((_resp) => _resp);
  }

  async function getVoDStatuses() {
    return httpService
      .get(`${apiUrl.master}/vod-statuses`)
      .then((_resp) => _resp);
  }

  async function getVoDTypes() {
    return httpService
      .get(`${apiUrl.journey}/voice-of-drivers/dropdown`)
      .then((_resp) => _resp);
  }

  async function getShipmentCancellationReasons() {
    return httpService
      .get(`${apiUrl.master}/shipment-cancellation-reasons`)
      .then((_resp) => _resp);
  }

  async function getLocationReverse(_payload: LocationReversePayload) {
    return httpService
      .get(`${apiUrl.master}/locations/reverse`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getJourneyStatuses() {
    return httpService
      .get(`${apiUrl.master}/journey-statuses`)
      .then((_resp) => _resp);
  }

  return {
    getShipmentTypes,
    getOwnershipTypes,
    getEmployeeStatus,
    getDriverStatus,
    getAreas,
    getOrderPriorities,
    getUnitCapacityStatuses,
    getDriverCapacityStatuses,
    getEmployeeStatuses,
    getTierLevels,
    getShipmentConfirmationStatuses,
    getVoDCategories,
    getVoDStatuses,
    getVoDTypes,
    getShipmentCancellationReasons,
    getLocationReverse,
    getJourneyStatuses,
  };
};

export default MasterDataApi;
