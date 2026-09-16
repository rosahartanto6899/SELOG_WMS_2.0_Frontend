/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@sera-components/button";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import LocationApi from "@sera-libraries/api/location";
import ZoneApi from "@sera-libraries/api/zone";
import Utils from "@sera-utils/utils";
import { Card, Col, Form, FormInstance, Row } from "antd";
import { Input as AntdInput } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ActionFormProps {
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  type?: "create" | "update";
  warehouseCode?: string | null;
  currentZoneId?: string | null;
  currentZoneName?: string | null;
}

const LOCATION_CATEGORIES = ["Binning Location"];

const ActionForm = ({
  form,
  loading,
  onSubmit,
  type,
  warehouseCode,
  currentZoneId,
  currentZoneName,
}: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.location.form",
  });
  const { data: session } = useSession() as any;
  const sessionWarehouseCode = session?.user?.warehouseCode ?? undefined;

  const [zones, setZones] = useState<any[]>([]);
  const [barcodes, setBarcodes] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    warehouseCode ?? null,
  );

  // add mode: warehouse follows the header's "Switch Warehouse" selection;
  // update mode: follows the detail's warehouse once it arrives from the API
  useEffect(() => {
    if (type === "update") {
      setSelectedWarehouse(warehouseCode ?? null);
    } else if (sessionWarehouseCode) {
      setSelectedWarehouse(sessionWarehouseCode);
    }
  }, [type, warehouseCode, sessionWarehouseCode]);

  useEffect(() => {
    LocationApi()
      .retrieveAvailableBarcodes()
      .then((resp: any) => setBarcodes(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  // zone follows the selected warehouse
  useEffect(() => {
    if (selectedWarehouse) {
      ZoneApi()
        .retrieveDropdownZones()
        .then((resp: any) => setZones(resp?.data?.data ?? []))
        .catch(() => undefined);
    } else {
      setZones([]);
    }
  }, [selectedWarehouse]);

  // ponytail: merge zone lama dari detail ke options — /zones/dropdown tidak
  // selalu memuat zone milik location yang diedit (beda scope) & value ter-set
  // sebelum fetch selesai, jadi tanpa ini antd render UUID mentah
  const zoneOptions = zones.map((z: any) => ({
    value: z.id,
    label: `${z.code} — ${z.name}`,
  }));
  if (currentZoneId && !zones.some((z: any) => z.id === currentZoneId)) {
    zoneOptions.unshift({
      value: currentZoneId,
      label: currentZoneName ?? currentZoneId,
    });
  }

  const requiredMessage = t("message.default");

  return (
    <Form form={form} layout="vertical" disabled={loading} autoComplete="off">
      <Card title={t("cardTitle")}>
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
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("zone.label")}
              rules={[{ required: true, message: requiredMessage }]}
              name="zoneId"
            >
              <Select
                id="zoneId"
                placeholder={t("zone.placeholder")}
                showSearch
                optionFilterProp="label"
                disabled={type === "update" && !selectedWarehouse}
                options={zoneOptions}
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
            <Form.Item label={t("category.label")} name="category">
              <Select
                id="category"
                placeholder={t("category.placeholder")}
                allowClear
                options={LOCATION_CATEGORIES.map((c) => ({
                  value: c,
                  label: c,
                }))}
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
              onClick={() => Utils().onGoBack(router, "/master-data/location")}
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
