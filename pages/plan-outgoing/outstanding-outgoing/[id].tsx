import PageLayout from "@sera-components/layout/page-layout";
import DnDetailPage from "@sera-components/pages/plan-outgoing/outstanding-outgoing/dn-detail-page";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

/** View detail DN outstanding — ?id= (spec 004 Fase 3). */
const OutstandingOutgoingDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });

  return (
    <PageLayout
      title={t("outstandingDetailTitle")}
      breadcrumb={[
        { title: t("outstandingDetailBreadcrumb.0") },
        {
          title: t("outstandingDetailBreadcrumb.1"),
          url: ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING,
        },
        { title: t("outstandingDetailBreadcrumb.2") },
      ]}
      backUrl={ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}
      isDirectToURL
      withTab={false}
      content={<DnDetailPage />}
    />
  );
};

export default OutstandingOutgoingDetailPage;
