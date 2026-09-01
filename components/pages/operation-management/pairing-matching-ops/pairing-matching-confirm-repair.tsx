import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { PairingRepairPayload } from "@sera-types/pairing-matching-ops";
import { Col, Row, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { includes } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";

const { Title } = Typography;

interface IFormBody {
  repairOptions: string[];
  note: string;
}

interface IProps {
  onCancel: () => void;
  onFinish: (arsg: PairingRepairPayload) => void;
  licensePlate: string | null | undefined;
  driverName1: string | null | undefined;
  driverName2: string | null | undefined;
  qtyDriver: number;
}

const PairingMatchingConfirmRepair = (props: IProps) => {
  const {
    onCancel,
    onFinish: handleFinish,
    licensePlate,
    driverName1,
    driverName2,
    qtyDriver,
  } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.confirmation.form",
  });

  const messageRequired = t("message.required");
  const {
    loading: { loadingPairingRepair },
  } = usePairingMatchingOps();

  const [form] = useForm();

  const confirmationOption = [
    {
      label: `Unit (${licensePlate ?? "-"})`,
      value: "vehicleId",
    },
    {
      label: `Driver 1 (${driverName1 ?? "-"})`,
      value: "driverId1",
    },
  ];

  if (qtyDriver > 1)
    confirmationOption.push({
      label: `Driver 2 (${driverName2 ?? "-"})`,
      value: "driverId2",
    });

  const FORM_CONFIG = [
    {
      id: "A",
      type: "checkbox",
      name: "repairOptions",
      options: confirmationOption,
      columns: { span: 24 },
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "B",
      type: "text",
      name: "note",
      label: t("input.B.label"),
      readOnly: false,
    },
  ] as ChildConfig[];

  const onFinish = (body: IFormBody) => {
    const requestBody: PairingRepairPayload = {
      note: body.note ?? "",
      vehicleId: Boolean(includes(body.repairOptions, "vehicleId")),
      driverId1: Boolean(includes(body.repairOptions, "driverId1")),
      ...(qtyDriver > 1 && {
        driverId2: Boolean(includes(body.repairOptions, "driverId2")),
      }),
    };

    handleFinish(requestBody);
  };

  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
        <Title level={5}>{t("title")}</Title>
      </Col>
      <Col span={24}>
        <RsFormBuilder
          name="form-pairing-matching-ops"
          layout="vertical"
          form={form}
          type="create"
          configs={FORM_CONFIG}
          submitText={t("button.submit")}
          onFinish={(e) => onFinish(e)}
          loading={loadingPairingRepair}
          disabled={loadingPairingRepair}
          onCancel={onCancel}
          fullWidth
        />
      </Col>
    </Row>
  );
};

export default PairingMatchingConfirmRepair;
