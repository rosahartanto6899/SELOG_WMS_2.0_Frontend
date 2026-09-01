import Button from "@sera-components/button";
import ModalApproveReject from "@sera-components/modal/modal-approve-reject";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  masterDataActions,
  shipmentCancellationsActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { shipmentCancellationsTypes } from "@sera-types/shipment-cancellations.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form, Row, Space } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";

const CancelForm = ({ isApproval }: { isApproval: boolean }) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.form.approvalConfirmation",
  });

  const router = useRouter();
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const {
    detail: { data: orderStatusDetail },
  } = useAppSelector((state) => state.orderStatus);
  const loading = useAppSelector((state) => state.loading);

  const {
    getShipmentCancellationReasons: {
      data: dropdownShipmentCancellationReasons,
    },
  } = useAppSelector((state) => state.masterData);

  const {
    approvalHistory: { data: approvalHistoryData },
  } = useAppSelector((state) => state.shipmentCancellations);

  const len =
    orderStatusDetail?.shipment?.shipmentDetail?.routeLocations?.length ?? 1;

  const shipmentCancellationForm = {
    customerName: orderStatusDetail?.shipment?.customerName || "-",
    shipmentNo: orderStatusDetail?.shipment?.shipmentNo || "-",
    shipmentType: orderStatusDetail?.shipment?.shipmentType || "-",
    bookingNo: orderStatusDetail?.shipment?.bookingOrderNo || "-",
    destination:
      orderStatusDetail?.shipment?.shipmentDetail?.routeLocations[0]
        ?.locationName,
    origin:
      orderStatusDetail?.shipment?.shipmentDetail?.routeLocations[len - 1]
        ?.locationName,
    pickupDate: orderStatusDetail?.shipment?.pickUpDate
      ? dayjs(orderStatusDetail?.shipment?.pickUpDate).format(
          "YYYY-MM-DD HH:mm",
        )
      : "-",
    chronology:
      approvalHistoryData?.[0]?.shipmentApprovalRequest?.description || "-",
    cancellationReason:
      approvalHistoryData?.[0]?.shipmentApprovalRequest?.reason || undefined,
  };

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

  const requiredMessage = t("message");

  const FORM_CONFIG = [
    {
      id: "bookingNo",
      type: "text",
      name: "bookingNo",
      label: t("input.bookingNo.label"),
      placeholder: t("input.bookingNo.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "shipmentNo",
      type: "text",
      name: "shipmentNo",
      label: t("input.shipmentNo.label"),
      placeholder: t("input.shipmentNo.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("input.origin.label"),
      placeholder: t("input.origin.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("input.destination.label"),
      placeholder: t("input.destination.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "pickupDate",
      type: "text",
      name: "pickupDate",
      label: t("input.pickupDate.label"),
      placeholder: t("input.pickupDate.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "cancellationReason",
      type: "select",
      name: "cancellationReason",
      label: t("input.cancellationReason.label"),
      placeholder: t("input.cancellationReason.placeholder"),
      options: dropdownShipmentCancellationReasons.map((v) => ({
        label: v.name,
        value: v.id,
      })),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "chronology",
      type: "textarea",
      name: "chronology",
      label: t("input.chronology.label"),
      placeholder: t("input.chronology.placeholder"),
    },
  ] as ChildConfig[];

  const handleConfirm = (reason?: string) => {
    const callback = () => {
      const approval =
        modalData.decision === "approve" ? "approved" : "rejected";
      MessageHandler().success(
        t("messageApproval.cancel", { value: approval }),
      );
      router.push(ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS);

      setModalData((prev) => ({
        ...prev,
        show: false,
        data: null,
        reason: "",
      }));

      dispatch(
        shipmentCancellationsActions.updateApprovalCancelShipmentClear(),
      );
    };

    dispatch(
      shipmentCancellationsActions.updateApprovalCancelShipmentFetch({
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

  useEffect(() => {
    if (isEmpty(orderStatusDetail || approvalHistoryData)) return;
    form.setFieldsValue(shipmentCancellationForm);

    return () => {
      form.resetFields([]);
    };
  }, [orderStatusDetail, approvalHistoryData]);

  useEffect(() => {
    dispatch(masterDataActions.getShipmentCancellationReasonsFetch());

    return () => {
      dispatch(masterDataActions.getShipmentCancellationReasonsClear());
    };
  }, []);

  return (
    <>
      <RsFormBuilder
        name="form-cancel"
        type={"create"}
        layout="vertical"
        form={form}
        configs={FORM_CONFIG}
        onFinish={() => {}}
        onCancel={() => {}}
        disabled
        isHideFormButton
      />

      {/* IF APPROVAL STATUS IS APPROVED / REJECTED HIDE BUTTON  */}
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
        loading={
          loading[shipmentCancellationsTypes.UPDATE_APPROVAL_CANCEL_SHIPMENT]
        }
        onOk={(reason) => handleConfirm(reason)}
        onCancel={() => setModalData((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default CancelForm;
