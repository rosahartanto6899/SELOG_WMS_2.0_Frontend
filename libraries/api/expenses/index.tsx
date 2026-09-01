import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  ExpensesPayload,
  ExpensesTemplatePayload,
  SummaryExpensesPayload,
} from "@sera-types/expenses.type";

const ExpensesApi = () => {
  async function retrieveExpenses(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/expenses`, { params: payload })
      .then((resp) => resp);
  }

  async function getSummaryExpenses(payload: SummaryExpensesPayload) {
    return httpService
      .get(`${apiUrl.order}/expenses/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getExpensesDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.order}/expenses/${payload.id}`)
      .then((resp) => resp);
  }

  async function updateExpenses(payload: {
    id: string;
    data: ExpensesPayload;
  }) {
    return httpService
      .put(`${apiUrl.order}/expenses/${payload.id}`, payload.data)
      .then((resp) => resp);
  }

  async function createExpenses(payload: ExpensesPayload) {
    return httpService
      .post(`${apiUrl.order}/expenses`, payload)
      .then((resp) => resp);
  }

  async function downloadExpensesTemplate(payload: ExpensesTemplatePayload) {
    return httpService
      .post(`${apiUrl.order}/expenses/template`, payload, {
        responseType: "blob",
      })
      .then((resp) => resp);
  }

  return {
    retrieveExpenses,
    getSummaryExpenses,
    getExpensesDetail,
    updateExpenses,
    createExpenses,
    downloadExpensesTemplate,
  };
};

export default ExpensesApi;
