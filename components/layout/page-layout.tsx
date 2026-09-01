import Card from "@sera-components/card";
import LoadingPage from "@sera-components/loading/loading-page";
import PageHeader, { PageHeaderProps } from "@sera-components/page-header";
import useGetSubmenus from "@sera-utils/hooks/useGetSubmenus";
import { Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

import styles from "./page-layout.module.scss";

export interface PageLayoutProps extends PageHeaderProps {
  content?: ReactNode;
  withTab?: boolean;
  noPadding?: boolean;
}

const PageLayout = ({
  withTab = true,
  content,
  noPadding = false,
  ...args
}: PageLayoutProps) => {
  const router = useRouter();
  const basePath = "/" + router.pathname.split("/")[1];

  const { loading, menu } = useGetSubmenus(basePath, !withTab);

  const [currentMenu, setCurrentMenu] = useState(router.pathname);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentMenu(e.key);
    router.push(e.key);
  };

  if (loading) return <LoadingPage />;

  return (
    <div className={styles["sera-page"]}>
      <PageHeader {...args} />

      <div
        id="sera-page-content"
        className={`${styles["sera-page__content"]} ${
          noPadding ? "sera-page__content--no-padding" : ""
        }`}
      >
        {menu.length ? (
          <>
            <Menu
              className="submenu-page"
              mode="horizontal"
              items={menu}
              selectedKeys={[currentMenu]}
              onClick={onClick}
            />

            <Card.Container
              bordered={false}
              className={styles["card-container-with-menu"]}
              styles={noPadding ? { body: { padding: 0 } } : undefined}
            >
              {content}
            </Card.Container>
          </>
        ) : (
          <>{content}</>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
