import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  ISummaryPayload,
  IUpdateNotePayload,
} from "@sera-types/driver-stock.type";

const DriverStockApi = () => {
  const baseUrl = "drivers";
  async function retrieveList(payload: any) {
    const url = `${apiUrl.driver}/${baseUrl}`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrieveSummary(payload: ISummaryPayload) {
    const url = `${apiUrl.driver}/${baseUrl}/summary`;
    return httpService.get(url, { params: payload }).then((resp) => resp);
  }

  async function retrieveById({ id }: { id: string }) {
    const url = `${apiUrl.driver}/${baseUrl}/${id}`;
    return httpService.get(url, {}).then((resp) => resp);
  }

  async function retrieveFilters() {
    //TODO license status is missing
    const urlDriverStatus = `${apiUrl.master}/driver-capacity-statuses`;
    const urlEmployeeStatus = `${apiUrl.master}/employee-statuses`;
    const urlContractStatus = `${apiUrl.master}/contract-statuses`;
    const urlFatigueStatus = `${apiUrl.master}/fatigue-statuses`;

    return Promise.all([
      httpService.get(urlDriverStatus, {}),
      httpService.get(urlEmployeeStatus, {}),
      httpService.get(urlContractStatus, {}),
      httpService.get(urlFatigueStatus, {}),
    ]).then((e) => e);
  }

  async function updateNoteById(
    { id, note }: IUpdateNotePayload,
    callback?: () => void,
  ) {
    const url = `${apiUrl.driver}/${baseUrl}/${id}`;
    return httpService.put(url, { note }).then((resp) => {
      if (callback) callback();
      return resp;
    });
  }

  return {
    retrieveList,
    retrieveSummary,
    retrieveById,
    retrieveFilters,
    updateNoteById,
  };
};

export default DriverStockApi;
