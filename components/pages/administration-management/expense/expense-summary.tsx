/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import {
  ExpenseState,
  expenseTypes,
  FilterParams,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ExpenseSummaryProps {
  params: FilterParams;
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getSummary: typeof expenseActions.getSummaryFetch;
}

const ExpenseSummary = ({
  params,
  loading,
  expenseMonitoring,
  getSummary,
}: ExpenseSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.summary",
  });

  const DATA = useMemo(() => {
    const _data = expenseMonitoring?.getSummary?.data;

    return [
      {
        label: t("fields.0"),
        total: _data?.totalShipmentQty || "0",
        value: `Rp ${NUMBER_FORMAT(_data?.totalShipmentAmount)}`,
        variant: "info",
      },
      {
        label: t("fields.1"),
        total: _data?.totalExpenseRequestedQty || "0",
        value: `Rp ${NUMBER_FORMAT(_data?.totalExpenseRequestedAmount)}`,
        variant: "error",
      },
      {
        label: t("fields.2"),
        total: _data?.totalAdditionalRequestQty || "0",
        value: `Rp ${NUMBER_FORMAT(_data?.totalAdditionalRequestAmount)}`,
        variant: "warning",
      },
      {
        label: t("fields.3"),
        total: _data?.totalTransferredQty || "0",
        value: `Rp ${NUMBER_FORMAT(_data?.totalTransferredAmount)}`,
        variant: "success",
      },
    ] as CardSummaryDataProps[];
  }, [expenseMonitoring?.getSummary?.data]);

  useEffect(() => {
    getSummary({ ...params });
  }, [params]);

  return (
    <CardSummary
      isCurrency
      data={DATA}
      loading={loading[expenseTypes.GET_SUMMARY]}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getSummary: expenseActions.getSummaryFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseSummary);
