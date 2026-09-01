import MenuApi from "@sera-libraries/api/menu";
import { PermissionUtilsType } from "@sera-types/menu.type";
import PermissionUtils from "@sera-utils/permission-utils";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";

interface MenuProps {
  key: string;
  label: string;
}

const useGetSubmenus = (_menus: string, _isSkip = false) => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<(MenuProps | null)[]>([]);

  useEffect(() => {
    if (_isSkip) return setLoading(false);

    const getSubmenus = async () => {
      try {
        setLoading(true);

        const _response = await MenuApi().retrieveMenus({
          page: 1,
          limit: 10,
          search: _menus,
          searchBy: "menuLink",
        });

        setMenu(
          orderBy(
            _response?.data?.data?.[0]?.children,
            ["menuOrder"],
            ["asc"],
          ).map((_menu) => {
            const _permission = PermissionUtils().getAccessMenuPermission(
              _menu.menuLink,
            ) as PermissionUtilsType | null;

            if (!_permission?.data?.isRead) return null;
            return { label: _menu.menuName, key: _menu.menuLink };
          }),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getSubmenus();
  }, [_menus, _isSkip]);

  return { loading, menu };
};

export default useGetSubmenus;
