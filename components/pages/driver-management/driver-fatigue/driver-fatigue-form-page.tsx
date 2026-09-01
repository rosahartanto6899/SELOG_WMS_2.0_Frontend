import Card from "@sera-components/card";
import Table from "@sera-components/table";
import {
  IFatigueDetailsResponseQuestion,
  IFatiguePayloadHealthCheck,
} from "@sera-types/driver-fatigue.type";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Button, Col, FormInstance, Radio, Row, Typography } from "antd";
import dayjs from "dayjs";
import { cloneDeep, isEmpty, isNil } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ColumnDeclaration,
  ColumnHealth,
  LOCAL_DECLARATION_QUESTIONS,
} from "./driver-fatigue-props-table";
import FatigueStatus, { TStatusType } from "./FatigueStatus";
import useDriverFatigue from "./hooks/useDriverFatigue";

interface IProps {
  type: "detail" | "update";
  date: string;
  driverName: string;
  form: FormInstance<any>;
  onSubmit: () => void;
  id: string;
}

const DriverFatigueFormPage = (props: IProps) => {
  const { type, date, id } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverFatigue.form",
  });

  const [healthResult, setHealthResult] = useState<TStatusType | string | null>(
    "Fit",
  );

  const isMobile = useIsMobileView();

  const {
    queries: { fetchFatigueById },
    data: { fatigueDetails },
    mutations: { createHealthCheck },
    loading: { loadingFatigueList, loadingDetails },
    events: { goBack },
  } = useDriverFatigue();

  const [dataSourceHealthCheck, setDataSourceHealthCheck] = useState<
    IFatigueDetailsResponseQuestion[]
  >([]);

  const onCancel = () => goBack();

  const handleSubmit = () => {
    if (type === "detail" || !healthResult || !fatigueDetails?.driverId) return;

    const payload: IFatiguePayloadHealthCheck = {
      driverId: fatigueDetails?.driverId,
      healthResult,
      note: fatigueDetails.note ?? "",
      details: dataSourceHealthCheck.map((e) => ({
        answer: Boolean(e.answer),
        healthAssessmentQuestionId: e.id,
      })),
    };
    createHealthCheck(payload, fatigueDetails?.driverName ?? "-");
  };

  const handleChange = (
    value: boolean | null,
    record: IFatigueDetailsResponseQuestion,
  ) => {
    const tempDataSource: IFatigueDetailsResponseQuestion[] = cloneDeep(
      dataSourceHealthCheck,
    );

    const idx = tempDataSource.findIndex((e) => e.id === record.id);

    tempDataSource[idx].answer = Boolean(value);

    setDataSourceHealthCheck(tempDataSource);
  };

  useEffect(() => {
    if (id) fetchFatigueById(id);
  }, [id]);

  useEffect(() => {
    if (fatigueDetails) {
      setHealthResult(fatigueDetails.healthResult);
      setDataSourceHealthCheck(
        fatigueDetails?.questions
          .filter((data) => data.category === "Health Check")
          .map((e, idx) => ({ ...e, no: idx + 1 })),
      );
    }
  }, [fatigueDetails]);

  return (
    <Card
      {...(type === "detail" ? { title: t("title.detail") } : {})}
      {...(type === "update" ? { title: t("title.update") } : {})}
    >
      <Row style={{ flexDirection: "column" }} gutter={[16, 24]}>
        <Card>
          <Row gutter={[12, 12]}>
            <>
              <Col span={24}>
                <Row justify="space-between">
                  <Col>
                    <Typography.Title level={5}>
                      {t("driverDeclaration")}
                    </Typography.Title>
                  </Col>
                  <Col>
                    {`${t("declarationDate")}`} :{" "}
                    <span
                      style={{ fontWeight: "bold" }}
                    >{`${fatigueDetails?.declaration.filledAt ? dayjs(fatigueDetails?.declaration.filledAt).format("DD-MM-YYYY HH:mm") : date}`}</span>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Table
                  bordered={false}
                  dataSource={LOCAL_DECLARATION_QUESTIONS.map((e, idx) => ({
                    question: e.text,
                    no: idx + 1,
                    isStatement: Boolean(e?.isStatement),
                    fontWeight: e.fontWeight,
                  }))}
                  columns={ColumnDeclaration()}
                  showTitle={false}
                  showActions={false}
                  loading={loadingDetails}
                />
              </Col>
              {type === "update" && (
                <Col span={24}>
                  <Card
                    style={{ border: "none", boxShadow: "none" }}
                    loading={loadingDetails}
                  >
                    {fatigueDetails?.questions
                      .filter((data) => data.category === "Driver Declaration")
                      .map((e, idx) => (
                        <Row key={idx} align={"middle"}>
                          <Col span={18}>
                            <p
                              style={{
                                textAlign: "justify",
                                fontWeight: "bold",
                              }}
                            >
                              {e.question}
                            </p>
                          </Col>
                          <Col
                            span={6}
                            style={{
                              pointerEvents: "none",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Radio.Group
                              size="small"
                              defaultValue={Boolean(e.answer)}
                              buttonStyle="solid"
                            >
                              <Radio.Button value={true}>Yes</Radio.Button>
                              <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              )}
            </>

            <Col style={{ width: "100%" }}>
              <Row
                gutter={[12, 12]}
                style={{ alignItems: "center", width: "100%" }}
              >
                <Col xs={24} lg={3}>
                  <Typography.Title level={5}>
                    {t("healthResult")}
                  </Typography.Title>
                </Col>
                <Col xs={24} lg={20} style={{ marginLeft: 10 }}>
                  <FatigueStatus
                    width={120}
                    value={
                      Boolean(
                        fatigueDetails?.questions?.find(
                          (e) => e.category === "Driver Declaration",
                        )?.answer,
                      )
                        ? "Fit"
                        : "Unfit"
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card>
          <Row gutter={[12, 12]}>
            <>
              <Col span={24}>
                <Row justify="space-between">
                  <Col>
                    <Typography.Title level={5}>
                      {t("healthCheck")}
                    </Typography.Title>
                  </Col>
                  {type === "detail" && (
                    <Col>
                      {`${t("lastHealthCheck")}`} :{" "}
                      <span
                        style={{ fontWeight: "bold" }}
                      >{`${fatigueDetails?.healthCheck.filledAt ? dayjs(fatigueDetails?.healthCheck.filledAt).format("DD-MM-YYYY HH:mm") : date}`}</span>
                    </Col>
                  )}
                </Row>
              </Col>

              <Col span={24}>
                <Table
                  bordered={false}
                  dataSource={dataSourceHealthCheck ?? []}
                  columns={ColumnHealth(type === "update", handleChange)}
                  showTitle={false}
                  showActions={false}
                  loading={loadingDetails}
                />
              </Col>
            </>

            <Col style={{ width: "100%" }}>
              <Row justify="center" gutter={[12, 12]}>
                <Col span={type === "update" ? 18 : 24}>
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={5}
                      xl={4}
                      lg={type === "detail" ? 5 : 5}
                    >
                      <Typography.Title level={5}>
                        {t("healthResult")}
                      </Typography.Title>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={type === "detail" ? 10 : 12}
                      xl={12}
                      style={{
                        pointerEvents: type === "detail" ? "none" : "auto",
                      }}
                    >
                      <Radio.Group
                        value={healthResult}
                        buttonStyle="solid"
                        size={isMobile ? "small" : "middle"}
                        {...(type === "update" && {
                          onChange: (e) => setHealthResult(e.target.value),
                        })}
                      >
                        <Radio.Button value="Fit">Fit</Radio.Button>
                        {/* <Radio.Button value="Fit With Note">
                          Fit With Note
                        </Radio.Button> */}
                        <Radio.Button value="Unfit">Unfit</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Col>

                {type === "update" && (
                  <Col xs={24} lg={6}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} lg={12}>
                        <Button
                          type="primary"
                          style={{ width: "100%" }}
                          onClick={handleSubmit}
                          loading={loadingFatigueList}
                          disabled={
                            loadingFatigueList ||
                            isNil(healthResult) ||
                            isEmpty(healthResult)
                          }
                        >
                          Submit
                        </Button>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Button
                          disabled={loadingFatigueList}
                          style={{ width: "100%" }}
                          onClick={onCancel}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Card>
      </Row>
    </Card>
  );
};

export default DriverFatigueFormPage;
