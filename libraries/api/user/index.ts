import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  CreateNewUserPayload,
  UpdateActiveVendorPayload,
  UpdateUserPayload,
} from "@sera-types/user.type";
import _ from "lodash";

const UserApi = () => {
  async function retrieveUsers(payload: {
    page: number;
    limit: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/users`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveUserDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/users/${payload.id}`)
      .then((resp) => resp);
  }

  async function retrieveUserGrade() {
    return httpService
      .get(`${apiUrl.user}/user-grade/dropdown`)
      .then((resp) => resp);
  }

  async function createUser(payload: CreateNewUserPayload) {
    return httpService
      .post(`${apiUrl.user}/users`, payload)
      .then((resp) => resp);
  }

  async function updateUser(payload: {
    id: string;
    items?: UpdateUserPayload;
  }) {
    return httpService
      .put(`${apiUrl.user}/users/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteUser(id: string) {
    return httpService.del(`${apiUrl.user}/users/${id}`).then((resp) => resp);
  }

  async function updateActiveVendor(payload: UpdateActiveVendorPayload) {
    const data = _.omit(payload, ["id", "name"]);
    return httpService
      .patch(`${apiUrl.user}/users/${payload.id}`, data)
      .then((resp) => resp);
  }

  return {
    retrieveUsers,
    retrieveUserDetail,
    retrieveUserGrade,
    createUser,
    updateUser,
    deleteUser,
    updateActiveVendor,
  };
};

export default UserApi;
