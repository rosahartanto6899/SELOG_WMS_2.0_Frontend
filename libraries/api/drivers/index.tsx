import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

const DriversApi = () => {
  async function retrieveDrivers(payload: any) {
    return httpService
      .get(`${apiUrl.driver}/drivers`, { params: payload })
      .then((resp) => resp);
  }

  async function detailDriver(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.driver}/drivers/${payload.id}`)
      .then((resp) => resp);
  }

  return {
    retrieveDrivers,
    detailDriver,
  };
};

export default DriversApi;
