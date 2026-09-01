/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisFile } from "@sera-components/icons";
import { UnitParams } from "@sera-types/expense-refund.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import useExpenseRefund from "./hooks/useExpenseRefund";

interface SummaryProps {
  params: UnitParams;
}

const ListSummary = ({ params }: SummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenseRefund.summary.fields",
  });

  const {
    queries: { fetchSummary },
    data: { summaryData },
    loading: { loadingSummary },
  } = useExpenseRefund();

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: NUMBER_FORMAT(summaryData.outstandingRefund),
        variant: "info",
      },
      {
        label: t("1"),
        value: `Rp.${NUMBER_FORMAT(summaryData.outstandingAmount)}`,
        variant: "success",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisFile />,
    })) as CardSummaryDataProps[];
  }, [summaryData]);

  useEffect(() => {
    fetchSummary(params);
  }, [params]);

  return <CardSummary isCurrency data={DATA} loading={loadingSummary} />;
};

export default ListSummary;
