import Card from "@sera-components/card";
import Input from "@sera-components/input";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { ApprovalBookingRecord } from "@sera-types/approval-booking-order.type";
import { Col, Divider, Form, Row, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface ModalConfirmationProps {
  data: ApprovalBookingRecord;
  onChangeNote: (value: string) => void;
}

const ModalConfirmationApprovalBookingOrder = ({
  data: record,
  onChangeNote,
}: ModalConfirmationProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder",
  });

  const [form] = Form.useForm();

  const FORM_ORDER_CONFIRMATION_CONFIG: ChildConfig[] = [
    {
      id: "branchOrder",
      type: "text",
      name: "branchOrder",
      label: t("form.input.branchOrder.label"),
      placeholder: t("form.input.branchOrder.placeholder"),
    },
    {
      id: "bookingCode",
      type: "text",
      name: "bookingCode",
      label: t("form.input.bookingCode.label"),
      placeholder: t("form.input.bookingCode.placeholder"),
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("form.input.customerName.label"),
      placeholder: t("form.input.customerName.placeholder"),
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("form.input.unitType.label"),
      placeholder: t("form.input.unitType.placeholder"),
    },
    {
      id: "pickUpDate",
      type: "text",
      name: "pickUpDate",
      label: t("form.input.pickUpDate.label"),
      placeholder: t("form.input.pickUpDate.placeholder"),
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("form.input.origin.label"),
      placeholder: t("form.input.origin.placeholder"),
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("form.input.destination.label"),
      placeholder: t("form.input.destination.placeholder"),
    },
  ];

  const withDash = <T extends Record<string, any>>(obj?: T) =>
    Object.fromEntries(
      Object.entries(obj ?? {}).map(([key, value]) => [key, value || "-"]),
    );

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...withDash(record),
        branchOrder: record.branchName || "-",
        pickUpDate: record.pickupDate || "-",
      });
    }

    return () => {
      form.resetFields();
    };
  }, [record.id]);

  return (
    <>
      <Card title={t("modal.updateFulfill.title")}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={FORM_ORDER_CONFIRMATION_CONFIG}
          isHideFormButton
          loading={true}
          disabled={true}
        />
      </Card>
      <Divider />

      <Row
        gutter={[16, 12]}
        style={{
          background: "#fafafa",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Col md={8} sm={8} span={24}>
          <Text type="secondary">{t("table.column.qtyUnit")}</Text>
          <div>
            <Text>{record.qtyUnit}</Text>
          </div>
        </Col>

        <Col md={8} sm={8} span={24}>
          <Text strong>{t("table.column.fulfill")}</Text>
          <div>
            <Text strong>{record.fulfill}</Text>
          </div>
        </Col>

        <Col md={8} sm={8} span={24}>
          <Text type="secondary">{t("table.column.unfill")}</Text>
          <div>
            <Text>{(record.qtyUnit || 0) - (record.fulfill || 0)}</Text>
          </div>
        </Col>

        <Col span={24}>
          <Text type="secondary">{t("form.input.note.label")}</Text>
          <Input
            placeholder={t("form.input.note.placeholder")}
            value={record.notes}
            onChange={(e) => onChangeNote(e.target.value)}
          />
        </Col>
      </Row>
    </>
  );
};

export default ModalConfirmationApprovalBookingOrder;
