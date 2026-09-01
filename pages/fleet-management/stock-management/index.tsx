import PageLayout from "@sera-components/layout/page-layout";
import StockManagementComponent from "@sera-components/pages/fleet-management/stock-management";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const StockManagementPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<StockManagementComponent.InitialPage />}
    />
  );
};

export default connect()(StockManagementPage);
