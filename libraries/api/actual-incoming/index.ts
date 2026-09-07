import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  ActualIncomingDeleteItem,
  ActualIncomingDeleteResponse,
  ActualIncomingListPayload,
} from "@sera-types/actual-incoming.type";

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

  /** A-Detail GET /:id — record GR aktif (PIC, grBy/grDate, lokasi binning) */
  function retrieveActual(id: string) {
    return httpService
      .get(`${base}/${id}`)
      .then((resp: any) => resp?.data?.data ?? resp?.data);
  }

  /** A-Delete POST /delete — bulk + alasan (audit) */
  function deleteActual(items: ActualIncomingDeleteItem[]) {
    return httpService
      .post(`${base}/delete`, { items })
      .then(
        (resp: any) => resp?.data?.data ?? resp?.data,
      ) as Promise<ActualIncomingDeleteResponse>;
  }

  return { retrieveList, retrieveListTyped, retrieveActual, deleteActual };
};

export default ActualIncomingApi;
