import PageLayout from "@sera-components/layout/page-layout";
import BranchComponent from "@sera-components/pages/master-data/master-branch";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MasterBranchPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "businessArea" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<BranchComponent.InitialPage />}
    />
  );
};

export default connect()(MasterBranchPage);
