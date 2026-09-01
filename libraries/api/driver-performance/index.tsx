import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { ISummaryPayload } from "@sera-types/driver-fatigue.type";

const DriverPerformanceApi = () => {
  const performanceUrl = "driver-performances";
  async function retrievePerformanceList(payload: any) {
    const url = `${apiUrl.driver}/${performanceUrl}`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrieveSummary(payload: ISummaryPayload) {
    const url = `${apiUrl.driver}/${performanceUrl}/summary`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrievePerformanceFilter() {
    const url = `${apiUrl.master}/driver-grades`;

    return httpService.get(url, {}).then((e) => e);
  }

  return {
    retrievePerformanceList,
    retrieveSummary,
    retrievePerformanceFilter,
  };
};

export default DriverPerformanceApi;
