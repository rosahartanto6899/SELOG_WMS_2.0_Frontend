/* eslint-disable react-hooks/exhaustive-deps */
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisFile } from "@sera-components/icons";
import { useAppSelector } from "@sera-redux";
import { shipmentCancellationsTypes } from "@sera-types/shipment-cancellations.type";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ShipmentCancellationsSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.summary.fields",
  });

  const {
    summary: {
      data: { approved, rejected, waitingForApproval },
    },
  } = useAppSelector((state) => state.shipmentCancellations);

  const loading = useAppSelector((state) => state.loading);

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
  }, [approved, rejected, waitingForApproval]);

  return (
    <CardSummary
      data={DATA}
      loading={
        loading[shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS_SUMMARY]
      }
      height={150}
    />
  );
};

export default ShipmentCancellationsSummary;
