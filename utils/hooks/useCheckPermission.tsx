import { PermissionUtilsType } from "@sera-types/menu.type";
import PermissionUtils from "@sera-utils/permission-utils";

const useCheckPermission = ({ menuLink }: { menuLink: string }) => {
  const menuPermission: PermissionUtilsType =
    PermissionUtils().getAccessMenuPermission(menuLink) as any;

  return {
    isRead: menuPermission?.data?.isRead || false,
    isCreate: menuPermission?.data?.isCreate || false,
    isUpdate: menuPermission?.data?.isUpdate || false,
    isDelete: menuPermission?.data?.isDelete || false,
    isExport: menuPermission?.data?.isExport || false,
  };
};

export default useCheckPermission;
