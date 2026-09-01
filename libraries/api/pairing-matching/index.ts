import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  PairingConfirmPayload,
  PairingHistoryParams,
  PairingProcessPayload,
  UnitDetailParams,
  UnitParams,
  UnitPositionParams,
} from "@sera-types/pairing-matching";

const PairingMatchingApi = () => {
  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/summary`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getUnitPosition(_payload?: UnitPositionParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/unit-position`, {
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
      .get(`${apiUrl.order}/pairing-matchings/demands`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getUnpairedUnit(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/vehicles/unpaired`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getUnpairedDriver(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/drivers/unpaired`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function pairingProcess({ id, ..._payload }: PairingProcessPayload) {
    return httpService
      .put(`${apiUrl.order}/pairing-matchings/shipments/${id}`, { ..._payload })
      .then((_resp) => _resp);
  }

  async function getCapacityPaired(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/capacities/paired`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function pairingConfirm({ id, ..._payload }: PairingConfirmPayload) {
    return httpService
      .post(
        `${apiUrl.order}/pairing-matchings/shipments/${id}/request-confirmation`,
        { ..._payload },
      )
      .then((_resp) => _resp);
  }

  async function getPairingHistory({ id }: PairingHistoryParams) {
    return httpService
      .get(`${apiUrl.order}/pairing-matchings/shipments/${id}/history`)
      .then((_resp) => _resp);
  }

  return {
    getSummary,
    getUnitPosition,
    getUnitDetail,
    getDemands,
    getUnpairedUnit,
    getUnpairedDriver,
    pairingProcess,
    getCapacityPaired,
    pairingConfirm,
    getPairingHistory,
  };
};

export default PairingMatchingApi;
