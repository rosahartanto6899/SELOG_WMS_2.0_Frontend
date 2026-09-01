import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { GetProvinceDropdownPayload } from "@sera-types/provinces.type";
/**
 * Handles API call related to role.
 * @class
 */
const ProvinceApi = () => {
  async function retrieveDropdownProvinces(params: GetProvinceDropdownPayload) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");

    return httpService
      .get(
        `${apiUrl.master}/provinces/dropdown${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  return {
    retrieveDropdownProvinces,
  };
};

export default ProvinceApi;
