import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  ApprovalBookingOrderDetailPayload,
  ApprovalBookingOrderSummaryPayload,
  UpdateApprovalBookingOrderPayload,
} from "@sera-types/approval-booking-order.type";
import { BaseType } from "@sera-types/base.type";
import { omit } from "lodash";

const ApprovalBookingOrderApi = () => {
  async function retrieveApprovalBookingOrder(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/order-confirmations`, { params: payload })
      .then((resp) => resp);
  }

  async function getApprovalBookingOrderSummary(
    payload: ApprovalBookingOrderSummaryPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/order-confirmations/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getApprovalBookingOrderById(
    payload: ApprovalBookingOrderDetailPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/order-confirmations/${payload.id}`)
      .then((resp) => resp);
  }

  async function updateApprovalBookingOrder(
    payload: UpdateApprovalBookingOrderPayload,
  ) {
    const _payload = omit(payload, ["id"]);
    return httpService
      .put(`${apiUrl.order}/order-confirmations/${payload.id}`, _payload)
      .then((resp) => resp);
  }

  async function getConfirmationStatus() {
    return httpService
      .get(`${apiUrl.master}/booking-order-confirmation-statuses`)
      .then((resp) => resp);
  }

  return {
    retrieveApprovalBookingOrder,
    getApprovalBookingOrderSummary,
    getApprovalBookingOrderById,
    updateApprovalBookingOrder,
    getConfirmationStatus,
  };
};

export default ApprovalBookingOrderApi;
