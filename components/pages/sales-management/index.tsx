import BookingOrderFilters from "./booking-order/booking-filters";
import BookingOrderForm from "./booking-order/booking-form";
import BookingOrderInitialPage from "./booking-order/booking-initial-page";
import BookingOrderUpsertBulk from "./booking-order/booking-order-upsert-bulk";
import CustomerFilters from "./customer/customer-filters";
import CustomerForm from "./customer/customer-form";
import CustomerInitialPage from "./customer/customer-initial-page";
import CustomerContractForm from "./customer-contract/customer-contract-form";
import CustomerContractInitialPage from "./customer-contract/customer-contract-initial-page";
import CustomerLocationForm from "./customer-location/customer-location-form";
import CustomerLocationInitialPage from "./customer-location/customer-location-initial-page";
import CustomerRouteFilters from "./customer-route/customer-route-filters";
import CustomerRouteForm from "./customer-route/customer-route-form";
import CustomerRouteInitialPage from "./customer-route/customer-route-initial-page";
import OrderStatusFilters from "./order-status/order-status-filter";
import OrderStatusForm from "./order-status/order-status-form";
import OrderStatusInitialPage from "./order-status/order-status-initial-page";
import OrderStatusUpdateForm from "./order-status/order-status-update-form";

const SalesManagementComponent = {
  CustomerInitialPage: CustomerInitialPage,
  CustomerForm: CustomerForm,
  CustomerFilters: CustomerFilters,
  CustomerLocationInitialPage: CustomerLocationInitialPage,
  CustomerLocationForm: CustomerLocationForm,
  CustomerContractInitialPage: CustomerContractInitialPage,
  CustomerContractForm,
  CustomerRouteInitialPage: CustomerRouteInitialPage,
  CustomerRouteFilters: CustomerRouteFilters,
  CustomerRouteForm: CustomerRouteForm,
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
