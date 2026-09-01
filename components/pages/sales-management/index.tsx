import BookingOrderFilters from "./booking-order/booking-filters";
import BookingOrderForm from "./booking-order/booking-form";
import BookingOrderInitialPage from "./booking-order/booking-initial-page";
import BookingOrderUpsertBulk from "./booking-order/booking-order-upsert-bulk";
import OrderStatusFilters from "./order-status/order-status-filter";
import OrderStatusForm from "./order-status/order-status-form";
import OrderStatusInitialPage from "./order-status/order-status-initial-page";
import OrderStatusUpdateForm from "./order-status/order-status-update-form";

const SalesManagementComponent = {
  BookingInitialPage: BookingOrderInitialPage,
  BookingFilters: BookingOrderFilters,
  BookingForm: BookingOrderForm,
  BookingUpsert: BookingOrderUpsertBulk,
  OrderStatusInitialPage: OrderStatusInitialPage,
  OrderStatusFilters: OrderStatusFilters,
  OrderStatusForm: OrderStatusForm,
  OrderStatusUpdateForm: OrderStatusUpdateForm,
};

export default SalesManagementComponent;
