import Card from "@sera-components/card";
import Input from "@sera-components/input";
import { Col, Flex, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./driver-stock-detail.module.scss";

const DriverStockDetailDocument = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.form",
  });
  return (
    <div className={styles["driver-stock-detail-overview-wrapper"]}>
      <div className={styles["driver-stock-detail-overview-wrapper__content"]}>
        <Flex gap={24} vertical>
          <Card title={t("title.driverLicense")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="licenseType"
                  label={t("input.licenseType.label")}
                >
                  <Input
                    placeholder={t("input.licenseType.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="licenseNumber"
                  label={t("input.licenseNumber.label")}
                >
                  <Input
                    placeholder={t("input.licenseNumber.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="licenseExpired"
                  label={t("input.licenseExpiredDate.label")}
                >
                  <Input
                    placeholder={t("input.licenseExpiredDate.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="licenseStatus"
                  label={t("input.licenseStatus.label")}
                >
                  <Input
                    placeholder={t("input.licenseStatus.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={t("title.financialData")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="bankAccount"
                  label={t("input.bankAccount.label")}
                >
                  <Input
                    placeholder={t("input.bankAccount.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="bankName" label={t("input.bankName.label")}>
                  <Input placeholder={t("input.bankName.placeholder")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="bankAccountHolder"
                  label={t("input.bankAccountHolder.label")}
                >
                  <Input
                    placeholder={t("input.bankAccountHolder.placeholder")}
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
)(DriverStockDetailDocument);
