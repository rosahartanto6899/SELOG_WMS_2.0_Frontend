/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
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

const ActionForm = ({ form, loading, onSubmit, type }: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.zone.form",
  });

  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    WmsWarehouseApi()
      .retrieveDropdownWarehouses()
      .then((resp: any) => setWarehouses(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  const requiredMessage = t("message.default");

  return (
    <Form form={form} layout="vertical" disabled={loading} autoComplete="off">
      <Card title={t("title")}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("warehouse.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="warehouseCode"
            >
              <Select
                id="warehouseCode"
                placeholder={t("warehouse.placeholder")}
                showSearch
                optionFilterProp="label"
                disabled={type === "update"}
                options={warehouses.map((w: any) => ({
                  value: w.code,
                  label: w.name,
                  name: w.name,
                }))}
                onChange={(_v: any, opt: any) =>
                  form.setFieldValue("warehouseName", opt?.name)
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="warehouseName" hidden>
              <Input id="warehouseName" />
            </Form.Item>
            <Form.Item
              label={t("code.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="code"
            >
              <Input
                id="code"
                placeholder={t("code.placeholder")}
                disabled={type === "update"}
                maxLength={50}
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
                maxLength={75}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
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
              onClick={() => Utils().onGoBack(router, "/master-data/zone")}
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
