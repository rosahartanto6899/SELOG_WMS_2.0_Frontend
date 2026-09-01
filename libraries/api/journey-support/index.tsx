import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  JourneySupportDetailPayload,
  JourneySupportSummaryPayload,
  UpdateJourneyActivitySkywardPayload,
  UpdateJourneySupportActivtyPayload,
} from "@sera-types/journey-support.type";
import _ from "lodash";

const JourneySupportApi = () => {
  async function retrieveJourneySupport(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/journey-supports`, { params: payload })
      .then((resp) => resp);
  }

  async function getSummaryJourneySupport(
    payload: JourneySupportSummaryPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/journey-supports/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getDetailJourneySupport(payload: JourneySupportDetailPayload) {
    return httpService
      .get(`${apiUrl.journey}/journey-supports/${payload.id}`)
      .then((resp) => resp);
  }

  async function updateActivity(payload: UpdateJourneySupportActivtyPayload) {
    const _payload = _.omit(payload, ["id", "callback"]);
    return httpService
      .put(`${apiUrl.journey}/journey-supports/${payload.id}`, _payload)
      .then((resp) => resp);
  }

  async function updateActivitySkyward(
    payload: UpdateJourneyActivitySkywardPayload,
  ) {
    return httpService
      .put(`${apiUrl.journey}/journey-supports/${payload.id}/retry`)
      .then((resp) => resp);
  }

  return {
    retrieveJourneySupport,
    getSummaryJourneySupport,
    getDetailJourneySupport,
    updateActivity,
    updateActivitySkyward,
  };
};

export default JourneySupportApi;
