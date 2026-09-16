/* eslint-disable import/no-anonymous-default-export */
import auth from "./auth.json";
import customerManagement from "./customer-management.json";
import dashboard from "./dashboard.json";
import global from "./global.json";
import inventoryStock from "./inventory-stock.json";
import masterData from "./master-data.json";
import planIncoming from "./plan-incoming.json";
import planOutgoing from "./plan-outgoing.json";
import report from "./report.json";
import menuConfiguration from "./user-management/menu-configuration.json";
import rolePermission from "./user-management/role-permission.json";
import roles from "./user-management/roles.json";
import userManagement from "./user-management/user-management.json";
import warehouseManagement from "./warehouse-management.json";

export default {
  translation: {
    dashboard,
    global,
    inventoryStock,
    auth,
    menuConfiguration,
    roles,
    rolePermission,
    userManagement,
    customerManagement,
    warehouseManagement,
    planIncoming,
    planOutgoing,
    report,
    masterData,
  },
};
