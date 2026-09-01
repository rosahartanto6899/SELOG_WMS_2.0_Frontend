/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTarget } from "@sera-components/icons";
import { UnitParams } from "@sera-types/pairing-matching-ops";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import usePairingMatchingOps from "./hooks/usePairingMatchingOps";

interface PairingMatchingSummaryProps {
  params: UnitParams;
}

const PairingMatchingSummary = ({ params }: PairingMatchingSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.summary.fields",
  });

  const {
    queries: { fetchSummary },
    data: { summaryData },
    loading: { loadingSummary },
  } = usePairingMatchingOps();

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: NUMBER_FORMAT(summaryData.totalShipment),
        variant: "info",
      },
      {
        label: t("1"),
        value: NUMBER_FORMAT(summaryData.needToConfirm),
        variant: "success",
      },
      {
        label: t("2"),
        value: NUMBER_FORMAT(summaryData.repaired),
        variant: "warning",
      },
      {
        label: t("3"),
        value: NUMBER_FORMAT(summaryData.assigned),
        variant: "info",
      },
      {
        label: t("4"),
        value: NUMBER_FORMAT(summaryData.cancelled),
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisTarget />,
    })) as CardSummaryDataProps[];
  }, [summaryData]);

  useEffect(() => {
    fetchSummary(params);
  }, [params]);

  return <CardSummary data={DATA} loading={loadingSummary} height={150} />;
};

export default PairingMatchingSummary;
