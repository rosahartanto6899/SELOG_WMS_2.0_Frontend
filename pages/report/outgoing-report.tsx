import PageLayout from "@sera-components/layout/page-layout";
import OutgoingReportComponent from "@sera-components/pages/report/outgoing-report";
import { useTranslation } from "react-i18next";

const OutgoingReportPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.outgoingReport.page",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<OutgoingReportComponent.OutgoingReportInitialPage />}
    />
  );
};

export default OutgoingReportPage;
