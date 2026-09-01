import PageLayout from "@sera-components/layout/page-layout";
import ExpenseComponent from "@sera-components/pages/administration-management/expense";
import { useTranslation } from "react-i18next";

const ExpenseMonitoringPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admExpense" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<ExpenseComponent.InitialPage />}
    />
  );
};

export default ExpenseMonitoringPage;
