import PageLayout from "@sera-components/layout/page-layout";
import JMPComponent from "@sera-components/pages/journey-management/jmp";
import { useTranslation } from "react-i18next";

const JMPPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "jmp" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<JMPComponent.InitialPage />}
    />
  );
};

export default JMPPage;
