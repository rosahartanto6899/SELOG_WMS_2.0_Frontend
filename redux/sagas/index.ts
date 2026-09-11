import { all } from "redux-saga/effects";

import actualIncomingSaga from "./actual-incoming.saga";
import actualOutgoingSaga from "./actual-outgoing.saga";
import businessAreaSaga from "./business-area.saga";
import city from "./city.saga";
import customerSaga from "./customer.saga";
import district from "./district.saga";
import locationSaga from "./location.saga";
import materialSaga from "./material.saga";
import materialLocationMappingSaga from "./material-location-mapping.saga";
import menusSaga from "./menu.saga";
import notificationSaga from "./notification.saga";
import outstandingIncomingSaga from "./outstanding-incoming.saga";
import outstandingOutgoingSaga from "./outstanding-outgoing.saga";
import provinceSaga from "./province.saga";
import roleSaga from "./role.saga";
import roleMenuSaga from "./role-menu.saga";
import uploadIncomingAhmSaga from "./upload-incoming-ahm.saga";
import userSaga from "./user.saga";
import wmsWarehouseSaga from "./wms-warehouse.saga";
import zoneSaga from "./zone.saga";

export default function* rootSaga() {
  yield all([
    businessAreaSaga(),
    city(),
    district(),
    menusSaga(),
    notificationSaga(),
    provinceSaga(),
    roleSaga(),
    customerSaga(),
    wmsWarehouseSaga(),
    roleMenuSaga(),
    userSaga(),
    uploadIncomingAhmSaga(),
    actualIncomingSaga(),
    actualOutgoingSaga(),
    outstandingIncomingSaga(),
    outstandingOutgoingSaga(),
    zoneSaga(),
    locationSaga(),
    materialSaga(),
    materialLocationMappingSaga(),
  ]);
}
