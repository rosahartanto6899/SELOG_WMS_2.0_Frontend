/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import MaterialApi from "@sera-libraries/api/material";
import Utils from "@sera-utils/utils";
import { Card, Col, Form, FormInstance, Row } from "antd";
import { Input as AntdInput } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ActionFormProps {
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  type?: "create" | "update";
}

const MATERIAL_CATEGORIES = ["Part", "Non-Part"];

const ActionForm = ({ form, loading, onSubmit, type }: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.material.form",
  });

  const [barcodes, setBarcodes] = useState<any[]>([]);

  useEffect(() => {
    MaterialApi()
      .retrieveAvailableBarcodes()
      .then((resp: any) => setBarcodes(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  const requiredMessage = t("message.default");

  return (
    <Form form={form} layout="vertical" disabled={loading} autoComplete="off">
      <Card title={t("title")}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("code.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="code"
            >
              <Input
                id="code"
                placeholder={t("code.placeholder")}
                disabled={type === "update"}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("name.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="name"
            >
              <Input
                id="name"
                placeholder={t("name.placeholder")}
                maxLength={200}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("category.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="category"
            >
              <Select
                id="category"
                placeholder={t("category.placeholder")}
                options={MATERIAL_CATEGORIES.map((c) => ({
                  value: c,
                  label: c,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("barcode.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="barcode"
            >
              <Select
                id="barcode"
                placeholder={t("barcode.placeholder")}
                showSearch
                disabled={type === "update"}
                options={barcodes.map((b: any) => ({
                  value: b.barcode,
                  label: b.barcode,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t("brand.label")} name="brand">
              <Input
                id="brand"
                placeholder={t("brand.placeholder")}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t("uom.label")} name="uoM">
              <Input
                id="uoM"
                placeholder={t("uom.placeholder")}
                maxLength={20}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={t("description.label")} name="description">
              <AntdInput.TextArea
                id="description"
                placeholder={t("description.placeholder")}
                maxLength={200}
                rows={2}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <FormActions>
        <Row justify="end" gutter={[8, 8]}>
          <Col>
            <Button
              id="cancel"
              className="ant-btn-custom secondary"
              onClick={() => Utils().onGoBack(router, "/master-data/material")}
              disabled={loading}
            >
              {t("button.cancel")}
            </Button>
          </Col>
          <Col>
            <Button
              id="save"
              type="primary"
              className="ant-btn-custom primary"
              loading={loading}
              onClick={onSubmit}
            >
              {t("button.save")}
            </Button>
          </Col>
        </Row>
      </FormActions>
    </Form>
  );
};

export default ActionForm;
