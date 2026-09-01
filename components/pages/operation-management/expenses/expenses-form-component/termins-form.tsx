import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { Col, Form, Row, Typography } from "antd";
import { FormInstance } from "antd/lib";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

const { Text } = Typography;

interface TerminsFormProps {
  form: FormInstance;
  disabled: boolean;
}

const TerminsForm: FC<TerminsFormProps> = ({ form, disabled }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const requiredMessage = t("input.message");

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "termin1",
      type: "number",
      name: "termin1",
      label: t("input.termin1.label"),
      placeholder: t("input.termin1.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },

    {
      id: "termin4",
      type: "number",
      name: "termin4",
      label: t("input.termin4.label"),
      placeholder: t("input.termin4.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },

    {
      id: "termin2",
      type: "number",
      name: "termin2",
      label: t("input.termin2.label"),
      placeholder: t("input.termin2.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "termin5",
      type: "number",
      name: "termin5",
      label: t("input.termin5.label"),
      placeholder: t("input.termin5.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "termin3",
      type: "number",
      name: "termin3",
      label: (
        <Trans
          t={t}
          i18nKey="input.termin3.label"
          components={{
            bold: <strong />,
            italic: <i />,
            small: <span style={{ fontSize: "12px" }} />,
          }}
        />
      ),
      placeholder: t("input.termin3.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "termin6",
      type: "number",
      name: "termin6",
      label: (
        <Trans
          t={t}
          i18nKey="input.termin6.label"
          components={{
            bold: <strong />,
            italic: <i />,
            small: <span style={{ fontSize: "12px" }} />,
          }}
        />
      ),
      placeholder: t("input.termin6.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
  ];

  const allValues = Form.useWatch([], form);

  const terminValue = (values: any) => {
    let terminSum = 0;
    for (const key in values) {
      if (key.includes("termin")) {
        terminSum += Number(values[key]) || 0;
      }
    }
    return (allValues?.totalExpense || 0) - terminSum;
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <RsFormBuilder
          type={disabled ? "detail" : "create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={DetailFormConfigHandler(FORM_CONFIG, disabled)}
          isHideFormButton
          loading={disabled}
          disabled={disabled}
        />
      </Col>
      <Col>
        <Text>
          Balance :{" "}
          <span
            style={
              terminValue(allValues) < 0
                ? { color: "red", fontWeight: "bold" }
                : { color: "black", fontWeight: "normal" }
            }
          >
            Rp.{NUMBER_FORMAT(terminValue(allValues))}
          </span>
        </Text>
      </Col>
    </Row>
  );
};

export default TerminsForm;
