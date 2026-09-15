import PageLayout from "@sera-components/layout/page-layout";
import StockAvailabilityComponent from "@sera-components/pages/dashboard/stock-availability";
import { useTranslation } from "react-i18next";

const StockAvailabilityPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<StockAvailabilityComponent.StockAvailabilityInitialPage />}
    />
  );
};

export default StockAvailabilityPage;
