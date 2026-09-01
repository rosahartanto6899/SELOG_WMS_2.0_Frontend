import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const CustomerPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "customer" });

  return (
    <PageLayout
      title={t("breadcrumb.1")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<SalesManagementComponent.CustomerInitialPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);
