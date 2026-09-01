import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import ModalApproveReject from "@sera-components/modal/modal-approve-reject";
import RsFormBuilder from "@sera-components/rs-form-builder";
import Table from "@sera-components/table";
import CustomerRouteApi from "@sera-libraries/api/customer-route";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  shipmentCancellationsActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
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
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "../../shipment-cancellations.module.scss";
import { ColumnRoute } from "../../shipment-cancellations-props-table";

const OrderReshceduleForm = ({ isApproval }: { isApproval: boolean }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.form.approvalConfirmation",
  });

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const approvalId = router.query.approvalId as string;

  const requiredMessage = t("message");

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

  const [summaryRouteData, setSummaryRouteData] = useState<
    RouteJourneyRecord[]
  >([]);

  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );

  const {
    approvalHistory: { data: approvalHistoryData },
  } = useAppSelector((state) => state.shipmentCancellations);

  const loading = useAppSelector((state) => state.loading);

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
    newPickupDate: approvalHistoryData?.[0]?.shipmentApprovalRequest
      ?.referenceValue
      ? dayjs(approvalHistoryData?.[0]?.shipmentApprovalRequest?.referenceValue)
      : undefined,
    notes: orderStatusDetail?.shipment?.shipmentDetail?.notes,
    pickupDate: orderStatusDetail?.shipment?.pickUpDate || "-",
    qtyDriver: orderStatusDetail?.shipment?.qtyDriver || 0,
    note: approvalHistoryData?.[0]?.shipmentApprovalRequest?.description || "-",
    routeCode: orderStatusDetail?.shipment?.shipmentDetail?.routeCode || "",
    salesDealing: orderStatusDetail?.shipment?.salesDealing || "-",
    salesServicing: orderStatusDetail?.shipment?.salesServicing || "-",
  };

  const [dropdownCustomerRoutes, setDropdownCustomerRoutes] = useState<{
    data: any[];
  }>({
    data: [],
  });

  const getDetailRouteCode = async (id: string) => {
    const res: AxiosResponse<{ data: DataDetailCustomerRoute }> =
      await CustomerRouteApi().retrieveCustomerRouteDetail({ id });

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
    if (!orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId) return;
    getDetailRouteCode(
      orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId,
    );

    return () => {
      setDropdownCustomerRoutes({ data: [] });
    };
  }, [orderStatusDetail]);

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
      type: "text",
      name: "routeCode",
      label: t("input.routeCode.label"),
      placeholder: t("input.routeCode.placeholder"),
      mdSize: 6,
      dependency: {
        fields: [],
        disabled: () => true,
      },
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
      format: "YYYY-MM-DD HH:mm",
      label: t("input.pickupDate.label"),
      placeholder: t("input.pickupDate.placeholder"),
      disabled: true,
      rules: [{ required: true, message: requiredMessage }],
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
        disabled: () => true,
      },
    },
  ] as ChildConfig[];

  const handleConfirm = (reason?: string) => {
    const callback = () => {
      const approval =
        modalData.decision === "approve" ? "approved" : "rejected";
      MessageHandler().success(
        t("messageApproval.reschedule", { value: approval }),
      );
      router.push(ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS);

      setModalData((prev) => ({
        ...prev,
        show: false,
        data: null,
        reason: "",
      }));

      dispatch(
        shipmentCancellationsActions.updateApprovalRescheduleShipmentClear(),
      );
    };

    dispatch(
      shipmentCancellationsActions.updateApprovalRescheduleShipmentFetch({
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

  useEffect(() => {
    if (isEmpty(orderStatusDetail)) return;
    if (!shipmentRescheduleForm?.newPickupDate) return;
    setSummaryRouteData(
      getRouteLocation(
        orderStatusDetail?.shipment?.shipmentDetail?.routeLocations,
      ),
    );
    const { leadtimeType, leadtimeValue } =
      dropdownCustomerRoutes.data.find(
        (o) =>
          o.customerRouteId ===
          orderStatusDetail?.shipment?.shipmentDetail?.customerRouteId,
      ) || {};
    let _eta = dayjs(
      shipmentRescheduleForm.pickupDate ?? "",
      "YYYY-MM-DD HH:mm",
    );
    let _newEta = dayjs(
      shipmentRescheduleForm.newPickupDate,
      "YYYY-MM-DD HH:mm",
    );

    if (leadtimeValue && leadtimeType) {
      _eta = _eta.add(
        leadtimeValue,
        leadtimeType as unknown as dayjs.ManipulateType,
      );
      _newEta = _newEta.add(
        leadtimeValue,
        leadtimeType as unknown as dayjs.ManipulateType,
      );
    }
    form.setFieldsValue({
      ...shipmentRescheduleForm,
      eta: _eta.isValid() ? _eta.format("YYYY-MM-DD HH:mm") : undefined,
      newEta: _newEta?.isValid()
        ? _newEta.format("YYYY-MM-DD HH:mm")
        : undefined,
    });
  }, [orderStatusDetail, dropdownCustomerRoutes?.data, approvalHistoryData]);

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
            onFinish={() => {}}
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
                      {shipmentRescheduleForm.qtyDriver > 1 && (
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
          loading[
            shipmentCancellationsTypes.UPDATE_APPROVAL_RESCHEDULE_SHIPMENT
          ]
        }
        onCancel={() => setModalData((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default OrderReshceduleForm;
