/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import { DeleteOutlined } from "@sera-components/icons";
import Input from "@sera-components/input";
import { RouteColumns } from "@sera-components/pages/sales-management/booking-order/booking-props-table";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { useAppSelector } from "@sera-redux";
import { RouteJourneyRecord } from "@sera-types/booking-order.type";
import { Col, Divider, Form, Row, Space, TimePicker } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { isEqualWith } from "lodash";
import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "./approval-booking-order.module.scss";

interface BookingOrderBulkProps {
  form: FormInstance;
  disabled: boolean;
  shipmentType?: string;
  type: string;
}

const ApprovalBookingOrderBulk: FC<BookingOrderBulkProps> = ({
  form,
  disabled,
  shipmentType,
  type,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder.form" });
  const IS_RITASE = shipmentType?.toLowerCase() === "ritase";
  const IS_DEDICATED = shipmentType?.toLowerCase() === "dedicated";
  const requiredMessage = "";
  const IS_EDIT = type === "edit";

  const { shipmentDetails, pickUpDate } = Form.useWatch([], form) || {};

  const {
    dropdownCustomerRoutes,
    detailCustomerRoute: { data: detailCustomerRouteData },
  } = useAppSelector((state) => state.customerRoutes) || {};

  const { detailApprovalBooking } = useAppSelector(
    (state) => state.approvalBookingOrder,
  );

  const MAPPED_CUSTOMER_ROUTE = (dropdownCustomerRoutes.data || []).map(
    (v) => ({
      ...v,
      label: v.originalRouteCode,
      value: v.id,
    }),
  );

  const routeColumns = RouteColumns();

  const handleDisabledTime = (index: number) => {
    const shipments = form.getFieldValue(["shipmentDetails"]);
    const currentCustRouteId = form.getFieldValue([
      "shipmentDetails",
      index,
      "customerRouteId",
    ]);

    const isArr = Array.isArray(shipments);

    if (!isArr || !shipments?.length) return {};

    const disabledHours = () => {
      const hours: number[] = [];
      shipments.forEach((shipment, idx) => {
        const pHour = shipment?.pickupHour;
        const custRouteId = shipment?.customerRouteId;
        if (idx !== index && pHour) {
          if (custRouteId === currentCustRouteId) {
            hours.push(dayjs(pHour).hour());
          }
        }
      });

      return hours;
    };

    return {
      disabledHours,
    };
  };

  const getRouteJourney = (): RouteJourneyRecord[] => {
    if (!detailCustomerRouteData.details?.length) return [];
    const data = [...detailCustomerRouteData.details].sort(
      (a, b) => (a?.routeOrder ?? 0) - (b?.routeOrder ?? 0),
    );

    return data.map((v) => ({
      no: v.routeOrder,
      type:
        v.routeActivityType?.toLowerCase() === "loading"
          ? "Origin"
          : "Destination",
      location: v.locationName || "-",
      address: v.locationAddress || "-",
    }));
  };

  const handlePickupHour = (eta: dayjs.Dayjs, time: dayjs.Dayjs) => {
    const hours = time.hour();
    const minutes = time.minute();

    const updatedEta = eta.add(hours, "hour").add(minutes, "minute");

    return updatedEta;
  };

  // calculate estimated time arrived
  useEffect(() => {
    if (!pickUpDate) return;
    if (!shipmentDetails?.length) return;

    const shipments = shipmentDetails as any[];

    const updated = shipments.map((item, idx) => {
      let eta = pickUpDate as dayjs.Dayjs;
      const routeId = shipments?.[idx]?.customerRouteId || "";
      const pickupHour = shipments?.[idx]?.pickupHour as null | dayjs.Dayjs;

      if (pickupHour) {
        eta = handlePickupHour(eta, pickupHour);
      }
      const r = MAPPED_CUSTOMER_ROUTE.find(
        (o) => o.customerRouteId === routeId,
      );

      if (r && r.leadtimeValue != null && r.leadtimeType != null) {
        eta = eta.add(
          r.leadtimeValue,
          r.leadtimeType as unknown as dayjs.ManipulateType,
        );
      }

      return {
        ...item,
        eta: eta.format("DD-MM-YYYY HH:mm"),
      };
    });

    if (!isEqualWith(updated, shipmentDetails)) {
      form.setFieldsValue({ shipmentDetails: updated });
    }
  }, [pickUpDate, shipmentDetails]);

  return (
    <Form form={form} layout="vertical" disabled={disabled} autoComplete="off">
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Form.List name="shipmentDetails">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Form.Item
                      label={name === 0 ? "Detail Order" : ""}
                      required={false}
                      key={key}
                    >
                      <Row>
                        <Col span={24}>
                          <Card
                            key={key}
                            noShadow
                            style={{ border: "1px solid #3A8DDB61" }}
                          >
                            {!disabled && !IS_EDIT && (
                              <button
                                type="button"
                                className={styles["button-delete"]}
                                onClick={() => {
                                  remove(name);
                                }}
                              >
                                <DeleteOutlined color="red" />
                              </button>
                            )}
                            <Row gutter={[16, 16]}>
                              <Col lg={6} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t(
                                    "input.shipmentDetails.customerRouteId.label",
                                  )}
                                  rules={[
                                    {
                                      required: true,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "customerRouteId"]}
                                >
                                  <Select
                                    options={[
                                      {
                                        label:
                                          detailApprovalBooking?.data
                                            ?.routeCode || "-",
                                        value:
                                          detailApprovalBooking?.data
                                            ?.customerRouteId || "-",
                                      },
                                    ]}
                                    optionFilterProp="label"
                                    placeholder={t(
                                      "input.shipmentDetails.customerRouteId.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={4} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={
                                    <p
                                      title={t(
                                        "input.shipmentDetails.pickupHour.label",
                                      )}
                                      className={
                                        styles["custom-label-form-item"]
                                      }
                                    >
                                      {t(
                                        "input.shipmentDetails.pickupHour.label",
                                      )}
                                    </p>
                                  }
                                  rules={[
                                    {
                                      required: true,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "pickupHour"]}
                                >
                                  <TimePicker
                                    disabledTime={() =>
                                      handleDisabledTime(name)
                                    }
                                    inputReadOnly
                                    format="HH:mm"
                                    style={{ borderRadius: 20, width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              {IS_RITASE && (
                                <Col lg={3} md={12} span={24}>
                                  <Form.Item
                                    {...rest}
                                    label={
                                      <p
                                        title={t(
                                          "input.shipmentDetails.qtyUnit.label",
                                        )}
                                        className={
                                          styles["custom-label-form-item"]
                                        }
                                      >
                                        {t(
                                          "input.shipmentDetails.qtyUnit.label",
                                        )}
                                      </p>
                                    }
                                    rules={[
                                      {
                                        required: IS_RITASE,
                                        message: requiredMessage,
                                      },
                                      {
                                        validator: (_, value) => {
                                          if (value) {
                                            if (value < 1) {
                                              return Promise.reject(
                                                t("input.minimumQty"),
                                              );
                                            }

                                            if (value > 100) {
                                              return Promise.reject(
                                                t("input.maximumQtyUnit"),
                                              );
                                            }
                                          }
                                          return Promise.resolve();
                                        },
                                      },
                                    ]}
                                    name={[name, "qtyUnit"]}
                                  >
                                    <Input
                                      type="number"
                                      min={1}
                                      name={t(
                                        "input.shipmentDetails.qtyUnit.label",
                                      )}
                                      placeholder={t(
                                        "input.shipmentDetails.qtyUnit.placeholder",
                                      )}
                                    />
                                  </Form.Item>
                                </Col>
                              )}
                              {IS_DEDICATED && (
                                <Col lg={3} md={12} span={24}>
                                  <Row>
                                    <Col span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={
                                          <p
                                            title={t(
                                              "input.shipmentDetails.qtyDriver.label",
                                            )}
                                            className={
                                              styles["custom-label-form-item"]
                                            }
                                          >
                                            {t(
                                              "input.shipmentDetails.qtyDriver.label",
                                            )}
                                          </p>
                                        }
                                        rules={[
                                          {
                                            required: true,
                                            message: requiredMessage,
                                          },
                                          {
                                            validator: (_, value) => {
                                              if (value) {
                                                if (value > 2) {
                                                  return Promise.reject(
                                                    t("input.maximumQtyDriver"),
                                                  );
                                                }

                                                if (value < 1) {
                                                  return Promise.reject(
                                                    t("input.minimumQty"),
                                                  );
                                                }
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                        name={[name, "qtyDriver"]}
                                      >
                                        <Input
                                          type="number"
                                          name={"qtyDriver"}
                                          min={0}
                                          onChange={(e) => {
                                            const val =
                                              Number(e.target.value) || 0;

                                            if (val > 2) return;

                                            form.resetFields([
                                              [
                                                "shipmentDetails",
                                                name,
                                                "drivers",
                                              ],
                                            ]);

                                            if (!val) return;
                                            form.setFieldValue(
                                              [
                                                "shipmentDetails",
                                                name,
                                                "drivers",
                                              ],
                                              Array.from({
                                                length: val,
                                              }).fill(undefined),
                                            );
                                          }}
                                          placeholder={t(
                                            "input.shipmentDetails.qtyDriver.placeholder",
                                          )}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                              <Col lg={5} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t("input.shipmentDetails.eta.label")}
                                  rules={[
                                    {
                                      required: false,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "eta"]}
                                >
                                  <Input
                                    disabled
                                    name={t("input.shipmentDetails.eta.label")}
                                    placeholder={t(
                                      "input.shipmentDetails.eta.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={6} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t("input.shipmentDetails.notes.label")}
                                  rules={[
                                    {
                                      required: false,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "notes"]}
                                >
                                  <Input
                                    name={t(
                                      "input.shipmentDetails.notes.label",
                                    )}
                                    placeholder={t(
                                      "input.shipmentDetails.notes.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            {/* ADDITIONAL INFORMATION */}
                            {shipmentDetails?.[name]?.customerRouteId && (
                              <>
                                <Divider />
                                <Row gutter={[24, 24]}>
                                  <Col span={24}>
                                    <Table
                                      columns={routeColumns}
                                      title={t("title.summaryRouteLocation")}
                                      scroll={{ x: "max-content" }}
                                      dataSource={getRouteJourney()}
                                      isCustomSearch={false}
                                      showActions={false}
                                    />
                                  </Col>
                                </Row>
                              </>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  {!disabled && !IS_EDIT && (
                    <Space>
                      <Button
                        type="dashed"
                        disabled={shipmentDetails?.length >= 10}
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        {t("button.addRow")}
                      </Button>
                    </Space>
                  )}
                </>
              );
            }}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
};

export default ApprovalBookingOrderBulk;
