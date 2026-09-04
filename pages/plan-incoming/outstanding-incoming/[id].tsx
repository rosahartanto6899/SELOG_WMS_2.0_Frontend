import PageLayout from "@sera-components/layout/page-layout";
import OutstandingIncomingComponent from "@sera-components/pages/plan-incoming/outstanding-incoming";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const OutstandingIncomingDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.page",
  });

  return (
    <PageLayout
      title={t("detailTitle")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING,
        },
        { title: t("breadcrumb.2") },
      ]}
      backUrl={ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}
      isDirectToURL
      withTab={false}
      content={<OutstandingIncomingComponent.OutstandingIncomingDetail />}
    />
  );
};

export default OutstandingIncomingDetailPage;
