import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { Form } from "antd";
import { FormInstance } from "antd/lib";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

interface OperationalCostsFormProps {
  form: FormInstance;
  disabled: boolean;
}

const OperationalCostsForm: FC<OperationalCostsFormProps> = ({
  form,
  disabled,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const requiredMessage = t("input.message");

  const {
    fuel,
    toll,
    mell,
    loadingUnloading,
    harborCrossing,
    workerContributions,
    security,
    documentShippingFee,
  } = Form.useWatch([], form) || {};

  useEffect(() => {
    // Calculate Operational Costs
    const _fuel = Number(fuel) || 0;
    const _toll = Number(toll) || 0;
    const _mell = Number(mell) || 0;
    const _loadingUnloading = Number(loadingUnloading) || 0;
    const _harborCrossing = Number(harborCrossing) || 0;
    const _workerContributions = Number(workerContributions) || 0;
    const _security = Number(security) || 0;
    const _docShipmentFee = Number(documentShippingFee) || 0;

    const _totalCost =
      _fuel +
      _toll +
      _mell +
      _loadingUnloading +
      _harborCrossing +
      _workerContributions +
      _security +
      _docShipmentFee;

    form.setFieldsValue({
      totalCost: _totalCost,
    });
  }, [
    fuel,
    toll,
    mell,
    loadingUnloading,
    harborCrossing,
    workerContributions,
    security,
    documentShippingFee,
    form,
  ]);

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "fuel",
      type: "number",
      name: "fuel",
      label: t("input.fuel.label"),
      placeholder: t("input.fuel.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "toll",
      type: "number",
      name: "toll",
      label: t("input.toll.label"),
      placeholder: t("input.toll.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "mell",
      type: "number",
      name: "mell",
      label: t("input.mell.label"),
      placeholder: t("input.mell.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "loadingUnloading",
      type: "number",
      name: "loadingUnloading",
      label: t("input.loadingUnloading.label"),
      placeholder: t("input.loadingUnloading.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "harborCrossing",
      type: "number",
      name: "harborCrossing",
      label: t("input.harborCrossing.label"),
      placeholder: t("input.harborCrossing.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "workerContributions",
      type: "number",
      name: "workerContributions",
      label: t("input.workerContributions.label"),
      placeholder: t("input.workerContributions.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "security",
      type: "number",
      name: "security",
      label: t("input.security.label"),
      placeholder: t("input.security.placeholder"),
      prefix: "Rp.",
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "documentShippingFee",
      type: "number",
      name: "documentShippingFee",
      label: t("input.documentShippingFee.label"),
      prefix: "Rp.",
      placeholder: t("input.documentShippingFee.placeholder"),
    },
    {
      id: "totalCost",
      type: "number",
      name: "totalCost",
      label: t("input.totalCost.label"),
      prefix: "Rp.",
      placeholder: t("input.totalCost.placeholder"),
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

export default OperationalCostsForm;
