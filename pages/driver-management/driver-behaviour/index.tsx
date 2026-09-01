import PageLayout from "@sera-components/layout/page-layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const DriverBehaviourPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "driverBehaviour" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<>Driver Behaviour</>}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverBehaviourPage);
