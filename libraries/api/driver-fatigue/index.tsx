import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  IFatiguePayloadHealthCheck,
  ISummaryPayload,
} from "@sera-types/driver-fatigue.type";

const DriverFatigueApi = () => {
  async function retrieveFatigueList(payload: any) {
    const url = `${apiUrl.driver}/driver-fatigues`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrieveSummary(payload: ISummaryPayload) {
    const url = `${apiUrl.driver}/driver-fatigues/summary`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrieveFatigueFilter() {
    const urlFatigueLevel = `${apiUrl.master}/fatigue-statuses`;
    const urlHealthResult = `${apiUrl.master}/health-results`;
    const urlRecommendation = `${apiUrl.master}/driver-recommendations`;

    return Promise.all([
      httpService.get(urlFatigueLevel, {}),
      httpService.get(urlHealthResult, {}),
      httpService.get(urlRecommendation, {}),
    ]).then((e) => e);
  }

  async function retrieveFatigueDetails({ id }: { id: string }) {
    const url = `${apiUrl.driver}/driver-fatigues/${id}`;
    return httpService.get(url).then((e) => e);
  }

  async function updateFatigueData(
    payload: IFatiguePayloadHealthCheck,
    callback?: () => void,
  ) {
    const url = `${apiUrl.driver}/driver-fatigues/health-check`;
    return httpService.post(url, payload).then((_resp) => {
      if (callback) callback();
      return _resp;
    });
  }

  return {
    retrieveFatigueList,
    retrieveSummary,
    retrieveFatigueFilter,
    retrieveFatigueDetails,
    updateFatigueData,
  };
};

export default DriverFatigueApi;
