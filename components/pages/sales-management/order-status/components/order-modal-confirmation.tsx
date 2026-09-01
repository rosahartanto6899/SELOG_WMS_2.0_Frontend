import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { useAppSelector } from "@sera-redux";
import { ApprovalBookingRecord } from "@sera-types/approval-booking-order.type";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ModalConfirmationProps {
  data: ApprovalBookingRecord;
}

const ModalConfirmationOrder = ({ data: record }: ModalConfirmationProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.editForm",
  });

  const [form] = Form.useForm();

  const {
    getShipmentCancellationReasons: {
      data: dropdownShipmentCancellationReasons,
    },
  } = useAppSelector((state) => state.masterData);

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
      dependency: {
        fields: [],
        disabled: () => true,
      },
      options: dropdownShipmentCancellationReasons.map((v) => ({
        label: v.name,
        value: v.name,
      })),
    },
    {
      id: "chronology",
      type: "textarea",
      name: "chronology",
      label: t("input.chronology.label"),
      placeholder: t("input.chronology.placeholder"),
    },
  ] as ChildConfig[];

  const withDash = <T extends Record<string, any>>(obj?: T) =>
    Object.fromEntries(
      Object.entries(obj ?? {}).map(([key, value]) => [key, value || "-"]),
    );

  useEffect(() => {
    if (record) {
      form.setFieldsValue(withDash(record));
    }

    return () => {
      form.resetFields();
    };
  }, [record]);

  return (
    <>
      <Card noShadow>
        <div style={{ marginBottom: "18px" }}>
          <strong style={{ fontSize: "18px" }}>
            {t("modalCancel.cardTitle")}
          </strong>
        </div>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={FORM_CONFIG}
          isHideFormButton
          cancelText="Close"
          loading={true}
          disabled={true}
        />
      </Card>
    </>
  );
};

export default ModalConfirmationOrder;
