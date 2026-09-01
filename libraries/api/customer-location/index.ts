import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  CreateNewCustomerLocationPayload,
  DropdownCustomerLocationPayload,
  UpdateCustomerLocationPayload,
} from "@sera-types/customer-location.type";
import _ from "lodash";

/**
 * Handles API call related to role.
 * @class
 */

const CustomerLocationApi = () => {
  async function retrieveCustomerLocations(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
    customerId?: string;
  }) {
    return httpService
      .get(`${apiUrl.master}/locations/customer-locations`, { params: payload })
      .then((resp) => resp);
  }

  // Get Role Detail
  async function retrieveCustomerLocationDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/locations/customer-locations/${payload.id}`)
      .then((resp) => resp);
  }

  // Create Role
  async function createCustomerLocation(
    payload: CreateNewCustomerLocationPayload,
  ) {
    return httpService
      .post(`${apiUrl.master}/locations/customer-locations`, payload)
      .then((resp) => resp);
  }

  // Update Role
  async function updateCustomerLocation(
    payload: UpdateCustomerLocationPayload,
  ) {
    const data = _.omit(payload, "id");
    return httpService
      .put(`${apiUrl.master}/locations/customer-locations/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteCustomerLocation(id: string) {
    return httpService
      .del(`${apiUrl.master}/locations/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownCustomerLocations(
    payload: DropdownCustomerLocationPayload,
  ) {
    return httpService
      .get(`${apiUrl.master}/locations/customer-locations/dropdown`, {
        params: payload,
      })
      .then((resp) => resp);
  }

  return {
    retrieveCustomerLocations,
    retrieveCustomerLocationDetail,
    createCustomerLocation,
    updateCustomerLocation,
    deleteCustomerLocation,
    retrieveDropdownCustomerLocations,
  };
};

export default CustomerLocationApi;
