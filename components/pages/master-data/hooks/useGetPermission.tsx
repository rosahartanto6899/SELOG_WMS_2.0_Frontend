import PermissionUtils from "@sera-utils/permission-utils";
import { useSession } from "next-auth/react";

interface PermissionProps {
  data?: {
    isCreate?: boolean;
    isUpdate?: boolean;
    isRead?: boolean;
    isDelete?: boolean;
  };
}

const useGetPermissionMasterData = (menu: string) => {
  const { data: sessionData } = useSession();

  const permission = PermissionUtils().getAccessMenuPermission(
    `/master-data/${menu}`,
  ) as PermissionProps | null;
  const actionPermission = {
    isCreate: permission?.data?.isCreate || false,
    isUpdate: permission?.data?.isUpdate || false,
    isRead: permission?.data?.isRead || false,
    isDelete: permission?.data?.isDelete || false,
  };

  const session = sessionData as {
    user?: {
      email?: string;
      name?: string;
      role?: string;
      roleName?: string;
    };
  };

  const isAdmin = session.user?.roleName?.toLocaleLowerCase() === "superadmin";

  return {
    isUpdate: isAdmin && actionPermission.isUpdate,
    isCreate: isAdmin && actionPermission.isCreate,
    isRead: actionPermission.isRead,
    isDelete: isAdmin && actionPermission.isDelete,
  };
};

export default useGetPermissionMasterData;
