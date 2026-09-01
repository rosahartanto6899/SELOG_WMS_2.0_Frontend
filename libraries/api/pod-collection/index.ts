import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  ApprovalPodPayload,
  PodDeliveryPayload,
  PodHardcopyPayload,
  PodLoadingPayload,
  PodTimestampPayload,
  PodUnloadingPayload,
  UnitParams,
} from "@sera-types/pod-collection.type";
import dayjs from "dayjs";

const podCollectionApi = () => {
  const baseUrlPath = "pod";
  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.billing}/${baseUrlPath}/summary`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getList(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.billing}/${baseUrlPath}/shipments`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getDetails({ id }: { id: string }) {
    const url = `${apiUrl.billing}/${baseUrlPath}/${id}`;
    return httpService.get(url).then((e) => e);
  }

  async function podLoading(
    { ..._payload }: PodLoadingPayload,
    callback?: () => void,
  ) {
    const formData = new FormData();

    formData.append("shipmentNumber", _payload.shipmentNumber);
    formData.append("picName", _payload.picName);

    _payload?.files?.forEach((file) => {
      formData.append("files", file);
    });

    return httpService
      .post(`${apiUrl.billing}/${baseUrlPath}/loading`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function podUnloading(
    { ..._payload }: PodUnloadingPayload,
    callback?: () => void,
  ) {
    const formData = new FormData();

    formData.append("shipmentNumber", _payload.shipmentNumber);
    formData.append("picName", _payload.picName);
    formData.append("isClaim", Boolean(_payload.isClaim) ? "true" : "false");

    _payload?.files?.forEach((file) => {
      formData.append("files", file);
    });

    return httpService
      .post(`${apiUrl.billing}/${baseUrlPath}/unloading`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function podDelivery(
    { ..._payload }: PodDeliveryPayload,
    callback?: () => void,
  ) {
    const formData = new FormData();

    formData.append("shipmentNumber", _payload.shipmentNumber);
    formData.append("receiptNumber", _payload.receiptNumber);
    formData.append(
      "receiptDate",
      dayjs(_payload.receiptDate).format("YYYY-MM-DD"),
    );
    formData.append("courier", _payload.courier);
    formData.append("amountOfReceipt", _payload.amount.toString());

    _payload?.files?.forEach((file) => {
      formData.append("files", file);
    });

    return httpService
      .post(`${apiUrl.billing}/${baseUrlPath}/delivery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function podTimestamp(
    { ..._payload }: PodTimestampPayload,
    callback?: () => void,
  ) {
    const formData = new FormData();

    formData.append("shipmentNumber", _payload.shipmentNumber);

    _payload?.files?.forEach((file) => {
      formData.append("files", file);
    });

    return httpService
      .post(`${apiUrl.billing}/${baseUrlPath}/timestamp`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function podHardcopy(
    payload: PodHardcopyPayload,
    callback?: () => void,
  ) {
    // const formData = new FormData();

    // formData.append("shipmentNumber", _payload.shipmentNumber);
    // formData.append("submittedDate", _payload.submittedDate);

    return httpService
      .post(
        `${apiUrl.billing}/${baseUrlPath}/hardcopy`,
        { ...payload },
        // formData,
        //   , {
        //   headers: { "Content-Type": "multipart/form-data" },
        // }
      )
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function podApproval(
    { id, ..._payload }: ApprovalPodPayload,
    callback?: () => void,
  ) {
    return httpService
      .put(`${apiUrl.billing}/${baseUrlPath}/${id}`, {
        ..._payload,
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  return {
    getSummary,
    getList,
    getDetails,
    podLoading,
    podUnloading,
    podDelivery,
    podApproval,
    podTimestamp,
    podHardcopy,
  };
};

export default podCollectionApi;
