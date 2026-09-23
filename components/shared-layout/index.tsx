/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // GlobalOutlined,
  HomeOutlined,
  LoadingOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import Typography from "@sera-components/typography";
import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import i18n from "@sera-locale/i18n";
import { decryptData } from "@sera-utils/encryptor";
import PermissionUtils from "@sera-utils/permission-utils";
import SharedUtils from "@sera-utils/shared-utils";
import Utils from "@sera-utils/utils";
import { Flex, Grid, MenuProps, Space, Spin, Tooltip } from "antd";
import { ItemType } from "antd/es/menu/interface";
import _ from "lodash";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SubMenuDotIcon from "../icons/SubMenuDotIcon";
import Layout from "../layout";

const IS_SERVER = typeof window === "undefined";
export interface SharedLibrariesProps {
  children: ReactNode;
  // showNotificationHandler: () => void;
}

const { useBreakpoint } = Grid;

const SharedLayout = (props: SharedLibrariesProps) => {
  const DynamicIcon = dynamic(() => import("../icons/DynamicIcon"), {
    ssr: false,
  });
  const { t } = useTranslation();

  const { /* showNotificationHandler, */ children } = props;
  const { xs, lg } = useBreakpoint();
  const router = useRouter();
  const { pathname, asPath } = router;
  // const { data } = useSession() as CustomUseSession;
  const { data, update } = useSession() as any;
  const isInternal = data?.detail?.data?.user.isInternal ?? false;
  const [selectedParentKeys, setSelectedParentKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [sidebar, setSidebar] = useState<any[]>([]);
  const [counting, setCounting] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  // const [lang, setLang] = useState<string>(localStorage.getItem("i18nextLng")!);

  const menus: any = PermissionUtils().getAccessMenus();

  useEffect(() => {
    if (router.locale) {
      i18n.changeLanguage(router.locale);
      // SET HEADER LANG
      httpService.setDefaultLang(router.locale);
    }
  }, [router.locale]);

  // cache accessMenus ditimpa (permission berubah) → bangun ulang sidebar
  useEffect(() => {
    const handler = () => setSidebar([]);
    window.addEventListener("accessMenus-updated", handler);
    return () => window.removeEventListener("accessMenus-updated", handler);
  }, []);

  if (!menus) {
    setTimeout(() => {
      setCounting(counting + 1);
    }, 1000);
  }

  function pathIsServer(
    locationPathname: string,
    gotoSpecificPath: string,
    destinationPath: string,
  ) {
    return (
      !IS_SERVER &&
      Utils().parsePath(locationPathname, gotoSpecificPath, destinationPath)
    );
  }

  // SET MENU
  if (menus?.data?.length > 0 && sidebar.length === 0) {
    const sortedMenu = _.orderBy(menus.data, ["order"], ["asc"]);
    const SIDEBAR_MENU = sortedMenu.map((menu: any) => {
      let menuLevel1 = null;
      if (menu.menuLink && menu.data.isRead) {
        const idMenuLevel1 = `link-menu-${Utils().titleToKebabCase(menu.menuName)}`;
        let menuLink = menu.menuLink;
        const child = _.orderBy(menu.child ?? [], ["order"], ["asc"]).filter(
          (_c: any) => _c?.menuLink && _c?.data?.isRead,
        );
        const submenu = child.map((_c: any) => ({
          label: (
            <Tooltip title={lg ? _c.menuName : undefined} placement="right">
              <Link
                id={`link-level2-${Utils().titleToKebabCase(_c.menuName)}`}
                href={_c.menuLink}
                passHref
              >
                {_c.menuName}
              </Link>
            </Tooltip>
          ),
          key: _c.id,
          // Uniform, hardcoded icon for all sub-menu items — intentionally
          // not sourced from _c.menuIcon (DB) so sub-menus stay visually
          // consistent regardless of what's configured per-menu.
          icon: <SubMenuDotIcon />,
          rawLink: _c.menuLink,
          path: pathIsServer(window.location.pathname, "", _c.menuLink),
          pathname: [_c.menuLink],
        }));
        if (child.length) {
          menuLink = child[0].menuLink;
        }
        menuLevel1 = {
          label: child.length ? (
            menu.menuName
          ) : (
            <Link id={`link-level1-${idMenuLevel1}`} href={menuLink} passHref>
              {menu.menuName}
            </Link>
          ),
          key: menu.id,
          rawLink: child.length ? undefined : menuLink,
          icon: (
            <span
              className="sidebar-menu-icon"
              style={{
                boxSizing: "border-box",
                display: "block",
                flexShrink: 0,
                height: "3rem",
                minHeight: "3rem",
                minWidth: "3rem",
                position: "relative",
                width: "3rem",
              }}
            >
              <DynamicIcon
                type={menu.menuIcon}
                style={{
                  display: "block",
                  height: "1.6rem",
                  left: "50%",
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "1.6rem",
                }}
              />
            </span>
          ),
          path: pathIsServer(window.location.pathname, "", menuLink),
          // parent with submenu is a group, highlight comes from children
          pathname: child.length ? [] : [menuLink],
          ...(child.length ? { children: submenu } : {}),
        };
      }

      return menuLevel1;
    });
    setSidebar(SIDEBAR_MENU.filter(Boolean));
  }

  const handleSignout = async () => {
    const loginProvider = data?.loginProvider;
    const baseUrl = process.env.NEXTAUTH_URL || window.location.origin;
    let authUrl = `${baseUrl}/auth`;
    if (isInternal && loginProvider === "azure-ad") {
      authUrl = `${decryptData(process.env.MSAL_LOGIN_URL)}/${decryptData(process.env.MSAL_TENANT_ID)}/oauth2/logout?post_logout_redirect_uri=${decryptData(process.env.AUTH_URL)}&prompt=none`;
    }
    setLoading(true);
    await SharedUtils().logout(loginProvider);
    setLoading(false);
    window.location.replace(authUrl);
  };

  const handleSwitchRole: MenuProps["onClick"] = async (e) => {
    try {
      const res: any = await SharedUtils().switchRole(e.key);
      await update({
        ...res.data.data,
        detail: {
          data: {
            ...res.data.data,
          },
        },
      });
    } catch (error) {
      console.error("Update session error", error);
    } finally {
      router.push("/");
    }
  };

  // Multi-tenant: Customer = tenant. Load names of accessible customers.
  const [tenantOptions, setTenantOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [warehouseDropdown, setWarehouseDropdown] = useState<any[]>([]);

  useEffect(() => {
    const accessible = data?.user?.customers || [];
    if (!accessible.length) return;
    httpService
      .get(`${apiUrl.user}/warehouses/dropdown`)
      .then((resp: any) => {
        const all = resp?.data?.data || [];
        const byId = new Map<string, string>();
        all.forEach((w: any) => {
          if (w.customer?.id && !byId.has(w.customer.id)) {
            byId.set(w.customer.id, w.customer.name);
          }
        });
        setTenantOptions(
          accessible
            .filter((id: string) => byId.has(id))
            .map((id: string) => ({ id, name: byId.get(id) })),
        );
        setWarehouseDropdown(all);
      })
      .catch(() => undefined);
  }, [data?.user?.customers]);

  const handleSwitchWarehouse: MenuProps["onClick"] = async (e) => {
    try {
      const res: any = await SharedUtils().switchWarehouse(e.key);
      await update({
        ...res.data.data,
        detail: {
          data: {
            ...res.data.data,
          },
        },
      });
    } catch (error) {
      console.error("Update session error", error);
    } finally {
      router.push("/");
    }
  };

  // Switch warehouse — opsi = warehouse customer aktif yang juga masuk
  // akses role (session.warehouses, code-based) + id dari dropdown
  const sessionWarehouses: Array<{
    warehouseCode: string;
    warehouseName: string | null;
  }> = (data as any)?.detail?.data?.session?.warehouses ?? [];
  const accessibleCodes = new Set(
    sessionWarehouses.map((w) => w.warehouseCode),
  );
  const warehouseMenu = warehouseDropdown
    .filter(
      (w: any) =>
        w.customer?.id === data?.user?.customerId &&
        accessibleCodes.has(w.code),
    )
    .map((w: any) => ({
      label: w.name,
      key: w.id,
      onClick: handleSwitchWarehouse,
    }));

  const handleSwitchCustomer: MenuProps["onClick"] = async (e) => {
    try {
      const res: any = await SharedUtils().switchCustomer(e.key);
      await update({
        ...res.data.data,
        detail: {
          data: {
            ...res.data.data,
          },
        },
      });
    } catch (error) {
      console.error("Update session error", error);
    } finally {
      router.push("/");
    }
  };

  const tenantMenu = tenantOptions.map((tenant) => ({
    label: tenant.name,
    key: tenant.id,
    onClick: handleSwitchCustomer,
  }));

  const roleMenu = data?.user?.roles?.map((role: any) => ({
    label: role.name,
    key: role.id,
    onClick: handleSwitchRole,
  }));

  const headerMenu: ItemType[] = [
    ...(xs
      ? [
          {
            key: "profile",
            label: (
              <Flex vertical>
                <Typography.Text variant="muted" fontSize={16}>
                  {data?.user?.name}
                </Typography.Text>
                <Typography.Text variant="muted">
                  {data?.user?.roleName}
                </Typography.Text>
              </Flex>
            ),
            icon: <UserOutlined style={{ position: "relative", top: -10 }} />,
          },
          {
            key: "divider-profile", // Tambahkan key untuk menghindari error
            type: "divider" as const,
          },
        ]
      : []),

    ...(tenantMenu.length
      ? [
          {
            key: "switch-customer",
            label: (
              <Space size={14}>{t("global.header.menu.witchCustomer")}</Space>
            ),
            children: tenantMenu,
            icon: <UserOutlined />,
          },
        ]
      : []),
    {
      key: "switch-role",
      label: <Space size={14}>{t("global.header.menu.witchRole")}</Space>,
      children: roleMenu,
      icon: <SyncOutlined />,
    },
    ...(warehouseMenu.length
      ? [
          {
            key: "switch-warehouse",
            label: (
              <Space size={14}>{t("global.header.menu.switchWarehouse")}</Space>
            ),
            children: warehouseMenu,
            icon: <HomeOutlined />,
          },
        ]
      : []),
    {
      key: "logout",
      label: (
        <Space size={14}>
          {t("global.header.menu.logout")}{" "}
          {loading ? (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />}
            />
          ) : null}
        </Space>
      ),
      icon: <LogoutOutlined />,
      onClick: () => {
        if (!loading) {
          handleSignout().catch(console.error);
        }
      },
    },
    // ...(xs
    //   ? [
    //       {
    //         key: "divider-lang", // Tambahkan key untuk menghindari error
    //         type: "divider" as const,
    //       },
    //       {
    //         key: "lang",
    //         label: (
    //           <Typography.Text variant="muted" fontSize={16}>
    //             {lang?.toUpperCase()}
    //           </Typography.Text>
    //         ),
    //         icon: <GlobalOutlined />,
    //         children: [
    //           {
    //             key: "id",
    //             label: "ID",
    //             onClick: () => {
    //               router.replace(router.asPath, router.asPath, {
    //                 locale: "id",
    //               });
    //               setLang("id");
    //               localStorage.setItem("i18nextLng", "id");
    //             },
    //           },
    //           {
    //             key: "en",
    //             label: "EN",
    //             onClick: () => {
    //               router.replace(router.asPath, router.asPath, {
    //                 locale: "en",
    //               });
    //               setLang("en");
    //               localStorage.setItem("i18nextLng", "en");
    //             },
    //           },
    //         ],
    //       },
    //     ]
    //   : []),
  ];

  const sideMenuItemClick = (_e: any) => {
    setSelectedKeys([_e.key]);
  };

  useEffect(() => {
    let bestMatch: {
      score: number;
      parentKey?: string;
      menuKey: string;
    } | null = null;

    const currentAsPath = (asPath || "").split("?")[0].split("#")[0];
    const currentRoute = pathname || "";

    const checkLinkScore = (link?: string) => {
      if (!link) return -1;
      const normalizedLink = link.trim();
      if (!normalizedLink) return -1;

      // Exact match against asPath or pathname
      if (normalizedLink === currentAsPath || normalizedLink === currentRoute) {
        return 10000 + normalizedLink.length;
      }

      // Root "/" only matches exact root
      if (normalizedLink === "/") return -1;

      // Prefix match for nested/detail/create routes (e.g. /plan-incoming/actual-incoming/123)
      if (
        currentAsPath.startsWith(`${normalizedLink}/`) ||
        currentRoute.startsWith(`${normalizedLink}/`)
      ) {
        return normalizedLink.length;
      }

      return -1;
    };

    sidebar.forEach((menuItem: any) => {
      if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children.forEach((childItem: any) => {
          const childLink = childItem.rawLink || childItem.pathname?.[0];
          const score = checkLinkScore(childLink);
          if (score > 0 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = {
              score,
              parentKey: menuItem.key,
              menuKey: childItem.key,
            };
          }
        });
      } else {
        const itemLink = menuItem.rawLink || menuItem.pathname?.[0];
        const score = checkLinkScore(itemLink);
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = {
            score,
            menuKey: menuItem.key,
          };
        }
      }
    });

    if (bestMatch) {
      const match = bestMatch as {
        score: number;
        parentKey?: string;
        menuKey: string;
      };
      setSelectedParentKeys(match.parentKey ? [match.parentKey] : []);
      setSelectedKeys([match.menuKey]);
    }
  }, [pathname, asPath, sidebar]);

  const selectedCustomerName = tenantOptions.find(
    (tenant) => tenant.id === data?.user?.customerId,
  )?.name;
  const selectedWarehouseName = data?.user?.warehouseName ?? undefined;

  return (
    <Layout
      siderMenuData={sidebar}
      headerMenu={headerMenu}
      selectedKeys={selectedKeys}
      defaultOpenKeys={selectedParentKeys}
      sideMenuItemClick={sideMenuItemClick}
      user={data?.user}
      selectedCustomerName={selectedCustomerName}
      selectedWarehouseName={selectedWarehouseName}
      // onNotificationClick={showNotificationHandler}
    >
      {children}
    </Layout>
  );
};

export default SharedLayout;
