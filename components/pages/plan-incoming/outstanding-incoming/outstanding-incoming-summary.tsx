/* eslint-disable react-hooks/exhaustive-deps */
import { BoxPlotOutlined } from "@ant-design/icons";
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { useAppSelector } from "@sera-redux";
import { outstandingIncomingTypes } from "@sera-types/outstanding-incoming.type";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const OutstandingIncomingSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.summary.fields",
  });

  const {
    summary: { data },
  } = useAppSelector((state) => state.outstandingIncoming);

  const loading = useAppSelector((state) => state.loading);

  const DATA = useMemo(() => {
    const cards: CardSummaryDataProps[] = [
      {
        label: t("total"),
        value: `${data?.total ?? 0}`,
        variant: "info",
        icon: <BoxPlotOutlined />,
      },
    ];
    (data?.byWarehouse ?? []).slice(0, 3).forEach((wh) => {
      cards.push({
        label: wh.warehouseName ?? wh.warehouseCode ?? "-",
        value: `${wh.totalDataOutstanding}`,
        variant: "sub-info",
        icon: <BoxPlotOutlined />,
      });
    });
    return cards;
  }, [data]);

  return (
    <CardSummary
      data={DATA}
      loading={
        loading[outstandingIncomingTypes.GET_OUTSTANDING_INCOMING_SUMMARY]
      }
      height={150}
    />
  );
};

export default OutstandingIncomingSummary;
