import PageLayout from "@sera-components/layout/page-layout";
import ActualIncomingComponent from "@sera-components/pages/plan-incoming/actual-incoming";
import { useTranslation } from "react-i18next";

const ActualIncomingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<ActualIncomingComponent.ActualIncomingInitialPage />}
    />
  );
};

export default ActualIncomingPage;
