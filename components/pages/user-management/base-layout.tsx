import { ArrowLeftOutlined } from "@ant-design/icons";
import Typography from "@sera-components/typography";
import Utils from "@sera-utils/utils";
import { Button, Col, Flex, Row } from "antd";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import styles from "./base-layout.module.scss";
import LocationBreadcumb from "./location-breadcrumb";

interface LayoutProps {
  children: ReactNode;
  locationUrlList: {
    title: string;
    href?: string;
  }[];
  titlePage: string;
  backUrl?: string;
  isActionHeader?: boolean;
  actionHeader?: ReactNode;
}

const Layout = ({
  children,
  locationUrlList,
  titlePage,
  backUrl = "/",
  isActionHeader = false,
  actionHeader = <div />,
}: LayoutProps) => {
  const router = useRouter();

  return (
    <>
      {/* Breadcrumbs */}
      <LocationBreadcumb locationUrlList={locationUrlList} />

      {/* {Page Header} */}
      <Row className={styles["header-container"]}>
        <Col span={isActionHeader ? 6 : 12}>
          <Flex gap="small" align="center">
            <Button
              id={`${titlePage} back button`}
              className={styles["header-button-back"]}
              type="link"
              size="middle"
              icon={<ArrowLeftOutlined />}
              onClick={() => Utils().onGoBack(router, backUrl)}
            />

            <Typography.Title className={styles["header-title"]} level={4}>
              {titlePage}
            </Typography.Title>
          </Flex>
        </Col>

        {isActionHeader ? (
          <Col span={12} offset={6}>
            {actionHeader}
          </Col>
        ) : null}
      </Row>

      {children}
    </>
  );
};

export default Layout;
