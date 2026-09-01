import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

const ExportLogApi = () => {
  // Get Export Log
  async function retrieveExportLog(payload: { type: string }) {
    return httpService
      .get(`${apiUrl.export}/export-log`, { params: payload })
      .then((resp) => resp);
  }

  return {
    retrieveExportLog,
  };
};

export default ExportLogApi;
