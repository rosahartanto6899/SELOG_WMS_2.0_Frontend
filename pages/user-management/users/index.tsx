import PageLayout from "@sera-components/layout/page-layout";
import UserManagementComponent from "@sera-components/pages/user-management/users";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const UserManagement = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "userManagement" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      withTab
      content={<UserManagementComponent.InitialPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
