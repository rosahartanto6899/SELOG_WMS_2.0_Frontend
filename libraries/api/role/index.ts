import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * Handles API call related to role.
 * @class
 */
const RoleApi = () => {
  // Get Roles
  async function retrieveRoles(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/roles`, { params: payload })
      .then((resp) => resp);
  }

  // Get Role Detail
  async function retrieveRoleDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/roles/${payload.id}`)
      .then((resp) => resp);
  }

  // Create Role
  async function createRole(payload: { roleName?: string }) {
    return httpService
      .post(`${apiUrl.user}/roles`, payload)
      .then((resp) => resp);
  }

  // Update Role
  async function updateRole(payload: {
    id: string;
    items?: { roleName?: string };
  }) {
    return httpService
      .put(`${apiUrl.user}/roles/${payload.id}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteRole(id: string) {
    return httpService.del(`${apiUrl.user}/roles/${id}`).then((resp) => resp);
  }

  async function retrieveDropdownRoles() {
    return httpService
      .get(`${apiUrl.user}/roles/dropdown`)
      .then((resp) => resp);
  }

  return {
    retrieveRoles,
    retrieveRoleDetail,
    createRole,
    updateRole,
    deleteRole,
    retrieveDropdownRoles,
  };
};

export default RoleApi;
