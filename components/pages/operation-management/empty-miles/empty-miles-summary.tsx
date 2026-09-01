/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTarget } from "@sera-components/icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const EmptyMilesSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles.summary.fields",
  });

  const DATA = useMemo(() => {
    return [
      {
        label: t("0"),
        value: "55",
        variant: "info",
      },
      {
        label: t("1"),
        value: "19",
        variant: "success",
      },
      {
        label: t("2"),
        value: "0",
        variant: "warning",
      },
      {
        label: t("3"),
        value: "14",
        variant: "info",
      },
      {
        label: t("4"),
        value: "36",
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisTarget />,
    })) as CardSummaryDataProps[];
  }, []);

  return <CardSummary data={DATA} loading={false} />;
};

export default EmptyMilesSummary;
