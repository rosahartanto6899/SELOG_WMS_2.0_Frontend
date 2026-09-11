import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  ActualOutgoingAddInfoRow,
  ActualOutgoingDetailRow,
  ActualOutgoingHistoryRow,
  ActualOutgoingListPayload,
} from "@sera-types/actual-outgoing.type";

/**
 * API halaman Actual Outgoing (spec 005, ServiceOutgoing modul
 * actual-outgoing — read-only Q1–Q5).
 */
const ActualOutgoingApi = () => {
  const base = `${apiUrl.outgoing}/actual-outgoing`;

  /** Q1 GET / */
  function retrieveList(payload: ActualOutgoingListPayload) {
    return httpService.get(`${base}`, { params: payload }).then((resp) => resp);
  }

  async function retrieveListTyped(
    payload: ActualOutgoingListPayload,
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

  /** Q2 GET /:id/details (search material: search + searchBy whitelist DTO) */
  async function retrieveDetail(
    id: string,
    search?: { search?: string; searchBy?: string },
  ): Promise<{
    data: { [k: string]: any; details: ActualOutgoingDetailRow[] } | null;
  }> {
    const resp: any = await httpService.get(`${base}/${id}/details`, {
      params: search,
    });
    return { data: resp?.data?.data ?? null };
  }

  /** Q3 GET /:id/history */
  async function retrieveHistory(
    id: string,
  ): Promise<ActualOutgoingHistoryRow[]> {
    const resp: any = await httpService.get(`${base}/${id}/history`);
    return resp?.data?.data ?? [];
  }

  /** Q4 GET /:id/add-info */
  async function retrieveAddInfoHeader(
    id: string,
  ): Promise<ActualOutgoingAddInfoRow[]> {
    const resp: any = await httpService.get(`${base}/${id}/add-info`);
    return resp?.data?.data ?? [];
  }

  /** Q5 GET /detail/:detailId/add-info */
  async function retrieveAddInfoDetail(
    detailId: string,
  ): Promise<ActualOutgoingAddInfoRow[]> {
    const resp: any = await httpService.get(
      `${base}/detail/${detailId}/add-info`,
    );
    return resp?.data?.data ?? [];
  }

  return {
    retrieveList,
    retrieveListTyped,
    retrieveDetail,
    retrieveHistory,
    retrieveAddInfoHeader,
    retrieveAddInfoDetail,
  };
};

export default ActualOutgoingApi;
