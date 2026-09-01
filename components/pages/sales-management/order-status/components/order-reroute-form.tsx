import { SwapOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
// import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  bookingOrderActions,
  // customerContractActions,
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MATERIAL_CODE } from "../../booking-order/booking-form";
import styles from "../order-status.module.scss";
import { ColumnRoute } from "../order-status-props-table";

const RerouteForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.editForm",
  });

  const router = useRouter();
  const [form] = Form.useForm();
  const id = router.query.id as string;

  const [summaryRouteData, setSummaryRouteData] = useState<{
    prev: RouteJourneyRecord[];
    new: RouteJourneyRecord[];
  }>({
    prev: [],
    new: [],
  });

  const rerouteForm = Form.useWatch([], form);

  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );

  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );

  // const {
  //   detailContract: { data: detailContract },
  // } = useAppSelector((state) => state.customerContracts);

  const {
    detail: { data: orderStatusDetail },
  } = useAppSelector((state) => state.orderStatus);

  const shipmentRerouteForm = {
    additionalRequest: (
      orderStatusDetail?.shipment?.additionalRequests ?? []
    )?.map((v) => v.id),
    customerName: orderStatusDetail?.shipment?.customerName,
    driver1: orderStatusDetail?.shipment?.driverName1 || "-",
    driver2: orderStatusDetail?.shipment?.driverName2 || "-",
    eta: undefined,
    licensePlate: orderStatusDetail?.shipment?.licensePlate || "-",
    newDriver1: orderStatusDetail?.shipment?.driverName1 || "-",
    newDriver2: orderStatusDetail?.shipment?.driverName2 || "-",
    newEta: undefined,
    newLicensePlate: orderStatusDetail?.shipment?.licensePlate || "-",
    newNotes: orderStatusDetail?.shipment?.shipmentDetail?.notes || "-",
    newQtyDriver: orderStatusDetail?.shipment?.qtyDriver || 0,
    newRouteCode: undefined,
    notes: orderStatusDetail?.shipment?.shipmentDetail?.notes || "-",
    pickupDate: orderStatusDetail?.shipment?.pickUpDate || "",
    qtyDriver: orderStatusDetail?.shipment?.qtyDriver || 0,
    reason: undefined,
    routeCode: orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId,
    salesDealing: orderStatusDetail?.shipment?.salesDealing || "-",
    salesServicing: orderStatusDetail?.shipment?.salesServicing || "-",
    shipmentNumber: orderStatusDetail?.shipment?.shipmentNo,
    shipmentType: orderStatusDetail?.shipment?.shipmentType,
  };

  const loading = useAppSelector((state) => state.loading);
  // const _PICKUPDATE = dayjs(shipmentRerouteForm.pickupDate, "YYYY-MM-DD");
  // const _ENDDATE_CONTRACT = dayjs(
  //   detailContract?.endDate,
  //   "YYYY-MM-DD HH:mm:ss",
  // );
  // const isExceedContract = _PICKUPDATE.isAfter(_ENDDATE_CONTRACT);

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

  const FORM_NEW_ROUTE_CONFIG = [
    {
      id: "newRouteCode",
      type: "select",
      name: "newRouteCode",
      label: t("input.routeCode.label"),
      placeholder: t("input.routeCode.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        required: {
          condition: () => true,
        },
      },
      options: dropdownCustomerRoutes.data
        .filter(
          (o) =>
            o.qtyDriver === (Number(shipmentRerouteForm?.qtyDriver) ?? 1) &&
            o.customerRouteId !== shipmentRerouteForm.routeCode,
        )
        .map((v) => ({
          label: v.originalRouteCode,
          value: v.customerRouteId,
        })),
    },
    {
      id: "newQtyDriver",
      type: "text",
      name: "newQtyDriver",
      label: t("input.qtyDriver.label"),
      placeholder: t("input.qtyDriver.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "newEta",
      type: "text",
      name: "newEta",
      label: t("input.eta.label"),
      placeholder: t("input.eta.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "newNotes",
      type: "text",
      name: "newNotes",
      label: t("input.notes.label"),
      placeholder: t("input.notes.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
  ] as ChildConfig[];

  const FORM_REASON_CONFIG = [
    {
      id: "note",
      type: "textarea",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      showCount: true,
      maxLength: 200,
    },
  ] as ChildConfig[];

  const handleSubmit = async () => {
    const value = await form.validateFields();

    const callback = () => {
      MessageHandler().success(t("rerouteSuccess"));
      router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS);
      dispatch(orderStatusActions.updateCancelOrderStatusClear());
    };

    dispatch(
      orderStatusActions.updateRerouteOrderStatusFetch({
        reason: value?.note ?? "",
        customerRouteId: value?.newRouteCode,
        shipmentId: id,
        callback,
      }),
    );
  };

  const getRouteJourney = (id: string): RouteJourneyRecord[] => {
    if (!id) {
      return [];
    }
    const route = dropdownCustomerRoutes.data.find(
      (o) => o.customerRouteId === id,
    );

    return [
      {
        no: 1,
        type: "Origin",
        location: route?.origin || "-",
        address: route?.detailOrigin || "-",
      },
      {
        no: 2,
        type: "Destination",
        location: route?.destination || "-",
        address: route?.detailDestination || "-",
      },
    ];
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
    //prev route code
    if (isEmpty(orderStatusDetail)) return;
    const { leadtimeType, leadtimeValue } =
      dropdownCustomerRoutes.data.find(
        (o) => o.customerRouteId === shipmentRerouteForm.routeCode,
      ) || {};
    let _eta = dayjs(shipmentRerouteForm.pickupDate ?? "", "YYYY-MM-DD HH:mm");

    if (leadtimeValue && leadtimeType) {
      _eta = _eta.add(
        leadtimeValue,
        leadtimeType as unknown as dayjs.ManipulateType,
      );
    }

    setSummaryRouteData((prev) => ({
      ...prev,
      prev: getRouteLocation(
        orderStatusDetail?.shipment?.shipmentDetail?.routeLocations,
      ),
    }));

    form.setFieldsValue({
      ...shipmentRerouteForm,
      eta: _eta.isValid() ? _eta.format("YYYY-MM-DD HH:mm") : undefined,
    });

    return () => {
      setSummaryRouteData((prev) => ({
        ...prev,
        prev: [],
      }));
    };
  }, [dropdownCustomerRoutes.data, orderStatusDetail]);

  useEffect(() => {
    if (rerouteForm?.newRouteCode) {
      const { qtyDriver, leadtimeType, leadtimeValue } =
        dropdownCustomerRoutes.data.find(
          (o) => o.customerRouteId === rerouteForm?.newRouteCode,
        ) || {};

      let _eta = dayjs(shipmentRerouteForm.pickupDate, "YYYY-MM-DD HH:mm");

      if (leadtimeValue && leadtimeType) {
        _eta = _eta.add(
          leadtimeValue,
          leadtimeType as unknown as dayjs.ManipulateType,
        );
      }

      setSummaryRouteData((prev) => ({
        ...prev,
        new: getRouteJourney(rerouteForm?.newRouteCode),
      }));

      form.setFieldsValue({
        newQtyDriver: qtyDriver,
        newEta: _eta.format("YYYY-MM-DD HH:mm"),
      });
    }

    return () => {
      setSummaryRouteData((prev) => ({
        ...prev,
        new: [],
      }));

      form.resetFields(["newEta"]);
    };
  }, [rerouteForm?.newRouteCode]);

  useEffect(() => {
    if (isEmpty(orderStatusDetail)) return;

    const params = {
      limit: 1000,
      page: 1,
      customerId: orderStatusDetail?.shipment?.customerId,
      materialCode:
        MATERIAL_CODE[
          orderStatusDetail?.shipment
            ?.shipmentType as keyof typeof MATERIAL_CODE
        ],
    };

    dispatch(customerRouteActions.getDropdownCustomerRoutesFetch(params));

    return () => {
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
    };
  }, [orderStatusDetail]);

  useEffect(() => {
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());
    return () => {
      dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsClear());
    };
  }, []);

  // useEffect(() => {
  //   const { contractId } =
  //     dropdownCustomerRoutes.data.find(
  //       (o) => o.customerRouteId === shipmentRerouteForm.routeCode,
  //     ) || {};

  //   if (contractId) {
  //     dispatch(
  //       customerContractActions.getDetailContractFetch({ id: contractId }),
  //     );
  //   }

  //   return () => {
  //     dispatch(customerContractActions.getDetailContractClear());
  //   };
  // }, [dropdownCustomerRoutes.data, shipmentRerouteForm.routeCode]);

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
      <Divider />
      <Flex vertical>
        {/* PREVIOUS ROUTE CARD */}
        <Card
          noShadow
          className={`${styles["card-container"]} ${styles["prev"]}`}
        >
          <div className={styles["card-title"]}>
            <strong>{t("previousRouteCode.title")}</strong>
          </div>
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
                scroll={{ x: "max-content" }}
                dataSource={summaryRouteData.prev}
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
                      {rerouteForm?.qtyDriver > 1 && (
                        <Form.Item
                          label={`${t("input.driver.label")} 2`}
                          name={"driver2"}
                        >
                          <Input
                            name={"driver2"}
                            placeholder={t("input.driver.placeholder")}
                          />
                        </Form.Item>
                      )}
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>

        <Divider>
          <i className={styles["swap-icon"]}>
            <SwapOutlined />
          </i>
        </Divider>

        {/* NEW ROUTE CARD */}
        <Card
          noShadow
          className={`${styles["card-container"]} ${styles["new"]}`}
        >
          <div className={styles["card-title"]}>
            <strong>{t("newRouteCode.title")}</strong>
          </div>
          <RsFormBuilder
            name="form-new-route"
            type={"create"}
            layout="vertical"
            form={form}
            configs={FORM_NEW_ROUTE_CONFIG}
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
                dataSource={summaryRouteData.new}
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
                      name={"newLicensePlate"}
                    >
                      <Input
                        name={"newLicensePlate"}
                        placeholder={t("input.licensePlate.placeholder")}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} span={24}>
                    <Flex vertical>
                      <Form.Item
                        label={`${t("input.driver.label")} 1`}
                        name={"newDriver1"}
                      >
                        <Input
                          name={"newDriver1"}
                          placeholder={t("input.driver.placeholder")}
                        />
                      </Form.Item>
                      {rerouteForm?.newQtyDriver > 1 && (
                        <Form.Item
                          label={`${t("input.driver.label")} 2`}
                          name={"newDriver2"}
                        >
                          <Input
                            name={"newDriver2"}
                            placeholder={t("input.driver.placeholder")}
                          />
                        </Form.Item>
                      )}
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          <Divider />
          <RsFormBuilder
            name="form-reason-new-route"
            type={"create"}
            layout="vertical"
            form={form}
            configs={FORM_REASON_CONFIG}
            onFinish={(v) => console.log(v)}
            isHideFormButton
            fullWidth
          />
        </Card>
      </Flex>

      <Row justify={"end"}>
        <Space style={{ marginTop: "2rem" }} align="end" wrap>
          <Button
            onClick={() => router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS)}
            disabled={loading[orderStatusTypes.UPDATE_REROUTE_ORDER_STATUS]}
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={loading[orderStatusTypes.UPDATE_REROUTE_ORDER_STATUS]}
          >
            {t("button.submit")}
          </Button>
        </Space>
      </Row>

      {/* <Modal.Confirm
        title={t("reroute.modal.exceedDate.title")}
        open={isExceedContract}
        width={"50%"}
        closable={false}
        onOk={() => {
          router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS);
        }}
        cancelButtonProps={{ hidden: true }}
      >
        <p>{t("reroute.modal.exceedDate.subtitle")}</p>

        <Descriptions
          layout="vertical"
          column={2}
          labelStyle={{ paddingBottom: 0 }}
          contentStyle={{ fontWeight: "bold", marginTop: "-8px" }}
          size="small"
        >
          <Descriptions.Item label={"Pickup Date"}>
            {_PICKUPDATE.format("YYYY-MM-DD")}
          </Descriptions.Item>
          <Descriptions.Item label={"Contract End Date"}>
            {_ENDDATE_CONTRACT.format("YYYY-MM-DD")}
          </Descriptions.Item>
        </Descriptions>
      </Modal.Confirm> */}
    </>
  );
};

export default RerouteForm;
