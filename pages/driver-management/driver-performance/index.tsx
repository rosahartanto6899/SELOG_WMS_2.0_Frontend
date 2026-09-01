import PageLayout from "@sera-components/layout/page-layout";
import DriverManagementComponent from "@sera-components/pages/driver-management";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DriverPerformancePage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverPerformance" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<DriverManagementComponent.DriverPerformanceInitialPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverPerformancePage);
