import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { Form } from "antd";
import { FormInstance } from "antd/lib";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DetailFormConfigHandler } from "../expenses-form";

interface DistanceFuelFormProps {
  form: FormInstance;
  disabled: boolean;
}

const DistanceFuelForm: FC<DistanceFuelFormProps> = ({ form, disabled }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });

  const requiredMessage = t("input.message");

  const {
    distanceCargo,
    toleranceCargo,
    distanceEmpty,
    toleranceEmpty,
    fuelCargo,
    fuelEmpty,
  } = Form.useWatch([], form) || {};

  const parseCommaNumber = (val: number) => {
    return Number(String(val ?? "")?.replace(/,/g, ".")) || 0;
  };

  useEffect(() => {
    // Calculate Total Distance Cargo
    const _distanceCargo = Number(distanceCargo) || 0;
    const _toleranceCargo = Number(toleranceCargo) || 0;
    const _totalDistanceCargo = _distanceCargo + _toleranceCargo;

    // Calculate Total Distance Empty
    const _distanceEmpty = Number(distanceEmpty) || 0;
    const _toleranceEmpty = Number(toleranceEmpty) || 0;
    const _totalDistanceEmpty = _distanceEmpty + _toleranceEmpty;

    // Calculate Grand Total Distance
    const _totalDistance = _totalDistanceCargo + _totalDistanceEmpty;

    // Calculate Total Fuel
    const _fuelCargo = parseCommaNumber(fuelCargo);
    const _fuelEmpty = parseCommaNumber(fuelEmpty);
    const _totalFuel = _fuelCargo + _fuelEmpty;

    form.setFieldsValue({
      totalDistanceCargo: _totalDistanceCargo,
      totalDistanceEmpty: _totalDistanceEmpty,
      totalDistance: _totalDistance,
      totalFuel: _totalFuel?.toString()?.replace(".", ","),
    });
  }, [
    distanceCargo,
    toleranceCargo,
    distanceEmpty,
    toleranceEmpty,
    fuelCargo,
    fuelEmpty,
    form,
  ]);

  const FORM_CONFIG: ChildConfig[] = [
    {
      id: "distanceCargo",
      type: "number",
      name: "distanceCargo",
      label: t("input.distanceCargo.label"),
      placeholder: t("input.distanceCargo.placeholder"),
    },
    {
      id: "toleranceCargo",
      type: "number",
      name: "toleranceCargo",
      label: t("input.toleranceCargo.label"),
      placeholder: t("input.toleranceCargo.placeholder"),
    },
    {
      id: "totalDistanceCargo",
      type: "number",
      name: "totalDistanceCargo",
      label: t("input.totalDistanceCargo.label"),
      placeholder: t("input.totalDistanceCargo.placeholder"),
      disabled: true,
    },
    {
      id: "distanceEmpty",
      type: "number",
      name: "distanceEmpty",
      label: t("input.distanceEmpty.label"),
      placeholder: t("input.distanceEmpty.placeholder"),
    },
    {
      id: "toleranceEmpty",
      type: "number",
      name: "toleranceEmpty",
      label: t("input.toleranceEmpty.label"),
      placeholder: t("input.toleranceEmpty.placeholder"),
    },
    {
      id: "totalDistanceEmpty",
      type: "number",
      name: "totalDistanceEmpty",
      label: t("input.totalDistanceEmpty.label"),
      placeholder: t("input.totalDistanceEmpty.placeholder"),
      disabled: true,
    },
    {
      id: "totalDistance",
      type: "number",
      name: "totalDistance",
      label: t("input.totalDistance.label"),
      placeholder: t("input.totalDistance.placeholder"),
      disabled: true,
    },
    {
      id: "fuelCargo",
      type: "number",
      allowFraction: true,
      name: "fuelCargo",
      label: t("input.fuelCargo.label"),
      placeholder: t("input.fuelCargo.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "fuelEmpty",
      type: "number",
      allowFraction: true,
      name: "fuelEmpty",
      label: t("input.fuelEmpty.label"),
      placeholder: t("input.fuelEmpty.placeholder"),
    },
    {
      id: "totalFuel",
      type: "number",
      allowFraction: true,
      name: "totalFuel",
      label: t("input.totalFuel.label"),
      placeholder: t("input.totalFuel.placeholder"),
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

export default DistanceFuelForm;
