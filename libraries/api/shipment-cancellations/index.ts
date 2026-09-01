import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  ShipmentCancellationsDetailPayload,
  ShipmentCancellationsSummaryPayload,
  UpdateApprovalCancelPayload,
  UpdateApprovalReroutePayload,
  UpdateApprovalReschedulePayload,
} from "@sera-types/shipment-cancellations.type";
import { omit } from "lodash";

const ShipmentCancellationsApi = () => {
  async function getShipmentCancellationsList(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/outstanding-approvals`, {
        params: {
          ...payload,
          category: "Shipment Cancellation",
        },
      })
      .then((resp) => resp);
  }

  async function getShipmentCancellationsSummary(
    payload: ShipmentCancellationsSummaryPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/outstanding-approvals/summary`, {
        params: {
          ...payload,
          category: "Shipment Cancellation",
        },
      })
      .then((resp) => resp);
  }

  async function getShipmentCancellationsDetail(
    payload: ShipmentCancellationsDetailPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/outstanding-approvals/${payload.id}`)
      .then((resp) => resp);
  }

  async function updateApprovalRerouteShipment(
    payload: UpdateApprovalReroutePayload,
  ) {
    const _payload = omit(payload, ["id"]);
    return httpService
      .post(
        `${apiUrl.order}/outstanding-approvals/${payload.id}/reroute`,
        _payload,
      )
      .then((resp) => resp);
  }

  async function updateApprovalCancelShipment(
    payload: UpdateApprovalCancelPayload,
  ) {
    const _payload = omit(payload, ["id"]);
    return httpService
      .post(
        `${apiUrl.order}/outstanding-approvals/${payload.id}/cancel`,
        _payload,
      )
      .then((resp) => resp);
  }

  async function updateApprovalRescheduleShipment(
    payload: UpdateApprovalReschedulePayload,
  ) {
    const _payload = omit(payload, ["id"]);
    return httpService
      .post(
        `${apiUrl.order}/outstanding-approvals/${payload.id}/reschedule`,
        _payload,
      )
      .then((resp) => resp);
  }

  async function getApprovalHistory(
    payload: ShipmentCancellationsDetailPayload,
  ) {
    return httpService.get(
      `${apiUrl.order}/outstanding-approvals/${payload.id}/history`,
    );
  }

  return {
    getShipmentCancellationsList,
    getShipmentCancellationsSummary,
    getShipmentCancellationsDetail,
    updateApprovalCancelShipment,
    updateApprovalRerouteShipment,
    updateApprovalRescheduleShipment,
    getApprovalHistory,
  };
};

export default ShipmentCancellationsApi;
