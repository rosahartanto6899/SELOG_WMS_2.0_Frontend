import { all } from "redux-saga/effects";

import additionalExpenseSaga from "./additional-expense.saga";
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
import driversSaga from "./drivers.saga";
import exportLogSaga from "./export-log.saga";
import locationSaga from "./location.saga";
import locationTypeSaga from "./location-type.saga";
import masterDataSaga from "./master-data.saga";
import menusSaga from "./menu.saga";
import notificationSaga from "./notification.saga";
import orderStatusSaga from "./order-status.saga";
import provinceSaga from "./province.saga";
import roleSaga from "./role.saga";
import roleMenuSaga from "./role-menu.saga";
import serviceGroupSaga from "./service-group.saga";
import shipmentCancellationsSaga from "./shipment-cancellations.saga";
import shipmentDetailsSaga from "./shipment-details.saga";
import stockManagementSaga from "./stock-management.saga";
import tracingTrackingSaga from "./tracing-tracking.saga";
import uploadImgSaga from "./upload-img.saga";
import userSaga from "./user.saga";
import userLogSaga from "./user-logs.saga";
import vehicleGroupSaga from "./vehicle-group.saga";
import vehicleTypeSaga from "./vehicle-type.saga";
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
    orderStatusSaga(),
    driversSaga(),
    tracingTrackingSaga(),
    shipmentDetailsSaga(),
  ]);
}
