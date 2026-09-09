import PageLayout from "@sera-components/layout/page-layout";
import OutstandingOutgoingComponent from "@sera-components/pages/plan-outgoing/outstanding-outgoing";
import { useTranslation } from "react-i18next";

/** Outstanding Outgoing — worklist 4 tab (DN List / DN Items / Packaging /
 *  Shipment), spec 004 Fase 1 (read-only). */
const OutstandingOutgoingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });

  return (
    <PageLayout
      title={t("outstandingTitle")}
      breadcrumb={[
        { title: t("outstandingBreadcrumb.0") },
        { title: t("outstandingBreadcrumb.1") },
      ]}
      content={<OutstandingOutgoingComponent.OutstandingOutgoingInitialPage />}
    />
  );
};

export default OutstandingOutgoingPage;
