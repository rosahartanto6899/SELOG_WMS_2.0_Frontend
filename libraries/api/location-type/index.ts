import apiUrl from "@sera-libraries/common/api-url";
import { decryptData } from "@sera-utils/encryptor";
import axios from "axios";

const baseURL: string = decryptData(process.env.API_BASE_URL);
const xApiKey: string = decryptData(process.env.X_API_KEY);

/**
 * Handles API call related to role.
 * @class
 */
const LocationTypeApi = () => {
  async function retrieveDropdownLocationTypes() {
    return axios
      .get(`${baseURL}${apiUrl.master}/location-types`, {
        headers: {
          "x-api-key": xApiKey,
        },
      })
      .then((resp) => resp);
  }

  return {
    retrieveDropdownLocationTypes,
  };
};

export default LocationTypeApi;
