/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisFile } from "@sera-components/icons";
import { UnitParams } from "@sera-types/expense-refund.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
// import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import usePodCollection from "./hooks/usePodCollection";

interface SummaryProps {
  params: UnitParams;
}

const ListSummary = ({ params }: SummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "podCollection.summary.fields",
  });

  const {
    queries: { fetchSummary },
    data: { summaryData },
    loading: { loadingSummary },
  } = usePodCollection();

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: NUMBER_FORMAT(summaryData?.totalShipment),
        variant: "info",
      },
      {
        label: t("1"),
        value: NUMBER_FORMAT(summaryData?.podLoading),
        variant: "success",
      },
      {
        label: t("2"),
        value: NUMBER_FORMAT(summaryData.podUnloading),
        variant: "warning",
      },
      {
        label: t("3"),
        value: NUMBER_FORMAT(summaryData?.podDelivery),
        variant: "info",
      },
      {
        label: t("5"),
        value: NUMBER_FORMAT(summaryData?.podCheckpoint),
        variant: "error",
      },
      {
        label: t("4"),
        value: NUMBER_FORMAT(summaryData?.podHardcopy),
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisFile />,
    })) as CardSummaryDataProps[];
  }, [summaryData]);

  useEffect(() => {
    fetchSummary(params);
  }, [params]);

  return <CardSummary data={DATA} loading={loadingSummary} />;
};

export default ListSummary;
