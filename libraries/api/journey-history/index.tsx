import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  FilterParams,
  JourneyDetailParams,
} from "@sera-types/journey-history.type";

const JourneyHistoryApi = () => {
  async function getSummary(_payload?: FilterParams) {
    return httpService
      .get(`${apiUrl.order}/journey-histories/summary`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getJourneyList(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/journey-histories`, { params: _payload })
      .then((resp) => resp);
  }

  async function getJourneyDetail({ id }: JourneyDetailParams) {
    return httpService
      .get(`${apiUrl.journey}/journey-histories/${id}`)
      .then((_resp) => _resp);
  }

  return {
    getSummary,
    getJourneyList,
    getJourneyDetail,
  };
};

export default JourneyHistoryApi;
