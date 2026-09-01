import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateServiceGroupPayload,
  DetailServiceGroupPayload,
  UpdateServiceGroupPayload,
} from "@sera-types/service-group.type";

const ServiceGroupApi = () => {
  async function retrieveServiceGroups(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.master}/service-groups`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function createServiceGroup(_payload: CreateServiceGroupPayload) {
    return httpService
      .post(`${apiUrl.master}/service-groups`, _payload)
      .then((_resp) => _resp);
  }

  async function detailServiceGroup(_payload: DetailServiceGroupPayload) {
    return httpService
      .get(`${apiUrl.master}/service-groups/${_payload?.id}`)
      .then((_resp) => _resp);
  }

  async function updateServiceGroup({
    id,
    ..._payload
  }: UpdateServiceGroupPayload) {
    return httpService
      .put(`${apiUrl.master}/service-groups/${id}`, _payload)
      .then((_resp) => _resp);
  }

  async function deletelServiceGroup(_id: string) {
    return httpService
      .del(`${apiUrl.master}/service-groups/${_id}`)
      .then((_resp) => _resp);
  }

  async function retrieveServiceGroupsDropdown() {
    return httpService
      .get(`${apiUrl.master}/service-groups/dropdown`)
      .then((_resp) => _resp);
  }

  return {
    retrieveServiceGroups,
    createServiceGroup,
    detailServiceGroup,
    updateServiceGroup,
    deletelServiceGroup,
    retrieveServiceGroupsDropdown,
  };
};

export default ServiceGroupApi;
