import PageLayout from "@sera-components/layout/page-layout";
import StockAvailabilityDetailPage from "@sera-components/pages/dashboard/stock-availability/stock-availability-detail-page";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

const StockAvailabilityDetailPageRoute = () => {
  const router = useRouter();
  const { data: session } = useSession() as any;
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability",
  });

  return (
    <PageLayout
      title={t("detail.title")}
      backUrl={ROUTE.DASHBOARD_STOCK_AVAILABILITY}
      breadcrumb={[
        { title: t("page.breadcrumb.0") },
        {
          title: t("page.breadcrumb.1"),
          url: ROUTE.DASHBOARD_STOCK_AVAILABILITY,
        },
        { title: t("detail.title") },
      ]}
      content={
        <StockAvailabilityDetailPage
          materialCode={String(router.query.materialCode ?? "")}
          customerCode={(session?.user?.customerCode ?? "") as string}
          warehouseCode={(session?.user?.warehouseCode ?? "") as string}
        />
      }
    />
  );
};

export default StockAvailabilityDetailPageRoute;
