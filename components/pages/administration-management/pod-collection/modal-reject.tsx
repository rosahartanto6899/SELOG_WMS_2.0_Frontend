import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import { ApprovalActionType } from "@sera-types/pod-collection.type";
import { Col, Form, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useTranslation } from "react-i18next";

import { ApprovalTypeEnum } from "./list-props-table";

interface IProps {
  isOpen: boolean;
  onSubmit: (args: { reason: string }, type: ApprovalActionType) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalReject = (props: IProps) => {
  const { isOpen, onSubmit, onCancel, loading } = props;
  const [form] = useForm();
  const { t } = useTranslation(undefined, {
    keyPrefix: "driverStock",
  });

  return (
    <Modal
      title="Reject POD"
      centered
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={(e) => {
          onSubmit(e, ApprovalTypeEnum.REJECTED);
          form.resetFields();
        }}
        style={{ padding: 20 }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form.Item
              name="reason"
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

export default ModalReject;
