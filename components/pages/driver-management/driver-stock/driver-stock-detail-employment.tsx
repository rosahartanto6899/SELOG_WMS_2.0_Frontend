import Card from "@sera-components/card";
import Input from "@sera-components/input";
import { IDetailsResponseData } from "@sera-types/driver-stock.type";
import { Col, Flex, Form, Row } from "antd";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./driver-stock-detail.module.scss";

const DriverStockDetailEmployment = ({
  loading,
  data,
}: {
  loading: boolean;
  data: IDetailsResponseData;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock.form",
  });
  return (
    <div className={styles["driver-stock-detail-overview-wrapper"]}>
      <div className={styles["driver-stock-detail-overview-wrapper__content"]}>
        <Flex gap={24} vertical>
          <Card title={t("title.employment")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="employeeId"
                  label={t("input.employeeID.label")}
                >
                  <Input
                    placeholder={t("input.employeeID.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="vkvd" label={t("input.vkvd.label")}>
                  <Input
                    placeholder={t("input.vkvd.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="employeeStatus"
                  label={t("input.employeeStatus.label")}
                >
                  <Input
                    placeholder={t("input.employeeStatus.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="driverStatus"
                  label={t("input.driverStatus.label")}
                >
                  <Input
                    placeholder={t("input.driverStatus.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="joinDate" label={t("input.joinDate.label")}>
                  <Input
                    placeholder={t("input.joinDate.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="resignDate"
                  label={t("input.resignDate.label")}
                >
                  <Input
                    placeholder={t("input.resignDate.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="endDate" label={t("input.endContract.label")}>
                  <Input
                    placeholder={t("input.endContract.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="contractStatus"
                  label={t("input.contractStatus.label")}
                >
                  <Input
                    placeholder={t("input.contractStatus.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={t("title.placement")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="branchName"
                  label={t("input.branchAssignment.label")}
                >
                  <Input
                    placeholder={t("input.branchAssignment.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="shipmentType"
                  label={t("input.shipmentType.label")}
                >
                  <Input
                    placeholder={t("input.shipmentType.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="customerName"
                  label={t("input.customerAssignment.label")}
                >
                  <Input
                    placeholder={t("input.customerAssignment.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={t("title.ability")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="abilityUnits"
                  label={t("input.abilityUnit.label")}
                >
                  <Row gutter={[24, 24]} style={{ flexDirection: "column" }}>
                    {isEmpty(data.abilityUnits) ? (
                      <Col>
                        <Input
                          placeholder={t("input.abilityUnit.placeholder")}
                          loading={loading}
                          value={"-"}
                        />
                      </Col>
                    ) : (
                      data.abilityUnits.map((e, idx) => (
                        <Col key={idx}>
                          <Input
                            placeholder={t("input.abilityUnit.placeholder")}
                            loading={loading}
                            value={e}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="abilityAreas"
                  label={t("input.abilityArea.label")}
                >
                  <Row gutter={[24, 24]} style={{ flexDirection: "column" }}>
                    {isEmpty(data.abilityAreas) ? (
                      <Col>
                        <Input
                          placeholder={t("input.abilityArea.placeholder")}
                          loading={loading}
                          value={"-"}
                        />
                      </Col>
                    ) : (
                      data.abilityAreas.map((e, idx) => (
                        <Col key={idx}>
                          <Input
                            placeholder={t("input.abilityArea.placeholder")}
                            loading={loading}
                            value={e}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={t("title.training")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="trainingDate"
                  label={t("input.trainingDate.label")}
                >
                  <Row gutter={[24, 24]} style={{ flexDirection: "column" }}>
                    {isEmpty(data.trainings) ? (
                      <Col>
                        <Input
                          placeholder={t("input.trainingDate.placeholder")}
                          loading={loading}
                          value={"-"}
                        />
                      </Col>
                    ) : (
                      data.trainings.map((e, idx) => (
                        <Col key={idx}>
                          <Input
                            placeholder={t("input.trainingDate.placeholder")}
                            loading={loading}
                            value={e.trainingStartDate}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="trainingName"
                  label={t("input.trainingName.label")}
                >
                  <Row gutter={[24, 24]} style={{ flexDirection: "column" }}>
                    {isEmpty(data.trainings) ? (
                      <Col>
                        <Input
                          placeholder={t("input.trainingName.placeholder")}
                          loading={loading}
                          value={"-"}
                        />
                      </Col>
                    ) : (
                      data.trainings.map((e, idx) => (
                        <Col key={idx}>
                          <Input
                            placeholder={t("input.trainingName.placeholder")}
                            loading={loading}
                            value={e.trainingName}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={t("title.healthCondition")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="mcuDate" label={t("input.mcuDate.label")}>
                  <Input
                    placeholder={t("input.mcuDate.placeholder")}
                    loading={loading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="mcuResult" label={t("input.mcuResult.label")}>
                  <Input
                    placeholder={t("input.mcuResult.placeholder")}
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
)(DriverStockDetailEmployment);
