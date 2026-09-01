import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  CreateNewLocationPayload,
  DropdownLocationPayload,
  UpdateLocationPayload,
} from "@sera-types/location.type";
import _ from "lodash";

/**
 * Handles API call related to role.
 * @class
 */
const LocationApi = () => {
  // Get Locations
  async function retrieveLocations(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/locations`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveCustomerLocations(payload: {
    page?: number;
    limit?: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.master}/locations/customer-locations`, { params: payload })
      .then((resp) => resp);
  }

  // Get Role Detail
  async function retrieveLocationDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/locations/${payload.id}`)
      .then((resp) => resp);
  }

  // Create Role
  async function createLocation(payload: CreateNewLocationPayload) {
    return httpService
      .post(`${apiUrl.master}/locations`, payload)
      .then((resp) => resp);
  }

  // Update Role
  async function updateLocation(payload: UpdateLocationPayload) {
    const data = _.omit(payload, "id");
    return httpService
      .put(`${apiUrl.master}/locations/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteLocation(id: string) {
    return httpService
      .del(`${apiUrl.master}/locations/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownLocations(payload: DropdownLocationPayload) {
    return httpService
      .get(`${apiUrl.master}/locations/dropdown`, { params: payload })
      .then((resp) => resp);
  }

  return {
    retrieveLocations,
    retrieveCustomerLocations,
    retrieveLocationDetail,
    createLocation,
    updateLocation,
    deleteLocation,
    retrieveDropdownLocations,
  };
};

export default LocationApi;
