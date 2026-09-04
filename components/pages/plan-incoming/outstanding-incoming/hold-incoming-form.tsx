/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  HoldRowResult,
  OutstandingIncomingRow,
} from "@sera-types/outstanding-incoming.type";
import {
  Button,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Switch,
  Table,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface InsertProps {
  open: boolean;
  rows: OutstandingIncomingRow[]; // selected headers (bulk per header)
  onClose: () => void;
  onDone: () => void;
}

/** hold modal per DN (location, qty, description, attached photos). */
export const HoldIncomingForm = (props: InsertProps) => {
  const { open, rows, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.hold",
  });
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  const submit = async (values: any) => {
    setSubmitting(true);
    try {
      await OutstandingIncomingApi().insertHolds(
        rows.map((row) => ({
          planIncomingHeaderId: row.id,
          locationId: values.locationId,
          locationName: values.locationName,
          qty: values.qty,
          description: values.description,
        })),
      );
      // A2b: per-detail attachments uploaded via a separate list (needs the detail id)
      message.success(t("success"));
      onDone();
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
      destroyOnClose
    >
      <Descriptions size="small" column={1} bordered className="mb-4">
        {rows.map((row) => (
          <Descriptions.Item key={row.id} label={t("deliveryNoteNo")}>
            {row.deliveryNoteNo}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="locationId" label={t("locationId")}>
          <Input />
        </Form.Item>
        <Form.Item name="locationName" label={t("locationName")}>
          <Input />
        </Form.Item>
        <Form.Item
          name="qty"
          label={t("qty")}
          rules={[{ required: true, message: t("required") }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="description" label={t("description")}>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

/** A3/A5 — daftar hold + toggle (attach upload per detail dari sini). */
export const HoldListForm = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.holdList",
  });
  const [data, setData] = useState<HoldRowResult[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    OutstandingIncomingApi()
      .retrieveHoldsTyped()
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const onToggle = async (id: string) => {
    try {
      await OutstandingIncomingApi().toggleHold(id);
      message.success(t("toggled"));
      load();
    } catch {
      message.error(t("failed"));
    }
  };

  const columns = [
    {
      title: t("deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
    },
    {
      title: t("customerName"),
      dataIndex: "customerName",
      key: "customerName",
    },
    { title: t("poNo"), dataIndex: "poNo", key: "poNo" },
    { title: t("picReceiver"), dataIndex: "picReceiver", key: "picReceiver" },
    { title: t("picBinner"), dataIndex: "picBinner", key: "picBinner" },
    {
      title: t("binningLocation"),
      dataIndex: "binningLocation",
      key: "binningLocation",
    },
    {
      title: t("locationName"),
      dataIndex: "locationName",
      key: "locationName",
    },
    { title: t("qty"), dataIndex: "qty", key: "qty" },
    {
      title: t("isHold"),
      dataIndex: "isHold",
      key: "isHold",
      render: (v: number, row: HoldRowResult) => (
        <Switch checked={!!v} onChange={() => onToggle(row.id)} />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={t("title")}
    >
      <Table
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />
    </Modal>
  );
};

/** upload attachment hold per detail id (dipakai dari detail modal/binning). */
export const HoldAttachmentUpload = (props: { detailId: string }) => {
  const { detailId } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.hold",
  });
  return (
    <Upload
      multiple={false}
      showUploadList={false}
      beforeUpload={(file) => {
        OutstandingIncomingApi()
          .uploadHoldAttachment(detailId, file)
          .then(() => message.success(t("uploadSuccess")))
          .catch(() => message.error(t("uploadFailed")));
        return false; // stop auto-upload
      }}
    >
      <Button icon={<UploadOutlined />}>{t("upload")}</Button>
    </Upload>
  );
};
