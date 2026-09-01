import PageLayout from "@sera-components/layout/page-layout";
import ExpenseRefundInitialPage from "@sera-components/pages/administration-management/expense-refund/initial-page";
import { useTranslation } from "react-i18next";

const VoDPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenseRefund" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<ExpenseRefundInitialPage />}
    />
  );
};

export default VoDPage;
