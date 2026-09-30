/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // GlobalOutlined,
  LoadingOutlined,
  UserOutlined,
  UserSwitchOutlined,
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
import { Button, Drawer, Flex, Grid, Select, Space, Spin } from "antd";
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

  const updateSession = async (sessionData: any) => {
    try {
      await update({
        ...sessionData,
        detail: {
          data: {
            ...sessionData,
          },
        },
      });
    } catch (error) {
      console.error("Update session error", error);
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

  // ===== Switch Profile (customer + role + warehouse dalam satu panel) =====
  const [profileCustomerId, setProfileCustomerId] = useState<string>();
  const [profileRoleId, setProfileRoleId] = useState<string>();
  const [profileWarehouseId, setProfileWarehouseId] = useState<string>();
  const [switching, setSwitching] = useState<boolean>(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);

  // sinkronkan pilihan panel dari session aktif
  useEffect(() => {
    setProfileCustomerId(data?.user?.customerId ?? undefined);
    setProfileRoleId(
      data?.user?.roles?.find((r: any) => r.name === data?.user?.roleName)?.id,
    );
    setProfileWarehouseId(data?.user?.warehouseId ?? undefined);
  }, [
    data?.user?.customerId,
    data?.user?.roleName,
    data?.user?.warehouseId,
    data?.user?.roles,
  ]);

  const activeRoleId = data?.user?.roles?.find(
    (r: any) => r.name === data?.user?.roleName,
  )?.id;

  // warehouse yang diizinkan role aktif (session.warehouses, code-based)
  const sessionWarehouses: Array<{
    warehouseCode: string;
    warehouseName: string | null;
  }> = (data as any)?.detail?.data?.session?.warehouses ?? [];
  const accessibleCodes = new Set(
    sessionWarehouses.map((w) => w.warehouseCode),
  );

  // ponytail: session.warehouses hanya mencakup customer+role AKTIF —
  // filter ketat hanya valid untuk kombinasi aktif; kombinasi lain tampilkan
  // semua warehouse customer terpilih, backend memvalidasi saat switch
  const profileWarehouseOptions = warehouseDropdown
    .filter(
      (w: any) =>
        w.customer?.id === (profileCustomerId ?? data?.user?.customerId),
    )
    .filter((w: any) =>
      profileCustomerId === data?.user?.customerId &&
      profileRoleId === activeRoleId
        ? accessibleCodes.has(w.code)
        : true,
    )
    .map((w: any) => ({ label: w.name, value: w.id }));

  // Terapkan berurutan customer → role → warehouse; tiap switch
  // mengembalikan session baru sebagai dasar perbandingan berikutnya.
  const handleSwitchProfile = async () => {
    setSwitching(true);
    try {
      let user = data?.user;
      if (profileCustomerId && profileCustomerId !== user?.customerId) {
        const res: any = await SharedUtils().switchCustomer(profileCustomerId);
        await updateSession(res.data.data);
        user = res.data.data.user;
      }
      if (
        profileRoleId &&
        profileRoleId !==
          user?.roles?.find((r: any) => r.name === user?.roleName)?.id &&
        user?.roles?.some((r: any) => r.id === profileRoleId)
      ) {
        const res: any = await SharedUtils().switchRole(profileRoleId);
        await updateSession(res.data.data);
        user = res.data.data.user;
      }
      if (profileWarehouseId && profileWarehouseId !== user?.warehouseId) {
        const res: any =
          await SharedUtils().switchWarehouse(profileWarehouseId);
        await updateSession(res.data.data);
      }
    } catch (error) {
      console.error("Switch profile error", error);
    } finally {
      setSwitching(false);
      setProfileDrawerOpen(false);
      router.push("/");
    }
  };

  // Item disabled → klik di dalam panel tidak menutup dropdown (menu tetap tertahan)
  // tombol Change aktif hanya jika semua field terisi dan ada perubahan
  // dari session aktif (field yang tidak dirender tidak diwajibkan)
  const profileIncomplete =
    (tenantOptions.length > 0 && !profileCustomerId) ||
    !profileRoleId ||
    (profileWarehouseOptions.length > 0 && !profileWarehouseId);
  const profileUnchanged =
    (!tenantOptions.length || profileCustomerId === data?.user?.customerId) &&
    profileRoleId === activeRoleId &&
    (!profileWarehouseOptions.length ||
      profileWarehouseId === data?.user?.warehouseId);

  const profilePanel = (
    <Flex vertical gap={12} style={{ width: "100%" }}>
      {tenantOptions.length > 0 && (
        <Flex vertical gap={4}>
          <Typography.Text variant="muted" fontSize={12}>
            {t("global.header.menu.customer")}
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            placeholder={t("global.header.menu.customer")}
            getPopupContainer={(node) => node.parentElement}
            value={profileCustomerId}
            options={tenantOptions.map((o) => ({
              label: o.name,
              value: o.id,
            }))}
            onChange={(v) => {
              setProfileCustomerId(v);
              setProfileWarehouseId(undefined);
            }}
          />
        </Flex>
      )}
      <Flex vertical gap={4}>
        <Typography.Text variant="muted" fontSize={12}>
          {t("global.header.menu.role")}
        </Typography.Text>
        <Select
          style={{ width: "100%" }}
          placeholder={t("global.header.menu.role")}
          getPopupContainer={(node) => node.parentElement}
          value={profileRoleId}
          options={(data?.user?.roles ?? []).map((r: any) => ({
            label: r.name,
            value: r.id,
          }))}
          onChange={(v) => {
            setProfileRoleId(v);
            setProfileWarehouseId(undefined);
          }}
        />
      </Flex>
      {profileWarehouseOptions.length > 0 && (
        <Flex vertical gap={4}>
          <Typography.Text variant="muted" fontSize={12}>
            {t("global.header.menu.warehouse")}
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            placeholder={t("global.header.menu.warehouse")}
            getPopupContainer={(node) => node.parentElement}
            value={profileWarehouseId}
            options={profileWarehouseOptions}
            onChange={setProfileWarehouseId}
          />
        </Flex>
      )}
      <Button
        type="primary"
        block
        loading={switching}
        disabled={switching || profileIncomplete || profileUnchanged}
        onClick={() => handleSwitchProfile().catch(console.error)}
      >
        {t("global.header.menu.change")}
      </Button>
    </Flex>
  );

  // desktop: panel sebagai submenu popup (klik di dalam tidak menutup dropdown)
  const switchProfileChildren: ItemType[] = [
    {
      key: "profile-panel",
      disabled: true,
      style: {
        cursor: "auto",
        color: "rgba(0, 0, 0, 0.88)",
        padding: 12,
        width: 288,
      },
      label: profilePanel,
    },
  ];

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

    // mobile: buka bottom drawer; desktop: submenu panel di kiri item
    ...(xs
      ? [
          {
            key: "switch-profile",
            label: (
              <Space size={14}>{t("global.header.menu.switchProfile")}</Space>
            ),
            icon: <UserSwitchOutlined />,
            onClick: () => setProfileDrawerOpen(true),
          },
        ]
      : [
          {
            key: "switch-profile",
            label: (
              <Space size={14}>{t("global.header.menu.switchProfile")}</Space>
            ),
            icon: <UserSwitchOutlined />,
            children: switchProfileChildren,
          },
        ]),
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
      {/* mobile: form switch profile sebagai bottom sheet */}
      <Drawer
        placement="bottom"
        height="auto"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        title={t("global.header.menu.switchProfile")}
        styles={{
          content: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
        }}
      >
        {profilePanel}
      </Drawer>
    </Layout>
  );
};

export default SharedLayout;
