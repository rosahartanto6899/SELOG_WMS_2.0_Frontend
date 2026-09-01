import PageLayout from "@sera-components/layout/page-layout";
import InitialPage from "@sera-components/pages/administration-management/pod-collection/initial-page";
import { useTranslation } from "react-i18next";

const VoDPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "podCollection" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<InitialPage />}
    />
  );
};

export default VoDPage;
