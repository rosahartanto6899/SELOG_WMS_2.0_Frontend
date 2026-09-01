import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { GetDistrictDropdownPayload } from "@sera-types/districts.type";
/**
 * Handles API call related to role.
 * @class
 */
const DistrictApi = () => {
  async function retrieveDropdownDistricts(params: GetDistrictDropdownPayload) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");

    return httpService
      .get(
        `${apiUrl.master}/districts/dropdown${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  return {
    retrieveDropdownDistricts,
  };
};

export default DistrictApi;
