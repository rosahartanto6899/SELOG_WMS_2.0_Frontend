import { all } from "redux-saga/effects";

import businessAreaSaga from "./business-area.saga";
import city from "./city.saga";
import company from "./company.saga";
import customerSaga from "./customer.saga";
import district from "./district.saga";
import exportLogSaga from "./export-log.saga";
import locationSaga from "./location.saga";
import locationTypeSaga from "./location-type.saga";
import menusSaga from "./menu.saga";
import notificationSaga from "./notification.saga";
import provinceSaga from "./province.saga";
import roleSaga from "./role.saga";
import roleMenuSaga from "./role-menu.saga";
import serviceGroupSaga from "./service-group.saga";
import uploadImgSaga from "./upload-img.saga";
import userSaga from "./user.saga";
import userLogSaga from "./user-logs.saga";
import vehicleGroupSaga from "./vehicle-group.saga";
import vehicleTypeSaga from "./vehicle-type.saga";
import wmsWarehouseSaga from "./wms-warehouse.saga";

export default function* rootSaga() {
  yield all([
    businessAreaSaga(),
    company(),
    city(),
    district(),
    exportLogSaga(),
    locationSaga(),
    locationTypeSaga(),
    menusSaga(),
    notificationSaga(),
    provinceSaga(),
    roleSaga(),
    customerSaga(),
    wmsWarehouseSaga(),
    roleMenuSaga(),
    serviceGroupSaga(),
    uploadImgSaga(),
    userSaga(),
    userLogSaga(),
    vehicleGroupSaga(),
    vehicleTypeSaga(),
  ]);
}
