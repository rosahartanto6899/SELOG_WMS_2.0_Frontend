/* eslint-disable react-hooks/exhaustive-deps */
import { BoxPlotOutlined } from "@ant-design/icons";
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { useAppSelector } from "@sera-redux";
import { outstandingOutgoingTypes } from "@sera-types/outstanding-outgoing.type";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/** Summary total outstanding + rincian per warehouse (Q10/Q11) — parity
 *  outstanding-incoming-summary (rincian langsung kartu, bukan modal legacy). */
const OutstandingOutgoingSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.summary.fields",
  });

  const {
    totals: { data },
  } = useAppSelector((state) => state.outstandingOutgoing);

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
      loading={loading[outstandingOutgoingTypes.GET_OUTGOING_TOTALS]}
      height={150}
    />
  );
};

export default OutstandingOutgoingSummary;
