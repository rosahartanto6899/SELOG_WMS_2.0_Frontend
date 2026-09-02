import { combineReducers } from "@reduxjs/toolkit";

import { baseReducers } from "./base.slice";
import businessAreaReducer from "./business-area.slice";
import cityReducer from "./city.slice";
import companyReducer from "./company.slice";
import customersReducer from "./customer.slice";
import districtReducer from "./district.slice";
import exportLogReducer from "./export-log.slice";
import locationReducer from "./location.slice";
import locationTypeReducer from "./location-type.slice";
import menuReducer from "./menu.slice";
import notificationReducer from "./notification.slice";
import provinceReducer from "./province.slice";
import rolesReducer from "./role.slice";
import rolesMenuReducer from "./role-menu.slice";
import serviceGroupReducer from "./service-group.slice";
import uploadImgReducer from "./upload-img.slice";
import userReducer from "./user.slice";
import userLogReducer from "./user-logs.slice";
import vehicleGroupReducer from "./vehicle-group.slice";
import vehicleTypeReducer from "./vehicle-type.slice";
import wmsWarehousesReducer from "./wms-warehouse.slice";

const rootReducer = combineReducers({
  ...baseReducers,
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
  serviceGroups: serviceGroupReducer,
  provinces: provinceReducer,
  cities: cityReducer,
  districts: districtReducer,
});

export default rootReducer;
