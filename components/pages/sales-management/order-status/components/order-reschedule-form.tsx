import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  bookingOrderActions,
  customerRouteActions,
  orderStatusActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import {
  bookingOrderTypes,
  RouteJourneyRecord,
} from "@sera-types/booking-order.type";
import {
  orderStatusTypes,
  ShipmentRouteDetail,
} from "@sera-types/order-status.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Divider, Flex, Form, Grid, Row, Space } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "../order-status.module.scss";
import { ColumnRoute } from "../order-status-props-table";

const OrderReshceduleForm = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.editForm",
  });

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const rescheduleForm = Form.useWatch([], form);
  const router = useRouter();

  const id = router.query.id as string;

  const [summaryRouteData, setSummaryRoute] = useState<RouteJourneyRecord[]>(
    [],
  );

  const requiredMessage = t("message");

  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );

  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );

  const {
    detail: { data: orderStatusDetail },
  } = useAppSelector((state) => state.orderStatus);

  const shipmentRescheduleForm = {
    customerName: orderStatusDetail?.shipment?.customerName,
    shipmentNumber: orderStatusDetail?.shipment?.shipmentNo,
    shipmentType: orderStatusDetail?.shipment?.shipmentType,
    additionalRequest: (
      orderStatusDetail?.shipment?.additionalRequests ?? []
    )?.map((v) => v.id),
    driver1: orderStatusDetail?.shipment?.driverName1,
    driver2: orderStatusDetail?.shipment?.driverName2,
    eta: undefined,
    licensePlate: orderStatusDetail?.shipment?.licensePlate || "-",
    newEta: undefined,
    newPickupDate: undefined,
    notes: orderStatusDetail?.shipment?.shipmentDetail?.notes,
    pickupDate: orderStatusDetail?.shipment?.pickUpDate || "",
    qtyDriver: orderStatusDetail?.shipment?.qtyDriver || 0,
    reason: undefined,
    routeCode:
      orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId || "-",
    salesDealing: orderStatusDetail?.shipment?.salesDealing || "-",
    salesServicing: orderStatusDetail?.shipment?.salesServicing || "-",
  };

  const loading = useAppSelector((state) => state.loading);

  const FORM_ORDER_CONFIG: ChildConfig[] = [
    {
      id: "shipmentNumber",
      type: "text",
      name: "shipmentNumber",
      label: t("input.shipmentNumber.label"),
      placeholder: t("input.shipmentNumber.placeholder"),
      disabled: true,
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      disabled: true,
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      disabled: true,
    },
    {
      id: "pickupDate",
      type: "text",
      name: "pickupDate",
      label: t("input.pickupDate.label"),
      placeholder: t("input.pickupDate.placeholder"),
      disabled: true,
    },
    {
      id: "salesDealing",
      type: "text",
      name: "salesDealing",
      label: t("input.salesDealing.label"),
      placeholder: t("input.salesDealing.placeholder"),
      disabled: true,
    },
    {
      id: "salesServicing",
      type: "select",
      name: "salesServicing",
      label: t("input.salesServicing.label"),
      placeholder: t("input.salesServicing.placeholder"),
      disabled: true,
    },
    {
      id: "additionalRequest",
      type: "checkbox",
      name: "additionalRequest",
      label: t("input.additionalRequest.label"),
      placeholder: t("input.additionalRequest.placeholder"),
      columns: { xs: 12, xl: 8 },
      options: dropdownAdditionalRequestItems.data.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
        // disabled: detailCustomer?.data?.additionalRequests?.includes(_item.id),
      })),
      disabled: true,
      loading: loading[bookingOrderTypes.GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS],
      dependency: {
        fields: [],
      },
    },
  ];

  const FORM_ROUTE_CONFIG = [
    {
      id: "routeCode",
      type: "select",
      name: "routeCode",
      label: t("input.routeCode.label"),
      placeholder: t("input.routeCode.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
      options: dropdownCustomerRoutes.data.map((v) => ({
        label: v.originalRouteCode,
        value: v.customerRouteId,
      })),
    },
    {
      id: "qtyDriver",
      type: "text",
      name: "qtyDriver",
      label: t("input.qtyDriver.label"),
      placeholder: t("input.qtyDriver.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "eta",
      type: "text",
      name: "eta",
      label: t("input.eta.label"),
      placeholder: t("input.eta.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "notes",
      type: "text",
      name: "notes",
      label: t("input.notes.label"),
      placeholder: t("input.notes.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
  ] as ChildConfig[];

  const FORM_NEW_PICKUP_DATE = [
    {
      id: "newPickupDate",
      type: "date",
      name: "newPickupDate",
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().add(5, "year").format("YYYY-MM-DD"),
      label: t("input.pickupDate.label"),
      placeholder: t("input.pickupDate.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
      format: "YYYY-MM-DD HH:mm",
    },
    {
      id: "newEta",
      type: "text",
      name: "newEta",
      label: t("input.eta.label"),
      placeholder: t("input.eta.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "note",
      type: "textarea",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      mdSize: 24,
      dependency: {
        fields: [],
      },
    },
  ] as ChildConfig[];

  const handleSubmit = async () => {
    const value = await form.validateFields();

    const callback = () => {
      MessageHandler().success(t("rescheduleSuccess"));
      router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS);
      dispatch(orderStatusActions.updateRescheduleOrderStatusClear());
    };

    dispatch(
      orderStatusActions.updateRescheduleOrderStatusFetch({
        reason: value?.note ?? "",
        pickupDate: dayjs(value?.newPickupDate).format("YYYY-MM-DD HH:mm"),
        shipmentId: id,
        callback,
      }),
    );
  };

  const getRouteLocation = (
    routeLoc?: ShipmentRouteDetail["routeLocations"],
  ): RouteJourneyRecord[] => {
    if (!routeLoc?.length) return [];
    return routeLoc?.map((v) => ({
      no: v.routeOrder,
      type:
        v.routeActivityType.toLowerCase() === "loading"
          ? "Origin"
          : "Destination",
      location: v?.locationName ?? "-",
      address: v?.address ?? "",
    }));
  };

  useEffect(() => {
    if (isEmpty(orderStatusDetail)) return;
    const { leadtimeType, leadtimeValue } =
      dropdownCustomerRoutes.data.find(
        (o) => o.customerRouteId === shipmentRescheduleForm.routeCode,
      ) || {};
    let _eta = dayjs(
      shipmentRescheduleForm.pickupDate ?? "",
      "YYYY-MM-DD HH:mm",
    );

    if (leadtimeValue && leadtimeType) {
      _eta = _eta.add(
        leadtimeValue,
        leadtimeType as unknown as dayjs.ManipulateType,
      );
    }
    form.setFieldsValue({
      ...shipmentRescheduleForm,
      eta: _eta.isValid() ? _eta.format("YYYY-MM-DD HH:mm") : undefined,
    });
  }, [orderStatusDetail, dropdownCustomerRoutes?.data]);

  useEffect(() => {
    if (isEmpty(orderStatusDetail)) return;
    setSummaryRoute(
      getRouteLocation(
        orderStatusDetail?.shipment?.shipmentDetail?.routeLocations,
      ),
    );

    return () => {
      setSummaryRoute([]);
    };
  }, [orderStatusDetail]);

  useEffect(() => {
    if (rescheduleForm?.newPickupDate) {
      const { leadtimeType, leadtimeValue } =
        dropdownCustomerRoutes.data.find(
          (o) => o.customerRouteId === shipmentRescheduleForm?.routeCode,
        ) || {};
      let _eta = rescheduleForm?.newPickupDate as dayjs.Dayjs;

      if (leadtimeValue && leadtimeType) {
        _eta = _eta.add(
          leadtimeValue,
          leadtimeType as unknown as dayjs.ManipulateType,
        );
      }
      form.setFieldsValue({
        newEta: _eta.format("YYYY-MM-DD HH:mm"),
      });
    }

    return () => {
      form.resetFields(["newEta"]);
    };
  }, [rescheduleForm?.newPickupDate]);

  useEffect(() => {
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());
    const params = {
      limit: 1000,
      page: 1,
      customerId: undefined, // get if exist
    };

    dispatch(customerRouteActions.getDropdownCustomerRoutesFetch(params));
    return () => {
      dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsClear());
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
    };
  }, []);

  const { sm } = Grid.useBreakpoint();

  return (
    <>
      <RsFormBuilder
        name="form-reroute"
        type={"create"}
        layout="vertical"
        form={form}
        configs={FORM_ORDER_CONFIG}
        onFinish={() => {}}
        onCancel={() => {}}
        isHideFormButton
      />

      <Flex vertical gap={32}>
        <Card noShadow className={styles["card-container"]}>
          <RsFormBuilder
            name="form-prev-route"
            type={"create"}
            layout="vertical"
            form={form}
            configs={FORM_ROUTE_CONFIG}
            onFinish={(v) => console.log(v)}
            isHideFormButton
          />

          {sm ? (
            <Divider orientation="left" orientationMargin={0}>
              {t("summaryRouteLocation.table.title")}
            </Divider>
          ) : (
            <strong>
              <p style={{ textAlign: "center" }}>
                {t("summaryRouteLocation.table.title")}
              </p>
            </strong>
          )}
          <Row gutter={[16, 16]}>
            <Col lg={12} span={24}>
              <Table
                showTitle={false}
                columns={ColumnRoute()}
                // scroll={{ x: "max-content" }}
                dataSource={summaryRouteData}
                isCustomSearch={false}
                showActions={false}
              />
            </Col>

            <Col lg={12} span={24}>
              <Form
                form={form}
                layout="vertical"
                disabled={true}
                autoComplete="off"
              >
                <Row gutter={[16, 0]}>
                  <Col lg={12} md={12} span={24}>
                    <Form.Item
                      label={t("input.licensePlate.label")}
                      name={"licensePlate"}
                    >
                      <Input
                        name={t("input.licensePlate.label")}
                        placeholder={t("input.licensePlate.placeholder")}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} span={24}>
                    <Flex vertical>
                      <Form.Item
                        label={`${t("input.driver.label")} 1`}
                        name={"driver1"}
                      >
                        <Input
                          name={"driver1"}
                          placeholder={t("input.driver.placeholder")}
                        />
                      </Form.Item>
                      <Form.Item
                        label={`${t("input.driver.label")} 2`}
                        name={"driver2"}
                      >
                        <Input
                          name={"driver2"}
                          placeholder={t("input.driver.placeholder")}
                        />
                      </Form.Item>
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>

        <Card
          noShadow
          className={`${styles["card-container"]} ${styles["new"]}`}
        >
          <div className={styles["card-title"]}>
            <strong>{t("newPickupDate.title")}</strong>
          </div>
          <RsFormBuilder
            name="form-reroute"
            type={"create"}
            layout="vertical"
            form={form}
            configs={FORM_NEW_PICKUP_DATE}
            onFinish={() => {}}
            onCancel={() => {}}
            isHideFormButton
          />
        </Card>
      </Flex>

      <Row justify={"end"}>
        <Space style={{ marginTop: "2rem" }} align="end" wrap>
          <Button
            onClick={() => router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS)}
            disabled={loading[orderStatusTypes.UPDATE_RESCHEDULE_ORDER_STATUS]}
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={loading[orderStatusTypes.UPDATE_RESCHEDULE_ORDER_STATUS]}
          >
            {t("button.submit")}
          </Button>
        </Space>
      </Row>
    </>
  );
};

export default OrderReshceduleForm;
