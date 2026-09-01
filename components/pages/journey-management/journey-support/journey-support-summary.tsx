/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisCurvy } from "@sera-components/icons";
import { useAppSelector } from "@sera-redux";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const JourneySupportSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport.summary.fields",
  });

  const {
    summary: {
      data: { loading, onJourney, total, unloading },
    },
  } = useAppSelector((state) => state.journeySupport);

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: `${total}`,
        variant: "info",
      },
      {
        label: t("1"),
        value: `${unloading}`,
        variant: "warning",
      },
      {
        label: t("2"),
        value: `${onJourney}`,
        variant: "success",
      },
      {
        label: t("3"),
        value: `${loading}`,
        variant: "yellow-accent",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisCurvy />,
    })) as CardSummaryDataProps[];
  }, [loading, onJourney, total, unloading]);

  return <CardSummary data={DATA} loading={false} />;
};

export default JourneySupportSummary;
