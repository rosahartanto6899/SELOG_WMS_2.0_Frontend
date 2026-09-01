import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import { LogisTarget } from "@sera-components/icons";
import { ApprovalBookingOrderSummary } from "@sera-types/approval-booking-order.type";
import React from "react";
import { useTranslation } from "react-i18next";

const ApprovalBookingSummary = ({
  data,
}: {
  data: ApprovalBookingOrderSummary;
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder.table",
  });
  const DATA_SUMMARY: CardSummaryDataProps[] = [
    {
      label: t("card.totalOrder"),
      icon: <LogisTarget />,
      value: `${data.totalOrder}`,
      variant: "info",
    },
    {
      label: t("card.orderConfirmed"),
      icon: <LogisTarget />,
      value: `${data.totalConfirmed}`,
      variant: "success",
    },
    {
      label: t("card.orderRequested"),
      icon: <LogisTarget />,
      value: `${data.totalRequested}`,
      variant: "warning",
    },
    {
      label: t("card.orderRejected"),
      icon: <LogisTarget />,
      value: `${data.totalRejected}`,
      variant: "error",
    },
    {
      label: t("card.orderCancelled"),
      icon: <LogisTarget />,
      value: `${data.totalCancelled}`,
      variant: "info",
      customVariant: ["#f7efed", "#d2b1ad"],
    },
  ];
  return <CardSummary data={DATA_SUMMARY} height={"14rem"} />;
};

export default ApprovalBookingSummary;
