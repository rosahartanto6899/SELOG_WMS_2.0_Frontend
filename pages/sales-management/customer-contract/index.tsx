import PageLayout from "@sera-components/layout/page-layout";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import { useTranslation } from "react-i18next";

const CustomerContractPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerContract" });

  return (
    <PageLayout
      title={t("breadcrumb.1")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<SalesManagementComponent.CustomerContractInitialPage />}
    />
  );
};

export default CustomerContractPage;
