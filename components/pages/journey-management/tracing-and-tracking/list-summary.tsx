/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisCurvy } from "@sera-components/icons";
import { UnitParams } from "@sera-types/tracking-tracking.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import useTracingTracking from "./hooks/useTracingTracking";

interface SummaryProps {
  params: UnitParams;
}

const ListSummary = ({ params }: SummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "tracingAndTracking.summary.fields",
  });

  const {
    queries: { fetchSummary },
    data: { summaryData },
    loading: { loadingSummary },
  } = useTracingTracking();

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: NUMBER_FORMAT(summaryData.shipmentOnDuty),
        variant: "info",
      },
      {
        label: t("1"),
        value: NUMBER_FORMAT(summaryData.unloading),
        variant: "success",
      },
      {
        label: t("2"),
        value: NUMBER_FORMAT(summaryData.onJourney),
        variant: "warning",
      },
      {
        label: t("3"),
        value: NUMBER_FORMAT(summaryData.loading),
        variant: "info",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisCurvy />,
    })) as CardSummaryDataProps[];
  }, [summaryData]);

  useEffect(() => {
    fetchSummary(params);
  }, [params]);

  return <CardSummary data={DATA} loading={loadingSummary} />;
};

export default ListSummary;
