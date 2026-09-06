import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  ActualIncomingDeleteItem,
  ActualIncomingDeleteResponse,
  ActualIncomingListPayload,
} from "@sera-types/actual-incoming.type";

/**
 * API untuk halaman Actual Incoming (spec 002-actual-incoming-page,
 * ServiceIncoming A-List & A-Delete). Envelope respons backend: { data, pagination? }.
 */
const ActualIncomingApi = () => {
  const base = `${apiUrl.incoming}/outstanding-incoming`;

  /** A-List GET /actual */
  function retrieveList(payload: ActualIncomingListPayload) {
    return httpService
      .get(`${base}/actual`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveListTyped(
    payload: ActualIncomingListPayload,
  ): Promise<{ data: any[]; pagination: any; recordsTotal?: number }> {
    const resp: any = await retrieveList(payload);
    return {
      data: resp?.data?.data ?? [],
      pagination: resp?.data?.pagination,
      recordsTotal:
        resp?.data?.pagination?.recordsTotal ??
        resp?.data?.pagination?.totalData ??
        0,
    };
  }

  /** A-Delete POST /actual/delete — bulk + alasan (audit) */
  function deleteActual(items: ActualIncomingDeleteItem[]) {
    return httpService
      .post(`${base}/actual/delete`, { items })
      .then(
        (resp: any) => resp?.data?.data ?? resp?.data,
      ) as Promise<ActualIncomingDeleteResponse>;
  }

  return { retrieveList, retrieveListTyped, deleteActual };
};

export default ActualIncomingApi;
