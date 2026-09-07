import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { ActualIncomingListPayload } from "@sera-types/actual-incoming.type";

/**
 * API untuk halaman Actual Incoming (spec 002-actual-incoming-page,
 * ServiceIncoming modul actual-incoming: A-List & A-Delete & A-Detail).
 * Envelope respons backend: { data, pagination? }.
 */
const ActualIncomingApi = () => {
  const base = `${apiUrl.incoming}/actual-incoming`;

  /** A-List GET / */
  function retrieveList(payload: ActualIncomingListPayload) {
    return httpService.get(`${base}`, { params: payload }).then((resp) => resp);
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

  /** A-Delete DELETE /:id — satu id per request (alasan di body) */
  function deleteActual(id: string, description: string) {
    return httpService
      .del(`${base}/${id}`, { data: { description } })
      .then((resp: any) => resp?.data?.data ?? resp?.data) as Promise<{
      deleted: number;
      reason?: string;
    }>;
  }

  return { retrieveList, retrieveListTyped, deleteActual };
};

export default ActualIncomingApi;
