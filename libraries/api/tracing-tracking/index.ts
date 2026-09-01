import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import { DetailParams, UnitParams } from "@sera-types/tracking-tracking.type";

const TracingTracking = () => {
  const baseUrl = "tracing-tracking";
  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.order}/${baseUrl}/overview`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getList(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.order}/${baseUrl}`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getDetails({ id, ..._payload }: DetailParams) {
    return httpService
      .get(`${apiUrl.order}/${baseUrl}/${id}`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  return {
    getSummary,
    getList,
    getDetails,
  };
};

export default TracingTracking;
