import PermissionUtils from "@sera-utils/permission-utils";

interface PermissionProps {
  data?: {
    isCreate?: boolean;
    isUpdate?: boolean;
    isRead?: boolean;
    isDelete?: boolean;
  };
}

const useGetPermission = (menu: string) => {
  const permission = PermissionUtils().getAccessMenuPermission(
    `/driver-management/${menu}`,
    false,
  ) as PermissionProps | null;

  const actionPermission = {
    isCreate: permission?.data?.isCreate || false,
    isUpdate: permission?.data?.isUpdate || false,
    isRead: permission?.data?.isRead || false,
    isDelete: permission?.data?.isDelete || false,
  };

  return {
    isUpdate: actionPermission.isUpdate,
    isCreate: actionPermission.isCreate,
    isRead: actionPermission.isRead,
    isDelete: actionPermission.isDelete,
  };
};

export default useGetPermission;
