/* eslint-disable import/no-anonymous-default-export */
import admExpense from "./administration-management/expense.json";
import expenseRefund from "./administration-management/expense-refund.json";
import podCollection from "./administration-management/pod-collection.json";
import additionalExpense from "./approvals/additional-expense.json";
import shipmentCancellations from "./approvals/shipment-cancellations.json";
import auth from "./auth.json";
import customerManagement from "./customer-management.json";
import dashboard from "./dashboard.json";
import driverBehaviour from "./driver-management/driver-behaviour.json";
import driverFatigue from "./driver-management/driver-fatigue.json";
import driverPerformance from "./driver-management/driver-performance.json";
import driverStock from "./driver-management/driver-stock.json";
import driverGanttChart from "./driver-management/gantt-chart.json";
import filterTag from "./filter-tag.json";
import stockManagement from "./fleet-management/stock-management.json";
import unitActivities from "./fleet-management/unit-activities.json";
import voiceOfDriver from "./fleet-management/voice-of-driver.json";
import global from "./global.json";
import jmp from "./journey-management/jmp.json";
import journeyHistory from "./journey-management/journey-history.json";
import journeySupport from "./journey-management/journey-support.json";
import tracingAndTracking from "./journey-management/tracing-and-tracking.json";
import vod from "./journey-management/vod.json";
import businessArea from "./master-data/business-area.json";
import company from "./master-data/company.json";
import location from "./master-data/location.json";
import serviceGroup from "./master-data/service-group.json";
import vehicleType from "./master-data/vehicle-type.json";
import approvalBookingOrder from "./operation-management/approval-booking-order.json";
import emptyMiles from "./operation-management/empty-miles.json";
import expenses from "./operation-management/expenses.json";
import pairingMatching from "./operation-management/pairing-matching.json";
import pairingMatchingOps from "./operation-management/pairing-matching-ops.json";
import unitDriverCapacity from "./operation-management/unit-driver-capacity.json";
import bookingOrder from "./sales-management/booking-order.json";
import customer from "./sales-management/customer.json";
import customerContract from "./sales-management/customer-contract.json";
import customerLocation from "./sales-management/customer-location.json";
import customerRoute from "./sales-management/customer-route.json";
import orderStatus from "./sales-management/order-status.json";
import menuConfiguration from "./user-management/menu-configuration.json";
import rolePermission from "./user-management/role-permission.json";
import roles from "./user-management/roles.json";
import userLogs from "./user-management/user-logs.json";
import userManagement from "./user-management/user-management.json";
import warehouseManagement from "./warehouse-management.json";
import xenditLink from "./xendit-link.json";

export default {
  translation: {
    customer,
    customerContract,
    customerLocation,
    customerRoute,
    dashboard,
    driverBehaviour,
    driverFatigue,
    driverGanttChart,
    driverPerformance,
    driverStock,
    global,
    auth,
    location,
    menuConfiguration,
    roles,
    rolePermission,
    userManagement,
    customerManagement,
    warehouseManagement,
    userLogs,
    company,
    businessArea,
    vehicleType,
    stockManagement,
    unitActivities,
    voiceOfDriver,
    xenditLink,
    filterTag,
    serviceGroup,
    bookingOrder,
    orderStatus,
    unitDriverCapacity,
    pairingMatching,
    approvalBookingOrder,
    expenses,
    pairingMatchingOps,
    emptyMiles,
    journeyHistory,
    tracingAndTracking,
    journeySupport,
    vod,
    jmp,
    admExpense,
    additionalExpense,
    expenseRefund,
    podCollection,
    shipmentCancellations,
  },
};
