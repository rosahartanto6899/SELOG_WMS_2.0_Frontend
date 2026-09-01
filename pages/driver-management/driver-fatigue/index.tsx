import PageLayout from "@sera-components/layout/page-layout";
import DriverManagementComponent from "@sera-components/pages/driver-management";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DriverFatiguePage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverFatigue" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<DriverManagementComponent.DriverFatigueInitialPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DriverFatiguePage);
