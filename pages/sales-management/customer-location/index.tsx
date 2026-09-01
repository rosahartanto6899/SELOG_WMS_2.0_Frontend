import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { useTranslation } from "react-i18next";

// SHIPMENT STATUS = ORDER STATUS (REDUX)
const CustomerLocationPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerLocation" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<SalesManagementComponent.CustomerLocationInitialPage />}
    />
  );
};

export default CustomerLocationPage;
