/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import ActualIncomingApi from "@sera-libraries/api/actual-incoming";
import { Col, Form, message, Modal, Row } from "antd";
import { Input as AntdInput } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  ids: string[];
  onClose: () => void;
  onDone: () => void;
}

/** Hapus actual bulk + alasan wajib (audit) — parity CoreApp DeleteActualIncoming. */
export const DeleteActualForm = ({ open, ids, onClose, onDone }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.list",
  });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const submit = async (values: { description: string }) => {
    setLoading(true);
    try {
      const result = await ActualIncomingApi().deleteActual(
        ids.map((id) => ({ id, description: values.description })),
      );
      message.success(
        t("deleted", {
          count: result?.deleted ?? 0,
          skipped: result?.skipped?.length ?? 0,
        }),
      );
      form.resetFields();
      onDone();
      onClose();
    } catch (error: any) {
      const body: any = error?.response?.data ?? error?.data ?? {};
      message.error(body?.message ?? error?.statusText ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("confirmDelete")}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Row>
          <Col span={24}>{t("confirmDeleteHint")}</Col>
          <Col span={24} style={{ marginTop: "1rem" }}>
            <Form.Item
              name="description"
              label={t("reasonLabel")}
              rules={[{ required: true, message: t("reasonLabel") }]}
            >
              <AntdInput.TextArea
                rows={3}
                placeholder={t("reasonPlaceholder")}
                maxLength={255}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={[8, 0]}>
          <Col>
            <Button onClick={onClose}>{t("cancel")}</Button>
          </Col>
          <Col>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              {t("confirm")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeleteActualForm;
