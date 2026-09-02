/* eslint-disable import/no-anonymous-default-export */
import auth from "./auth.json";
import customerManagement from "./customer-management.json";
import dashboard from "./dashboard.json";
import global from "./global.json";
import businessArea from "./master-data/business-area.json";
import company from "./master-data/company.json";
import location from "./master-data/location.json";
import serviceGroup from "./master-data/service-group.json";
import vehicleType from "./master-data/vehicle-type.json";
import menuConfiguration from "./user-management/menu-configuration.json";
import rolePermission from "./user-management/role-permission.json";
import roles from "./user-management/roles.json";
import userLogs from "./user-management/user-logs.json";
import userManagement from "./user-management/user-management.json";
import warehouseManagement from "./warehouse-management.json";
import xenditLink from "./xendit-link.json";

export default {
  translation: {
    dashboard,
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
    xenditLink,
    serviceGroup,
  },
};
