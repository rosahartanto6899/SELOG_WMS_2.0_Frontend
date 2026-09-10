import PageLayout from "@sera-components/layout/page-layout";
import OutstandingIncomingComponent from "@sera-components/pages/plan-incoming/outstanding-incoming";
import { useTranslation } from "react-i18next";

const OutstandingIncomingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<OutstandingIncomingComponent.OutstandingIncomingInitialPage />}
    />
  );
};

export default OutstandingIncomingPage;
