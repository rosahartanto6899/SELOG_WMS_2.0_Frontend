import { isArray } from "lodash";

import { PermissionUtilsType, SavedAccessMenus } from "../types/menu.type";
import { decryptData } from "./encryptor";

const PermissionUtils = () => {
  const getAccessMenus = () => {
    const menus =
      typeof window !== "undefined" && localStorage.getItem("accessMenus")
        ? (localStorage.getItem("accessMenus") ?? "")
        : null;

    if (!menus) return "";
    return decryptData(menus);
  };

  const findPermissionInChildren = (
    menu: PermissionUtilsType,
    menuLink: string,
  ): PermissionUtilsType | null => {
    let permissions: PermissionUtilsType | null = null;

    menu.child.forEach((child: PermissionUtilsType) => {
      if (child.menuLink === menuLink && child?.data?.isRead) {
        permissions = child;
      } else if (child.child?.length > 0) {
        child.child.forEach((lastChild: PermissionUtilsType) => {
          if (lastChild.menuLink === menuLink && lastChild?.data?.isRead) {
            permissions = lastChild;
          }
        });
      }
    });

    return permissions;
  };

  const getAccessMenuPermission = (menuLink: string, isParent = true) => {
    const menus: SavedAccessMenus = getAccessMenus();
    let permissions: PermissionUtilsType | null = null;
    if (!isArray(menus.data)) return permissions;

    menus?.data?.forEach((menu: PermissionUtilsType) => {
      if (isParent && menu.menuLink === menuLink && menu?.data?.isRead) {
        permissions = menu;
      } else if (menu?.child?.length > 0) {
        const childPermissions = findPermissionInChildren(menu, menuLink);
        if (childPermissions) {
          permissions = childPermissions;
        }
      }
    });

    return permissions;
  };

  const getAccessMenuPermissionRead = (menuLink: string) => {
    const menus =
      typeof window !== "undefined" && localStorage.getItem("accessMenus")
        ? JSON.parse(localStorage.getItem("accessMenus") ?? "")
        : null;

    let permissions: PermissionUtilsType | null = null;

    menus?.data.data.forEach((menu: PermissionUtilsType) => {
      if (menu.menuLink === menuLink && menu?.data?.isRead) {
        permissions = menu;
      } else if (menu?.child?.length > 0) {
        menu.child.forEach((child: PermissionUtilsType) => {
          if (child.menuLink === menuLink && child?.data?.isRead) {
            permissions = child;
          } else if (child?.child?.length > 0) {
            child.child.forEach((lastChild: PermissionUtilsType) => {
              if (lastChild.menuLink === menuLink && lastChild?.data?.isRead) {
                permissions = lastChild;
              }
            });
          }
        });
      }
    });

    if (permissions) {
      const { data } = permissions as PermissionUtilsType;
      return data?.isRead;
    }
    return false;
  };

  return {
    getAccessMenuPermission,
    getAccessMenuPermissionRead,
    getAccessMenus,
  };
};

export default PermissionUtils;
