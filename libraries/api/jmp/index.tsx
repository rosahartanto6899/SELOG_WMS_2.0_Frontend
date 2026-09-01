import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateJMPPayload,
  DetailJMPPayload,
  FilterParams,
  UpdateJMPPayload,
} from "@sera-types/jmp.type";

const JMPApi = () => {
  async function getSummary(_payload?: FilterParams) {
    return httpService
      .get(`${apiUrl.order}/journey-management-plans/summary`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getJMPList(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/journey-management-plans`, { params: _payload })
      .then((resp) => resp);
  }

  async function createJMP(_payload: CreateJMPPayload) {
    return httpService
      .post(`${apiUrl.order}/journey-management-plans`, { ..._payload })
      .then((resp) => resp);
  }

  async function detailJMP({ id }: DetailJMPPayload) {
    return httpService
      .get(`${apiUrl.order}/journey-management-plans/${id}`)
      .then((resp) => resp);
  }

  async function updateJMP({ id, ..._payload }: UpdateJMPPayload) {
    return httpService
      .put(`${apiUrl.order}/journey-management-plans/${id}`, { ..._payload })
      .then((resp) => resp);
  }

  return {
    getSummary,
    getJMPList,
    createJMP,
    detailJMP,
    updateJMP,
  };
};

export default JMPApi;
