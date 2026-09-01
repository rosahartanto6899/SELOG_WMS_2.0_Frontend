import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTarget } from "@sera-components/icons";
import { useAppSelector } from "@sera-redux";
import { expensesTypes } from "@sera-types/expenses.type";
import React from "react";
import { useTranslation } from "react-i18next";

const ExpensesSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses.summary",
  });

  const {
    summaryExpenses: {
      data: {
        summary: { completed, incompleted, total },
      },
    },
  } = useAppSelector((state) => state.expenses);
  const DATA_SUMMARY: CardSummaryDataProps[] = [
    {
      label: t("totalExpenses"),
      icon: <LogisTarget />,
      value: `${total}`,
      variant: "info",
    },
    {
      label: t("completed"),
      icon: <LogisTarget />,
      value: `${completed}`,
      variant: "success",
    },
    {
      label: t("incomplete"),
      icon: <LogisTarget />,
      value: `${incompleted}`,
      variant: "warning",
    },
  ];

  const loading = useAppSelector((state) => state.loading);
  return (
    <CardSummary
      data={DATA_SUMMARY}
      height={"15rem"}
      loading={loading[expensesTypes.GET_SUMMARY_EXPENSES]}
    />
  );
};

export default ExpensesSummary;
