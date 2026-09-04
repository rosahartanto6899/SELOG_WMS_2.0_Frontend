/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  OutstandingIncomingDetail,
  StockAvailabilityResult,
} from "@sera-types/outstanding-incoming.type";
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

interface Props {
  open: boolean;
  details: OutstandingIncomingDetail[]; // details of the selected header
  onClose: () => void;
  onDone: () => void;
}

/** adjust qty per detail; the StockAvailability result is shown after submit. */
const AdjustQtyForm = (props: Props) => {
  const { open, details, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.adjustQty",
  });
  const [form] = Form.useForm();
  const [stock, setStock] = useState<StockAvailabilityResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (values: any) => {
    setSubmitting(true);
    try {
      const resp = await OutstandingIncomingApi().updatePlanQty(
        values.detailId,
        {
          planQty: values.planQty,
          description: values.description,
        },
      );
      setStock(resp?.data?.stockAvailabilities ?? []);
      if (resp?.data?.message) message.info(String(resp.data.message));
      onDone();
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const stockColumns = [
    {
      title: t("stock.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
    },
    { title: t("stock.uom"), dataIndex: "uom", key: "uom" },
    {
      title: t("stock.qtySOH"),
      dataIndex: "qtySOH",
      key: "qtySOH",
      align: "right" as const,
      className: styles["tabular-nums"],
    },
    {
      title: t("stock.qtyPlanIncoming"),
      dataIndex: "qtyPlanIncoming",
      key: "qpi",
      align: "right" as const,
      className: styles["tabular-nums"],
    },
    {
      title: t("stock.qtyPlanOutgoing"),
      dataIndex: "qtyPlanOutgoing",
      key: "qpo",
      align: "right" as const,
      className: styles["tabular-nums"],
    },
  ];

  return (
    <Modal
      open={open}
      title={t("title")}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
      footer={stock ? null : undefined}
    >
      {!stock ? (
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            name="detailId"
            label={t("detail")}
            rules={[{ required: true, message: t("required") }]}
          >
            <Select
              placeholder={t("selectDetail")}
              options={details.map((d) => ({
                value: d.id,
                label: `${d.materialCode} — ${d.materialName} (PO ${d.poQty})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="planQty"
            label={t("planQty")}
            rules={[{ required: true, message: t("required") }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label={t("description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      ) : (
        <>
          <Typography.Paragraph strong>{t("stock.title")}</Typography.Paragraph>
          <Table
            size="small"
            rowKey="materialCode"
            dataSource={stock}
            columns={stockColumns}
            pagination={false}
          />
        </>
      )}
    </Modal>
  );
};

export default AdjustQtyForm;
