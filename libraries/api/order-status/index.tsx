import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  OrderStatusCancelPayload,
  OrderStatusDetailPayload,
  OrderStatusReroutePayload,
  OrderStatusReschedulePayload,
  OrderStatusSummaryPayload,
} from "@sera-types/order-status.type";

const OrderStatusApi = () => {
  async function retrieveOrderStatus(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/order-statuses`, { params: payload })
      .then((resp) => resp);
  }

  async function getSummaryOrderStatus(payload: OrderStatusSummaryPayload) {
    return httpService
      .get(`${apiUrl.order}/order-statuses/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getOrderStatusDetail(payload: OrderStatusDetailPayload) {
    return httpService
      .get(`${apiUrl.order}/order-statuses/${payload.id}`)
      .then((resp) => resp);
  }

  async function rerouteOrderStatus(payload: OrderStatusReroutePayload) {
    return httpService
      .post(`${apiUrl.order}/order-statuses/reroute`, payload)
      .then((resp) => resp);
  }

  async function cancelOrderStatus(payload: OrderStatusCancelPayload) {
    return httpService
      .post(`${apiUrl.order}/order-statuses/cancel`, payload)
      .then((resp) => resp);
  }

  async function rescheduleOrderStatus(payload: OrderStatusReschedulePayload) {
    return httpService
      .post(`${apiUrl.order}/order-statuses/reschedule`, payload)
      .then((resp) => resp);
  }

  return {
    retrieveOrderStatus,
    getSummaryOrderStatus,
    getOrderStatusDetail,
    rerouteOrderStatus,
    cancelOrderStatus,
    rescheduleOrderStatus,
  };
};

export default OrderStatusApi;
