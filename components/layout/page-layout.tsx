import Card from "@sera-components/card";
import PageHeader, { PageHeaderProps } from "@sera-components/page-header";
import { ReactNode } from "react";

import styles from "./page-layout.module.scss";

export interface PageLayoutProps extends PageHeaderProps {
  content?: ReactNode;
  /** Wraps content in a card container. Submenu tabs were moved to the sidebar. */
  withTab?: boolean;
  noPadding?: boolean;
}

const PageLayout = ({
  withTab = true,
  content,
  noPadding = false,
  ...args
}: PageLayoutProps) => {
  return (
    <div className={styles["sera-page"]}>
      <PageHeader {...args} />

      <div
        id="sera-page-content"
        className={`${styles["sera-page__content"]} ${
          noPadding ? "sera-page__content--no-padding" : ""
        }`}
      >
        {withTab ? (
          <Card.Container
            bordered={false}
            className={styles["card-container"]}
            styles={noPadding ? { body: { padding: 0 } } : undefined}
          >
            {content}
          </Card.Container>
        ) : (
          <>{content}</>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
