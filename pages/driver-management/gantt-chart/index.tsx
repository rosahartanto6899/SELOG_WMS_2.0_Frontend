import PageLayout from "@sera-components/layout/page-layout";
import DriverManagementComponent from "@sera-components/pages/driver-management";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DriverGanttChartPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverGanttChart" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={<DriverManagementComponent.GanttChartInitialPage />}
    />
  );
};

export default connect()(DriverGanttChartPage);
