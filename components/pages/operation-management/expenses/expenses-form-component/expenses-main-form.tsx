import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { useAppSelector } from "@sera-redux";
import { AllCustomerRouteDropdown } from "@sera-types/customer-route.type";
import { Form } from "antd";
import { FormInstance } from "antd/lib";
import { orderBy } from "lodash";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

interface ExpensesMainFormProps {
  form: FormInstance;
  disabled: boolean;
}

const DRVIER_TYPE_OPTIONS = [
  {
    label: "PKWT",
    value: "PKWT",
  },
  {
    label: "MITRA",
    value: "Mitra",
  },
];

const ExpensesMainForm: FC<ExpensesMainFormProps> = ({ form, disabled }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const requiredMessage = t("input.message");

  const { routeCode } = Form.useWatch([], form) || {};

  const { dropdownBusinessAreas } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );

  const BRANCH_OPTIONS = dropdownBusinessAreas.data.map((v) => ({
    label: v.name,
    value: v.id,
  }));

  const CUSTOMER_ROUTE_OPTIONS = dropdownCustomerRoutes.data.map((v) => ({
    label: v.originalRouteCode,
    value: v.id,
  }));

  useEffect(() => {
    if (routeCode && dropdownCustomerRoutes.data.length) {
      const {
        customerName,
        // tollUsage,
        qtyDriver,
        origin,
        destination,
        vehicleTypeName,
        leadtimeType,
        leadtimeValue,
        shipmentType,
        revenuePerShipment,
        tollUsageName,
      } = (dropdownCustomerRoutes.data.find((o) => o.id === routeCode) ||
        {}) as AllCustomerRouteDropdown;

      form.setFieldsValue({
        customerName: customerName,
        tollUsage: tollUsageName,
        totalDriver: qtyDriver,
        origin: origin,
        destination: destination,
        unitType: vehicleTypeName,
        leadTime: `${leadtimeValue || 0} ${leadtimeType}`,
        shipmentType,
        revenue: revenuePerShipment,
      });
    }

    return () => {
      form.resetFields([
        "customerName",
        "tollUsage",
        "totalDriver",
        "origin",
        "destination",
        "unitType",
        "leadTime",
        "shipmentType",
      ]);
    };
  }, [routeCode, form, dropdownCustomerRoutes.data]);

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "routeCode",
      type: "select",
      options: CUSTOMER_ROUTE_OPTIONS,
      name: "routeCode",
      label: t("input.routeCode.label"),
      placeholder: t("input.routeCode.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
      order: 1,
    },
    {
      id: "jmpCode",
      type: "text",
      name: "jmpCode",
      label: t("input.jmpCode.label"),
      placeholder: t("input.jmpCode.placeholder"),
      hidden: !disabled,
      order: 2,
    },
    {
      id: "tollUsage",
      type: "text",
      name: "tollUsage",
      label: t("input.tollUsage.label"),
      placeholder: t("input.tollUsage.placeholder"),
      disabled: true,
      order: 3,
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      disabled: true,
      order: disabled ? 6 : 4,
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("input.unitType.label"),
      placeholder: t("input.unitType.placeholder"),
      disabled: true,
      order: disabled ? 4 : 5,
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("input.origin.label"),
      placeholder: t("input.origin.placeholder"),
      disabled: true,
      order: disabled ? 7 : 6,
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("input.destination.label"),
      placeholder: t("input.destination.placeholder"),
      disabled: true,
      order: disabled ? 8 : 7,
    },
    {
      id: "leadTime",
      type: "text",
      name: "leadTime",
      label: t("input.leadTime.label"),
      placeholder: t("input.leadTime.placeholder"),
      disabled: true,
      order: disabled ? 12 : 8,
    },
    {
      id: "totalDriver",
      type: "text",
      name: "totalDriver",
      label: t("input.totalDriver.label"),
      placeholder: t("input.totalDriver.placeholder"),
      disabled: true,
      order: 9,
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      disabled: true,
      rules: [{ required: true, message: requiredMessage }],
      order: disabled ? 5 : 10,
    },
    {
      id: "revenue",
      type: "number",
      name: "revenue",
      label: t("input.revenue.label"),
      prefix: "Rp.",
      placeholder: t("input.revenue.placeholder"),
      disabled: true,
      order: disabled ? 13 : 11,
    },
    {
      id: "branchId",
      type: "select",
      options: BRANCH_OPTIONS,
      name: "branchId",
      label: t("input.branchId.label"),
      placeholder: t("input.branchId.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
      order: disabled ? 11 : 12,
    },
    {
      id: "driverType",
      type: "select",
      options: DRVIER_TYPE_OPTIONS,
      name: "driverType",
      label: t("input.driverType.label"),
      rules: [{ required: true, message: requiredMessage }],
      placeholder: t("input.driverType.placeholder"),
      order: disabled ? 10 : 13,
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
      configs={DetailFormConfigHandler(
        orderBy(FORM_CONFIG, ["order"], "asc"),
        disabled,
      )}
      isHideFormButton
      loading={disabled}
      disabled={disabled}
    />
  );
};

export default ExpensesMainForm;
