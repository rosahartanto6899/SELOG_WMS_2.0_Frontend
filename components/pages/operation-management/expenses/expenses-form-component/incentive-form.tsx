import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { Form } from "antd";
import { FormInstance } from "antd/lib";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

interface IncentiveFormProps {
  form: FormInstance;
  disabled: boolean;
}

const IncentiveForm: FC<IncentiveFormProps> = ({ form, disabled }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const requiredMessage = t("input.message");

  const { incentiveKm, incentiveDaily, incentiveSio } =
    Form.useWatch([], form) || {};

  useEffect(() => {
    // Calculate Incentive
    const _incentiveKm = Number(incentiveKm) || 0;
    const _incentiveDaily = Number(incentiveDaily) || 0;
    const _incentiveSio = Number(incentiveSio) || 0;

    const _totalIncentive = _incentiveKm + _incentiveDaily + _incentiveSio;

    form.setFieldsValue({
      totalIncentive: _totalIncentive,
    });
  }, [incentiveKm, incentiveDaily, incentiveSio, form]);

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "incentiveKm",
      type: "number",
      name: "incentiveKm",
      label: t("input.incentiveKm.label"),
      prefix: "Rp.",
      placeholder: t("input.incentiveKm.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "incentiveDaily",
      type: "number",
      name: "incentiveDaily",
      label: t("input.incentiveDaily.label"),
      prefix: "Rp.",
      placeholder: t("input.incentiveDaily.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "incentiveSio",
      type: "number",
      name: "incentiveSio",
      label: t("input.incentiveSio.label"),
      prefix: "Rp.",
      placeholder: t("input.incentiveSio.placeholder"),
    },
    {
      id: "totalIncentive",
      type: "number",
      name: "totalIncentive",
      label: t("input.totalIncentive.label"),
      prefix: "Rp.",
      placeholder: t("input.totalIncentive.placeholder"),
      disabled: true,
    },
  ];

  return (
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
  );
};

export default IncentiveForm;
