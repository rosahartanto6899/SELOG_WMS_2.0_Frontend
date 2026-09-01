import { SwapOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import ModalApproveReject from "@sera-components/modal/modal-approve-reject";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import CustomerRouteApi from "@sera-libraries/api/customer-route";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { shipmentCancellationsActions, useAppSelector } from "@sera-redux";
import {
  bookingOrderTypes,
  RouteJourneyRecord,
} from "@sera-types/booking-order.type";
import { DataDetailCustomerRoute } from "@sera-types/customer-route.type";
import { ShipmentRouteDetail } from "@sera-types/order-status.type";
import { shipmentCancellationsTypes } from "@sera-types/shipment-cancellations.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Divider, Flex, Form, Grid, Row, Space } from "antd";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { isEmpty, isNull } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import styles from "../../shipment-cancellations.module.scss";
import { ColumnRoute } from "../../shipment-cancellations-props-table";

export interface RouteCodesProps {
  new?: DataDetailCustomerRoute | null;
  prev?: DataDetailCustomerRoute | null;
}

const RerouteForm = ({ isApproval }: { isApproval: boolean }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.form.approvalConfirmation",
  });

  const [summaryRouteData, setSummaryRouteData] = useState<{
    prev: RouteJourneyRecord[];
    new: RouteJourneyRecord[];
  }>({
    prev: [],
    new: [],
  });

  const router = useRouter();
  const [form] = Form.useForm();

  const approvalId = router.query.approvalId as string;

  const [modalData, setModalData] = useState<{
    decision: "approve" | "reject";
    show: boolean;
    data: null;
    reason: string;
  }>({
    data: null,
    show: false,
    decision: "approve",
    reason: "",
  });

  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );

  const {
    detail: { data: orderStatusDetail },
  } = useAppSelector((state) => state.orderStatus);

  const {
    approvalHistory: { data: approvalHistoryData },
  } = useAppSelector((state) => state.shipmentCancellations);

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
    newRouteCode:
      approvalHistoryData?.[0]?.shipmentApprovalRequest?.referenceValue || "",
    notes: orderStatusDetail?.shipment?.shipmentDetail?.notes || "-",
    pickupDate: orderStatusDetail?.shipment?.pickUpDate
      ? dayjs(orderStatusDetail?.shipment?.pickUpDate).format(
          "YYYY-MM-DD HH:mm",
        )
      : "",
    qtyDriver: orderStatusDetail?.shipment?.qtyDriver || 0,
    note: approvalHistoryData?.[0]?.shipmentApprovalRequest?.description || "",
    routeCode: orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId,
    salesDealing: orderStatusDetail?.shipment?.salesDealing || "-",
    salesServicing: orderStatusDetail?.shipment?.salesServicing || "-",
    shipmentNumber: orderStatusDetail?.shipment?.shipmentNo,
    shipmentType: orderStatusDetail?.shipment?.shipmentType,
  };

  const [routeCodes, setRouteCodes] = useState<RouteCodesProps>({
    new: null,
    prev: null,
  });

  const [dropdownCustomerRoutes, setDropdownCustomerRoutes] = useState<{
    data: any[];
  }>({
    data: [],
  });

  const getDetailRouteCode = async (id: string, type: "new" | "prev") => {
    const res: AxiosResponse<{ data: DataDetailCustomerRoute }> =
      await CustomerRouteApi().retrieveCustomerRouteDetail({ id });

    setRouteCodes((prev) => ({
      ...prev,
      [type]: res.data.data,
    }));

    const data = res?.data?.data || {};
    const _payloadCustomerRoute = {
      customerRouteId: data?.header?.customerRouteId,
      contractId: data?.header?.contractId,
      routeCode: data?.header?.routeCode,
      originalRouteCode: data?.header?.originalRouteCode,
      cmdCode: data?.header?.cmdCode,
      origin: data?.details?.find((d) => d.routeActivityType === "Loading")
        ?.locationName,
      areaOrigin: data?.details?.find((d) => d.routeActivityType === "Loading")
        ?.locationArea,
      detailOrigin: data?.details?.find(
        (d) => d.routeActivityType === "Loading",
      )?.locationDetail,

      destination: data?.details?.find(
        (d) => d.routeActivityType === "Unloading",
      )?.locationName,
      areaDestination: data?.details?.find(
        (d) => d.routeActivityType === "Unloading",
      )?.locationArea,
      detailDestination: data?.details?.find(
        (d) => d.routeActivityType === "Unloading",
      )?.locationDetail,
      revenuePerShipment: data?.header?.revenuePerShipment,
      qtyDriver: data?.header?.qtyDriver,
      cost: data?.header?.cost,
      leadtimeType: data?.header?.leadtimeType,
      leadtimeValue: data?.header?.leadtimeValue,
    };
    setDropdownCustomerRoutes((prev) => ({
      data: [...prev.data, _payloadCustomerRoute],
    }));
  };

  useEffect(() => {
    if (!shipmentRerouteForm?.routeCode || !shipmentRerouteForm?.newRouteCode)
      return;
    if (isNull(routeCodes.new)) {
      getDetailRouteCode(shipmentRerouteForm?.newRouteCode, "new");
    }

    if (isNull(routeCodes.prev)) {
      getDetailRouteCode(shipmentRerouteForm?.routeCode, "prev");
    }

    return () => {
      setRouteCodes({ prev: null, new: null });
      setDropdownCustomerRoutes({ data: [] });
    };
  }, [
    shipmentRerouteForm?.routeCode,
    shipmentRerouteForm?.newRouteCode,
    orderStatusDetail,
    approvalHistoryData,
  ]);

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
        disabled: () => true,
      },
      options: dropdownCustomerRoutes.data.map((v) => ({
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
      disabled: true,
    },
  ] as ChildConfig[];

  const handleConfirm = (reason?: string) => {
    const callback = () => {
      const approval =
        modalData.decision === "approve" ? "approved" : "rejected";
      MessageHandler().success(
        t("messageApproval.reroute", { value: approval }),
      );
      router.push(ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS);

      setModalData((prev) => ({
        ...prev,
        show: false,
        data: null,
        reason: "",
      }));

      dispatch(
        shipmentCancellationsActions.updateApprovalRerouteShipmentClear(),
      );
    };

    dispatch(
      shipmentCancellationsActions.updateApprovalRerouteShipmentFetch({
        id: approvalId,
        action: modalData.decision,
        note: reason || "",
        callback,
      }),
    );
  };

  const handleDecision = (val: "approve" | "reject") => {
    setModalData({ decision: val, show: true, data: null, reason: "" });
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
      pickupDate: shipmentRerouteForm?.pickupDate || "-",
      eta: _eta.isValid() ? _eta.format("YYYY-MM-DD HH:mm") : "-",
    });

    return () => {
      setSummaryRouteData((prev) => ({
        ...prev,
        prev: [],
      }));
    };
  }, [dropdownCustomerRoutes.data, orderStatusDetail]);

  useEffect(() => {
    if (shipmentRerouteForm?.newRouteCode) {
      const { qtyDriver, leadtimeType, leadtimeValue } =
        dropdownCustomerRoutes.data.find(
          (o) => o.customerRouteId === shipmentRerouteForm?.newRouteCode,
        ) || {};

      let _eta = dayjs(
        shipmentRerouteForm?.pickupDate ?? "",
        "YYYY-MM-DD HH:mm",
      );

      if (leadtimeValue && leadtimeType) {
        _eta = _eta.add(
          leadtimeValue,
          leadtimeType as unknown as dayjs.ManipulateType,
        );
      }

      setSummaryRouteData((prev) => ({
        ...prev,
        new: getRouteJourney(shipmentRerouteForm?.newRouteCode),
      }));

      form.setFieldsValue({
        newQtyDriver: qtyDriver,
        newEta: _eta.isValid() ? _eta.format("YYYY-MM-DD HH:mm") : "-",
      });
    }

    return () => {
      setSummaryRouteData((prev) => ({
        ...prev,
        new: [],
      }));

      form.resetFields(["newEta"]);
    };
  }, [
    shipmentRerouteForm?.newRouteCode,
    approvalHistoryData,
    dropdownCustomerRoutes.data,
  ]);

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
                      {shipmentRerouteForm?.qtyDriver > 1 && (
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
                scroll={{ x: "max-content" }}
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
                      {shipmentRerouteForm?.qtyDriver > 1 && (
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
            type="primary"
            onClick={() => handleDecision("approve")}
            disabled={!isApproval}
          >
            {t("button.approve")}
          </Button>
          <Button
            onClick={() => handleDecision("reject")}
            disabled={!isApproval}
          >
            {t("button.reject")}
          </Button>
          <Button
            onClick={() => router.push(ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS)}
          >
            {t("button.cancel")}
          </Button>
        </Space>
      </Row>

      <ModalApproveReject
        type={modalData.decision}
        open={modalData.show}
        onOk={(reason) => handleConfirm(reason)}
        loading={
          loading[shipmentCancellationsTypes.UPDATE_APPROVAL_REROUTE_SHIPMENT]
        }
        onCancel={() => setModalData((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default RerouteForm;
