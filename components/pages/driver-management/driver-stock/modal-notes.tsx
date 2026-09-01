import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import { Col, Form, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  isOpen: boolean;
  onSubmit: (args: { note: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  note: string;
}

const ModalNotes = (props: IProps) => {
  const { isOpen, onSubmit, onCancel, loading, note } = props;
  const [form] = useForm();
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock",
  });

  useEffect(() => {
    form.setFieldsValue({ note });
  }, [note]);

  return (
    <Modal
      title="Add Notes"
      centered
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} style={{ padding: 20 }}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form.Item
              name="note"
              label="Note"
              rules={[{ required: true }, { message: t("message.required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row justify={"end"} gutter={[12, 12]}>
              <Col>
                <Button
                  loading={loading}
                  disabled={loading}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Col>
              <Col>
                <Button disabled={loading} onClick={onCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalNotes;
