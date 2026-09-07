import OutstandingIncomingComponent from "@sera-components/pages/plan-incoming/outstanding-incoming";
import PageLayout from "@sera-components/layout/page-layout";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const OutstandingIncomingBinningPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.binning",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING,
        },
        { title: t("title") },
      ]}
      backUrl={ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}
      isDirectToURL
      withTab={false}
      content={<OutstandingIncomingComponent.BinningPage />}
    />
  );
};

export default OutstandingIncomingBinningPage;
