import PageLayout from "@sera-components/layout/page-layout";
import ActualIncomingComponent from "@sera-components/pages/plan-incoming/actual-incoming";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const ActualIncomingDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.page",
  });

  return (
    <PageLayout
      title={t("detailTitle")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.PLAN_INCOMING.ACTUAL_INCOMING,
        },
        { title: t("breadcrumb.2") },
      ]}
      backUrl={ROUTE.PLAN_INCOMING.ACTUAL_INCOMING}
      isDirectToURL
      withTab={false}
      content={<ActualIncomingComponent.ActualIncomingDetail />}
    />
  );
};

export default ActualIncomingDetailPage;
