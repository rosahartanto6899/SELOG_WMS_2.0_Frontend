import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  BookingOrderDetailPayload,
  BookingOrderSummaryPayload,
  CreateBookingOrderPayload,
  ShipmentStatusDriverPayload,
  ShipmentStatusVehiclePayload,
  UpdateBookingOrderPayload,
  UpdateStatusBookingOrderPayload,
} from "@sera-types/booking-order.type";
import _ from "lodash";

const BookingOrderApi = () => {
  async function retrieveBookingOrder(payload: BaseType) {
    return httpService
      .get(`${apiUrl.order}/booking-orders`, { params: payload })
      .then((resp) => resp);
  }

  async function getBookingOrderSummary(payload: BookingOrderSummaryPayload) {
    return httpService
      .get(`${apiUrl.order}/booking-orders/summary`, { params: payload })
      .then((resp) => resp);
  }

  async function getBookingOrderById(payload: BookingOrderDetailPayload) {
    return httpService
      .get(`${apiUrl.order}/booking-orders/${payload.id}`)
      .then((resp) => resp);
  }

  async function getBookingOrderDropBaseById(
    payload: BookingOrderDetailPayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/booking-orders/drop-base/${payload.id}`)
      .then((resp) => resp);
  }

  async function createBookingOrder(payload: CreateBookingOrderPayload) {
    const _payload = _.omit(payload, "isDropBase");
    return httpService
      .post(`${apiUrl.order}/booking-orders`, _payload)
      .then((resp) => resp);
  }

  async function createBookingOrderDropBase(
    payload: CreateBookingOrderPayload,
  ) {
    const _payload = _.omit(payload, "isDropBase");
    return httpService
      .post(`${apiUrl.order}/booking-orders/drop-base`, _payload)
      .then((resp) => resp);
  }

  async function updateBookingOrder(payload: UpdateBookingOrderPayload) {
    const _payload = _.omit(payload, ["id", "isDropBase"]);
    return httpService
      .put(`${apiUrl.order}/booking-orders/${payload.id}`, _payload)
      .then((resp) => resp);
  }

  async function updateBookingOrderDropBase(
    payload: UpdateBookingOrderPayload,
  ) {
    const _payload = _.omit(payload, ["id", "isDropBase"]);
    return httpService
      .put(`${apiUrl.order}/booking-orders/drop-base/${payload.id}`, _payload)
      .then((resp) => resp);
  }

  async function updateStatusBookingOrder(
    payload: UpdateStatusBookingOrderPayload,
  ) {
    const _payload = _.omit(payload, "id");
    return httpService
      .patch(`${apiUrl.order}/booking-orders/${payload.id}/status`, _payload)
      .then((resp) => resp);
  }

  async function getDropdownAdditionalRequest() {
    return httpService
      .get(`${apiUrl.order}/customers/additional-req-items`)
      .then((resp) => resp);
  }

  async function getShipmentStatusVehicle(
    payload: ShipmentStatusVehiclePayload,
  ) {
    return httpService
      .get(`${apiUrl.order}/booking-orders/unit-status`, { params: payload })
      .then((resp) => resp);
  }

  async function getShipmentStatusDriver(payload: ShipmentStatusDriverPayload) {
    return httpService
      .get(`${apiUrl.order}/booking-orders/driver-status`, { params: payload })
      .then((resp) => resp);
  }

  return {
    retrieveBookingOrder,
    getBookingOrderSummary,
    getBookingOrderById,
    getBookingOrderDropBaseById,
    createBookingOrder,
    updateBookingOrder,
    updateBookingOrderDropBase,
    updateStatusBookingOrder,
    getDropdownAdditionalRequest,
    createBookingOrderDropBase,
    getShipmentStatusDriver,
    getShipmentStatusVehicle,
  };
};

export default BookingOrderApi;
