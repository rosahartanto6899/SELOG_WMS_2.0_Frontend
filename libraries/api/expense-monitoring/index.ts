import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  AdditionalExpensesPayload,
  AuditTrailPayload,
  CreateAdditionalExpensesPayload,
  DetailExpensesPayload,
  FilterParams,
  UpdateDetailExpensePayload,
  UpdateTermin1DatePayload,
} from "@sera-types/expense-monitoring";

const ExpenseAPI = () => {
  async function getSummary(_payload?: FilterParams) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/totals`, { params: _payload })
      .then((_resp) => _resp);
  }

  async function getSummaryExpenses(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/summary`, { params: _payload })
      .then((resp) => resp);
  }

  async function getShipmentExpenses(_payload: BaseType) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses`, { params: _payload })
      .then((resp) => resp);
  }

  async function updateTermin1Date({
    id,
    ..._payload
  }: UpdateTermin1DatePayload) {
    return httpService
      .put(`${apiUrl.billing}/shipment-expenses/${id}/termin1-transfer`, {
        ..._payload,
      })
      .then((resp) => resp);
  }

  async function updateDetailExpense({
    id,
    ..._payload
  }: UpdateDetailExpensePayload) {
    return httpService
      .put(`${apiUrl.billing}/shipment-expenses/${id}`, { ..._payload })
      .then((resp) => resp);
  }

  async function getAddExpenses({
    id,
    ..._payload
  }: AdditionalExpensesPayload) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/${id}/additional`, {
        params: _payload,
      })
      .then((resp) => resp);
  }

  async function getDetailExpenses({ id, ..._payload }: DetailExpensesPayload) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/${id}`, { params: _payload })
      .then((resp) => resp);
  }

  async function getAuditTrail({ id, ..._payload }: AuditTrailPayload) {
    return httpService
      .get(`${apiUrl.billing}/shipment-expenses/${id}/activity-history`, {
        params: _payload,
      })
      .then((resp) => resp);
  }

  async function createAddExpenses(_payload: CreateAdditionalExpensesPayload) {
    return httpService
      .post(`${apiUrl.billing}/shipment-expenses/additional`, { ..._payload })
      .then((resp) => resp);
  }

  return {
    getSummary,
    getSummaryExpenses,
    getShipmentExpenses,
    updateTermin1Date,
    getDetailExpenses,
    updateDetailExpense,
    getAuditTrail,
    getAddExpenses,
    createAddExpenses,
  };
};

export default ExpenseAPI;
