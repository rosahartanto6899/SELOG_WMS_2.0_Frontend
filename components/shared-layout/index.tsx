/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // GlobalOutlined,
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
import { Flex, Grid, MenuProps, Space, Spin } from "antd";
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
  const { xs } = useBreakpoint();
  const router = useRouter();
  const { pathname } = router;
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
            <Link
              id={`link-level2-${Utils().titleToKebabCase(_c.menuName)}`}
              href={_c.menuLink}
              passHref
            >
              {_c.menuName}
            </Link>
          ),
          key: _c.id,
          // Uniform, hardcoded icon for all sub-menu items — intentionally
          // not sourced from _c.menuIcon (DB) so sub-menus stay visually
          // consistent regardless of what's configured per-menu.
          icon: <SubMenuDotIcon />,
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
          icon: (
            <span style={{ color: "#0050b3" }}>
              <DynamicIcon type={menu.menuIcon} />
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
      })
      .catch(() => undefined);
  }, [data?.user?.customers]);

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

    {
      key: "switch-role",
      label: <Space size={14}>{t("global.header.menu.witchRole")}</Space>,
      children: roleMenu,
      icon: <SyncOutlined />,
    },
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
    const activeMenu = {
      parentKey: [] as string[],
      menuKey: [] as string[],
    };

    sidebar.forEach((menuItem: any) => {
      if (
        menuItem.pathname &&
        menuItem.pathname.length > 0 &&
        menuItem.pathname.includes(pathname)
      ) {
        activeMenu.menuKey = [menuItem.key];
      } else if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children.forEach((menuChildrenItem: any) => {
          if (
            menuChildrenItem.pathname &&
            menuChildrenItem.pathname.length > 0 &&
            menuChildrenItem.pathname.includes(pathname)
          ) {
            activeMenu.parentKey = [menuItem.key];
            activeMenu.menuKey = [menuChildrenItem.key];
          }
        });
      }
    });

    setSelectedParentKeys(activeMenu.parentKey);
    setSelectedKeys(activeMenu.menuKey);
  }, [pathname, sidebar]);

  return (
    <Layout
      siderMenuData={sidebar}
      headerMenu={headerMenu}
      selectedKeys={selectedKeys}
      defaultOpenKeys={selectedParentKeys}
      sideMenuItemClick={sideMenuItemClick}
      user={data?.user}
      // onNotificationClick={showNotificationHandler}
    >
      {children}
    </Layout>
  );
};

export default SharedLayout;
