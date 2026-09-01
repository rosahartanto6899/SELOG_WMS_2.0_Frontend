import PageLayout from "@sera-components/layout/page-layout";
import JourneyHistoryComponent from "@sera-components/pages/journey-management/journey-history";
import { useTranslation } from "react-i18next";

const JourneyHistoryPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "journeyHistory" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<JourneyHistoryComponent.InitialPage />}
    />
  );
};

export default JourneyHistoryPage;
