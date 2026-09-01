import PageLayout from "@sera-components/layout/page-layout";
import StockManagementComponent from "@sera-components/pages/fleet-management/stock-management";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

export default function StockManagementAddPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  return (
    <PageLayout
      title={t("breadcrumb.2.upsert")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT,
        },
        { title: t("breadcrumb.2.upsert") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}
      isDirectToURL
      withTab={false}
      content={<StockManagementComponent.UpsertBulk />}
    />
  );
}
