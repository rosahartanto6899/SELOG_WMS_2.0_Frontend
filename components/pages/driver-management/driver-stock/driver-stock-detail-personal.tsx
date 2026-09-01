import Card from "@sera-components/card";
import Input from "@sera-components/input";
import { Col, Flex, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./driver-stock-detail.module.scss";

const DriverStockDetailPersonal = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.form",
  });
  return (
    <div className={styles["driver-stock-detail-overview-wrapper"]}>
      <div className={styles["driver-stock-detail-overview-wrapper__content"]}>
        <Flex gap={24} vertical>
          <Card title={t("title.basicData")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="name" label={t("input.name.label")}>
                  <Input
                    placeholder={t("input.name.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="citizenIdAddress"
                  label={t("input.citizenIdAddress.label")}
                >
                  <Input
                    placeholder={t("input.citizenIdAddress.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="birthPlace"
                  label={t("input.birthPlace.label")}
                >
                  <Input
                    placeholder={t("input.birthPlace.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="age" label={t("input.age.label")}>
                  <Input
                    placeholder={t("input.age.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="note" label={t("input.note.label")}>
                  <Input
                    placeholder={t("input.note.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={t("title.contactInformation")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="mobilePhone"
                  label={t("input.mobilePhone.label")}
                >
                  <Input
                    placeholder={t("input.mobilePhone.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="email" label={t("input.email.label")}>
                  <Input
                    placeholder={t("input.email.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Flex>
      </div>
    </div>
  );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverStockDetailPersonal);
