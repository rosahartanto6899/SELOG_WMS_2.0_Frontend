import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { GetCityDropdownPayload } from "@sera-types/cities.type";
/**
 * Handles API call related to role.
 * @class
 */
const CityApi = () => {
  async function retrieveDropdownCities(params: GetCityDropdownPayload) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");

    return httpService
      .get(`${apiUrl.master}/cities/dropdown${keys.length ? "?" + PARAMS : ""}`)
      .then((resp) => resp);
  }

  return {
    retrieveDropdownCities,
  };
};

export default CityApi;
