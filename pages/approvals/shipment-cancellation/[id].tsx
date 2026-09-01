import PageLayout from "@sera-components/layout/page-layout";
import ApprovalsManagementComponent from "@sera-components/pages/approvals";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const ShipmentCancellationsDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        {
          title: t("breadcrumb.0"),
        },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS,
        },
        { title: t("breadcrumb.2") },
      ]}
      backUrl={ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS}
      isDirectToURL
      withTab={false}
      content={<ApprovalsManagementComponent.ShipmentCancellationsDetail />}
    />
  );
};

export default ShipmentCancellationsDetailPage;
