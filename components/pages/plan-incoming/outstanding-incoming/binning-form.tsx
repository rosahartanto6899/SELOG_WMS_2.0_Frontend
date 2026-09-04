/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { OutstandingIncomingDetail } from "@sera-types/outstanding-incoming.type";
import {
  Form,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

interface Props {
  open: boolean;
  headerId: string | null;
  details: OutstandingIncomingDetail[];
  onClose: () => void;
  onDone: () => void;
}

/** B2 — per-detail row binning (actualQty is INCREMENTED); locations from B1. */
const BinningForm = (props: Props) => {
  const { open, headerId, details, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.binning",
  });
  const [form] = Form.useForm();
  const [locations, setLocations] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && headerId) {
      OutstandingIncomingApi()
        .retrieveLocations(headerId)
        .then((resp: any) => {
          const rows = resp?.data?.data ?? [];
          setLocations(rows.map((r: any) => r.location).filter(Boolean));
        })
        .catch(() => setLocations([]));
    }
  }, [open, headerId]);

  const submit = async (values: any) => {
    setSubmitting(true);
    try {
      await OutstandingIncomingApi().binning(values.detailId, values.actualQty);
      message.success(t("success"));
      onDone();
      onClose();
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = (d: OutstandingIncomingDetail) =>
    Math.max(d.poQty - (d.binningQty ?? 0), 0);

  return (
    <Modal
      open={open}
      title={t("title")}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
      width={720}
    >
      {locations.length > 0 && (
        <Typography.Paragraph>
          {t("locations")}: <strong>{locations.join(", ")}</strong>
        </Typography.Paragraph>
      )}
      <Table
        size="small"
        rowKey="id"
        dataSource={details}
        pagination={false}
        columns={[
          { title: t("materialCode"), dataIndex: "materialCode" },
          { title: t("materialName"), dataIndex: "materialName" },
          {
            title: t("poQty"),
            dataIndex: "poQty",
            width: 80,
            align: "right" as const,
            className: styles["tabular-nums"],
          },
          {
            title: t("binningQty"),
            dataIndex: "binningQty",
            width: 100,
            align: "right" as const,
            className: styles["tabular-nums"],
          },
          {
            title: t("remaining"),
            render: (_: any, d: OutstandingIncomingDetail) => remaining(d),
            width: 90,
          },
        ]}
      />
      <Form form={form} layout="vertical" onFinish={submit} className="mt-4">
        <Form.Item
          name="detailId"
          label={t("detail")}
          rules={[{ required: true, message: t("required") }]}
        >
          <Select
            placeholder={t("selectDetail")}
            options={details.map((d) => ({
              value: d.id,
              label: `${d.materialCode} (sisa ${remaining(d)})`,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="actualQty"
          label={t("actualQty")}
          rules={[{ required: true, message: t("required") }]}
          extra={t("incrementHint")}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BinningForm;
