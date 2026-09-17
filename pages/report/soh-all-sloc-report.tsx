import PageLayout from "@sera-components/layout/page-layout";
import SohAllSlocReportComponent from "@sera-components/pages/report/soh-all-sloc-report";
import { useTranslation } from "react-i18next";

const SohAllSlocReportPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.sohAllSlocReport.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<SohAllSlocReportComponent.SohAllSlocReportInitialPage />}
    />
  );
};

export default SohAllSlocReportPage;
