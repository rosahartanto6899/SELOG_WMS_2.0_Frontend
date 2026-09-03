/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CaretDownOutlined,
  // GlobalOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
// import NotificationList from "@sera-components/notification-list";
import Typography from "@sera-components/typography";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Grid,
  Layout as AntdLayout,
  Menu,
  Space,
} from "antd";
import { ItemType } from "antd/lib/menu/interface";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import styles from "./layout.module.scss";
import { VisibilityContext } from "./layout-context";

const { Content, Header, Sider } = AntdLayout;

function getItem(
  label: string,
  key: string,
  icon?: JSX.Element,
  children?: any,
): any {
  return {
    key,
    icon,
    children,
    label,
  };
}

interface LayoutProps {
  children: React.ReactNode;
  siderMenuData?: ItemType[];
  selectedKeys: string[];
  sideMenuItemClick?: (val: any) => void;
  defaultOpenKeys: string[];
  headerMenu?: ItemType[];
  // roleMenu?: ItemType[];
  user?: any;
  selectedCustomerName?: string;
}

const { useBreakpoint } = Grid;

const Layout = (props: LayoutProps) => {
  // const [lang, setLang] = useState<string>(localStorage.getItem("i18nextLng")!);
  const router = useRouter();
  const { xs } = useBreakpoint();

  const [collapsed, setCollapsed] = useState(false);
  // const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>();
  const {
    siderMenuData,
    defaultOpenKeys,
    selectedKeys,
    sideMenuItemClick,
    headerMenu,
    user,
    selectedCustomerName,
    children,
  } = props;

  useEffect(() => {
    setLastUpdate(moment());
  }, [selectedKeys, defaultOpenKeys]);

  const sideMenu =
    siderMenuData
      ?.filter((_e: any) => (_e.hidden || false) === false)
      ?.map((_e: any) => {
        const _children = _e?.children
          ?.filter((_f: any) => (_f.hidden || false) === false)
          .map((_ee: any) => getItem(_ee.label, _ee.key, _ee.icon));
        return getItem(_e.label, _e.key, _e.icon, _children);
      }) || [];

  let childrenList = [];

  if (siderMenuData) {
    childrenList = siderMenuData
      .map((_e: any) => _e.children)
      .filter((_e) => _e !== undefined);
  }

  let parentList = [];

  if (siderMenuData) {
    parentList = siderMenuData.map((_e: any) => {
      const newE = { ..._e };
      if (newE.children) delete newE.children;
      return newE;
    });
  }

  const menuDirectory = [].concat(...childrenList).concat(...parentList);

  const onMenuChange = (params: any) => {
    const menuItem = menuDirectory.find((_e: any) => _e.key === params.key);
    if (sideMenuItemClick) sideMenuItemClick({ ...params, menuItem });
  };

  // const translationMenu = [
  //   {
  //     key: "id",
  //     label: "ID",
  //     onClick: () => {
  //       router.replace(router.asPath, router.asPath, { locale: "id" });
  //       setLang("id");
  //       localStorage.setItem("i18nextLng", "id");
  //     },
  //   },
  //   {
  //     key: "en",
  //     label: "EN",
  //     onClick: () => {
  //       router.replace(router.asPath, router.asPath, { locale: "en" });
  //       setLang("en");
  //       localStorage.setItem("i18nextLng", "en");
  //     },
  //   },
  // ];

  // const collapsedIcon: JSX.Element | null = collapsed ? <CaretDownOutlined /> : null;
  const { isHidden } = useContext(VisibilityContext);

  // useEffect(() => {
  //   setLang(router.locale as string);
  // }, [router]);

  return (
    <AntdLayout className={styles["layout-container"]}>
      {!isHidden && (
        <Sider
          width={256}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
        >
          <main className={styles["sider-container"]}>
            <div className={styles["header-wrapper"]}>
              <div className={styles["image-wrapper"]}>
                <Image
                  id="sera-header-logo"
                  src="/images/logo-white.svg"
                  alt="SELOG"
                  style={{ objectFit: "contain" }}
                  fill
                  priority
                  sizes="206px"
                />
              </div>
            </div>

            <div className={styles["body-wrapper"]}>
              {lastUpdate ? (
                <Menu
                  className={styles["sider-menu"]}
                  defaultOpenKeys={defaultOpenKeys}
                  theme="light"
                  defaultSelectedKeys={selectedKeys}
                  mode="inline"
                  items={sideMenu}
                  onClick={(_e: any) => {
                    onMenuChange({ ..._e });
                  }}
                  selectedKeys={selectedKeys}
                />
              ) : null}
            </div>

            <div className={styles["footer-wrapper"]}>
              <Button
                id="button-collapse"
                className={styles["footer-button"]}
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <div
                  className={
                    collapsed
                      ? styles["footer-button-collapsed"]
                      : styles["footer-button-expanded"]
                  }
                >
                  {collapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
                </div>
              </Button>
            </div>
          </main>
        </Sider>
      )}

      {/* <Moble Wrapper and Navbar /> */}
      {/* {!isHidden && (
        <div className={styles['mobile-wrapper-container']}>
          <div className="mobile-navbar-wrapper">
            {mobileCollapsed ? (
              <CloseOutlined
                className="mobile-navbar-items"
                onClick={() => {
                  setMobileCollapsed(!mobileCollapsed);
                }}
              />
            ) : (
              <MenuOutlined
                className="mobile-navbar-items"
                onClick={() => {
                  setMobileCollapsed(!mobileCollapsed);
                }}
              />
            )}
          </div>
        </div>
      )} */}

      {/* {!isHidden && (
        <div className={styles['mobile-wrapper-logo']}>
          <div className="mobile-logo-wrapper">
            <div className="mobile-logo">
              <Image src="/images/logo.svg" alt="SELOG" fill priority id="sera-header-mobile-logo" />
            </div>
          </div>
        </div>
      )} */}

      {/* {!isHidden && (
        <Drawer
          className="sera-drawer-mobile-menu"
          closable={false}
          placement="left"
          open={mobileCollapsed}
          onClose={() => setMobileCollapsed(false)}
        >
          {lastUpdate ? (
            <Menu
              expandIcon={collapsedIcon}
              className={styles['side-bar-menu']}
              defaultOpenKeys={defaultOpenKeys}
              theme="light"
              defaultSelectedKeys={selectedKeys}
              mode="inline"
              items={sideMenu}
              onClick={(_e: any) => {
                onMenuChange({ ..._e });
                setMobileCollapsed(false);
              }}
              selectedKeys={selectedKeys}
            />
          ) : null}
        </Drawer>
      )} */}

      {/* <Layout /> */}
      <AntdLayout>
        {!isHidden && (
          <Header className={styles["header-container"]}>
            <div className={styles["navbar-wrapper"]}>
              {/* {!xs ? (
                <Dropdown
                  className={styles["navbar-dropdown"]}
                  menu={{ items: translationMenu }}
                >
                  <Space>
                    <Typography.Text variant="light" fontSize={16}>
                      {lang?.toUpperCase()}
                    </Typography.Text>
                    <GlobalOutlined
                      className={styles["navbar-dropdown-icon"]}
                    />
                  </Space>
                </Dropdown>
              ) : null} */}
              {/* <NotificationList /> */}

              {selectedCustomerName ? (
                <div className={styles["navbar-customer"]}>
                  <Typography.Text
                    variant="light"
                    fontSize={13}
                    fontWeight={500}
                  >
                    {selectedCustomerName}
                  </Typography.Text>
                </div>
              ) : null}

              <Dropdown
                className={styles["navbar-dropdown"]}
                menu={{ items: headerMenu }}
              >
                <Link
                  id="user"
                  href="#user"
                  onClick={(e) => e.preventDefault()}
                  passHref
                >
                  <Space>
                    <Avatar
                      src="/avatar.png"
                      className={styles["navbar-avatar"]}
                    />
                    {!xs ? (
                      <Flex vertical>
                        <Typography.Text
                          variant="light"
                          fontSize={14}
                          fontWeight={500}
                        >
                          {user?.name}
                        </Typography.Text>
                        <Typography.Text variant="light" fontSize={12}>
                          {user?.roleName}
                        </Typography.Text>
                      </Flex>
                    ) : null}
                    <CaretDownOutlined
                      className={styles["navbar-dropdown-icon"]}
                    />
                  </Space>
                </Link>
              </Dropdown>
            </div>
          </Header>
        )}

        <Content
          className={
            router.pathname === "/"
              ? styles["report-content-container"]
              : styles["content-container"]
          }
        >
          {children}
        </Content>
        <div id="cta-container" />
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
