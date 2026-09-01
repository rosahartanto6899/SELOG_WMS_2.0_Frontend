import { InboxOutlined } from "@ant-design/icons";
import { Attachment } from "@sera-types/pod-collection.type";
import { Button, Col, Form, FormInstance, Input, Row } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";
import { TModalMutationType, TPODReformatType } from "./list-props-table";

interface IProps<T> {
  type: TModalMutationType;
  podType: TPODReformatType;
  formData: {
    shipmentNumber?: string;
    customerName?: string;
    submittedDate?: string;
    submittedBy?: string;
    attachments?: Attachment[];
  };
  selectedFiles: any;
  setSelectedFiles: (args: any) => void;
  form: FormInstance;
  onSubmit: (
    args: T,
    form?: FormInstance,
    cleanFiles?: (args: any) => void,
  ) => void;
  onCancel: (args: FormInstance) => void;
}

const FormUploadTimestamp = <T,>(props: IProps<T>) => {
  const {
    type,
    selectedFiles,
    setSelectedFiles,
    formData,
    form,
    onCancel,
    onSubmit,
  } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.detail.modalForm",
  });

  const {
    loading: { loadingTimestamp },
  } = usePodCollection();

  const ButtonUpload = () => (
    <Form.Item
      name={"files"}
      rules={[
        {
          required: type !== "verify",
          message: "Please Upload files.",
        },
        () => ({
          validator(_, value) {
            if ((value?.fileList || []).length <= 5) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error(
                "You can upload up to 5 documents. Please remove some files to proceed.",
              ),
            );
          },
        }),
      ]}
    >
      <Dragger
        multiple
        listType="picture"
        accept=".pdf,.png,.jpg,.jpeg"
        disabled={type === "verify"}
        {...(type === "verify" && { style: { display: "none" } })}
        fileList={selectedFiles}
        onChange={(e) => {
          setSelectedFiles(
            e?.fileList?.map((file) => ({
              ...file,
              status: "done",
              percent: 100,
            })),
          );
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload (pdf, jpg, jpeg, png).
        </p>
      </Dragger>
    </Form.Item>
  );

  useEffect(() => {
    form.setFieldsValue({ ...formData });
  }, [formData]);

  const handleFinish = async (val: any) => {
    await form
      .validateFields()
      .then(() => {
        onSubmit(
          {
            ...val,
            files: val?.files?.fileList.map((e: any) => e.originFileObj),
          },
          form,
          setSelectedFiles,
        );
      })
      .then(() => setSelectedFiles([]));
  };

  const handleClose = () => {
    if (onCancel) onCancel(form);
    setSelectedFiles([]);
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
        <Col xs={24} lg={24}>
          {ButtonUpload()}
        </Col>
      </Row>
      <Row gutter={[12, 12]} justify={"end"} style={{ marginTop: 20 }}>
        <Col>
          <Button
            type="primary"
            disabled={loadingTimestamp}
            loading={loadingTimestamp}
            htmlType="submit"
          >
            {type === "edit" ? "Submit" : "Verify"}
          </Button>
        </Col>
        <Col>
          <Button onClick={handleClose} disabled={loadingTimestamp}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormUploadTimestamp;
