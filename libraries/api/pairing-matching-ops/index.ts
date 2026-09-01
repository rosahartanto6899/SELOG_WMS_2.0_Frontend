import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  PairingConfirmPayload,
  PairingHistoryParams,
  PairingProcessPayload,
  PairingRepairPayload,
  ShipmentDetailPayload,
  UnitDetailParams,
  UnitParams,
} from "@sera-types/pairing-matching-ops";

const PairingMatchingApi = () => {
  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/ops/summary`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getUnitPosition(_payload?: any) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/ops/unit-position`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getUnitDetail({ id }: UnitDetailParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/shipments/vehicle/${id}`)
      .then((_resp) => _resp);
  }

  async function getDemands(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/ops/demands`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getDemandFilter() {
    return Promise.all([
      httpService.get(`${apiUrl.master}/shipment-types`),
      httpService.get(`${apiUrl.master}/shipment-confirmation-statuses`),
    ]).then((e) => e);
  }

  async function getUnpairedUnit(
    _payload: BaseType,
    customerId: string,
    originId: string,
  ) {
    return httpService
      .get(
        `${apiUrl.order}/pairing-matchings/ops/vehicles/unpaired?customerId=${customerId}&originId=${originId}`,
        {
          params: _payload,
        },
      )
      .then((_resp) => _resp);
  }

  async function getUnpairedDriver(
    _payload: BaseType,
    customerId: string,
    originId: string,
  ) {
    return httpService
      .get(
        `${apiUrl.order}/pairing-matchings/ops/drivers/unpaired?customerId=${customerId}&originId=${originId}`,
        {
          params: _payload,
        },
      )
      .then((_resp) => _resp);
  }

  async function pairingProcess({ id, ..._payload }: PairingProcessPayload) {
    return httpService
      .patch(`${apiUrl.order}/pairing-matchings/ops/shipments/${id}`, {
        ..._payload,
      })
      .then((_resp) => _resp);
  }

  async function getCapacityPaired(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/capacities/paired`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function pairingRepair(
    { id, ..._payload }: PairingRepairPayload,
    callback?: () => void,
  ) {
    return httpService
      .post(`${apiUrl.order}/pairing-matchings/ops/shipments/${id}/repair`, {
        ..._payload,
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function pairingConfirm(
    { id, ..._payload }: PairingConfirmPayload,
    callback?: () => void,
  ) {
    return httpService
      .post(`${apiUrl.order}/pairing-matchings/ops/shipments/${id}/confirm`, {
        ..._payload,
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function getPairingHistory({ id }: PairingHistoryParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/shipments/${id}/history`)
      .then((_resp) => _resp);
  }

  async function getShipmentDetail({ id }: ShipmentDetailPayload) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/ops/shipments/${id}`)
      .then((_resp) => _resp);
  }

  return {
    getSummary,
    getUnitPosition,
    getUnitDetail,
    getDemandFilter,
    getDemands,
    getUnpairedUnit,
    getUnpairedDriver,
    pairingProcess,
    getCapacityPaired,
    pairingConfirm,
    pairingRepair,
    getPairingHistory,
    getShipmentDetail,
  };
};

export default PairingMatchingApi;
