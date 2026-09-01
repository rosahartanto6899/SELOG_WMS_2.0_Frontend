import PageLayout from "@sera-components/layout/page-layout";
import JourneyManagement from "@sera-components/pages/journey-management";
import { useTranslation } from "react-i18next";

const JourneySupportPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeySupport",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<JourneyManagement.JourneySupportInitialPage />}
    />
  );
};

export default JourneySupportPage;
