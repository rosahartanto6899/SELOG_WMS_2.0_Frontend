import { combineReducers } from "@reduxjs/toolkit";

import { baseReducers } from "./base.slice";
import businessAreaReducer from "./business-area.slice";
import cityReducer from "./city.slice";
import customersReducer from "./customer.slice";
import districtReducer from "./district.slice";
import menuReducer from "./menu.slice";
import notificationReducer from "./notification.slice";
import provinceReducer from "./province.slice";
import rolesReducer from "./role.slice";
import rolesMenuReducer from "./role-menu.slice";
import uploadIncomingAhmReducer from "./upload-incoming-ahm.slice";
import userReducer from "./user.slice";
import wmsWarehousesReducer from "./wms-warehouse.slice";

const rootReducer = combineReducers({
  ...baseReducers,
  menus: menuReducer,
  notification: notificationReducer,
  roles: rolesReducer,
  customers: customersReducer,
  wmsWarehouses: wmsWarehousesReducer,
  users: userReducer,
  roleMenus: rolesMenuReducer,
  businessAreas: businessAreaReducer,
  provinces: provinceReducer,
  cities: cityReducer,
  districts: districtReducer,
  uploadIncomingAhm: uploadIncomingAhmReducer,
});

export default rootReducer;
