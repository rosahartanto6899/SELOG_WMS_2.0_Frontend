/* eslint-disable @typescript-eslint/no-explicit-any */
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { ForActualResult } from "@sera-types/outstanding-incoming.type";
import {
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

interface Props {
  open: boolean;
  ids: string[];
  onClose: () => void;
  onDone: () => void;
}

/** GR data preview then submit (status Incoming Finished). */
const CreateActualForm = (props: Props) => {
  const { open, ids, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.createActual",
  });
  const [form] = Form.useForm();
  const [data, setData] = useState<ForActualResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && ids.length) {
      setLoading(true);
      OutstandingIncomingApi()
        .retrieveForActual(ids)
        .then((result) => setData(result ?? null))
        .finally(() => setLoading(false));
    }
  }, [open, ids]);

  const submit = async (values: any) => {
    setSubmitting(true);
    try {
      await OutstandingIncomingApi().createActual({
        ids,
        picReceiver: values.picReceiver,
        picBinner: values.picBinner,
      });
      message.success(t("success"));
      onDone();
      onClose();
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("title")}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      width={860}
      destroyOnClose
    >
      <Typography.Paragraph type="secondary">
        {t("preview")}
      </Typography.Paragraph>
      <Descriptions size="small" bordered column={1}>
        {(data?.headerIncoming ?? []).map((h) => (
          <Descriptions.Item key={h.id} label={h.deliveryNoteNo}>
            {h.customerName} — {h.warehouseName} — {h.status}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Table
        className="mt-2"
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={data?.detailIncoming ?? []}
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
        ]}
      />
      <Form form={form} layout="vertical" onFinish={submit} className="mt-4">
        <Form.Item name="picReceiver" label={t("picReceiver")}>
          <Input />
        </Form.Item>
        <Form.Item name="picBinner" label={t("picBinner")}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateActualForm;
