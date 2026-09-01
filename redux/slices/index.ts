import { combineReducers } from "@reduxjs/toolkit";

import { additionalExpenseReducer } from "./additional-expense.slice";
import approvalBookingOrderReducer from "./approval-booking-order.slice";
import areaReducer from "./area.slice";
import { baseReducers } from "./base.slice";
import bookingOrderReducer from "./booking-order.slice";
import businessAreaReducer from "./business-area.slice";
import cityReducer from "./city.slice";
import companyReducer from "./company.slice";
import customersReducer from "./customer.slice";
import customerContractReducer from "./customer-contract.slice";
import customerLocationReducer from "./customer-location.slice";
import customerRouteReducer from "./customer-route.slice";
import districtReducer from "./district.slice";
import driverFatigueReducer from "./driver-fatigue.slice";
import driverGanttChartReducer from "./driver-gantt-chart.slice";
import driverPerformanceReducer from "./driver-performance.slice";
import driverStatusReducer from "./driver-status.slice";
import driverStockReducer from "./driver-stock.slice";
import driversReducers from "./drivers.slice";
import employeeStatusReducer from "./employee-status.slice";
import { expensesReducer } from "./expenses.slice";
import exportLogReducer from "./export-log.slice";
import jmpReducer from "./jmp.slice";
import journeyHistoryReducer from "./journey-history.slice";
import { journeySupportReducer } from "./journey-support.slice";
import locationReducer from "./location.slice";
import locationTypeReducer from "./location-type.slice";
import masterDataReducer from "./master-data.slice";
import menuReducer from "./menu.slice";
import notificationReducer from "./notification.slice";
import orderStatusReducer from "./order-status.slice";
import ownershipTypesReducer from "./ownership-types.slice";
import pairingMatchingReducer from "./pairing-matching.slice";
import pairingMatchingOpsReducer from "./pairing-matching-ops.slice";
import provinceReducer from "./province.slice";
import rolesReducer from "./role.slice";
import rolesMenuReducer from "./role-menu.slice";
import serviceGroupReducer from "./service-group.slice";
import { shipmentCancellationsReducer } from "./shipment-cancellations.slice";
import shipmentDetailsReducer from "./shipment-details.slice";
import shipmentTypesReducer from "./shipment-types.slice";
import stockManagementReducer from "./stock-management.slice";
import tracingTrackingReducer from "./tracing-tracking-slice";
import unitActivityReducer from "./unit-activity.slice";
import unitDriverCapacityReducer from "./unit-driver-capacity.slice";
import uploadImgReducer from "./upload-img.slice";
import userReducer from "./user.slice";
import userLogReducer from "./user-logs.slice";
import vehicleGroupReducer from "./vehicle-group.slice";
import vehicleTypeReducer from "./vehicle-type.slice";
import vodReducer from "./voice-of-driver.slice";
import wmsWarehousesReducer from "./wms-warehouse.slice";

const rootReducer = combineReducers({
  ...baseReducers,
  additionalExpense: additionalExpenseReducer,
  areas: areaReducer,
  customerRoutes: customerRouteReducer,
  customerContracts: customerContractReducer,
  customerLocations: customerLocationReducer,
  locations: locationReducer,
  locationTypes: locationTypeReducer,
  menus: menuReducer,
  notification: notificationReducer,
  roles: rolesReducer,
  customers: customersReducer,
  wmsWarehouses: wmsWarehousesReducer,
  users: userReducer,
  roleMenus: rolesMenuReducer,
  userLogs: userLogReducer,
  exportLogs: exportLogReducer,
  uploadImg: uploadImgReducer,
  businessAreas: businessAreaReducer,
  companies: companyReducer,
  vehicleGroups: vehicleGroupReducer,
  vehicleTypes: vehicleTypeReducer,
  stockManagement: stockManagementReducer,
  serviceGroups: serviceGroupReducer,
  shipmentCancellations: shipmentCancellationsReducer,
  shipmentTypes: shipmentTypesReducer,
  ownershipTypes: ownershipTypesReducer,
  provinces: provinceReducer,
  cities: cityReducer,
  districts: districtReducer,
  bookingOrder: bookingOrderReducer,
  unitActivity: unitActivityReducer,
  vod: vodReducer,
  orderStatus: orderStatusReducer,
  drivers: driversReducers,
  driverFatigue: driverFatigueReducer,
  driverGanttChart: driverGanttChartReducer,
  employeeStatus: employeeStatusReducer,
  driverStatus: driverStatusReducer,
  driverPerformance: driverPerformanceReducer,
  approvalBookingOrder: approvalBookingOrderReducer,
  driverStock: driverStockReducer,
  pairingMatching: pairingMatchingReducer,
  unitDriverCapacity: unitDriverCapacityReducer,
  masterData: masterDataReducer,
  pairingMatchingOps: pairingMatchingOpsReducer,
  expenses: expensesReducer,
  tracingTracking: tracingTrackingReducer,
  journeySupport: journeySupportReducer,
  journeyHistory: journeyHistoryReducer,
  jmp: jmpReducer,
  shipmentDetails: shipmentDetailsReducer,
});

export default rootReducer;
