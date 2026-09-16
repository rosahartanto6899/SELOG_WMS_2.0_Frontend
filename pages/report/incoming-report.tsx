import PageLayout from "@sera-components/layout/page-layout";
import IncomingReportComponent from "@sera-components/pages/report/incoming-report";
import { useTranslation } from "react-i18next";

const IncomingReportPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.incomingReport.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<IncomingReportComponent.IncomingReportInitialPage />}
    />
  );
};

export default IncomingReportPage;
