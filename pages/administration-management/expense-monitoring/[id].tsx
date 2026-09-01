import PageLayout from "@sera-components/layout/page-layout";
import ExpenseComponent from "@sera-components/pages/administration-management/expense";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const ExpenseMonitoringDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admExpense" });

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.ADMINISTRATION_MANAGEMENT.EXPENSE,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.ADMINISTRATION_MANAGEMENT.EXPENSE}
      isDirectToURL
      withTab={false}
      content={<ExpenseComponent.DetailPage />}
    />
  );
};

export default ExpenseMonitoringDetailPage;
