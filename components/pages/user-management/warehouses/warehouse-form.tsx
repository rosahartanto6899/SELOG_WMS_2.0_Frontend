/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import Utils from "@sera-utils/utils";
import { Card, Col, Form, FormInstance, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ActionFormProps {
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  isDetail?: boolean;
}

const ActionForm = ({ form, loading, onSubmit, isDetail }: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "warehouseManagement.form",
  });

  const [dataCustomers, setDataCustomers] = useState<any[]>([]);

  useEffect(() => {
    WmsWarehouseApi()
      .retrieveWarehouseCustomers()
      .then((resp: any) => {
        setDataCustomers(resp?.data?.data || []);
      })
      .catch(() => undefined);
  }, []);

  const requiredMessage = t("message.default");

  return (
    <Form form={form} layout="vertical" disabled={loading} autoComplete="off">
      <Card title={t("title")}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("customer.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="customerId"
            >
              <Select
                id="customerId"
                placeholder={t("customer.placeholder")}
                showSearch
                optionFilterProp="label"
                disabled={isDetail}
                options={dataCustomers.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("code.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="code"
            >
              <Input
                id="code"
                placeholder={t("code.placeholder")}
                disabled={isDetail}
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
                disabled={isDetail}
                maxLength={75}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t("address.label")} name="address">
              <Input
                id="address"
                placeholder={t("address.placeholder")}
                disabled={isDetail}
                maxLength={200}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t("phone.label")} name="phone">
              <Input
                id="phone"
                placeholder={t("phone.placeholder")}
                disabled={isDetail}
                maxLength={50}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {!isDetail && (
        <FormActions>
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                id="cancel"
                className="ant-btn-custom secondary"
                onClick={() =>
                  Utils().onGoBack(router, "/user-management/warehouses")
                }
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
      )}
    </Form>
  );
};

export default ActionForm;
