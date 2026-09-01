import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { useAppSelector } from "@sera-redux";
import { Form } from "antd";
import { FormInstance } from "antd/lib";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

interface TotalExpensesFormProps {
  form: FormInstance;
  disabled: boolean;
}

const TotalExpensesForm: FC<TotalExpensesFormProps> = ({ form, disabled }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const { totalCost, totalIncentive, revenue, routeCode } =
    Form.useWatch([], form) || {};

  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );

  const route = dropdownCustomerRoutes.data.find((o) => o.id === routeCode);

  useEffect(() => {
    // Calculate Total Expense
    const _totalCost = Number(totalCost) || 0;
    const _totalIncentive = Number(totalIncentive) || 0;

    const _totalExpense = _totalCost + _totalIncentive;
    let _revenue = 0;

    if (route) {
      _revenue = Number(route.revenuePerShipment) || 0;
    }
    const rawPercentage = _revenue ? (_totalExpense / _revenue) * 100 : 0;
    const _expenseRatio = rawPercentage ? `${Math.ceil(rawPercentage)}%` : `0%`;

    form.setFieldsValue({
      totalExpense: _totalExpense,
      expenseRatio: _expenseRatio,
    });
  }, [totalCost, totalIncentive, revenue, route, form]);

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "totalExpense",
      type: "number",
      name: "totalExpense",
      label: t("input.totalExpense.label"),
      placeholder: t("input.totalExpense.placeholder"),
      prefix: "Rp.",
      disabled: true,
    },
    {
      id: "expenseRatio",
      type: "text",
      name: "expenseRatio",
      label: t("input.expenseRatio.label"),
      placeholder: t("input.expenseRatio.placeholder"),
      disabled: true,
    },
    {
      id: "revenue",
      type: "number",
      name: "revenue",
      label: "revenue",
      placeholder: "revenue",
      hidden: true,
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

export default TotalExpensesForm;
