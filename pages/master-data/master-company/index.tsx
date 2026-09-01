import PageLayout from "@sera-components/layout/page-layout";
import CompanyComponent from "@sera-components/pages/master-data/master-company";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MasterCompanyPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "company" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<CompanyComponent.InitialPage />}
    />
  );
};
export default connect()(MasterCompanyPage);
