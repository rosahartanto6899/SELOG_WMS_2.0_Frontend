import { InboxOutlined } from "@ant-design/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import { Button, Col, DatePicker, Form, Radio, Row, Typography } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { FormInstance } from "antd/lib";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";
import {
  PodTypeEnum,
  TModalMutationType,
  TPODReformatType,
} from "./list-props-table";

interface IProps<T> {
  form: FormInstance;
  type: TModalMutationType;
  podType: TPODReformatType;
  onSubmit: (
    args: T,
    form?: FormInstance,
    cleanFiles?: (args: any) => void,
  ) => void;
  onCancel?: (args: FormInstance) => void;
  formData: {
    shipmentNumber?: string;
    customerName?: string;
    submittedDate?: string;
    submittedBy?: string;
  };
  selectedFiles: any;
  setSelectedFiles: (args: any) => void;
}

const FormPod = <T,>(props: IProps<T>) => {
  const {
    type,
    podType,
    onSubmit,
    formData,
    onCancel,
    form,
    selectedFiles,
    setSelectedFiles,
  } = props;

  const {
    loading: { loadingPodLoad, loadingPodUnload },
  } = usePodCollection();

  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.detail.modalForm",
  });

  useEffect(() => {
    form.setFieldsValue({ ...formData });
  }, [formData]);

  const handleFinish = async (val: any) => {
    await form.validateFields().then(() => {
      onSubmit(
        {
          ...val,
          ...(type !== "verify" && {
            files: val?.files?.fileList.map((e: any) => e.originFileObj),
          }),
        },
        form,
        setSelectedFiles,
      );
    });
  };

  // const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleClose = () => {
    if (onCancel) onCancel(form);
    setSelectedFiles([]);
    // form.resetFields();
  };

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
        accept=".pdf,.png,.jpg,.jpeg"
        listType="picture"
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

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(val) => {
        handleFinish(val);
      }}
    >
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
          <Form.Item name="submittedDate" label={t("submittedDate")}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name="submittedBy" label={t("submittedBy")}>
            <Input disabled />
          </Form.Item>
        </Col>

        {podType !== PodTypeEnum.DELIVERY && (
          <Col xs={24} lg={12}>
            <Form.Item
              name="picName"
              label={
                podType === PodTypeEnum.LOADING
                  ? t("picLoading")
                  : t("picUnloading")
              }
              rules={[
                { required: true },
                {
                  pattern: new RegExp(/^[a-zA-Z\s]+$/),
                  message: "Field only accept alphabet",
                },
              ]}
            >
              <Input disabled={type === "verify"} />
            </Form.Item>
          </Col>
        )}

        {podType === PodTypeEnum.UNLOADING && (
          <>
            <Col xs={24} lg={12}>
              <Form.Item name="isClaim" label={t("isClaim")} required>
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  defaultValue={false}
                  disabled={type === "verify"}
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={24}>
          <Row gutter={[12, 16]}>
            <Col span={24}>
              <Typography.Text>File(s) : </Typography.Text>
            </Col>
            <Col span={24} style={{ maxHeight: 300, overflowY: "auto" }}>
              <ButtonUpload />
            </Col>
            {/* {type === "verify" && (
              <Col span={24}>
                <Flex
                  gap={"small"}
                  align="center"
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <Image
                    src="/sample/sample-local.pdf"
                    width={32}
                    height={32}
                    alt="preview"
                  />
                  <Col>
                    {extractFileNameFromUrl(
                      "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
                    )}
                  </Col>
                </Flex>
              </Col>
            )} */}
          </Row>
        </Col>
      </Row>
      {podType === PodTypeEnum.DELIVERY && (
        <>
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="receiptNumber"
                label={"Receipt Number"}
                rules={[{ required: true }]}
              >
                <Input disabled={type === "verify"} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="receiptDate"
                label={"Receipt Date"}
                rules={[{ required: true }]}
              >
                <DatePicker
                  disabled={type === "verify"}
                  format={"YYYY-MM-DD"}
                  style={{ width: "100%", borderRadius: 20 }}
                  getPopupContainer={(node) => node}
                />
                {/* <Input disabled={type === "verify"} /> */}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="courier"
                label={"Courier"}
                rules={[{ required: true }]}
              >
                <Select
                  disabled={type === "verify"}
                  placeholder="Select courier"
                >
                  <Select.Option value="JNE">JNE</Select.Option>
                  <Select.Option value="J&T">J&T</Select.Option>
                  <Select.Option value="Sicepat">Sicepat</Select.Option>
                  <Select.Option value="Pos Indonesia">
                    Pos Indonesia
                  </Select.Option>
                  <Select.Option value="Anteraja">Anteraja</Select.Option>
                  <Select.Option value="TIKI">TIKI</Select.Option>
                  <Select.Option value="Ninja Express">
                    Ninja Express
                  </Select.Option>
                  <Select.Option value="Lion Parcel">Lion Parcel</Select.Option>
                  <Select.Option value="Paxel">Paxel</Select.Option>
                  <Select.Option value="Wahana">Wahana</Select.Option>
                  <Select.Option value="SAP Express">SAP Express</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="amount"
                label={"Amount of Receipt"}
                rules={[
                  { required: true },
                  {
                    pattern: new RegExp(/^[0-9]+$/),
                    message: "Field only accept number",
                  },
                ]}
              >
                <Input
                  disabled={type === "verify"}
                  prefix="Rp."
                  type="number"
                  onlyNumber
                  displayCurrency
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={[12, 12]}>
            <Col>
              <Form.Item
                name="isBillToCustomer"
                label={t("isBillToCustomer")}
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={[
                    { label: "Yes", value: 1 },
                    { label: "No", value: 0 },
                  ]}
                  onChange={() => null}
                  optionType="button"
                  buttonStyle="solid"
                  disabled={type === "verify"}
                />
              </Form.Item>
            </Col>
          </Row> */}
        </>
      )}

      <Row gutter={[12, 12]} justify={"end"}>
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingPodLoad || loadingPodUnload}
            disabled={loadingPodLoad || loadingPodUnload}
          >
            {type === "edit" ? "Submit" : "Verify"}
          </Button>
        </Col>
        <Col>
          <Button
            onClick={handleClose}
            disabled={loadingPodLoad || loadingPodUnload}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormPod;
