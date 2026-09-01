import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

export default function StockManagementAddPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.SALES_MANAGEMENT.BOOKING_ORDER,
        },
        { title: t("breadcrumb.2.upsert") },
      ]}
      backUrl={ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}
      isDirectToURL
      withTab={false}
      content={<SalesManagementComponent.BookingUpsert />}
    />
  );
}
