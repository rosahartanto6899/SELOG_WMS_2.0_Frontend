/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisFile } from "@sera-components/icons";
import { useAppSelector } from "@sera-redux";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const AdditionalExpenseSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.summary.fields",
  });

  const {
    summary: {
      data: { waitingForApproval, approved, rejected },
    },
  } = useAppSelector((state) => state.additionalExpense);

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: `${waitingForApproval}`,
        variant: "info",
      },
      {
        label: t("1"),
        value: `${approved}`,
        variant: "success",
      },
      {
        label: t("2"),
        value: `${rejected}`,
        variant: "warning",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisFile />,
    })) as CardSummaryDataProps[];
  }, [waitingForApproval, approved, rejected]);

  return <CardSummary data={DATA} loading={false} height={150} />;
};

export default AdditionalExpenseSummary;
