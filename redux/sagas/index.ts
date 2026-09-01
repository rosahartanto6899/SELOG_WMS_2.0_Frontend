import { all } from "redux-saga/effects";

import additionalExpenseSaga from "./additional-expense.saga";
import approvalBookingOrderSaga from "./approval-booking-order.saga";
import areaSaga from "./area.saga";
import bookingOrderSaga from "./booking-order.saga";
import businessAreaSaga from "./business-area.saga";
import city from "./city.saga";
import company from "./company.saga";
import customerSaga from "./customer.saga";
import customerContract from "./customer-contract.saga";
import customerLocation from "./customer-location.saga";
import customerRoute from "./customer-route.saga";
import district from "./district.saga";
import driverFatigueSaga from "./driver-fatigue.saga";
import driverGanttChartSaga from "./driver-gantt-chart.saga";
import driverPerformanceSaga from "./driver-performance.saga";
import driverStockSaga from "./driver-stock.saga";
import driversSaga from "./drivers.saga";
import expenseMonitoringSaga from "./expense-monitoring.saga";
import expenseRefundSaga from "./expense-refund.saga";
import expensesSaga from "./expenses.saga";
import exportLogSaga from "./export-log.saga";
import jmpSaga from "./jmp.saga";
import journeyHistorySaga from "./journey-history.saga";
import journeySupportSaga from "./journey-support.saga";
import locationSaga from "./location.saga";
import locationTypeSaga from "./location-type.saga";
import masterDataSaga from "./master-data.saga";
import menusSaga from "./menu.saga";
import notificationSaga from "./notification.saga";
import orderStatusSaga from "./order-status.saga";
import pairingMatchingSaga from "./pairing-matching.saga";
import pairingMatchingOpsSaga from "./pairing-matching-ops.saga";
import podCollectionSaga from "./pod-collection.saga";
import provinceSaga from "./province.saga";
import roleSaga from "./role.saga";
import roleMenuSaga from "./role-menu.saga";
import serviceGroupSaga from "./service-group.saga";
import shipmentCancellationsSaga from "./shipment-cancellations.saga";
import shipmentDetailsSaga from "./shipment-details.saga";
import stockManagementSaga from "./stock-management.saga";
import tracingTrackingSaga from "./tracing-tracking.saga";
import unitActivitySaga from "./unit-activity.saga";
import unitDriverCapacitySaga from "./unit-driver-capacity.saga";
import uploadImgSaga from "./upload-img.saga";
import userSaga from "./user.saga";
import userLogSaga from "./user-logs.saga";
import vehicleGroupSaga from "./vehicle-group.saga";
import vehicleTypeSaga from "./vehicle-type.saga";
import vodSaga from "./voice-of-driver.saga";
import wmsWarehouseSaga from "./wms-warehouse.saga";

export default function* rootSaga() {
  yield all([
    additionalExpenseSaga(),
    areaSaga(),
    businessAreaSaga(),
    company(),
    city(),
    district(),
    customerContract(),
    customerRoute(),
    customerLocation(),
    exportLogSaga(),
    locationSaga(),
    locationTypeSaga(),
    masterDataSaga(),
    menusSaga(),
    notificationSaga(),
    provinceSaga(),
    roleSaga(),
    customerSaga(),
    wmsWarehouseSaga(),
    roleMenuSaga(),
    serviceGroupSaga(),
    shipmentCancellationsSaga(),
    stockManagementSaga(),
    uploadImgSaga(),
    userSaga(),
    userLogSaga(),
    vehicleGroupSaga(),
    vehicleTypeSaga(),
    bookingOrderSaga(),
    unitActivitySaga(),
    vodSaga(),
    orderStatusSaga(),
    driversSaga(),
    driverFatigueSaga(),
    driverGanttChartSaga(),
    driverPerformanceSaga(),
    approvalBookingOrderSaga(),
    driverStockSaga(),
    pairingMatchingSaga(),
    unitDriverCapacitySaga(),
    pairingMatchingOpsSaga(),
    expensesSaga(),
    tracingTrackingSaga(),
    journeySupportSaga(),
    journeyHistorySaga(),
    jmpSaga(),
    expenseRefundSaga(),
    podCollectionSaga(),
    expenseMonitoringSaga(),
    shipmentDetailsSaga(),
  ]);
}
