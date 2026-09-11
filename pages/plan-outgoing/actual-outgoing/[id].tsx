import PageLayout from "@sera-components/layout/page-layout";
import ActualOutgoingDetailPage from "@sera-components/pages/plan-outgoing/actual-outgoing/actual-outgoing-detail-page";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

/** View Actual Outgoing Detail — read-only (spec 005; parity actual-incoming detail). */
const ActualOutgoingDetailPageRoute = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });

  return (
    <PageLayout
      title={t("actualOutgoingDetailTitle")}
      breadcrumb={[
        { title: t("actualOutgoingDetailBreadcrumb.0") },
        {
          title: t("actualOutgoingDetailBreadcrumb.1"),
          url: ROUTE.PLAN_OUTGOING.ACTUAL_OUTGOING,
        },
        { title: t("actualOutgoingDetailBreadcrumb.2") },
      ]}
      backUrl={ROUTE.PLAN_OUTGOING.ACTUAL_OUTGOING}
      isDirectToURL
      withTab={false}
      content={<ActualOutgoingDetailPage />}
    />
  );
};

export default ActualOutgoingDetailPageRoute;
