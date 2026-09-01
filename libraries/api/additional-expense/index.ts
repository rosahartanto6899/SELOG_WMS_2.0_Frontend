import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import {
  AdditionalExpenseDetailPayload,
  AdditionalExpenseSummaryPayload,
  UpdateApprovalAdditionalExpensePayload,
} from "@sera-types/additional-expense.type";
import { BaseType } from "@sera-types/base.type";
import { omit } from "lodash";

const AdditionalExpenseApi = () => {
  async function retrieveAdditionalExpense(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/outstanding-approvals`, {
        params: {
          ...payload,
          category: "Additional Request",
        },
      })
      .then((resp) => resp);
  }

  async function getAdditionalExpenseSummary(
    payload: AdditionalExpenseSummaryPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/outstanding-approvals/summary`, {
        params: {
          ...payload,
          category: "Additional Request",
        },
      })
      .then((resp) => resp);
  }

  async function getAdditionalExpenseDetail(
    payload: AdditionalExpenseDetailPayload,
  ) {
    return httpService
      .get(
        `${apiUrl.billing}/shipment-expenses/${payload.id}/additional-expense`,
      )
      .then((resp) => resp);
  }

  async function getExpenseDetail(payload: AdditionalExpenseDetailPayload) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/${payload.id}`)
      .then((resp) => resp);
  }

  async function getAuditTrail(payload: AdditionalExpenseDetailPayload) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/${payload.id}/activity-history`)
      .then((resp) => resp);
  }

  async function updateApprovalAdditionalExpense(
    payload: UpdateApprovalAdditionalExpensePayload,
  ) {
    const isApprove = payload.type === "approve";
    const _payload = omit(payload, ["referenceId", "type", "callback"]);

    return httpService
      .patch(
        `${apiUrl.order}/shipment-approval-request/reference/${payload.referenceId}/${payload.type}`,
        isApprove ? undefined : _payload,
      )
      .then((resp) => resp);
  }
  return {
    retrieveAdditionalExpense,
    getAdditionalExpenseSummary,
    getAdditionalExpenseDetail,
    getExpenseDetail,
    getAuditTrail,
    updateApprovalAdditionalExpense,
  };
};

export default AdditionalExpenseApi;
