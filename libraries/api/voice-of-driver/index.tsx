import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateVoDPayload,
  DetailVoDPayload,
  ListParams,
  UpdateVoDPayload,
} from "@sera-types/voice-of-driver.type";

const VoDApi = () => {
  async function getSummary(_payload?: ListParams) {
    return httpService
      .get(`${apiUrl.journey}/voice-of-drivers/summary`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getVoDList(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.journey}/voice-of-drivers`, { params: _payload })
      .then((resp) => resp);
  }

  async function getShipment(_payload: BaseType & { filter?: string }) {
    return httpService
      .get(`${apiUrl.order}/shipment`, { params: _payload })
      .then((resp) => resp);
  }

  async function createVoD(_payload: CreateVoDPayload) {
    return httpService
      .post(`${apiUrl.journey}/voice-of-drivers`, { ..._payload })
      .then((resp) => resp);
  }

  async function detailVoD({ id }: DetailVoDPayload) {
    return httpService
      .get(`${apiUrl.journey}/voice-of-drivers/${id}`)
      .then((resp) => resp);
  }

  async function updateVoD({ id, ..._payload }: UpdateVoDPayload) {
    return httpService
      .put(`${apiUrl.journey}/voice-of-drivers/${id}`, { ..._payload })
      .then((_resp) => _resp);
  }

  return {
    getSummary,
    getVoDList,
    getShipment,
    createVoD,
    detailVoD,
    updateVoD,
  };
};

export default VoDApi;
