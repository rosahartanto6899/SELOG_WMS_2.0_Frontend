import Button from "@sera-components/button";
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import StatusTag from "@sera-components/status-tag";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { ExpenseRefundProcessPayload } from "@sera-types/expense-refund.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Flex, Form, FormInstance, Row } from "antd";
import dayjs from "dayjs";
import { includes, isEmpty, isNil, isNumber } from "lodash";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import useGetPermission from "../hooks/useGetPermission";
import styles from "./detail.module.scss";
import useExpenseRefund from "./hooks/useExpenseRefund";

interface IProps {
  formDriver1: FormInstance<any>;
  formDriver2: FormInstance<any>;
  id: string;
}

enum DriverFormStatus {
  COMPLETE = "Completed",
  INCOMPLETE = "Incompleted",
  NOT_YET_TRANSFERRED = "Not yet transferred",
}

const ExpenseDetail = (props: IProps) => {
  const { formDriver1, formDriver2, id } = props;

  const { t } = useTranslation(undefined, {
    keyPrefix: "expenseRefund.detail.shipment",
  });

  const { isUpdate } = useGetPermission("expense-refund");

  const { isApiResponse, sendErrorHandler } = useErrorHandler(
    "/pages/expense-refund/expense-detail",
  );

  const {
    queries: { refundProcess, fetchDetails },
    loading: { loadingRefund, detailsLoading },
    data: { detailsData },
  } = useExpenseRefund();

  const valuesDriver1 = Form.useWatch([], formDriver1);
  const valuesDriver2 = Form.useWatch([], formDriver2);

  const FORM_DRIVER_CONFIG = (isNotYetTransferred: boolean): ChildConfig[] => [
    {
      id: "driverVKVD",
      type: "text",
      name: "vkd",
      label: t("driverVKVD.label"),
      placeholder: t("driverVKVD.placeholder"),
      disabled: true,
    },
    {
      id: "driverName",
      type: "text",
      name: "driverName",
      label: t("driverName.label"),
      placeholder: t("driverName.placeholder"),
      disabled: true,
    },
    {
      id: "umNumber",
      type: "text",
      name: "umNumber",
      label: t("umNumber.label"),
      placeholder: t("umNumber.placeholder"),
      disabled: true,
    },
    {
      id: "refundAmount",
      type: "number",
      name: "refundAmount",
      label: t("refundAmount.label"),
      placeholder: t("refundAmount.placeholder"),
      rules: [{ required: true }],
      prefix: "Rp.",
      disabled: isNotYetTransferred,
    },
    {
      id: "transferredDate",
      type: "date",
      name: "transferredDate",
      format: "YYYY-MM-DD HH:mm",
      label: t("transferredDate.label"),
      placeholder: t("transferredDate.placeholder"),
      rules: [{ required: true }],
      disabled: isNotYetTransferred,
    },
    {
      id: "referenceNumber",
      type: "text",
      name: "referenceNumber",
      label: t("referenceNumber.label"),
      placeholder: t("referenceNumber.placeholder"),
      disabled: isNotYetTransferred,
    },
    // {
    //   id: "transferStatus",
    //   type: "text",
    //   name: "transferStatus",
    //   label: t("transferStatus.label"),
    //   placeholder: t("transferStatus.placeholder"),
    // },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("note.label"),
      placeholder: t("note.placeholder"),
      disabled: isNotYetTransferred,
    },
  ];

  const handleOnFinish = async (formType: "driver1" | "driver2") => {
    let form;
    let driverId;
    if (formType === "driver1") {
      form = formDriver1;
      driverId = detailsData?.driver1?.driverId;
    } else {
      form = formDriver2;
      driverId = detailsData?.driver2?.driverId;
    }
    if (!driverId) return;
    try {
      const validate = await form.validateFields();
      const payload: ExpenseRefundProcessPayload = {
        id,
        refunds: [
          {
            driverId,
            refundAmount: Number(validate.refundAmount),
            transferredDate: dayjs(validate.transferredDate).format(
              "YYYY-MM-DD HH:mm",
            ),
            referenceNumber: validate?.referenceNumber ?? "",
            note: validate?.note,
          },
        ],
      };
      refundProcess(payload, () => {
        MessageHandler().success(t("toast.refunded"));
        fetchDetails({ id });
      });
    } catch (_error: any) {
      const messageHandler = MessageHandler();
      const errorHandler = messageHandler.error({
        content: t("message.default"),
      });
      sendErrorHandler(
        "handleOnFinish",
        36,
        isApiResponse(_error) ? _error : "Validation form not pass",
        errorHandler,
      );
    }
  };

  const handleReset = (formType: "driver1" | "driver2") => {
    const form = formType === "driver1" ? formDriver1 : formDriver2;

    form.resetFields([
      "transferredDate",
      "refundAmount",
      "referenceNumber",
      "note",
    ]);
  };

  useEffect(() => {
    if (id) fetchDetails({ id });
  }, [id]);

  useEffect(() => {
    formDriver1.setFieldsValue({
      ...detailsData?.driver1,
      transferredDate: detailsData?.driver1?.transferredDate
        ? dayjs(detailsData?.driver1?.transferredDate)
        : null,
    });
    if (detailsData?.driver2)
      formDriver2.setFieldsValue({
        ...detailsData?.driver2,
        transferredDate: detailsData?.driver2?.transferredDate
          ? dayjs(detailsData?.driver2?.transferredDate)
          : null,
      });
  }, [detailsData]);

  return (
    <div className={styles["expense-refund-detail-overview-wrapper"]}>
      <div
        className={styles["expense-refund-detail-overview-wrapper__content"]}
      >
        <Row gutter={[12, 32]}>
          <Col span={24}>
            <Card
              title="Driver 1"
              extra={<StatusTag value={detailsData?.driver1?.status} />}
            >
              <RsFormBuilder
                type={"create"}
                layout="vertical"
                name={""}
                form={formDriver1}
                onFinish={() => {}}
                onCancel={() => {}}
                configs={FORM_DRIVER_CONFIG(
                  Boolean(
                    detailsData?.driver1?.status ===
                    DriverFormStatus.NOT_YET_TRANSFERRED,
                  ),
                )}
                isHideFormButton
                loading={detailsLoading}
                // loading={true}
                // disabled={true}
              />
            </Card>
          </Col>
          {isUpdate &&
            !includes(
              [DriverFormStatus.COMPLETE, DriverFormStatus.NOT_YET_TRANSFERRED],
              detailsData?.driver1?.status,
            ) && (
              <Col span={24}>
                <Flex gap={"small"} justify="flex-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => handleOnFinish("driver1")}
                    disabled={
                      loadingRefund ||
                      detailsLoading ||
                      includes(
                        [
                          DriverFormStatus.COMPLETE,
                          DriverFormStatus.NOT_YET_TRANSFERRED,
                        ],
                        detailsData?.driver1?.status,
                      ) ||
                      (isEmpty(valuesDriver1?.refundAmount) &&
                        !isNumber(valuesDriver1?.refundAmount)) ||
                      isEmpty(valuesDriver1?.transferredDate)
                    }
                    loading={loadingRefund}
                  >
                    Submit
                  </Button>
                  <Button
                    disabled={
                      loadingRefund ||
                      includes(
                        [
                          DriverFormStatus.COMPLETE,
                          DriverFormStatus.NOT_YET_TRANSFERRED,
                        ],
                        detailsData?.driver2?.status,
                      )
                    }
                    danger
                    onClick={() => handleReset("driver1")}
                  >
                    Reset
                  </Button>
                </Flex>
              </Col>
            )}

          {!isNil(detailsData?.driver2) && (
            <>
              <Col span={24}>
                <Card
                  title="Driver 2"
                  extra={<StatusTag value={detailsData?.driver2?.status} />}
                >
                  <RsFormBuilder
                    type={"create"}
                    layout="vertical"
                    name={""}
                    form={formDriver2}
                    onFinish={() => {}}
                    onCancel={() => {}}
                    configs={FORM_DRIVER_CONFIG(
                      Boolean(
                        detailsData?.driver2?.status ===
                        DriverFormStatus.NOT_YET_TRANSFERRED,
                      ),
                    )}
                    isHideFormButton
                    loading={detailsLoading}
                    // disabled={true}
                  />
                </Card>
              </Col>
              {isUpdate &&
                !includes(
                  [
                    DriverFormStatus.COMPLETE,
                    DriverFormStatus.NOT_YET_TRANSFERRED,
                  ],
                  detailsData?.driver2?.status,
                ) && (
                  <Col span={24}>
                    <Flex gap={"small"} justify="flex-end">
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => handleOnFinish("driver2")}
                        disabled={
                          loadingRefund ||
                          detailsLoading ||
                          includes(
                            [
                              DriverFormStatus.COMPLETE,
                              DriverFormStatus.NOT_YET_TRANSFERRED,
                            ],
                            detailsData?.driver2?.status,
                          ) ||
                          (isEmpty(valuesDriver2?.refundAmount) &&
                            !isNumber(valuesDriver2?.refundAmount)) ||
                          isEmpty(valuesDriver2?.transferredDate)
                        }
                        loading={loadingRefund}
                      >
                        Submit
                      </Button>
                      <Button
                        disabled={
                          loadingRefund ||
                          includes(
                            [
                              DriverFormStatus.COMPLETE,
                              DriverFormStatus.NOT_YET_TRANSFERRED,
                            ],
                            detailsData?.driver2?.status,
                          )
                        }
                        danger
                        onClick={() => handleReset("driver2")}
                      >
                        Reset
                      </Button>
                    </Flex>
                  </Col>
                )}
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default ExpenseDetail;
