import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { OrderStatusCancellationFormProps } from "@sera-components/pages/sales-management/order-status/order-status-update-form";
import { orderStatusActions, useAppDispatch } from "@sera-redux";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const OrderStatusEditPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "orderStatus" });
  const router = useRouter();

  const type = router.query.type as OrderStatusCancellationFormProps["type"];
  const id = router.query.id as string;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(orderStatusActions.getOrderStatusDetailFetch({ id }));

    return () => {
      dispatch(orderStatusActions.getOrderStatusDetailClear());
    };
  }, []);

  const UPDATE_TYPES = ["cancel", "reschedule", "reroute"] as const;

  if (!type || !UPDATE_TYPES.includes(type)) {
    router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS);
    return;
  }
  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS,
          },
          { title: t("breadcrumb.2.detail") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS}
        isDirectToURL
      />
      <SalesManagementComponent.OrderStatusUpdateForm type={type} />
    </>
  );
};

export default OrderStatusEditPage;
