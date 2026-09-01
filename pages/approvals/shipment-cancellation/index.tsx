import PageLayout from "@sera-components/layout/page-layout";
import ApprovalsManagementComponent from "@sera-components/pages/approvals";
import { useTranslation } from "react-i18next";

const ShipmentCancellationsPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={
        <ApprovalsManagementComponent.ShipmentCancellationsInitialPage />
      }
    />
  );
};

export default ShipmentCancellationsPage;
