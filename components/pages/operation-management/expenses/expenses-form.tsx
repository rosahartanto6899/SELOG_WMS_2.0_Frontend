import Button from "@sera-components/button";
import Card from "@sera-components/card";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  businessAreaActions,
  customerRouteActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { expensesTypes } from "@sera-types/expenses.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Flex, Row, Space } from "antd";
import { FormInstance } from "antd/lib";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import DistanceFuelForm from "./expenses-form-component/distance-fuel-form";
import ExpensesMainForm from "./expenses-form-component/expenses-main-form";
import IncentiveForm from "./expenses-form-component/incentive-form";
import OperationalCostsForm from "./expenses-form-component/operational-costs-form";
import TerminsForm from "./expenses-form-component/termins-form";
import TotalExpensesForm from "./expenses-form-component/total-expenses-form";

interface ExpensesFormProps {
  form: FormInstance;
  type: "edit" | "create" | "detail";
  onSubmit?: () => void;
}

export const DetailFormConfigHandler = (
  config: ChildConfig[],
  isDisabled: boolean,
) => {
  if (!isDisabled) return config;
  return config.map((v) => ({
    ...v,
    placeholder: undefined,
    disabled: isDisabled,
    readOnly: true,
    rules: [],
    showCount: undefined,
  }));
};

const ExpensesForm: FC<ExpensesFormProps> = ({ form, type, onSubmit }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses.form" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { detailExpenses } = useAppSelector((state) => state.expenses);
  const loading = useAppSelector((state) => state.loading);

  const isDetail = type === "detail";
  const isEdit = type === "edit";

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    dispatch(
      customerRouteActions.getDropdownCustomerRoutesFetch({
        limit: 1000,
        page: 1,
      }),
    );
    return () => {
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
    };
  }, []);

  useEffect(() => {
    if (detailExpenses.data?.id && (isDetail || isEdit)) {
      const {
        customerRouteId,
        branchId,
        shipmentType,
        driverType,
        distanceFuelCalculation,
        operationalCosts,
        incentive,
        totalExpenses,
        ...rest
      } = detailExpenses.data || {};

      const {
        distanceWithCargo,
        distanceWithoutCargo,
        toleranceWithCargo,
        toleranceWithoutCargo,
        ..._distanceFuelCalculation
      } = distanceFuelCalculation || {};

      const _operationCost = operationalCosts || {};
      const { incentiveKM, incentiveSIO, ..._incentive } = incentive || {};
      const _totalExpenses = totalExpenses || {};

      form.setFieldsValue({
        routeCode: customerRouteId,
        branchId,
        shipmentType,
        driverType,
        distanceCargo: distanceWithCargo,
        toleranceCargo: toleranceWithCargo,
        distanceEmpty: distanceWithoutCargo,
        toleranceEmpty: toleranceWithoutCargo,
        incentiveKm: incentiveKM,
        incentiveSio: incentiveSIO,
        ...rest,
        ..._distanceFuelCalculation,
        ..._operationCost,
        ..._incentive,
        ..._totalExpenses,
      });
    }
  }, [detailExpenses.data?.id, type]);

  return (
    <Flex vertical gap={32}>
      <Card title={t("section.routeInformation")}>
        <ExpensesMainForm form={form} disabled={isDetail} />
      </Card>

      <Card title={t("section.distanceFuel")}>
        <DistanceFuelForm form={form} disabled={isDetail} />
      </Card>

      <Card title={t("section.operational")}>
        <OperationalCostsForm form={form} disabled={isDetail} />
      </Card>

      <Card title={t("section.incentive")}>
        <IncentiveForm form={form} disabled={isDetail} />
      </Card>

      <Card title={t("section.totalExpenses")}>
        <TotalExpensesForm form={form} disabled={isDetail} />
      </Card>

      <Card title={t("section.termins")}>
        <TerminsForm form={form} disabled={isDetail} />
      </Card>

      {!isDetail && (
        <Row justify={"end"}>
          <Space style={{ marginTop: "1rem" }} align="end" wrap>
            <Button
              disabled={
                loading[expensesTypes.UPDATE_EXPENSES] ||
                loading[expensesTypes.CREATE_EXPENSES]
              }
              onClick={() => router.push(ROUTE.OPERATION_MANAGEMENT.EXPENSES)}
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="primary"
              onClick={onSubmit}
              disabled={
                loading[expensesTypes.UPDATE_EXPENSES] ||
                loading[expensesTypes.CREATE_EXPENSES]
              }
            >
              {t("button.save")}
            </Button>
          </Space>
        </Row>
      )}
    </Flex>
  );
};

export default ExpensesForm;
