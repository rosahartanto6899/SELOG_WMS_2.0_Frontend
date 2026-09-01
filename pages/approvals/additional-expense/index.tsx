import PageLayout from "@sera-components/layout/page-layout";
import ApprovalsManagementComponent from "@sera-components/pages/approvals";
import { useTranslation } from "react-i18next";

const AdditionalExpensePage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<ApprovalsManagementComponent.AdditionalExpenseInitialPage />}
    />
  );
};

export default AdditionalExpensePage;
