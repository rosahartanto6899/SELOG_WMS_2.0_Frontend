import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";
import { TModalMutationType, TPODReformatType } from "./list-props-table";

interface IProps<T> {
  type: TModalMutationType;
  podType: TPODReformatType;
  form: FormInstance;
  onSubmit: (args: T, form?: FormInstance) => void;
  onCancel?: (args: FormInstance) => void;
  formData: {
    shipmentNumber?: string;
    customerName?: string;
    submittedDate?: string;
    submittedBy?: string;
  };
}

const FormPodHardcopy = <T,>(props: IProps<T>) => {
  const { type, form, onSubmit, formData, onCancel } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.detail.modalForm",
  });

  const {
    loading: { loadingHardcopy },
  } = usePodCollection();

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      submittedDate: formData.submittedDate
        ? dayjs(formData.submittedDate)
        : null,
    });
  }, [formData]);

  const handleFinish = async (val: any) => {
    await form.validateFields().then(() => {
      onSubmit(
        {
          ...val,
        },
        form,
      );
    });
  };

  const handleClose = () => {
    if (onCancel) onCancel(form);
    // form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={12}>
          <Form.Item name="shipmentNumber" label={t("shipmentNumber")}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="customerName" label={t("customerName")}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="submittedDate"
            required
            label={t("submittedDate")}
            rules={[{ required: true }]}
          >
            <DatePicker
              disabled={type === "verify"}
              format={"YYYY-MM-DD"}
              style={{ width: "100%", borderRadius: 20 }}
              getPopupContainer={(node) => node}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 12]} justify={"end"}>
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loadingHardcopy}
            loading={loadingHardcopy}
          >
            {type === "edit" ? "Submit" : "Verify"}
          </Button>
        </Col>
        <Col>
          <Button onClick={handleClose} disabled={loadingHardcopy}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormPodHardcopy;
