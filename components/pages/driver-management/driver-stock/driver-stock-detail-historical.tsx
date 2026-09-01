import Input from "@sera-components/input";
import { Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./driver-stock-detail.module.scss";

const DriverStockDetailHistorical = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.form",
  });
  return (
    <div className={styles["driver-stock-detail-overview-wrapper"]}>
      <div className={styles["driver-stock-detail-overview-wrapper__content"]}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="lastPreTripDate"
              label={t("input.lastPreTripDate.label")}
            >
              <Input
                placeholder={t("input.lastPreTripDate.placeholder")}
                loading={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="lastPreTripResult"
              label={t("input.lastPreTripResult.label")}
            >
              <Input
                placeholder={t("input.lastPreTripResult.placeholder")}
                loading={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="lastLocation"
              label={t("input.lastLocation.label")}
            >
              <Input
                placeholder={t("input.lastLocation.placeholder")}
                loading={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fatigueStatus"
              label={t("input.fatigueStatus.label")}
            >
              <Input
                placeholder={t("input.fatigueStatus.placeholder")}
                loading={loading}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverStockDetailHistorical);
