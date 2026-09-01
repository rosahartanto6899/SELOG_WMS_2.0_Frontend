import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  CreateNewRoleMenuPayload,
  RoleMenuPayload,
} from "@sera-types/role-menu.type";

/**
 * Handles API call related to role menu / permission.
 * @class
 */
const RoleMenuApi = () => {
  // Get RoleMenus
  async function retrieveRoleMenus(payload: {
    page: number;
    limit: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/users-access/role-menu`, { params: payload })
      .then((resp) => resp);
  }

  // Get RoleMenu Detail
  async function retrieveRoleMenuDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/users-access/${payload.id}`)
      .then((resp) => resp);
  }

  // Create RoleMenu
  async function createRoleMenu(payload: CreateNewRoleMenuPayload) {
    return httpService
      .post(`${apiUrl.user}/users-access`, payload)
      .then((resp) => resp);
  }

  // Update RoleMenu
  async function updateRoleMenu(payload: {
    id: string;
    items?: RoleMenuPayload;
  }) {
    return httpService
      .put(`${apiUrl.user}/users-access/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteRoleMenu(id: string) {
    return httpService
      .del(`${apiUrl.user}/users-access/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownRoleMenus() {
    return httpService.get(`${apiUrl.user}/users-access`).then((resp) => resp);
  }

  return {
    retrieveRoleMenus,
    retrieveRoleMenuDetail,
    createRoleMenu,
    updateRoleMenu,
    deleteRoleMenu,
    retrieveDropdownRoleMenus,
  };
};

export default RoleMenuApi;
