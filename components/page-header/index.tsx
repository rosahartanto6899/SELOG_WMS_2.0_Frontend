import { ArrowLeftOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import styles from "@sera-components/page-header/page-header.module.scss";
import Typography from "@sera-components/typography";
import { ROUTE } from "@sera-utils/constants/routes";
import Utils from "@sera-utils/utils";
import { Breadcrumb, Col, Flex, Row } from "antd";
import { useRouter } from "next/router";

// NOTES
// IsForceBack => Kondisi dimana back harus ke halaman sebelumnya (history - 1)
// IsDirectToURL => Kondisi dimana back button harus ke backURL (tidak melihat history)

type BreadcrumbProps = { title: string; url?: string };

export interface PageHeaderProps {
  Action?: React.ReactNode;
  breadcrumb?: BreadcrumbProps[];
  backUrl?: string;
  title?: string;
  subtitle?: string;
  isForceBack?: boolean;
  isDirectToURL?: boolean;
  withOutBackButton?: boolean;
}

const PageHeader = ({
  Action,
  breadcrumb,
  backUrl,
  title,
  subtitle,
  isForceBack = false,
  isDirectToURL = false,
  withOutBackButton = false,
}: PageHeaderProps) => {
  const router = useRouter();
  return (
    <>
      {breadcrumb && (
        <Breadcrumb
          className={styles["breadcrumb-container"]}
          items={breadcrumb?.map((item: BreadcrumbProps, idx: number) => {
            if (idx === 0 || idx === breadcrumb.length - 1) {
              return { title: item.title };
            }

            return { title: item.title, href: item.url ?? "" };
          })}
        />
      )}

      <Row className={styles["header-container"]} gutter={[16, 4]}>
        {title ? (
          <Col
            xs={24}
            sm={24}
            md={Action ? 6 : 12}
            lg={Action ? 6 : 12}
            xl={Action ? 6 : 12}
          >
            <Flex gap="small" align="center">
              {withOutBackButton ? null : (
                <Button
                  id={`${title} back button`}
                  className={styles["header-button-back"]}
                  type="link"
                  size="middle"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    if (isDirectToURL) router.push(backUrl as string);
                    else if (
                      isForceBack ||
                      (backUrl && backUrl !== ROUTE.DASHBOARD)
                    )
                      Utils().onGoBack(router, backUrl ?? "/");
                    else router.push(ROUTE.DASHBOARD);
                  }}
                />
              )}

              <Row>
                <Col span={24}>
                  <Typography.Title
                    className={styles["header-title"]}
                    level={4}
                  >
                    {title}
                  </Typography.Title>
                </Col>
                <Col span={24}>
                  <Typography.Text>{subtitle}</Typography.Text>
                </Col>
              </Row>
            </Flex>
          </Col>
        ) : null}

        {Action ? (
          <Col
            xs={24}
            sm={24}
            md={{ span: 12, offset: 6 }}
            lg={{ span: 12, offset: 6 }}
            xl={{ span: 12, offset: 6 }}
          >
            {Action}
          </Col>
        ) : null}
      </Row>
    </>
  );
};

export default PageHeader;
