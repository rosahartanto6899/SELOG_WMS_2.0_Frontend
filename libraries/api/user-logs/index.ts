import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

/**
 * Handles API call related to user log.
 * @class
 */
const UserLogApi = () => {
  // Get User Logs
  async function retrieveUserLogs(payload: {
    page: number;
    limit: number;
    search?: string | null;
    searchBy?: string | null;
    order?: string | null;
    sort?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/user-activity`, { params: payload })
      .then((resp) => resp);
  }

  // Get User Log Detail
  async function retrieveUserLogDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/user-activity/${payload.id}`)
      .then((resp) => resp);
  }

  // Export User Logs
  async function exportUserLogs(payload: {
    search?: string | null;
    searchBy?: string | null;
  }) {
    return httpService
      .get(`${apiUrl.user}/user-activity/export`, {
        params: payload,
      })
      .then((resp) => resp);
  }

  return {
    retrieveUserLogs,
    retrieveUserLogDetail,
    exportUserLogs,
  };
};

export default UserLogApi;
