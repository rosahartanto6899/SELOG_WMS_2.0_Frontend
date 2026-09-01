import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useTranslation } from "react-i18next";

const baseOptions = [{ label: "option 1", value: "1" }];

interface IProps {
  type: "create";
}

const EmptyMilesForm = (props: IProps) => {
  const { type } = props;
  const { t } = useTranslation(undefined, { keyPrefix: "emptyMiles.form" });
  const [form] = useForm();

  const requiredMessage = t("input.message");

  const formConfig: ChildConfig[] = [
    {
      type: "select",
      label: t("input.branch.label"),
      name: "branch",
      id: "branch",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "journeyDate",
      type: "date",
      name: "journeyDate",
      label: t("input.journeyDate.label"),

      format: FORMAT_DATE_TIME,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "select",
      label: t("input.origin.label"),
      name: "origin",
      id: "origin",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "select",
      label: t("input.destination.label"),
      name: "destination",
      id: "destination",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "select",
      label: t("input.jmpCode.label"),
      name: "jmpCode",
      id: "jmpCode",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "select",
      label: t("input.classification.label"),
      name: "classification",
      id: "classification",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "reason",
      type: "text",
      name: "reason",
      label: t("input.reason.label"),
      disabled: false,
    },
    {
      type: "select",
      label: t("input.licensePlate.label"),
      name: "licensePlate",
      id: "licensePlate",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("input.unitType.label"),
      disabled: true,
    },
    {
      id: "soNumber",
      type: "text",
      name: "soNumber",
      label: t("input.soNumber.label"),
      disabled: true,
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      disabled: true,
    },
    {
      id: "qtyDriver",
      type: "text",
      name: "qtyDriver",
      label: t("input.qtyDriver.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      type: "select",
      label: t("input.driver1.label"),
      name: "driver1",
      id: "driver1",

      options: baseOptions,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "driver2",
      type: "text",
      name: "driver2",
      label: t("input.driver2.label"),
      disabled: false,
    },
    {
      id: "driverVKVD1",
      type: "text",
      name: "driverVKVD1",
      label: t("input.driverVKVD1.label"),
      disabled: true,
    },
    {
      id: "driverVKVD2",
      type: "text",
      name: "driverVKVD2",
      label: t("input.driverVKVD2.label"),
      disabled: true,
    },
    {
      id: "driverID1",
      type: "text",
      name: "driverID1",
      label: t("input.driverID1.label"),
      disabled: true,
    },
    {
      id: "driverID2",
      type: "text",
      name: "driverID2",
      label: t("input.driverID2.label"),
      disabled: true,
    },
    {
      id: "driverPhone1",
      type: "text",
      name: "driverPhone1",
      label: t("input.driverPhone1.label"),
      disabled: true,
    },
    {
      id: "driverPhone2",
      type: "text",
      name: "driverPhone2",
      label: t("input.driverPhone2.label"),
      disabled: true,
    },
    {
      id: "fuelCost",
      type: "text",
      name: "fuelCost",
      label: t("input.fuelCost.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "tollParking",
      type: "text",
      name: "tollParking",
      label: t("input.tollParking.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "incentiveKM",
      type: "text",
      name: "incentiveKM",
      label: t("input.incentiveKM.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "incentiveDaily",
      type: "text",
      name: "incentiveDaily",
      label: t("input.incentiveDaily.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "harborCrossing",
      type: "text",
      name: "harborCrossing",
      label: t("input.harborCrossing.label"),
      disabled: false,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "expensesAmount",
      type: "text",
      name: "expensesAmount",
      label: t("input.expensesAmount.label"),
      disabled: true,
    },
    {
      id: "expeditionCard",
      type: "text",
      name: "expeditionCard",
      label: t("input.expeditionCard.label"),
      disabled: false,
    },
  ];

  const onSubmit = () => {};

  return (
    <Card title={t(`title.${type}`)}>
      <RsFormBuilder
        name="form-empty-miles"
        layout="vertical"
        form={form}
        type={type}
        configs={formConfig}
        onFinish={onSubmit}
        loading={false}
        disabled={false}
      />
    </Card>
  );
};

export default EmptyMilesForm;
