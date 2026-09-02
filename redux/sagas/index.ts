import { all } from "redux-saga/effects";

import businessAreaSaga from "./business-area.saga";
import city from "./city.saga";
import customerSaga from "./customer.saga";
import district from "./district.saga";
import menusSaga from "./menu.saga";
import notificationSaga from "./notification.saga";
import provinceSaga from "./province.saga";
import roleSaga from "./role.saga";
import roleMenuSaga from "./role-menu.saga";
import userSaga from "./user.saga";
import wmsWarehouseSaga from "./wms-warehouse.saga";

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
  ]);
}
