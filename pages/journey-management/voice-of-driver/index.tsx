import PageLayout from "@sera-components/layout/page-layout";
import VoDComponent from "@sera-components/pages/journey-management/vod";
import { useTranslation } from "react-i18next";

const VoDPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "vod" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<VoDComponent.InitialPage />}
    />
  );
};

export default VoDPage;
